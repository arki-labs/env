/** The remaining aggregate budget and cooperative cancellation for a synchronous provider read. */
export type ReferenceOptions = {
    readonly timeoutMs?: number;
    readonly signal?: AbortSignal;
};
/** A provider returns its value or the exact owned provider/cancellation/deadline outcomes. */
export type ReferenceResolver = (reference: string, options?: ReferenceOptions) => ReturnType<typeof runProvider>;
/** The resolvers used unless the caller supplies an explicit registry. */
export declare const DEFAULT_RESOLVERS: Readonly<Record<string, ReferenceResolver>>;
/** Registered schemes are references; unknown URLs remain plain values. */
export declare function referenceScheme(value: string, resolvers: Readonly<Record<string, ReferenceResolver>>): string | undefined;
declare function runProvider(command: string, args: readonly string[], options?: ReferenceOptions): string | import("@arki/failure").Failure<"env.cancelled", undefined> | import("@arki/failure").Failure<"env.deadline", undefined> | import("@arki/failure").Failure<"env.reference_failed", {
    scheme: string;
}>;
export {};
//# sourceMappingURL=references.d.ts.map