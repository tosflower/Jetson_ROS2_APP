import type { HashSource } from '../Fingerprint.types';
/**
 * Build a hash source for an autolinked native module - its `package.json` name+version for the
 * `package` source type, otherwise its whole native directory.
 */
export declare function createAutolinkingHashSourceAsync(projectRoot: string, dirRelativePath: string, reasons: string[], nativeModuleSourceType: 'files' | 'package'): Promise<HashSource>;
/**
 * Read a package's identity — its `package.json` `name` and `version` — for a `package` source.
 * Returns null when the `package.json` is missing so the caller can fall back to hashing files;
 * any other read/parse error throws, matching `getPackageSourceAsync`.
 */
export declare function readPackageIdentityAsync(packageJsonPath: string): Promise<{
    name: string;
    version: string;
} | null>;
export declare function getFileBasedHashSourceAsync(projectRoot: string, filePath: string, reason: string): Promise<HashSource | null>;
/**
 * Resolve path aliases before computing relative hash source paths.
 * On Windows, temp paths can be passed as short paths like `RUNNER~1` while
 * autolinking returns the long real path, which makes `path.relative()` unstable.
 */
export declare function maybeGetRealPathAsync(filePath: string): Promise<string>;
/**
 * A version of `JSON.stringify` that keeps the keys sorted
 */
export declare function stringifyJsonSorted(target: any, space?: string | number | undefined): string;
/**
 * Transform absolute paths in JSON to relative paths based on the project root.
 */
export declare function relativizeJsonPaths(value: any, projectRoot: string): any;
