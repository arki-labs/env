import type { EnvPrivateKey, EnvPublicKey } from './key-schemas.js';
/** The public key in a file's header, or `undefined` when it has none. */
export declare function publicKeyIn(file: string): import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | EnvPublicKey | undefined;
/** What `initEnvFile` did. */
export type InitResult = {
    readonly file: string;
    readonly publicKey: EnvPublicKey;
    /** `false` when the file already had a header. */
    readonly headerAdded: boolean;
    /** Where a new private key was written; `undefined` when an existing key was reused. */
    readonly keysWritten?: string;
};
/**
 * Give `file` a dotenvx header, creating the file if needed. Reuses the private key of the same
 * environment when one is already reachable (so every `.env.development` in a repo shares one key);
 * otherwise generates a keypair and stores the private key in `<root>/.env.keys`.
 */
export declare function initEnvFile(file: string, options: {
    readonly root: string;
    readonly env?: Readonly<Record<string, string | undefined>>;
}): import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.key_generation_failed", undefined> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | {
    file: string;
    publicKey: EnvPublicKey;
    headerAdded: boolean;
    keysWritten?: undefined;
} | {
    file: string;
    publicKey: EnvPublicKey;
    headerAdded: boolean;
    keysWritten: string;
};
/**
 * Set `key` in `file`, encrypted to the file's public key unless `plain`. Returns `false` when the
 * file already held exactly this plaintext value (an encrypted value is always rewritten, because
 * the same plaintext never encrypts to the same bytes).
 */
export declare function setEnvFileValue(file: string, key: string, value: string, options: {
    readonly plain: boolean;
}): boolean | import("@arki/failure").Failure<"env.encryption_failed", undefined> | import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.missing_public_key", {
    file: string;
}> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined>;
/** Encrypt plaintext values in place: the listed keys, or every value. Returns the keys encrypted. */
export declare function encryptEnvFile(file: string, keys?: readonly string[]): string[] | import("@arki/failure").Failure<"env.encryption_failed", undefined> | import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.missing_public_key", {
    file: string;
}> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined>;
/** Decrypt values in place with `privateKeys`: the listed keys, or every value. Returns the keys decrypted. */
export declare function decryptEnvFile(file: string, privateKeys: readonly EnvPrivateKey[], keys?: readonly string[]): string[] | import("@arki/failure").Failure<"env.decryption_failed", undefined> | import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined>;
/** What `rotateEnvFiles` did. */
export type RotateResult = {
    readonly privateKeyName: string;
    readonly files: readonly {
        readonly file: string;
        readonly values: number;
    }[];
    /** Where the new private key was written. */
    readonly keysFile: string;
};
/**
 * Re-encrypt every file of one environment to a new keypair, in one step: decrypt everything first
 * (so a wrong key changes nothing), then write each file, then the new private key. All `files` must
 * share a file name (`.env.production`), because they share a key name.
 */
export declare function rotateEnvFiles(files: readonly string[], options: {
    readonly root: string;
    readonly env?: Readonly<Record<string, string | undefined>>;
}): import("@arki/failure").Failure<"env.decryption_failed", undefined> | import("@arki/failure").Failure<"env.encryption_failed", undefined> | import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | import("@arki/failure").Failure<"env.key_generation_failed", undefined> | import("@arki/failure").Failure<"env.missing_private_key", {
    file: string;
}> | import("@arki/failure").Failure<"env.rotation_incomplete", {
    keysFile: string;
    completedFiles: number;
    totalFiles: number;
}> | import("@arki/failure").Failure<"env.unrepresentable_value", undefined> | import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly import("@standard-schema/spec").StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | {
    privateKeyName: string;
    files: {
        file: string;
        values: number;
    }[];
    keysFile: string;
};
//# sourceMappingURL=edit.d.ts.map