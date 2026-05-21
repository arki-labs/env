import { z } from 'zod';
export const parseContracts = {
    json: (schema) => z.string().transform((str) => {
        const parsed = JSON.parse(str);
        return schema.parse(parsed);
    }),
    csvArray: (itemSchema) => z.preprocess((val) => {
        if (typeof val !== 'string')
            return val;
        return val.split(',').map((s) => s.trim());
    }, z.array(itemSchema)),
    csvSet: (itemSchema) => z.preprocess((val) => {
        if (typeof val !== 'string')
            return val;
        return [...new Set(val.split(',').map((s) => s.trim()))];
    }, z.array(itemSchema)),
};
//# sourceMappingURL=parsing.js.map