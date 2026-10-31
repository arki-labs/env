/**
 * `loadEnvFiles()`: read the env files from the repository root down to the working directory,
 * decrypt and resolve their values, and write the ones the real environment does not set into it.
 *
 * Values go into `process.env` on purpose: package envs (`@arki/db/env` and others) read it, some
 * of them while their module loads, so the files must be loaded before the app's modules are. Run
 * `dot env run -- <cmd>` or import `@arki/env/node/register` first in the entry file.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { attempt, isFailure } from '@arki/failure';
import { ensure } from '@arki/schema';
import { decryptValue, envValues, isEncrypted, isKeyName, keyNamesFor, parseEnv } from './codec.js';
import { DecryptionFailed, ENV_FILES_ERROR_CODES, EnvCancelled, EnvDeadline, EnvFilesFailed, FileReadFailed, ReferenceFailed, } from './errors.js';
import { readEnvText } from './files.js';
import { findPrivateKey, keysFileCandidates } from './keys.js';
import { nodeOperation } from './operation-telemetry.js';
import { DEFAULT_RESOLVERS, referenceScheme } from './references.js';
export { ENV_FILES_ERROR_CODES } from './errors.js';
const loadedSecrets = new Set();
/**
 * Keys a file may never set: they make a process started with this environment run other code
 * (PATH, interpreter options, preload and module paths, shell and git hooks) or change whom it
 * trusts over TLS. A machine that needs one sets it in its own shell. This is defence in depth:
 * a tracked env file is repository content, reviewed like code, not a security boundary.
 */
const REFUSED_KEY = new RegExp(`^(?:${[
    'PATH',
    'NODE_OPTIONS',
    'NODE_PATH',
    'NODE_EXTRA_CA_CERTS',
    'NODE_TLS_REJECT_UNAUTHORIZED',
    'NODE_REPL_EXTERNAL_MODULE',
    'BUN_OPTIONS',
    'SSL_CERT_FILE',
    'SSL_CERT_DIR',
    'LD_\\w+',
    'DYLD_\\w+',
    'BASH_ENV',
    'BASH_FUNC_.*',
    'ENV',
    'PROMPT_COMMAND',
    'ZDOTDIR',
    'GIT_\\w+',
    'npm_config_\\w+',
    'PERL5OPT',
    'PERL5LIB',
    'PERL5DB',
    'PYTHONPATH',
    'PYTHONHOME',
    'PYTHONSTARTUP',
    'PYTHONINSPECT',
    'RUBYOPT',
    'RUBYLIB',
    'JAVA_TOOL_OPTIONS',
    '_JAVA_OPTIONS',
    'JDK_JAVA_OPTIONS',
].join('|')})$`, 'i');
/** A portable variable name. Anything else is refused rather than passed to a child process. */
const PLAIN_NAME = /^[_a-z]\w*$/i;
/** Keys bundlers inline into browser code. */
const PUBLIC_KEY = /^(?:VITE_|NEXT_PUBLIC_|PUBLIC_|EXPO_PUBLIC_)/;
const loadBudget = z.number().int().min(1).max(2_147_483_647);
/** Load atomically into the env map: operational problems return canonical failures before applying values. */
export function loadEnvFiles(options = {}) {
    const budget = ensure(options.timeoutMs ?? 30_000, loadBudget);
    return nodeOperation('load', () => {
        const deadline = Date.now() + budget;
        const stopped = () => options.signal?.aborted
            ? EnvCancelled({ cause: options.signal.reason })
            : Date.now() >= deadline
                ? EnvDeadline()
                : undefined;
        const initialStop = stopped();
        if (initialStop !== undefined)
            return initialStop;
        const errors = [];
        const causes = [];
        const target = options.env ?? process.env;
        const cwd = path.resolve(options.cwd ?? process.cwd());
        const root = path.resolve(options.root ?? findRoot(cwd));
        const environment = options.environment ?? nonEmpty(target['NODE_ENV']) ?? 'development';
        const names = options.files ?? [`.env.${environment}`, ...(environment === 'test' ? [] : ['.env.local'])];
        const resolvers = options.references ?? DEFAULT_RESOLVERS;
        const files = envDirs(root, cwd)
            .flatMap(dir => names.map(name => path.join(dir, name)))
            .filter(file => existsSync(file));
        const winners = new Map();
        const refused = [];
        for (const file of files) {
            const stop = stopped();
            if (stop !== undefined)
                return stop;
            const text = readEnvText(file);
            if (isFailure(text)) {
                errors.push({ code: ENV_FILES_ERROR_CODES.cannotRead, file, message: text.message });
                causes.push(text);
                continue;
            }
            for (const [key, entry] of envValues(parseEnv(text))) {
                if (isKeyName(key))
                    continue;
                if (REFUSED_KEY.test(key) || !PLAIN_NAME.test(key)) {
                    const reason = PLAIN_NAME.test(key)
                        ? 'it changes what code a process runs or whom it trusts'
                        : 'it is not a portable variable name';
                    refused.push({ key, file, line: entry.start + 1, reason });
                    continue;
                }
                winners.set(key, { file, line: entry.start + 1, raw: entry.value });
            }
        }
        const keysByFile = new Map();
        const missingReported = new Set();
        /** The keys for `file`. A missing key is an error only when a value actually needs it (`required`). */
        const privateKeysFor = (file, required) => {
            if (!keysByFile.has(file)) {
                const found = findPrivateKey(file, { root, env: target });
                if (isFailure(found)) {
                    causes.push(found);
                    errors.push({
                        code: FileReadFailed.is(found) ? ENV_FILES_ERROR_CODES.cannotRead : ENV_FILES_ERROR_CODES.cannotDecrypt,
                        file,
                        message: 'Cannot read a valid private key for this env file',
                    });
                    missingReported.add(file);
                    keysByFile.set(file, null);
                }
                else
                    keysByFile.set(file, found?.keys ?? null);
            }
            const keys = keysByFile.get(file) ?? null;
            if (keys === null && required && !missingReported.has(file)) {
                missingReported.add(file);
                errors.push({
                    code: ENV_FILES_ERROR_CODES.missingPrivateKey,
                    file,
                    message: `${path.relative(root, file)} has encrypted values but no private key: set ${privateKeyHint(file)} or add it to ${keysFileCandidates(file, root)
                        .map(candidate => path.relative(root, candidate))
                        .join(' or ')}`,
                });
            }
            return keys;
        };
        const values = [];
        for (const [key, { file, line, raw }] of winners) {
            const stop = stopped();
            if (stop !== undefined)
                return stop;
            if (isEncrypted(raw)) {
                // A value the real environment already provides (Coolify, a parent `dot env run`) needs no key.
                const current = nonEmpty(target[key]);
                const keys = privateKeysFor(file, current === undefined || isEncrypted(current));
                if (keys === null) {
                    values.push({ key, file, line, kind: 'encrypted' });
                    continue;
                }
                const value = tryDecrypt(raw, keys);
                if (isFailure(value)) {
                    causes.push(value);
                    errors.push({
                        code: ENV_FILES_ERROR_CODES.cannotDecrypt,
                        file,
                        key,
                        message: `${key} in ${path.relative(root, file)}:${String(line)} cannot be decrypted with ${privateKeyHint(file)}`,
                    });
                    values.push({ key, file, line, kind: 'encrypted' });
                }
                else {
                    values.push({ key, file, line, kind: 'encrypted', value });
                }
                continue;
            }
            const scheme = referenceScheme(raw, resolvers);
            if (scheme === undefined) {
                values.push({ key, file, line, kind: 'plain', value: raw });
                continue;
            }
            if (PUBLIC_KEY.test(key)) {
                refused.push({
                    key,
                    file,
                    line,
                    reason: 'a public (browser-bundled) key cannot hold a secret-manager reference',
                });
                continue;
            }
            const resolved = attempt(() => resolvers[scheme]?.(raw, {
                timeoutMs: Math.min(30_000, Math.max(1, deadline - Date.now())),
                ...(options.signal === undefined ? {} : { signal: options.signal }),
            }), cause => ReferenceFailed({ scheme }, { cause }));
            const stopAfterProvider = stopped();
            if (stopAfterProvider !== undefined)
                return stopAfterProvider;
            if (EnvCancelled.is(resolved) || EnvDeadline.is(resolved))
                return resolved;
            if (isFailure(resolved) || resolved === undefined) {
                const failure = isFailure(resolved) ? resolved : ReferenceFailed({ scheme });
                causes.push(failure);
                errors.push({
                    code: ENV_FILES_ERROR_CODES.unresolvedReference,
                    file,
                    key,
                    message: `${key} (${scheme}://) in ${path.relative(root, file)}:${String(line)} could not be resolved`,
                });
                values.push({ key, file, line, kind: 'reference' });
            }
            else
                values.push({ key, file, line, kind: 'reference', value: resolved });
        }
        // Validate every entry first: a failed boot must not leave a partially applied environment.
        if (errors.length > 0)
            return EnvFilesFailed({ environment, errors }, { cause: causes });
        const applied = [];
        const shadowed = [];
        const fromFiles = new Set(values.map(value => value.key));
        for (const [key, value] of Object.entries(target)) {
            if (value !== undefined && isEncrypted(value) && !fromFiles.has(key)) {
                errors.push({
                    code: ENV_FILES_ERROR_CODES.cannotDecrypt,
                    file: '(environment)',
                    key,
                    message: `${key} holds an encrypted value that no loaded env file explains (a file auto-loaded by Bun?)`,
                });
            }
        }
        if (errors.length > 0)
            return EnvFilesFailed({ environment, errors }, { cause: causes });
        for (const entry of values) {
            if (entry.value === undefined)
                continue;
            const current = nonEmpty(target[entry.key]);
            if (current !== undefined && !isEncrypted(current)) {
                if (current !== entry.value)
                    shadowed.push({ key: entry.key, file: entry.file, line: entry.line });
                continue;
            }
            if (entry.kind !== 'plain')
                loadedSecrets.add(entry.value);
            if (options.write !== false)
                target[entry.key] = entry.value;
            applied.push(entry.key);
        }
        return { root, environment, files, values, applied, shadowed, refused, errors };
    });
}
/** Every value this process loaded from an encrypted or referenced entry: what log masking hides. */
export function secretValues() {
    return [...loadedSecrets];
}
/** The report's errors as one message, one line each. */
export function formatEnvFilesErrors(failure) {
    return [
        `Cannot load env files (${failure.data.environment}):`,
        ...failure.data.errors.map(error => `  ${error.code} ${error.message}`),
    ].join('\n');
}
/** The nearest ancestor of `cwd` with `.git`, else with a `workspaces` package.json, else `cwd`. */
export function findRoot(cwd) {
    let workspace;
    for (let dir = cwd;; dir = path.dirname(dir)) {
        if (existsSync(path.join(dir, '.git')))
            return dir;
        if (workspace === undefined && isWorkspaceRoot(path.join(dir, 'package.json')))
            workspace = dir;
        if (path.dirname(dir) === dir)
            return workspace ?? cwd;
    }
}
/** The directories from `root` down to `cwd`, root first. Just `cwd` when it is not inside `root`. */
export function envDirs(root, cwd) {
    const relative = path.relative(root, cwd);
    if (relative.startsWith('..') || path.isAbsolute(relative))
        return [cwd];
    const parts = relative === '' ? [] : relative.split(path.sep);
    return [root, ...parts.map((_, index) => path.join(root, ...parts.slice(0, index + 1)))];
}
const workspaceManifest = z.object({
    workspaces: z.union([z.array(z.string()), z.object({ packages: z.array(z.string()) })]),
});
function isWorkspaceRoot(manifest) {
    if (!existsSync(manifest))
        return false;
    try {
        return workspaceManifest.safeParse(JSON.parse(readFileSync(manifest, 'utf8'))).success;
    }
    catch {
        return false;
    }
}
function tryDecrypt(raw, keys) {
    for (const key of keys) {
        const value = decryptValue(raw, key);
        if (!isFailure(value))
            return value;
    }
    return DecryptionFailed();
}
function privateKeyHint(file) {
    return keyNamesFor(path.basename(file)).privateKey;
}
function nonEmpty(value) {
    return value === undefined || value === '' ? undefined : value;
}
//# sourceMappingURL=load.js.map