/** A dotenv value has no lossless quoting.
 * @fix Use encryption or a value supported by dotenv quoting.
 * @verify bun run test
 */
export declare const UnrepresentableValue: import("@arki/failure").FailureDefinition<"env.unrepresentable_value", undefined>;
/** Cryptographic encryption failed.
 * @fix Verify the public key and runtime crypto support.
 * @verify bun run test
 */
export declare const EncryptionFailed: import("@arki/failure").FailureDefinition<"env.encryption_failed", undefined>;
/** Ciphertext authentication or decoding failed.
 * @fix Restore the correct private key or reset the damaged value.
 * @verify bun run test
 */
export declare const DecryptionFailed: import("@arki/failure").FailureDefinition<"env.decryption_failed", undefined>;
/** The runtime could not generate a keypair.
 * @fix Restore runtime crypto support.
 * @verify bun run test
 */
export declare const KeyGenerationFailed: import("@arki/failure").FailureDefinition<"env.key_generation_failed", undefined>;
/** An env file could not be read.
 * @fix Check the path, file type and access permissions.
 * @verify bun run test
 */
export declare const FileReadFailed: import("@arki/failure").FailureDefinition<"env.file_read_failed", import("@standard-schema/spec").StandardSchemaV1<{
    file: string;
}, {
    file: string;
}>>;
/** An env file could not be replaced.
 * @fix Check disk space and parent-directory permissions.
 * @verify bun run test
 */
export declare const FileWriteFailed: import("@arki/failure").FailureDefinition<"env.file_write_failed", import("@standard-schema/spec").StandardSchemaV1<{
    file: string;
}, {
    file: string;
}>>;
/** The target file has no public key.
 * @fix Initialize the file before encrypting values.
 * @verify bun run test
 */
export declare const MissingPublicKey: import("@arki/failure").FailureDefinition<"env.missing_public_key", import("@standard-schema/spec").StandardSchemaV1<{
    file: string;
}, {
    file: string;
}>>;
/** No private key is available.
 * @fix Restore the environment key from its backup.
 * @verify bun run test
 */
export declare const MissingPrivateKey: import("@arki/failure").FailureDefinition<"env.missing_private_key", import("@standard-schema/spec").StandardSchemaV1<{
    file: string;
}, {
    file: string;
}>>;
/** Rotation stopped after its recovery keys were saved.
 * @fix Keep the staged key file and retry rotation.
 * @verify bun run test
 */
export declare const RotationIncomplete: import("@arki/failure").FailureDefinition<"env.rotation_incomplete", import("@standard-schema/spec").StandardSchemaV1<{
    keysFile: string;
    completedFiles: number;
    totalFiles: number;
}, {
    keysFile: string;
    completedFiles: number;
    totalFiles: number;
}>>;
/** A secret provider rejected a read.
 * @fix Check the provider CLI installation, login and reference.
 * @verify bun run test
 */
export declare const ReferenceFailed: import("@arki/failure").FailureDefinition<"env.reference_failed", import("@standard-schema/spec").StandardSchemaV1<{
    scheme: string;
}, {
    scheme: string;
}>>;
/** Loading was cancelled.
 * @fix Handle cancellation at the calling boundary.
 * @verify bun run test
 */
export declare const EnvCancelled: import("@arki/failure").FailureDefinition<"env.cancelled", undefined>;
/** The aggregate load deadline elapsed.
 * @fix Increase the budget or restore provider responsiveness.
 * @verify bun run test
 */
export declare const EnvDeadline: import("@arki/failure").FailureDefinition<"env.deadline", undefined>;
/** Loader problem codes are derived from their canonical definitions. */
export declare const ENV_FILES_ERROR_CODES: {
    readonly missingPrivateKey: "env.missing_private_key";
    readonly cannotDecrypt: "env.decryption_failed";
    readonly unresolvedReference: "env.reference_failed";
    readonly cannotRead: "env.file_read_failed";
    readonly cancelled: "env.cancelled";
    readonly deadline: "env.deadline";
};
/** One or more env entries could not be loaded. Public data excludes values and raw causes.
 * @fix Address each named problem before starting the app.
 * @verify bun run test
 */
export declare const EnvFilesFailed: import("@arki/failure").FailureDefinition<"env.files_failed", import("@standard-schema/spec").StandardSchemaV1<{
    environment: string;
    errors: {
        code: "env.cancelled" | "env.deadline" | "env.decryption_failed" | "env.file_read_failed" | "env.missing_private_key" | "env.reference_failed";
        message: string;
        file: string;
        key?: string | undefined;
    }[];
}, {
    environment: string;
    errors: {
        code: "env.cancelled" | "env.deadline" | "env.decryption_failed" | "env.file_read_failed" | "env.missing_private_key" | "env.reference_failed";
        message: string;
        file: string;
        key?: string | undefined;
    }[];
}>>;
//# sourceMappingURL=errors.d.ts.map