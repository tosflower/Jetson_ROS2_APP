import type { AutolinkingOptions } from '../commands/autolinkingOptions';
import type { ExtraDependencies, ModuleDescriptor, SearchResults, SupportedPlatform } from '../types';
export type ResolveModulesParams = {
    /**
     * Whether to scan native sources for annotated module classes, on platforms that support it.
     * Only the modules provider generation asks for it.
     */
    scanNativeModules?: boolean;
    /** Called with whether the requested scan produced a result. */
    onScanResult?: (succeeded: boolean) => void;
    /** The platform to scan for, when narrower than the resolved one (the umbrella `apple`). */
    scanPlatform?: SupportedPlatform;
};
/** Resolves search results to a list of platform-specific configuration. */
export declare function resolveModulesAsync(searchResults: SearchResults, autolinkingOptions: AutolinkingOptions & {
    platform: SupportedPlatform;
}, { scanNativeModules, onScanResult, scanPlatform }?: ResolveModulesParams): Promise<ModuleDescriptor[]>;
interface ResolveExtraBuildDependenciesParams {
    commandRoot: string;
    platform: SupportedPlatform;
}
/** Resolves the extra build dependencies for the project, such as additional Maven repositories or CocoaPods pods. */
export declare function resolveExtraBuildDependenciesAsync({ commandRoot, platform, }: ResolveExtraBuildDependenciesParams): Promise<ExtraDependencies>;
export {};
