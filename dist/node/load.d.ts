import type { FailureOf } from '@arki/failure';
import type { ReferenceResolver } from './references.js';
import { EnvFilesFailed } from './errors.js';
export { ENV_FILES_ERROR_CODES } from './errors.js';
/** How `loadEnvFiles` finds, reads and applies the files. */
export type LoadEnvFilesOptions = {
    /** Where to stop descending. Default: `process.cwd()`. */
    readonly cwd?: string;
    /** Where to start. Default: the nearest ancestor with `.git`, else with a `workspaces` package.json, else `cwd`. */
    readonly root?: string;
    /** Picks `.env.<environment>`. Default: `NODE_ENV`, else `development`. */
    readonly environment?: string;
    /** File names read in every directory, later wins. Default: `.env.<environment>`, then `.env.local` (not under `test`). */
    readonly files?: readonly string[];
    /** The environment read and written. Default: `process.env`. */
    readonly env?: Record<string, string | undefined>;
    /** `false` reads and decrypts without writing anything. Default: `true`. */
    readonly write?: boolean;
    /** Reference resolvers by scheme. Default: `op`, `infisical`, `doppler`. */
    readonly references?: Readonly<Record<string, ReferenceResolver>>;
    /** Cooperative cancellation between synchronous reads; passed to provider callbacks. */
    readonly signal?: AbortSignal;
    /** Aggregate load budget, shared by all provider subprocesses. Default: 30 seconds. */
    readonly timeoutMs?: number;
};
/** How a value is stored in its file. */
export type EnvValueKind = 'plain' | 'encrypted' | 'reference';
/** The winning file entry of one key. `value` is the plaintext, absent when it could not be read. */
export type EnvFileValue = {
    readonly key: string;
    readonly file: string;
    readonly line: number;
    readonly kind: EnvValueKind;
    readonly value?: string;
};
/** One problem, by name. Messages never contain a value. */
export type EnvFilesError = FailureOf<typeof EnvFilesFailed>['data']['errors'][number];
/** What a load found and did. Holds plaintext in `values`: never print it whole. */
export type EnvFilesReport = {
    readonly root: string;
    readonly environment: string;
    /** Files read, in load order. */
    readonly files: readonly string[];
    readonly values: readonly EnvFileValue[];
    /** Keys written into the environment. */
    readonly applied: readonly string[];
    /** Keys the real environment set to a different value, so the file value was not used. */
    readonly shadowed: readonly {
        readonly key: string;
        readonly file: string;
        readonly line: number;
    }[];
    /** File entries never applied: loader-hijacking keys (`NODE_OPTIONS`, `LD_*`, `DYLD_*`) and references into public keys. */
    readonly refused: readonly {
        readonly key: string;
        readonly file: string;
        readonly line: number;
        readonly reason: string;
    }[];
    readonly errors: readonly EnvFilesError[];
};
/** Load atomically into the env map: operational problems return canonical failures before applying values. */
export declare function loadEnvFiles(options?: LoadEnvFilesOptions): import("@arki/failure").Failure<"env.cancelled", undefined> | import("@arki/failure").Failure<"env.deadline", undefined> | import("@arki/failure").Failure<"env.files_failed", {
    environment: string;
    errors: {
        code: "env.cancelled" | "env.deadline" | "env.decryption_failed" | "env.file_read_failed" | "env.missing_private_key" | "env.reference_failed";
        message: string;
        file: string;
        key?: string | undefined;
    }[];
}> | {
    root: string;
    environment: string;
    files: string[];
    values: EnvFileValue[];
    applied: string[];
    shadowed: {
        key: string;
        file: string;
        line: number;
    }[];
    refused: {
        key: string;
        file: string;
        line: number;
        reason: string;
    }[];
    errors: {
        code: "env.cancelled" | "env.deadline" | "env.decryption_failed" | "env.file_read_failed" | "env.missing_private_key" | "env.reference_failed";
        message: string;
        file: string;
        key?: string | undefined;
    }[];
};
/** Every value this process loaded from an encrypted or referenced entry: what log masking hides. */
export declare function secretValues(): readonly string[];
/** The report's errors as one message, one line each. */
export declare function formatEnvFilesErrors(failure: FailureOf<typeof EnvFilesFailed>): string;
/** The nearest ancestor of `cwd` with `.git`, else with a `workspaces` package.json, else `cwd`. */
export declare function findRoot(cwd: string): string;
/** The directories from `root` down to `cwd`, root first. Just `cwd` when it is not inside `root`. */
export declare function envDirs(root: string, cwd: string): readonly string[];
//# sourceMappingURL=load.d.ts.map