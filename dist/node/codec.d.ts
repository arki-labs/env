import type { EnvPrivateKey, EnvPublicKey } from './key-schemas.js';
export { ENCRYPTED_PREFIX } from '../core/define-env.js';
/** One `KEY=value` assignment: its decoded value and the lines it spans (`end` exclusive). */
export type EnvEntry = {
    readonly key: string;
    readonly value: string;
    readonly start: number;
    readonly end: number;
};
/** A parsed `.env` file: its lines as written, and every assignment in order. */
export type EnvDocument = {
    readonly lines: readonly string[];
    readonly entries: readonly EnvEntry[];
};
/** A keypair as dotenvx writes it: a compressed public key (66 hex chars), a private key (64). */
export type EnvKeypair = {
    readonly publicKey: EnvPublicKey;
    readonly privateKey: EnvPrivateKey;
};
/**
 * Parse `.env` text the way `dotenv` reads it: `export` prefixes, `#` comments, single, double and
 * backtick quotes, multi-line quoted values, and `\n` / `\r` expanded inside double quotes. An
 * unquoted value ends at the first `#`. A key that appears twice keeps both entries; readers take the
 * last one, as dotenv does.
 */
export declare function parseEnv(text: string): EnvDocument;
/** The last value of `key`, or `undefined`. */
export declare function readEnvValue(document: EnvDocument, key: string): string | undefined;
/** Every key with its last value, in first-seen order. */
export declare function envValues(document: EnvDocument): Map<string, EnvEntry>;
/**
 * The text with `key` set to `value`. An existing assignment (the last one) is rewritten in place;
 * a new key is appended. Every other line is kept as written.
 */
export declare function setEnvValue(text: string, key: string, value: string): string | import("@arki/failure").Failure<"env.unrepresentable_value", undefined>;
/** The text without any assignment of `key`. */
export declare function removeEnvValue(text: string, key: string): string;
/** True for a value written by {@link encryptValue} (or by dotenvx). */
export declare function isEncrypted(value: string): boolean;
/** Encrypt `value` to a compressed or uncompressed secp256k1 public key (hex). */
export declare function encryptValue(value: string, publicKey: EnvPublicKey): string | import("@arki/failure").Failure<"env.encryption_failed", undefined>;
/** Decrypt authenticated UTF-8, or return DecryptionFailed when the ciphertext/key does not match. */
export declare function decryptValue(value: string, privateKey: EnvPrivateKey): string | import("@arki/failure").Failure<"env.decryption_failed", undefined>;
/** A new random keypair. */
export declare function generateKeypair(): import("@arki/failure").Failure<"env.key_generation_failed", undefined> | {
    publicKey: EnvPublicKey;
    privateKey: EnvPrivateKey;
};
/** The compressed public key of an already validated private key. */
export declare function publicKeyOf(privateKey: EnvPrivateKey): EnvPublicKey;
/**
 * The key names dotenvx uses for a file: `.env` → `DOTENV_PUBLIC_KEY` / `DOTENV_PRIVATE_KEY`,
 * `.env.production` → `..._PRODUCTION`, `.env.ci.local` → `..._CI_LOCAL`.
 */
export declare function keyNamesFor(fileName: string): {
    readonly publicKey: string;
    readonly privateKey: string;
};
/** True for the `DOTENV_PUBLIC_KEY*` / `DOTENV_PRIVATE_KEY*` names, which are never app values. */
export declare function isKeyName(key: string): boolean;
/** The dotenvx header for a file: banner, public key, and a `# <file>` line. */
export declare function envHeader(fileName: string, publicKey: EnvPublicKey): string;
//# sourceMappingURL=codec.d.ts.map