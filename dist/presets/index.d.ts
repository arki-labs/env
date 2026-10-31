export declare const presets: {
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
    json: <T extends import("zod").ZodType>(schema: T) => import("zod").ZodPipe<import("zod").ZodPipe<import("zod").ZodString, import("zod").ZodTransform<unknown, string>>, T>;
    csvArray: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPreprocess<import("zod").ZodArray<T>, unknown>;
    csvSet: <T extends import("zod").ZodType>(itemSchema: T) => import("zod").ZodPreprocess<import("zod").ZodArray<T>, unknown>;
    url: (defaultValue?: string) => import("zod").ZodDefault<import("zod").ZodURL> | import("zod").ZodURL;
    databaseUrl: () => import("zod").ZodURL;
    redisUrl: () => import("zod").ZodURL;
};
export { commonPresets } from './common.js';
export { urlPresets } from './urls.js';
export { parsePresets } from './parsing.js';
//# sourceMappingURL=index.d.ts.map