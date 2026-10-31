/** Foreign filesystem errors stay private; public outcomes identify only the file. */
export declare function readEnvText(file: string): string | import("@arki/failure").Failure<"env.file_read_failed", {
    file: string;
}>;
/** Each replacement is atomic; owner-only new files and key stores never follow a planted temp symlink. */
export declare function writeEnvText(file: string, text: string, privateFile?: boolean): import("@arki/failure").Failure<"env.file_write_failed", {
    file: string;
}> | undefined;
//# sourceMappingURL=files.d.ts.map