import { z } from 'zod';
export const urlContracts = {
    url: (defaultValue) => {
        const schema = z.url();
        return defaultValue ? schema.default(defaultValue) : schema;
    },
    databaseUrl: () => z
        .url()
        .refine(url => url.startsWith('postgres://') || url.startsWith('postgresql://'), 'Database URL must start with postgres:// or postgresql://'),
    redisUrl: () => z
        .url()
        .refine(url => url.startsWith('redis://') || url.startsWith('rediss://'), 'Redis URL must start with redis:// or rediss://'),
};
//# sourceMappingURL=urls.js.map