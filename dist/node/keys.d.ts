import type { EnvPrivateKey } from './key-schemas.js';
/** The git-ignored file that holds private keys, one `DOTENV_PRIVATE_KEY_<ENV>=<hex>` line each. */
export declare const KEYS_FILE = ".env.keys";
/** Where a private key was found. Never carries the key itself. */
export type PrivateKeySource = {
    readonly kind: 'env';
    readonly name: string;
} | {
    readonly kind: 'file';
    readonly name: string;
    readonly path: string;
};
/** The candidate keys for a file, and where they came from. */
export type FoundPrivateKey = {
    readonly keys: readonly EnvPrivateKey[];
    readonly source: PrivateKeySource;
};
/** The `.env.keys` paths searched for `file`, nearest first. */
export declare function keysFileCandidates(file: string, root: string): readonly string[];
/** The private key for `file`, or `undefined` when no source has one. */
export declare function findPrivateKey(file: string, options: {
    readonly root: string;
    readonly env: Readonly<Record<string, string | undefined>>;
}): import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | {
    keys: EnvPrivateKey[];
    source: {
        path?: undefined;
        kind: "env";
        name: string;
    };
} | {
    keys: EnvPrivateKey[];
    source: {
        kind: "file";
        name: string;
        path: string;
    };
} | undefined;
/**
 * Store `privateKey` under `name` in a keys file, creating it with the dotenvx banner. An existing
 * entry is replaced. The file is left readable by its owner only.
 */
export declare function writePrivateKey(keysPath: string, name: string, privateKey: EnvPrivateKey, comment: string, options?: {
    readonly preserve?: readonly EnvPrivateKey[];
}): import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined> | undefined;
//# sourceMappingURL=keys.d.ts.map