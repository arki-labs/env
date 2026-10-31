import { z } from 'zod';
export declare const urlPresets: {
    url: (defaultValue?: string) => z.ZodDefault<z.ZodURL> | z.ZodURL;
    databaseUrl: () => z.ZodURL;
    redisUrl: () => z.ZodURL;
};
//# sourceMappingURL=urls.d.ts.map