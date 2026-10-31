import type { StandardSchemaV1 } from '@arki/schema';
declare const publicKeyBrand: unique symbol;
/** A validated secp256k1 public key, distinct from its private key. */
export type EnvPublicKey = string & {
    readonly [publicKeyBrand]: true;
};
declare const privateKeyBrand: unique symbol;
/** A validated secp256k1 private key. Never serialize it into diagnostics. */
export type EnvPrivateKey = string & {
    readonly [privateKeyBrand]: true;
};
/** Standard Schema for an external public key; issue text never echoes the key. */
export declare const envPublicKeySchema: StandardSchemaV1<unknown, EnvPublicKey>;
/** Standard Schema for an external private key; issue text never echoes the key. */
export declare const envPrivateKeySchema: StandardSchemaV1<unknown, EnvPrivateKey>;
/** Parse an external public key without manufacturing a brand. */
export declare function parsePublicKey(value: unknown): import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | EnvPublicKey;
/** Parse an external private key without exposing its bytes in issues. */
export declare function parsePrivateKey(value: unknown): import("@arki/failure").Failure<"schema.async_required", undefined> | import("@arki/failure").Failure<"schema.invalid_input", {
    issues: readonly StandardSchemaV1.Issue[];
}> | import("@arki/failure").Failure<"schema.validator_defect", undefined> | EnvPrivateKey;
export {};
//# sourceMappingURL=key-schemas.d.ts.map