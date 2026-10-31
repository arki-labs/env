/**
 * Secrets that cannot leak by accident.
 *
 * `secret(schema)` parses a variable as usual and wraps the result in a
 * {@link Redacted}. Printing it, logging it, serialising it or putting it in a
 * template string all show `[redacted]`. Reading the value takes a deliberate,
 * greppable `reveal(env.KEY)` call at the one place that needs it.
 *
 * Redaction guards against accidents (a logged config object, an error
 * message with the env in it). It is not encryption: code that calls
 * `reveal` gets the plain value.
 */
import type { SchemaInput, SchemaOutput, StandardSchemaV1 } from '@arki/schema';
/** Node's `util.inspect` hook, so `console.log(env)` shows `[redacted]` too. */
declare const inspect: unique symbol;
/** A value that prints as `[redacted]`. Read it with {@link reveal}. */
export declare class Redacted<Value = string> {
    #private;
    constructor(value: Value);
    toString(): string;
    toJSON(): string;
    [inspect](): string;
}
/** What {@link secret} returns: a Standard Schema whose output is redacted, with an `.optional()` variant. */
export type SecretSchema<Schema extends StandardSchemaV1> = StandardSchemaV1<SchemaInput<Schema>, Redacted<SchemaOutput<Schema>>> & {
    readonly [SECRET_SCHEMA]: true;
    /** Accepts a missing variable. `undefined` passes through as `undefined`, never redacted. */
    optional(): StandardSchemaV1<SchemaInput<Schema> | undefined, Redacted<SchemaOutput<Schema>> | undefined> & {
        readonly [SECRET_SCHEMA]: true;
    };
};
/** Marks a schema built by {@link secret}, so `describeEnv` can tell secrets apart. */
export declare const SECRET_SCHEMA: unique symbol;
/** True for a schema built by {@link secret} (or its `.optional()`). */
export declare function isSecretSchema(schema: StandardSchemaV1): boolean;
/**
 * Validate with `schema` (any Standard Schema), then wrap the value in a {@link Redacted}. For an
 * optional secret, call `.optional()`: `secret(z.string()).optional()`. The inner result passes
 * straight through: an async inner schema yields a promise, so `defineEnv`'s synchronous check
 * fails with the same `UnexpectedFailure` it would give without `secret`, and a throwing validator
 * still throws.
 *
 * @example
 * const env = defineEnv({ server: { STRIPE_KEY: secret(z.string().min(1)) } });
 * console.log(env.STRIPE_KEY);          // [redacted]
 * stripe(reveal(env.STRIPE_KEY));       // the key
 */
export declare function secret<Schema extends StandardSchemaV1>(schema: Schema): SecretSchema<Schema>;
/**
 * The plain value of a secret. Also takes the raw value, because when
 * validation is skipped (`skipValidation`, or `CI` builds) schemas do not run
 * and the variable is still a plain string.
 */
export declare function reveal<Value>(value: Redacted<Value> | Value): Value;
export {};
//# sourceMappingURL=secret.d.ts.map