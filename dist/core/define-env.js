import { createEnv } from '@t3-oss/env-core';
/**
 * Fold validation issues into a human-legible, log-pipeline-safe string. The t3-oss default handler
 * logs `issues` as a raw object, which platforms like Coolify collapse to `[Object]` — so the var
 * that actually failed never reaches the logs. A flat `  path: message` list survives transport.
 */
function formatIssues(name, issues) {
    const label = name ? `[${name}] ` : '';
    const lines = issues.map(issue => {
        const path = (issue.path ?? [])
            .map(seg => (typeof seg === 'object' && seg !== null && 'key' in seg ? String(seg.key) : String(seg)))
            .join('.');
        return `  ${path || '(root)'}: ${issue.message}`;
    });
    return `❌ ${label}Invalid environment variables:\n${lines.join('\n')}`;
}
/**
 * Thin, type-preserving wrapper over `@t3-oss/env-core`'s `createEnv`. Generic over the server,
 * client, shared and composed schemas so the parsed env keeps its exact inferred types — the wrapper
 * adds the ARKI defaults (auto `runtimeEnv`, prod-safe `skipValidation`, a legible labelled error
 * handler) without widening any value to `unknown`.
 *
 * `TPrefix` is kept as a string-literal generic on purpose: `createEnv` uses it to enforce that
 * client keys (and only client keys) carry the prefix. Widening it to `string` would make every
 * server key collapse to a type-level `ErrorMessage`, so the prefix must stay a literal.
 */
export function defineEnv(config) {
    // LAZY by design: reading `process.env` and running validation are deferred
    // to the FIRST property access, not the module import. Declaring an env is
    // therefore observationally free — an app's declaration graph (features,
    // adapters, `dot explain`, docs tooling) imports from a bare checkout with
    // zero environment, and validation fires exactly when a value is actually
    // consumed (boot, a request, a job). This is the same import/observe split
    // drizzle tables have: define everywhere, observe only at use.
    const build = () => {
        const skipValidation = config.options?.skipValidation ?? (!!process.env.CI || process.env.NODE_ENV !== 'development');
        // Use the caller's explicit runtimeEnv when supplied (Vite client vars via import.meta.env, or
        // fallback aliases). Otherwise auto-build from every declared key (server + client + shared);
        // createEnv tolerates keys absent from process.env (they parse as undefined → optional/default).
        let runtimeEnv;
        if (config.runtimeEnv) {
            runtimeEnv = config.runtimeEnv;
        }
        else {
            runtimeEnv = {};
            for (const key of Object.keys(config.server)) {
                runtimeEnv[key] = process.env[key];
            }
            for (const key of Object.keys(config.client ?? {})) {
                runtimeEnv[key] = process.env[key];
            }
            for (const key of Object.keys(config.shared ?? {})) {
                runtimeEnv[key] = process.env[key];
            }
        }
        const onValidationError = config.options?.onValidationError ??
            ((issues) => {
                const message = formatIssues(config.name, issues);
                console.error(message);
                throw new Error(message);
            });
        // `createEnv`'s `server`/`client` params are conditional on `clientPrefix` being a *concrete*
        // string literal; inside a generic wrapper `TPrefix` is abstract, so the body cannot be verified
        // for all prefixes and the call argument must be asserted once. The PUBLIC contract stays exact:
        // the explicit return type above reconstructs `createEnv`'s own result from the generics, and the
        // caller's `server`/`client`/`extends` are fully type-checked against `TServer`/`TClient`/`TExtends`
        // at the call site. This is the only seam where types are asserted — value types are never widened.
        const options = {
            shared: config.shared ?? {},
            extends: config.extends,
            server: config.server,
            client: config.client ?? {},
            clientPrefix: config.clientPrefix ?? '',
            runtimeEnv,
            skipValidation,
            // Default ON: in containerized deploys an unset var is baked as "" (e.g. Docker `ENV X=${X}`
            // with no build arg), not left absent. Treating "" as undefined lets `.default()`/`.optional()`
            // apply as intended instead of failing format checks like `z.url()` on an empty string.
            emptyStringAsUndefined: config.options?.emptyStringAsUndefined ?? true,
            onValidationError,
        };
        const env = createEnv(options);
        // Skipped validation returns `runtimeEnv` itself: private only when `defineEnv` built it.
        // Otherwise `createEnv` returns a fresh Proxy whose reads return its stored values on the server.
        const isPrivate = skipValidation ? config.runtimeEnv === undefined : isServer();
        return { env, isPrivate };
    };
    return lazyEnv(build);
}
/**
 * Reads an env takes through the lazy view before it copies the values for fast reads. A copy costs
 * about as much as this many reads save (ski-rental), so an env that is read only a few times, such
 * as one built for a single check, never pays for it, and a hot env pays it once.
 */
const READS_BEFORE_COPY = 64;
/**
 * A lazy view over the env `build()` returns: nothing runs until the first operation, then every
 * operation forwards to the built env.
 *
 * Reads are the hot path. `createEnv` returns a Proxy, so a second Proxy over it pays two traps per
 * read. Where it is safe, once the env has been read `READS_BEFORE_COPY` times, its values are copied
 * into the Proxy's own target and the `get` trap is removed, so later reads are plain property reads
 * on that copy. It is safe when the built object is private to this env and reads on it return its
 * stored values:
 * - on the server, `createEnv`'s Proxy returns stored values (its client guard is off), and its
 *   object is a fresh copy nobody else holds;
 * - with validation skipped, `createEnv` returns the `runtimeEnv` it was given: only the one
 *   `defineEnv` built itself is private. A caller's own `runtimeEnv` stays a live view.
 * Writes and deletes through this object update both the built env and the copy.
 */
function lazyEnv(build) {
    let built;
    let canCopy = false;
    let copied = false;
    let reads = 0;
    const target = {};
    const resolve = () => {
        if (built !== undefined)
            return built;
        const result = build();
        built = result.env;
        canCopy = result.isPrivate;
        return built;
    };
    const copy = (instance) => {
        for (const key of Reflect.ownKeys(instance)) {
            setValue(target, key, readValue(instance, key));
        }
        copied = true;
        Reflect.deleteProperty(handler, 'get');
    };
    const handler = {
        get: (_target, property) => {
            const instance = resolve();
            if (canCopy && ++reads >= READS_BEFORE_COPY) {
                copy(instance);
                return target[property];
            }
            return readValue(instance, property);
        },
        set: (_target, property, value) => {
            const instance = resolve();
            const ok = Reflect.set(instance, property, value);
            if (ok && copied)
                setValue(target, property, readValue(instance, property));
            return ok;
        },
        deleteProperty: (_target, property) => {
            const ok = Reflect.deleteProperty(resolve(), property);
            if (ok && copied)
                Reflect.deleteProperty(target, property);
            return ok;
        },
        getPrototypeOf: () => Reflect.getPrototypeOf(resolve()),
        has: (_target, property) => Reflect.has(resolve(), property),
        ownKeys: () => Reflect.ownKeys(resolve()),
        getOwnPropertyDescriptor: (_target, property) => Object.getOwnPropertyDescriptor(resolve(), property),
    };
    return new Proxy(target, handler);
}
/** Same test `createEnv` uses to decide whether its client-side access guard applies. */
function isServer() {
    const { window } = globalThis;
    return window === undefined || 'Deno' in window;
}
/** A read as the old lazy view returned it: functions come back bound to the built env. */
function readValue(instance, property) {
    const value = Reflect.get(instance, property, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
}
/** An own data property. `__proto__` is defined, not assigned, so it never replaces the prototype. */
function setValue(target, key, value) {
    if (key === '__proto__') {
        Object.defineProperty(target, key, { value, writable: true, enumerable: true, configurable: true });
    }
    else {
        target[key] = value;
    }
}
//# sourceMappingURL=define-env.js.map