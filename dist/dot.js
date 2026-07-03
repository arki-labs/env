/**
 * DOT adapter for `@arki/env`.
 *
 * Wraps `defineEnv()` as a DOT pip so a DOT app can validate its
 * environment alongside any other services. The pip is sync (env
 * validation is sync), so the `boot` hook returns the validated env
 * object synchronously through the standard provides channel.
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
 * To mount a second env scope in the same app, rename the published wire
 * key at the mount site:
 *
 * ```ts
 * import { rename } from '@arki/dot';
 *
 * .use(env({ schema: appSchema }))
 * .use(rename(env({ schema: publicSchema }), { env: 'publicEnv' }, 'public-env'))
 * ```
 *
 * The `@arki/dot` package is an OPTIONAL peer of `@arki/env`. Importing
 * this adapter without `@arki/dot` installed will fail at module load —
 * that is intentional: the adapter only makes sense in a DOT app.
 */
import { pip } from '@arki/dot/pip';
import { defineEnv } from './core/define-env.js';
/**
 * Build a DOT pip that validates and publishes a typed `env` service.
 *
 * @param options - Schema + optional config.
 * @returns A pip that publishes `services.env`.
 */
export function env(options) {
    return pip({
        name: 'env',
        version: '0.1.0',
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
            return { env: envObject };
        },
    });
}
//# sourceMappingURL=dot.js.map