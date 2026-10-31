/**
 * `describeEnv(env)`: the keys an env built by `defineEnv` declares, which of them are `secret()`,
 * and where they live. It reads the declaration only, never a value, so tools (`dot env check`) can
 * use it on a bare checkout.
 */
import type { StandardSchemaV1 } from '@arki/schema';
/** One declared key. */
export type EnvKeyDescription = {
    readonly key: string;
    /** Declared with `secret()`: must never be plaintext in a tracked file. */
    readonly secret: boolean;
    readonly scope: 'server' | 'client' | 'shared';
};
/** What an env declares, its `extends` included. */
export type EnvDescription = {
    readonly name?: string;
    readonly keys: readonly EnvKeyDescription[];
};
/** The description of an env built by `defineEnv`, or `undefined` for any other object. */
export declare function describeEnv(env: object): EnvDescription | undefined;
/** Called by `defineEnv` once per env. Later scopes and the env's own keys win over `extends`. */
export declare function registerEnvDescription(env: object, declaration: {
    readonly name?: string;
    readonly server: Record<string, StandardSchemaV1>;
    readonly client?: Record<string, StandardSchemaV1>;
    readonly shared?: Record<string, StandardSchemaV1>;
    readonly extends?: readonly object[];
}): void;
//# sourceMappingURL=describe.d.ts.map