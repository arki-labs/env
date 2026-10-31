import { z } from 'zod';
export const parsePresets = {
    json: (schema) => z
        .string()
        .transform((str, context) => {
        try {
            return JSON.parse(str);
        }
        catch {
            context.issues.push({ code: 'custom', message: 'Invalid JSON', input: str });
            return z.NEVER;
        }
    })
        .pipe(schema),
    csvArray: (itemSchema) => z.preprocess(val => {
        if (typeof val !== 'string')
            return val;
        return val.split(',').map(s => s.trim());
    }, z.array(itemSchema)),
    csvSet: (itemSchema) => z.preprocess(val => {
        if (typeof val !== 'string')
            return val;
        return [...new Set(val.split(',').map(s => s.trim()))];
    }, z.array(itemSchema)),
};
//# sourceMappingURL=parsing.js.map