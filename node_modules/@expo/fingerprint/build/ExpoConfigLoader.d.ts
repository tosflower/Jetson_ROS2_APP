/**
 * A helper script to load the Expo config and loaded plugins from a project
 */
import module from 'module';
/**
 * A module observed while `installModuleCaptureHook()` was active.
 */
export interface CapturedModule {
    /** The CommonJS cache key, or an ES module's filename. May diverge from `filename` if virtual. */
    id: string;
    /** The filename Node compiled the module under. Authoritative even for transpiled sources. */
    filename: string;
    /** The source content Node received for the module, before Node strips any types. */
    content: string;
}
/**
 * A config-plugin source produced from a captured module.
 * A module backed by a real file becomes a `file` source.
 * For virtual modules without a physical file in the file system, it becomes a `contents` source
 * carrying the captured body.
 */
export type LoadedModuleSource = {
    type: 'file';
    path: string;
} | {
    type: 'contents';
    id: string;
    contents: string;
};
/**
 * Observe the JavaScript and TypeScript modules that `require()` evaluates while the hook is
 * installed.
 * We hook `Module.prototype._compile` to keep each CommonJS module's authoritative filename and
 * source content. Every argument is forwarded: Node 22.18+ passes a `format` argument that tells it
 * to strip types from a `.ts` file.
 * The ES modules that an ES module imports never reach `_compile`, so a `module.registerHooks`
 * load hook (Node 22.15+) records each ES module file that Node's loader evaluates.
 */
export declare function installModuleCaptureHook(): {
    getCapturedModules: () => CapturedModule[];
    uninstall: () => void;
};
/**
 * A `module.registerHooks` load hook that records each ES module loaded from a file.
 * CommonJS is left to the `_compile` hook, which also sees a module that a transpiler compiles
 * from a string.
 */
export declare function createESModuleLoadHook(capturedModules: CapturedModule[]): module.LoadHookSync;
/**
 * Turn captured modules into config-plugin sources, dropping ignored paths.
 * A real file becomes a `file` source; a module with no file on disk (virtual / compiled from a
 * string) becomes a `contents` source keyed by its project-relative path so it stays stable across
 * runs. A path that exists but is not a file (e.g. a directory) is skipped.
 */
export declare function resolveLoadedModuleSourcesAsync(capturedModules: CapturedModule[], projectRoot: string, ignoredPaths: string[]): Promise<LoadedModuleSource[]>;
/**
 * Get the path to the ExpoConfigLoader file.
 */
export declare function getExpoConfigLoaderPath(): string;
