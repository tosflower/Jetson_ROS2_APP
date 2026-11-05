import type commander from 'commander';
import type { SearchResults } from '../types';
/**
 * Warns about expected packages missing from the resolution. When the scan failed, returns the
 * packages left empty that don't declare their modules but have `@ExpoModule` in their sources.
 */
export declare function findPackagesMissingScannedModules(expectedPackageNames: string[], resolvedModules: {
    packageName: string;
    modules?: unknown[];
}[], scanSucceeded: boolean, searchResults: SearchResults): string[];
export declare function generateModulesProviderCommand(cli: commander.CommanderStatic): commander.Command;
