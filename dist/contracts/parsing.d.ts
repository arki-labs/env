import { z } from 'zod';
export declare const parseContracts: {
    json: <T extends z.ZodType>(schema: T) => z.ZodPipe<z.ZodString, z.ZodTransform<Awaited<z.core.output<T>>, string>>;
    csvArray: <T extends z.ZodType>(itemSchema: T) => z.ZodPreprocess<z.ZodArray<T>, unknown>;
    csvSet: <T extends z.ZodType>(itemSchema: T) => z.ZodPreprocess<z.ZodArray<T>, unknown>;
};
//# sourceMappingURL=parsing.d.ts.map