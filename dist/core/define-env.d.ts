import type { ZodType } from 'zod';
type CoreEnvConfig = {
    server: Record<string, ZodType>;
    options?: {
        skipValidation?: boolean;
        onValidationError?: (issues: any) => never;
    };
};
export declare function defineEnv(config: CoreEnvConfig): Readonly<{
    [x: string]: unknown;
}>;
export {};
//# sourceMappingURL=define-env.d.ts.map