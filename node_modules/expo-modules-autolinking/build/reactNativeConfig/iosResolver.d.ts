import type { ExpoModuleConfig } from '../ExpoModuleConfig';
import type { RNConfigDependencyIos, RNConfigReactNativePlatformsConfigIos } from './reactNativeConfig.types';
/** The CocoaPods platform name of each Apple platform that autolinking reports. */
declare const PODSPEC_PLATFORM_NAMES: {
    readonly ios: "ios";
    readonly tvos: "tvos";
    readonly macos: "osx";
};
type ApplePlatform = keyof typeof PODSPEC_PLATFORM_NAMES;
/**
 * Reads the platforms a podspec declares, or `null` when it does not spell them out.
 *
 * Podspecs are Ruby, so this only recognizes the literal forms: `:osx =>` and `osx:` hash keys, and
 * `s.osx.deployment_target`-style accessors. Comment lines are dropped first. A podspec that
 * computes its platforms (for example `s.platforms = min_supported_versions`) yields `null`, and
 * the caller keeps the dependency, because CocoaPods treats an unspecified platform list as
 * "all platforms".
 */
export declare function readPodspecPlatformsAsync(podspecPath: string): Promise<Set<string> | null>;
export declare function resolveDependencyConfigImplIosAsync(resolution: {
    path: string;
    version: string;
}, reactNativeConfig: RNConfigReactNativePlatformsConfigIos | null | undefined, expoModuleConfig?: ExpoModuleConfig | null, options?: {
    /**
     * The Apple platform being resolved. For `tvos` and `macos`, a dependency whose podspec
     * declares platforms without that one is skipped. The Podfile filters such pods anyway, but
     * codegen and Metro consume this config too and would otherwise reference native code that
     * is never built.
     */
    platform?: ApplePlatform;
}): Promise<RNConfigDependencyIos | null>;
export {};
