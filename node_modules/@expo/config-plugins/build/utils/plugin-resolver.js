"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assertInternalProjectRoot: null,
    moduleNameIsDirectFileReference: null,
    moduleNameIsPackageReference: null,
    normalizeStaticPlugin: null,
    pluginFileName: null,
    resolveConfigPluginExport: null,
    resolveConfigPluginFunction: null,
    resolveConfigPluginFunctionWithInfo: null,
    resolvePluginForModule: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assertInternalProjectRoot () {
        return assertInternalProjectRoot;
    },
    get moduleNameIsDirectFileReference () {
        return moduleNameIsDirectFileReference;
    },
    get moduleNameIsPackageReference () {
        return moduleNameIsPackageReference;
    },
    get normalizeStaticPlugin () {
        return normalizeStaticPlugin;
    },
    get pluginFileName () {
        return pluginFileName;
    },
    get resolveConfigPluginExport () {
        return resolveConfigPluginExport;
    },
    get resolveConfigPluginFunction () {
        return resolveConfigPluginFunction;
    },
    get resolveConfigPluginFunctionWithInfo () {
        return resolveConfigPluginFunctionWithInfo;
    },
    get resolvePluginForModule () {
        return resolvePluginForModule;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _errors = require("./errors");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const pluginFileName = 'app.plugin.js';
// `.js` first keeps the published-artifact case at one stat.
const pluginExtensions = [
    '.js',
    '.cjs',
    '.mjs',
    '.ts',
    '.cts',
    '.mts'
];
function resolvePluginForModule(projectRoot, pluginReference) {
    if (moduleNameIsDirectFileReference(pluginReference)) {
        const pluginScriptFile = (0, _requireutils().resolveFrom)(projectRoot, pluginReference, {
            extensions: pluginExtensions
        });
        if (pluginScriptFile) {
            return {
                isPluginFile: false,
                filePath: pluginScriptFile
            };
        }
    } else if (moduleNameIsPackageReference(pluginReference)) {
        const pluginPackageFile = (0, _requireutils().resolveFrom)(projectRoot, `${pluginReference}/app.plugin`, {
            extensions: pluginExtensions
        });
        if (pluginPackageFile) {
            warnIfPluginNotExported(projectRoot, pluginReference, pluginPackageFile);
            return {
                isPluginFile: true,
                filePath: pluginPackageFile
            };
        }
        // Skip the extension/index probes — Node's resolver (step 4) handles `main`.
        const packageMainEntry = (0, _requireutils().resolveFrom)(projectRoot, pluginReference, {
            extensions: []
        });
        if (packageMainEntry) {
            return {
                isPluginFile: false,
                filePath: packageMainEntry
            };
        }
    }
    throw new _errors.PluginError(`Failed to resolve plugin for module "${pluginReference}" relative to "${projectRoot}". Do you have node modules installed?`, 'PLUGIN_NOT_FOUND');
}
const checkedPluginExports = new Set();
// `resolveFrom` finds `app.plugin.*` on disk regardless of `package.json:exports`, so a package
// that omits it from `exports` works here but not for tools that resolve it through Node.
function warnIfPluginNotExported(projectRoot, pluginReference, pluginPackageFile) {
    if (checkedPluginExports.has(pluginReference)) {
        return;
    }
    checkedPluginExports.add(pluginReference);
    const pluginFile = _path().default.basename(pluginPackageFile);
    if ((0, _requireutils().nativeResolveFrom)(projectRoot, `${pluginReference}/${pluginFile}`) == null) {
        console.warn(`The config plugin for "${pluginReference}" was loaded from "${pluginFile}", but the "exports" field in its package.json doesn't include "./${pluginFile}", so tools that resolve "${pluginReference}/${pluginFile}" through Node can't find it. If you maintain "${pluginReference}", add "./${pluginFile}": "./${pluginFile}" to its "exports"; otherwise, report this to its maintainers.`);
    }
}
// TODO: Test windows
function pathIsFilePath(name) {
    // Matches lines starting with: . / ~/
    return !!name.match(/^(\.|~\/|\/)/g);
}
function moduleNameIsDirectFileReference(name) {
    if (pathIsFilePath(name)) {
        return true;
    }
    const slashCount = name.split('/')?.length;
    // Orgs (like @expo/config ) should have more than one slash to be a direct file.
    if (name.startsWith('@')) {
        return slashCount > 2;
    }
    // Regular packages should be considered direct reference if they have more than one slash.
    return slashCount > 1;
}
function moduleNameIsPackageReference(name) {
    const slashCount = name.split('/')?.length;
    return name.startsWith('@') ? slashCount === 2 : slashCount === 1;
}
function normalizeStaticPlugin(plugin) {
    if (Array.isArray(plugin)) {
        (0, _assert().default)(plugin.length > 0 && plugin.length < 3, `Wrong number of arguments provided for static config plugin, expected either 1 or 2, got ${plugin.length}`);
        return plugin;
    }
    return [
        plugin,
        undefined
    ];
}
function assertInternalProjectRoot(projectRoot) {
    (0, _assert().default)(projectRoot, `Unexpected: Config \`_internal.projectRoot\` isn't defined by expo-cli, this is a bug.`);
}
function resolveConfigPluginFunction(projectRoot, pluginReference) {
    const { plugin } = resolveConfigPluginFunctionWithInfo(projectRoot, pluginReference);
    return plugin;
}
function resolveConfigPluginFunctionWithInfo(projectRoot, pluginReference) {
    const { filePath: pluginFile, isPluginFile } = resolvePluginForModule(projectRoot, pluginReference);
    let result;
    try {
        result = (0, _requireutils().loadModuleSync)(pluginFile);
    } catch (error) {
        let message = error instanceof Error ? error.message : String(error);
        // Don't clobber `loadModuleSync`'s code-framed error
        if (!isPluginFile && !moduleNameIsDirectFileReference(pluginReference)) {
            message += `\n\nNo "app.plugin.{js,cjs,mjs,ts,cts,mts}" file was found in "${pluginReference}", so the package's main entry was loaded instead. Config plugins are typically exported from an "${pluginFileName}" file in the package root.\nLearn more: https://docs.expo.dev/guides/config-plugins/`;
        }
        const pluginError = new _errors.PluginError(message, 'INVALID_PLUGIN_IMPORT');
        if (error instanceof Error && error.stack) {
            pluginError.stack = error.stack;
        }
        throw pluginError;
    }
    const plugin = resolveConfigPluginExport({
        plugin: result,
        pluginFile,
        pluginReference,
        isPluginFile
    });
    return {
        plugin,
        pluginFile,
        pluginReference,
        isPluginFile
    };
}
function resolveConfigPluginExport({ plugin, pluginFile, pluginReference, isPluginFile }) {
    if (plugin.default != null) {
        plugin = plugin.default;
    }
    if (typeof plugin !== 'function') {
        const learnMoreLink = `Learn more: https://docs.expo.dev/guides/config-plugins/`;
        // If the plugin reference is a node module, and that node module does not export a function then it probably doesn't have a config plugin.
        if (!isPluginFile && !moduleNameIsDirectFileReference(pluginReference)) {
            throw new _errors.PluginError(`Package "${pluginReference}" does not contain a valid config plugin. Module must export a function from file: ${pluginFile}\n${learnMoreLink}`, 'INVALID_PLUGIN_TYPE');
        }
        throw new _errors.PluginError(`Plugin "${pluginReference}" must export a function from file: ${pluginFile}. ${learnMoreLink}`, 'INVALID_PLUGIN_TYPE');
    }
    return plugin;
}

//# sourceMappingURL=plugin-resolver.js.map
