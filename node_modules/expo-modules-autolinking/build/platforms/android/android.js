"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    convertPackageToProjectName: null,
    convertPackageWithGradleToProjectName: null,
    getConfiguration: null,
    isAndroidProject: null,
    resolveExtraBuildDependenciesAsync: null,
    resolveGradlePropertyAsync: null,
    resolveModuleAsync: null,
    searchGradlePropertyFirst: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get convertPackageToProjectName () {
        return convertPackageToProjectName;
    },
    get convertPackageWithGradleToProjectName () {
        return convertPackageWithGradleToProjectName;
    },
    get getConfiguration () {
        return getConfiguration;
    },
    get isAndroidProject () {
        return isAndroidProject;
    },
    get resolveExtraBuildDependenciesAsync () {
        return resolveExtraBuildDependenciesAsync;
    },
    get resolveGradlePropertyAsync () {
        return resolveGradlePropertyAsync;
    },
    get resolveModuleAsync () {
        return resolveModuleAsync;
    },
    get searchGradlePropertyFirst () {
        return searchGradlePropertyFirst;
    }
});
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
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
const _concurrency = require("../../concurrency");
const _utils = require("../../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const ANDROID_PROPERTIES_FILE = 'gradle.properties';
const ANDROID_EXTRA_BUILD_DEPS_KEY = 'android.extraMavenRepos';
function getConfiguration(options) {
    return options.buildFromSource ? {
        buildFromSource: options.buildFromSource
    } : undefined;
}
function isAndroidProject(projectRoot) {
    return _fs().default.existsSync(_path().default.join(projectRoot, 'build.gradle')) || _fs().default.existsSync(_path().default.join(projectRoot, 'build.gradle.kts'));
}
async function resolveModuleAsync(packageName, revision) {
    // TODO: Relative source dir should be configurable through the module config.
    // Don't link itself... :D
    if (packageName === '@unimodules/react-native-adapter') {
        return null;
    }
    const plugins = await (0, _concurrency.taskAll)(revision.config?.androidGradlePlugins() ?? [], async ({ id, group, sourceDir, version, applyToRootProject })=>{
        if (!sourceDir) {
            return {
                id,
                group,
                version,
                applyToRootProject
            };
        }
        const pluginPath = _path().default.join(revision.path, sourceDir);
        return {
            id,
            group,
            // The plugin source dir ends up in Gradle's `includeBuild`, which must not receive a
            // symlink - Android Studio's Tooling API fails to import symlinked included builds.
            // See: https://youtrack.jetbrains.com/issue/IDEA-329756.
            sourceDir: await (0, _utils.maybeRealpath)(pluginPath) ?? pluginPath,
            applyToRootProject
        };
    });
    const defaultProjectName = convertPackageToProjectName(packageName);
    const androidProjects = revision.config?.androidProjects(defaultProjectName)?.filter((project)=>{
        return !project.isDefault || isAndroidProject(_path().default.join(revision.path, project.path));
    });
    // Just in case where the module doesn't have its own `build.gradle`/`settings.gradle`.
    if (!androidProjects?.length) {
        if (!plugins.length) {
            return null;
        }
        return {
            packageName,
            plugins
        };
    }
    const projects = await (0, _concurrency.taskAll)(androidProjects, async (project)=>{
        const projectPath = _path().default.join(revision.path, project.path);
        const aarProjects = (project.gradleAarProjects ?? [])?.map((aarProject)=>{
            const projectName = `${defaultProjectName}$${aarProject.name}`;
            const projectDir = _path().default.join(projectPath, 'build', projectName);
            return {
                name: projectName,
                aarFilePath: _path().default.join(revision.path, aarProject.aarFilePath),
                projectDir
            };
        });
        const publication = project.publication ? {
            ...project.publication,
            version: project.publication.version ?? revision.version
        } : undefined;
        const shouldUsePublicationScriptPath = project.shouldUsePublicationScriptPath ? _path().default.join(revision.path, project.shouldUsePublicationScriptPath) : undefined;
        const packages = new Set();
        for await (const file of (0, _utils.scanFilesRecursively)(projectPath)){
            if (!file.name.endsWith('Package.java') && !file.name.endsWith('Package.kt')) {
                continue;
            }
            const fileContent = await _fs().default.promises.readFile(file.path, 'utf8');
            // Very naive check to skip non-expo packages
            if (!/\bimport\s+expo\.modules\.core\.(interfaces\.Package|BasePackage)\b/.test(fileContent)) {
                continue;
            }
            const classPathMatches = fileContent.match(/^package ([\w.]+)\b/m);
            if (classPathMatches) {
                const basename = _path().default.basename(file.name, _path().default.extname(file.name));
                packages.add(`${classPathMatches[1]}.${basename}`);
            }
        }
        return {
            name: project.name,
            sourceDir: projectPath,
            modules: project.modules ?? [],
            services: project.services ?? [],
            packages: [
                ...packages
            ].sort((a, b)=>a.localeCompare(b)),
            ...shouldUsePublicationScriptPath ? {
                shouldUsePublicationScriptPath
            } : {},
            ...publication ? {
                publication
            } : {},
            ...aarProjects?.length > 0 ? {
                aarProjects
            } : {}
        };
    });
    const coreFeatures = revision.config?.coreFeatures() ?? [];
    return {
        packageName,
        projects,
        ...plugins?.length > 0 ? {
            plugins
        } : {},
        ...coreFeatures.length > 0 ? {
            coreFeatures
        } : {}
    };
}
async function resolveExtraBuildDependenciesAsync(projectNativeRoot) {
    const extraMavenReposString = await resolveGradlePropertyAsync(projectNativeRoot, ANDROID_EXTRA_BUILD_DEPS_KEY);
    if (extraMavenReposString) {
        try {
            return JSON.parse(extraMavenReposString);
        } catch  {}
    }
    return null;
}
async function resolveGradlePropertyAsync(projectNativeRoot, propertyKey) {
    const propsFile = _path().default.join(projectNativeRoot, ANDROID_PROPERTIES_FILE);
    try {
        const contents = await _fs().default.promises.readFile(propsFile, 'utf8');
        const propertyValue = searchGradlePropertyFirst(contents, propertyKey);
        if (propertyValue) {
            return propertyValue;
        }
    } catch  {}
    return null;
}
function convertPackageToProjectName(packageName) {
    return packageName.replace(/^@/g, '').replace(/\W+/g, '-');
}
function convertPackageWithGradleToProjectName(packageName, buildGradleFile) {
    const name = convertPackageToProjectName(packageName);
    const baseDir = _path().default.dirname(buildGradleFile).replace(/\//g, '-');
    return baseDir === 'android' ? name : `${name}$${baseDir}`;
}
function searchGradlePropertyFirst(contents, propertyName) {
    const lines = contents.split('\n');
    for(let i = 0; i < lines.length; i++){
        const line = lines[i]?.trim();
        if (line && !line.startsWith('#')) {
            const eok = line.indexOf('=');
            const key = line.slice(0, eok);
            if (key === propertyName) {
                const value = line.slice(eok + 1, line.length);
                return value;
            }
        }
    }
    return null;
}

//# sourceMappingURL=android.js.map
