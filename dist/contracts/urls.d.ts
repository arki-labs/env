import { z } from 'zod';
export declare const urlContracts: {
    url: (defaultValue?: string) => z.ZodURL | z.ZodDefault<z.ZodURL>;
    databaseUrl: () => z.ZodURL;
    redisUrl: () => z.ZodURL;
};
//# sourceMappingURL=urls.d.ts.map