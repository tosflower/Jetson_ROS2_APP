"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createSymlinksToKotlinFiles: null,
    generateInlineModulesListFile: null,
    getClassName: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createSymlinksToKotlinFiles () {
        return createSymlinksToKotlinFiles;
    },
    get generateInlineModulesListFile () {
        return generateInlineModulesListFile;
    },
    get getClassName () {
        return getClassName;
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function createSymlinksToKotlinFiles(mirrorPath, inlineModulesMirror) {
    const kotlinFiles = inlineModulesMirror.files.filter(({ filePath })=>filePath.endsWith('.kt'));
    await (0, _concurrency.taskAll)(kotlinFiles, async ({ filePath, watchedDir })=>{
        const filePathRelativeToWatchedDir = _path().default.relative(watchedDir, filePath);
        const targetPath = _path().default.resolve(mirrorPath, filePathRelativeToWatchedDir);
        try {
            await _fs().default.promises.mkdir(_path().default.dirname(targetPath), {
                recursive: true
            });
            await _fs().default.promises.symlink(filePath, targetPath);
        } catch (e) {
            (0, _console().error)(`Couldn't symlink inline module: ${filePath}. Error: ${e}`);
        }
    });
}
function getClassName(classNameWithPackage) {
    const index = classNameWithPackage.lastIndexOf('.');
    if (index < 0) {
        return classNameWithPackage;
    }
    return classNameWithPackage.substring(index + 1);
}
async function generateInlineModulesListFile(inlineModulesListPath, inlineModulesMirror) {
    const fileContent = `package inline.modules

import expo.modules.kotlin.ModulesProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.services.Service

class ExpoInlineModulesList : ModulesProvider {
  override fun getModulesMap(): Map<Class<out Module>, String?> {
    return mapOf(
${inlineModulesMirror.kotlinClasses.map((moduleClass)=>`      ${moduleClass}::class.java to "${getClassName(moduleClass)}"`).join(',\n')}
    )
  }

  override fun getServices(): List<Class<out Service>> {
    return emptyList()
  }
}
`;
    await _fs().default.promises.mkdir(inlineModulesListPath, {
        recursive: true
    });
    await _fs().default.promises.writeFile(_path().default.resolve(inlineModulesListPath, 'ExpoInlineModulesList.kt'), fileContent);
}

//# sourceMappingURL=androidInlineModules.js.map
