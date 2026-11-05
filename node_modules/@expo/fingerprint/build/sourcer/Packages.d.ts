import type { HashSource, NormalizedOptions } from '../Fingerprint.types';
interface PackageSourcerParams {
    /**
     * The package name.
     *
     * Note that the package should be a direct dependency or devDependency of the project.
     * Otherwise on pnpm isolated mode the resolution will fail.
     */
    packageName: string;
    /**
     * How the package is hashed.
     * - `package`: by its `package.json` name+version, ignoring unrelated churn inside the package.
     * - `files`: by its entire directory.
     */
    sourceType: 'files' | 'package';
}
export declare function getDefaultPackageSourcesAsync(projectRoot: string, options: NormalizedOptions): Promise<HashSource[]>;
export declare function getPackageSourceAsync(projectRoot: string, params: PackageSourcerParams): Promise<HashSource | null>;
export {};
