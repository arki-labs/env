import { z } from 'zod';
export declare const parsePresets: {
    json: <T extends z.ZodType>(schema: T) => z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<unknown, string>>, T>;
    csvArray: <T extends z.ZodType>(itemSchema: T) => z.ZodPreprocess<z.ZodArray<T>, unknown>;
    csvSet: <T extends z.ZodType>(itemSchema: T) => z.ZodPreprocess<z.ZodArray<T>, unknown>;
};
//# sourceMappingURL=parsing.d.ts.map