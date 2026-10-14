export declare const contracts: {
    string: (defaultValue?: string) => import("zod").ZodDefault<import("zod").ZodString> | import("zod").ZodString;
    number: (defaultValue?: number) => import("zod").ZodCoercedNumber<unknown> | import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
    port: (defaultValue?: number) => import("zod").ZodDefault<import("zod").ZodCoercedNumber<unknown>>;
    nodeEnv: () => import("zod").ZodDefault<import("zod").ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    boolean: (defaultValue?: boolean) => import("zod").ZodPipe<import("zod").ZodDefault<import("zod").ZodEnum<{
        0: "0";
        1: "1";
        false: "false";
        true: "true";
    }>>, import("zod").ZodTransform<boolean, "0" | "1" | "false" | "true">>;
    logLevel: (defaultValue?: 'debug' | 'info' | 'warn' | 'error') => import("zod").ZodDefault<import("zod").ZodEnum<{
        debug: "debug";
        error: "error";
        info: "info";
        warn: "warn";
    }>>;
    json: <T extends import("zod").ZodType>(schema: T) => import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<Awaited<import("zod").infer<T>>, string>>;
    csvArray: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPreprocess<import("zod").ZodArray<T>, unknown>;
    csvSet: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPreprocess<import("zod").ZodArray<T>, unknown>;
    url: (defaultValue?: string) => import("zod").ZodDefault<import("zod").ZodURL> | import("zod").ZodURL;
    databaseUrl: () => import("zod").ZodURL;
    redisUrl: () => import("zod").ZodURL;
};
export { commonContracts } from './common.js';
export { urlContracts } from './urls.js';
export { parseContracts } from './parsing.js';
//# sourceMappingURL=index.d.ts.map