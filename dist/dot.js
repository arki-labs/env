/**
 * DOT adapter for `@arki/env`.
 *
 * Wraps `defineEnv()` as a `DotPip` so a DOT app can validate its
 * environment alongside any other services. The pip is sync (env
 * validation is sync), so the `boot` hook returns the validated env
 * object synchronously through the standard `services` channel.
 *
 * @example
 * ```ts
 * import { defineApp } from '@arki/dot';
 * import { env } from '@arki/env/dot';
 * import { z } from 'zod';
 *
 * const app = await defineApp('my-app')
 *   .use(env({ schema: { PORT: z.coerce.number().default(3000) } }))
 *   .boot();
 *
 * console.log(app.services.env.PORT); // number, typed.
 * ```
 *
 * The `@arki/dot` package is an OPTIONAL peer of `@arki/env`. Importing
 * this adapter without `@arki/dot` installed will fail at module load —
 * that is intentional: the adapter only makes sense in a DOT app.
 */
import { defineDotPip } from '@arki/dot/pip';
import { defineEnv } from './core/define-env.js';
/**
 * Build a DOT pip that validates and publishes a typed `env` service.
 *
 * @param options - Schema + optional config.
 * @returns A `DotPip` that registers an `env`-kind service.
 */
export function env(options) {
    const name = options.name ?? 'env';
    return defineDotPip({
        name,
        version: '0.1.0',
        provides: ['env'],
        configure(ctx) {
            ctx.registerService('env', 'env');
        },
        boot() {
            const validated = defineEnv({
                server: options.schema,
                options: options.skipValidation !== undefined
                    ? { skipValidation: options.skipValidation }
                    : undefined,
            });
            // `defineEnv` returns a Proxy from `@t3-oss/env-core`; we narrow it
            // to the schema-derived shape so downstream typing flows through.
            // The runtime guarantee comes from Zod-side validation inside
            // `defineEnv`. No `any` involved — the cast is type-only.
            const envObject = validated;
            return { services: { env: envObject } };
        },
    });
}
//# sourceMappingURL=dot.js.map