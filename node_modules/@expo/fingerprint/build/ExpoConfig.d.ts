import type { ProjectConfig } from '@expo/config';
import { type LoadedModuleSource } from './ExpoConfigLoader';
import type { NormalizedOptions } from './Fingerprint.types';
/**
 * An out-of-process `expo/config` loader that can be used to get the Expo config and loaded modules.
 */
export declare function getExpoConfigAsync(projectRoot: string, options: NormalizedOptions): Promise<{
    config: ProjectConfig | null;
    loadedModules: LoadedModuleSource[] | null;
}>;
/**
 * Keep only the config-plugin modules attributable to applying plugins.
 *
 * Anything that also loads when plugins are skipped is the config-loading framework and is dropped.
 * In-repo files and files of linked dependencies are always kept regardless of the diff, so a local
 * or workspace plugin imported at the top of `app.config` (which loads during config evaluation,
 * not plugin application) is never lost. `isLinkedDependencyFile` runs only for a file the diff
 * would drop.
 */
export declare function diffLoadedModules(withPlugins: LoadedModuleSource[], withoutPlugins: LoadedModuleSource[], isLinkedDependencyFile?: (relativePosixPath: string) => boolean): LoadedModuleSource[];
