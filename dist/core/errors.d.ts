/** The process environment does not match the schema, so the app must not boot.
 * @fix Set or correct the variables listed in the report, then start the app again.
 * @verify bun run test -- src/core/define-env.test.ts
 */
export declare const InvalidEnvironment: import("@arki/failure").FailureDefinition<"env.invalid_environment", import("@standard-schema/spec").StandardSchemaV1<{
    report: string;
}, {
    report: string;
}>>;
//# sourceMappingURL=errors.d.ts.map