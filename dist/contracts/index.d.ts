export declare const contracts: {
    json: <T extends import("zod").ZodType>(schema: T) => import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<Awaited<import("zod").infer<T>>, string>>;
    csvArray: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodArray<T>>;
    csvSet: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPipe<import("zod").ZodTransform<unknown, unknown>, import("zod").ZodArray<T>>;
    url: (defaultValue?: string) => import("zod").ZodString | import("zod").ZodDefault<import("zod").ZodString>;
    databaseUrl: () => import("zod").ZodURL;
    redisUrl: () => import("zod").ZodURL;
    string: (defaultValue?: string) => import("zod").ZodString | import("zod").ZodDefault<import("zod").ZodString>;
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
        true: "true";
        false: "false";
    }>>, import("zod").ZodTransform<boolean, "0" | "1" | "true" | "false">>;
    logLevel: (defaultValue?: "debug" | "info" | "warn" | "error") => import("zod").ZodDefault<import("zod").ZodEnum<{
        debug: "debug";
        info: "info";
        warn: "warn";
        error: "error";
    }>>;
};
export { commonContracts } from './common.js';
export { urlContracts } from './urls.js';
export { parseContracts } from './parsing.js';
//# sourceMappingURL=index.d.ts.map