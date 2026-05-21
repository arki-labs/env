import { createEnv } from '@t3-oss/env-core';
export function defineEnv(config) {
    const skipValidation = config.options?.skipValidation ?? (!!process.env.CI || process.env.NODE_ENV !== 'development');
    // Auto-generate runtimeEnv (no Next.js bundler constraints)
    const runtimeEnv = {};
    for (const key of Object.keys(config.server)) {
        runtimeEnv[key] = process.env[key];
    }
    return createEnv({
        server: config.server,
        client: {},
        clientPrefix: '',
        runtimeEnv,
        skipValidation,
        onValidationError: config.options?.onValidationError,
    });
}
//# sourceMappingURL=define-env.js.map