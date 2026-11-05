"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getKotlinInlineModuleInfo: null,
    getMirrorStateObject: null,
    getSwiftModuleClassName: null,
    hasSwiftModuleDefinition: null,
    inlineModuleFileNameInformation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getKotlinInlineModuleInfo () {
        return getKotlinInlineModuleInfo;
    },
    get getMirrorStateObject () {
        return getMirrorStateObject;
    },
    get getSwiftModuleClassName () {
        return getSwiftModuleClassName;
    },
    get hasSwiftModuleDefinition () {
        return hasSwiftModuleDefinition;
    },
    get inlineModuleFileNameInformation () {
        return inlineModuleFileNameInformation;
    }
});
function _console() {
    const data = require("console");
    _console = function() {
        return data;
    };
    return data;
}
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
const _concurrency = require("../concurrency");
const _utils = require("../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const nativeExtensions = [
    '.kt',
    '.swift'
];
// Checks for func definition() -> <anything>ModuleDefinition. <anything> because ExpoModulesCore.ModuleDefinition is a valid usage
const swiftModuleDefinitionRegex = /\bfunc\s+definition\s*\(\s*\)\s*->\s*[\w.]*ModuleDefinition\b/;
// Expo Modules 2.0 classes declare `@ExpoModule` instead of a `definition()` DSL.
const swiftExpoModuleMacroRegex = /@ExpoModule\b/;
// Checks for `override fun definition() = <anything>ModuleDefinition`
const kotlinModuleDefinitionRegex = /\boverride\s+fun\s+definition\s*\(\s*\)\s*=\s*[\w.]*ModuleDefinition\b/;
function inlineModuleFileNameInformation(fileName) {
    const ext = _path().default.extname(fileName);
    if (!nativeExtensions.includes(ext)) {
        return {
            valid: false,
            ext
        };
    }
    return {
        valid: true,
        ext
    };
}
async function getKotlinInlineModuleInfo(absoluteFilePath) {
    let contents;
    try {
        contents = await _fs().default.promises.readFile(absoluteFilePath, 'utf8');
    } catch  {
        (0, _console().warn)(`Kotlin inline module '${absoluteFilePath}' could not be opened.`);
        return {
            hasModuleDefinition: false,
            classNameWithPackage: null
        };
    }
    if (!kotlinModuleDefinitionRegex.test(contents)) {
        return {
            hasModuleDefinition: false,
            classNameWithPackage: null
        };
    }
    // We want to find `package some.package` and capture the `some.package` from it.
    const pacakgeRegex = /^package\s+([\w.]+)/m;
    const packageMatch = contents.match(pacakgeRegex);
    if (!packageMatch) {
        (0, _console().warn)(`Package name couldn't be found in ${absoluteFilePath}.`);
        return {
            hasModuleDefinition: true,
            classNameWithPackage: null
        };
    }
    const classNameWithPackage = `${packageMatch[1]}.${_path().default.basename(absoluteFilePath, _path().default.extname(absoluteFilePath))}`;
    return {
        hasModuleDefinition: true,
        classNameWithPackage
    };
}
function getSwiftModuleClassName(absoluteFilePath) {
    return _path().default.basename(absoluteFilePath, _path().default.extname(absoluteFilePath));
}
async function hasSwiftModuleDefinition(absoluteFilePath) {
    try {
        const contents = await _fs().default.promises.readFile(absoluteFilePath, 'utf8');
        return swiftModuleDefinitionRegex.test(contents) || swiftExpoModuleMacroRegex.test(contents);
    } catch  {
        (0, _console().warn)(`Swift inline module '${absoluteFilePath}' could not be opened.`);
        return false;
    }
}
async function getMirrorStateObject(options) {
    const { watchedDirectories, appRoot } = options;
    const inlineModulesMirror = {
        kotlinClasses: [],
        swiftModuleClassNames: [],
        files: []
    };
    const taskInputs = [];
    for (const dir of watchedDirectories ?? []){
        const absoluteDirPath = _path().default.resolve(appRoot, dir);
        taskInputs.push(absoluteDirPath);
    }
    await (0, _concurrency.taskAll)(taskInputs, async (absoluteDirPath)=>{
        for await (const { name, path: filePath } of (0, _utils.scanFilesRecursively)(absoluteDirPath)){
            const { valid, ext } = inlineModuleFileNameInformation(name);
            if (!valid) {
                continue;
            }
            const absoluteFilePath = await (0, _utils.maybeRealpath)(filePath);
            if (!absoluteFilePath) {
                continue;
            }
            if (ext === '.kt') {
                const { hasModuleDefinition, classNameWithPackage } = await getKotlinInlineModuleInfo(absoluteFilePath);
                if (hasModuleDefinition) {
                    if (classNameWithPackage === null) {
                        continue;
                    }
                    inlineModulesMirror.kotlinClasses.push(classNameWithPackage);
                }
            } else if (ext === '.swift' && await hasSwiftModuleDefinition(absoluteFilePath)) {
                const swiftClassName = getSwiftModuleClassName(absoluteFilePath);
                inlineModulesMirror.swiftModuleClassNames.push(swiftClassName);
            }
            inlineModulesMirror.files.push({
                filePath: absoluteFilePath,
                watchedDir: absoluteDirPath
            });
        }
    });
    // Sort the kotlin and swift classes as later we want to use them to generate module providers and it's better to do it consistently for caching.
    inlineModulesMirror.kotlinClasses.sort();
    inlineModulesMirror.swiftModuleClassNames.sort();
    return inlineModulesMirror;
}

//# sourceMappingURL=inlineModules.js.map
