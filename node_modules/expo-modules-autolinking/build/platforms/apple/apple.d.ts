import type { AutolinkingOptions } from '../../commands/autolinkingOptions';
import type { ExtraDependencies, ModuleDescriptorIos, ModuleIosConfig, ModuleIosPodspecInfo, PackageRevision, SearchResults, SupportedPlatform } from '../../types';
interface AppleConfigurationOutput {
    buildFromSource: string[];
}
export declare function getConfiguration(options: AutolinkingOptions): AppleConfigurationOutput | undefined;
export declare function getSwiftModuleNames(pods: ModuleIosPodspecInfo[], swiftModuleNames: string[] | undefined): string[];
/**
 * Scans all packages for `@ExpoModule` classes that compile for the given platform, in one scanner
 * run. Returns the classes by package name, or null when the scan is unavailable or fails.
 */
export declare function scanNativeModulesAsync(searchResults: SearchResults, platform: SupportedPlatform): Promise<Record<string, ModuleIosConfig[]> | null>;
/** Resolves module search result with additional details required for iOS platform. */
export declare function resolveModuleAsync(packageName: string, revision: PackageRevision, extraOutput: {
    flags?: Record<string, any>;
    scannedModules?: Record<string, ModuleIosConfig[]> | null;
}): Promise<ModuleDescriptorIos | null>;
export declare function resolveExtraBuildDependenciesAsync(projectNativeRoot: string): Promise<ExtraDependencies | null>;
interface GenerateModulesProviderParams {
    watchedDirectories: string[];
    inlineModulesTargets: {
        mainTarget?: string;
        targets: string[];
    };
    targetPath: string;
    targetName?: string;
    appRoot: string;
}
/**
 * Generates Swift file that contains all autolinked Swift packages.
 */
export declare function generateModulesProviderAsync(modules: ModuleDescriptorIos[], targetPath: string, entitlementPath: string | null, params: GenerateModulesProviderParams): Promise<void>;
/**
 * Formats an array of modules to Swift's array containing ReactDelegateHandlers
 */
export declare function formatArrayOfReactDelegateHandler(modules: ModuleDescriptorIos[]): string;
export {};
