import { isSecretSchema } from './secret.js';
const descriptions = new WeakMap();
/** The description of an env built by `defineEnv`, or `undefined` for any other object. */
export function describeEnv(env) {
    return descriptions.get(env);
}
/** Called by `defineEnv` once per env. Later scopes and the env's own keys win over `extends`. */
export function registerEnvDescription(env, declaration) {
    const keys = new Map();
    for (const base of declaration.extends ?? []) {
        for (const key of describeEnv(base)?.keys ?? [])
            keys.set(key.key, key);
    }
    const scopes = [
        ['shared', declaration.shared],
        ['client', declaration.client],
        ['server', declaration.server],
    ];
    for (const [scope, schemas] of scopes) {
        for (const [key, schema] of Object.entries(schemas ?? {}))
            keys.set(key, { key, secret: isSecretSchema(schema), scope });
    }
    descriptions.set(env, declaration.name === undefined ? { keys: [...keys.values()] } : { name: declaration.name, keys: [...keys.values()] });
}
//# sourceMappingURL=describe.js.map