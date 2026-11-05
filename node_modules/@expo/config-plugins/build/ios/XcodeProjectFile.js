"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createBuildSourceFile: null,
    withBuildSourceFile: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createBuildSourceFile () {
        return createBuildSourceFile;
    },
    get withBuildSourceFile () {
        return withBuildSourceFile;
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
const _iosplugins = require("../plugins/ios-plugins");
const _Xcodeproj = require("./utils/Xcodeproj");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withBuildSourceFile = (config, { filePath, contents, overwrite })=>{
    return (0, _iosplugins.withXcodeProject)(config, (config)=>{
        const projectName = (0, _Xcodeproj.getProjectName)(config.modRequest.projectRoot);
        config.modResults = createBuildSourceFile({
            project: config.modResults,
            nativeProjectRoot: config.modRequest.platformProjectRoot,
            fileContents: contents,
            filePath: _path().default.join(projectName, filePath),
            overwrite
        });
        return config;
    });
};
function createBuildSourceFile({ project, nativeProjectRoot, filePath, fileContents, overwrite }) {
    const absoluteFilePath = _path().default.join(nativeProjectRoot, filePath);
    if (overwrite || !_fs().default.existsSync(absoluteFilePath)) {
        // Create the file
        _fs().default.writeFileSync(absoluteFilePath, fileContents, 'utf8');
    }
    // `myapp`
    const groupName = _path().default.dirname(filePath);
    // Ensure the file is linked with Xcode resource files
    if (!project.hasFile(filePath)) {
        project = (0, _Xcodeproj.addBuildSourceFileToGroup)({
            filepath: filePath,
            groupName,
            project
        });
    }
    return project;
}

//# sourceMappingURL=XcodeProjectFile.js.map
