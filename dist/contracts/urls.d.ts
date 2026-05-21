import { z } from 'zod';
export declare const urlContracts: {
    url: (defaultValue?: string) => z.ZodString | z.ZodDefault<z.ZodString>;
    databaseUrl: () => z.ZodURL;
    redisUrl: () => z.ZodURL;
};
//# sourceMappingURL=urls.d.ts.map