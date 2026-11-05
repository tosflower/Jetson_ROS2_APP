import type { Fingerprint, FingerprintSource, HashResultContents, HashResultDir, HashResultFile, HashResultPackage, HashSource, HashSourceContents, HashSourcePackage, NormalizedOptions } from '../Fingerprint.types';
import { type Limiter } from '../utils/Concurrency';
/**
 * Create a `Fingerprint` from `HashSources` array
 */
export declare function createFingerprintFromSourcesAsync(sources: HashSource[], projectRoot: string, options: NormalizedOptions): Promise<Fingerprint>;
/**
 * Create a `FingerprintSource` from a `HashSource`
 * This function will get a hash value and merge back to original source
 */
export declare function createFingerprintSourceAsync(source: HashSource, limiter: Limiter, projectRoot: string, options: NormalizedOptions): Promise<FingerprintSource>;
/**
 * Create a `HashResult` from a file
 */
export declare function createFileHashResultsAsync(filePath: string, limiter: Limiter, projectRoot: string, options: NormalizedOptions): Promise<HashResultFile | null>;
/**
 * Create `HashResult` for a dir.
 * If the dir is excluded, returns null rather than a HashResult
 */
export declare function createDirHashResultsAsync(dirPath: string, limiter: Limiter, projectRoot: string, options: NormalizedOptions, depth?: number): Promise<HashResultDir | null>;
/**
 * Create `HashResult` for a `HashSourceContents`
 */
export declare function createContentsHashResultsAsync(source: HashSourceContents, options: NormalizedOptions): Promise<HashResultContents>;
/**
 * Create a `HashResult` for a package from its embedded `name` and `version`.
 * The sourcer reads these from the `package.json`, so the hash depends on the package identity
 * rather than its resolved path or unrelated contents.
 * Returns null when the package is ignored.
 */
export declare function createPackageHashResultsAsync(source: HashSourcePackage, options: NormalizedOptions): Promise<HashResultPackage | null>;
/**
 * Create id from given source
 */
export declare function createSourceId(source: HashSource): string;
