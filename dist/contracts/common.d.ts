import { z } from 'zod';
export declare const commonContracts: {
    string: (defaultValue?: string) => z.ZodDefault<z.ZodString> | z.ZodString;
    number: (defaultValue?: number) => z.ZodCoercedNumber<unknown> | z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    port: (defaultValue?: number) => z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    nodeEnv: () => z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    boolean: (defaultValue?: boolean) => z.ZodPipe<z.ZodDefault<z.ZodEnum<{
        0: "0";
        1: "1";
        false: "false";
        true: "true";
    }>>, z.ZodTransform<boolean, "0" | "1" | "false" | "true">>;
    logLevel: (defaultValue?: 'debug' | 'info' | 'warn' | 'error') => z.ZodDefault<z.ZodEnum<{
        debug: "debug";
        error: "error";
        info: "info";
        warn: "warn";
    }>>;
};
//# sourceMappingURL=common.d.ts.map