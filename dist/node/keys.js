/**
 * Where a file's private key comes from: the `DOTENV_PRIVATE_KEY_<ENV>` variable first, then a
 * `.env.keys` file beside the env file, then `.env.keys` at the repository root. The variable may
 * hold several keys separated by commas (dotenvx does the same), so one process can read files
 * encrypted to different keys of the same environment.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { isFailure } from '@arki/failure';
import { keyNamesFor, parseEnv, readEnvValue, setEnvValue } from './codec.js';
import { readEnvText, writeEnvText } from './files.js';
import { parsePrivateKey } from './key-schemas.js';
/** The git-ignored file that holds private keys, one `DOTENV_PRIVATE_KEY_<ENV>=<hex>` line each. */
export const KEYS_FILE = '.env.keys';
const KEYS_BANNER = [
    '#/------------------!DOTENV_PRIVATE_KEYS!-------------------/',
    '#/ private decryption keys. DO NOT commit to source control /',
    '#/     [how it works](https://dotenvx.com/encryption)       /',
    '#/----------------------------------------------------------/',
].join('\n');
/** The `.env.keys` paths searched for `file`, nearest first. */
export function keysFileCandidates(file, root) {
    return [...new Set([path.join(path.dirname(file), KEYS_FILE), path.join(root, KEYS_FILE)])];
}
/** The private key for `file`, or `undefined` when no source has one. */
export function findPrivateKey(file, options) {
    const name = keyNamesFor(path.basename(file)).privateKey;
    const fromEnv = splitKeys(options.env[name]);
    if (isFailure(fromEnv))
        return fromEnv;
    if (fromEnv.length > 0)
        return { keys: fromEnv, source: { kind: 'env', name } };
    for (const candidate of keysFileCandidates(file, options.root)) {
        if (!existsSync(candidate))
            continue;
        const text = readEnvText(candidate);
        if (isFailure(text))
            return text;
        const keys = splitKeys(readEnvValue(parseEnv(text), name));
        if (isFailure(keys))
            return keys;
        if (keys.length > 0)
            return { keys, source: { kind: 'file', name, path: candidate } };
    }
    return;
}
/**
 * Store `privateKey` under `name` in a keys file, creating it with the dotenvx banner. An existing
 * entry is replaced. The file is left readable by its owner only.
 */
export function writePrivateKey(keysPath, name, privateKey, comment, options = {}) {
    const existing = existsSync(keysPath) ? readEnvText(keysPath) : `${KEYS_BANNER}\n`;
    if (isFailure(existing))
        return existing;
    const stored = [...new Set([privateKey, ...(options.preserve ?? [])])].join(',');
    const next = readEnvValue(parseEnv(existing), name) === undefined
        ? `${existing}${existing.endsWith('\n') ? '' : '\n'}\n# ${comment}\n${name}=${stored}\n`
        : setEnvValue(existing, name, stored);
    if (isFailure(next))
        return next;
    return writeEnvText(keysPath, next, true);
}
function splitKeys(value) {
    const keys = [];
    for (const raw of (value ?? '')
        .split(',')
        .map(key => key.trim())
        .filter(key => key !== '')) {
        const key = parsePrivateKey(raw);
        if (isFailure(key))
            return key;
        keys.push(key);
    }
    return keys;
}
//# sourceMappingURL=keys.js.map