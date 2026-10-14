import { z } from 'zod';
export declare const urlContracts: {
    url: (defaultValue?: string) => z.ZodDefault<z.ZodURL> | z.ZodURL;
    databaseUrl: () => z.ZodURL;
    redisUrl: () => z.ZodURL;
};
//# sourceMappingURL=urls.d.ts.map