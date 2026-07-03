import { createEnv } from '@t3-oss/env-core';
import type { CreateEnv, DefaultCombinedSchema } from '@t3-oss/env-core';
import type { ZodType } from 'zod';
/** The issue shape t3-oss hands to `onValidationError`, derived so it stays in sync with the lib. */
type ValidationIssues = Parameters<NonNullable<Parameters<typeof createEnv>[0]['onValidationError']>>[0];
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
export declare function defineEnv<TServer extends Record<string, ZodType>, TClient extends Record<string, ZodType> = NonNullable<unknown>, TShared extends Record<string, ZodType> = NonNullable<unknown>, const TPrefix extends string = '', const TExtends extends Array<Record<string, unknown>> = []>(config: {
    /**
     * Label shown in validation-error logs, e.g. `'@acme/backend'`. Without it a misconfigured
     * deploy logs a bare "Invalid environment variables" with no hint which env failed — exactly the
     * blind failure this wrapper exists to prevent.
     */
    name?: string;
    server: TServer;
    /** Client-side schema. Every key must start with `clientPrefix` (enforced by `createEnv`). */
    client?: TClient;
    /** Prefix client keys must carry, e.g. `'VITE_'`. Defaults to `''` (no client vars). */
    clientPrefix?: TPrefix;
    /** Shared vars available to both client and server, unprefixed (e.g. `NODE_ENV`). */
    shared?: TShared;
    /**
     * Already-built envs to compose in (e.g. `@arki/auth`, `@arki/db`). Their parsed variables merge
     * into the result with full types; each was validated by its own `createEnv` at import time.
     */
    extends?: TExtends;
    /**
     * Explicit runtime source. Omit it and `defineEnv` auto-builds one by reading `process.env` for
     * every declared key — correct for any server-side env. Provide it only when the auto-build would
     * be wrong: Vite/`start` apps whose client vars come from `import.meta.env` in the browser, or
     * keys with a fallback/alias (e.g. `DB_URL: process.env.DB_URL ?? process.env.DATABASE_URL`).
     */
    runtimeEnv?: Record<string, string | boolean | number | undefined>;
    options?: {
        skipValidation?: boolean;
        /**
         * Treat empty-string env values as `undefined` so defaults apply (e.g. `PORT=` in `.env`, or a
         * Docker arg baked as `X=""`). Defaults to `true` — set `false` only if an app intentionally
         * accepts `""` as a valid required string.
         */
        emptyStringAsUndefined?: boolean;
        onValidationError?: (issues: ValidationIssues) => never;
    };
}): CreateEnv<DefaultCombinedSchema<TServer, TClient, TShared>, TExtends>;
export {};
//# sourceMappingURL=define-env.d.ts.map