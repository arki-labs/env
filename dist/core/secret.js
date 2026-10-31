/** What a redacted value prints as, everywhere. */
const REDACTED_TEXT = '[redacted]';
/** Node's `util.inspect` hook, so `console.log(env)` shows `[redacted]` too. */
const inspect = Symbol.for('nodejs.util.inspect.custom');
/** Reads the private value. Assigned in the class's static block, so only this module can read it. */
let read;
/** A value that prints as `[redacted]`. Read it with {@link reveal}. */
export class Redacted {
    // A private field: invisible to JSON, `Object.keys`, spreading and `util.inspect`.
    #value;
    static {
        read = redacted => redacted.#value;
    }
    constructor(value) {
        this.#value = value;
    }
    toString() {
        return REDACTED_TEXT;
    }
    toJSON() {
        return REDACTED_TEXT;
    }
    [inspect]() {
        return REDACTED_TEXT;
    }
}
/** Marks a schema built by {@link secret}, so `describeEnv` can tell secrets apart. */
export const SECRET_SCHEMA = Symbol.for('arki.env.secret');
/** True for a schema built by {@link secret} (or its `.optional()`). */
export function isSecretSchema(schema) {
    return SECRET_SCHEMA in schema;
}
/**
 * What every issue of a rejected secret says. Vendors such as valibot put the received value in
 * their messages (`Received "sk_live_…"`), and `defineEnv` logs and throws issues, so a secret's
 * issues keep only their path.
 */
const HIDDEN_ISSUE_MESSAGE = 'Invalid secret (details hidden so the value cannot leak)';
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
export function secret(schema) {
    const { version, vendor } = schema['~standard'];
    const seal = (result) => result.issues === undefined
        ? { value: new Redacted(result.value) }
        : {
            issues: result.issues.map(issue => issue.path === undefined
                ? { message: HIDDEN_ISSUE_MESSAGE }
                : { message: HIDDEN_ISSUE_MESSAGE, path: issue.path }),
        };
    const redact = (value) => {
        const result = schema['~standard'].validate(value);
        return result instanceof Promise ? result.then(seal) : seal(result);
    };
    return {
        [SECRET_SCHEMA]: true,
        '~standard': { version, vendor, validate: redact },
        optional: () => ({
            [SECRET_SCHEMA]: true,
            '~standard': {
                version,
                vendor,
                validate: value => (value === undefined ? { value: undefined } : redact(value)),
            },
        }),
    };
}
/**
 * The plain value of a secret. Also takes the raw value, because when
 * validation is skipped (`skipValidation`, or `CI` builds) schemas do not run
 * and the variable is still a plain string.
 */
export function reveal(value) {
    return value instanceof Redacted ? read(value) : value;
}
//# sourceMappingURL=secret.js.map