"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getGoogleServicesFile: null,
    getGoogleSignInReversedClientId: null,
    setGoogleConfig: null,
    setGoogleServicesFile: null,
    setGoogleSignInReversedClientId: null,
    withGoogle: null,
    withGoogleServicesFile: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getGoogleServicesFile () {
        return getGoogleServicesFile;
    },
    get getGoogleSignInReversedClientId () {
        return getGoogleSignInReversedClientId;
    },
    get setGoogleConfig () {
        return setGoogleConfig;
    },
    get setGoogleServicesFile () {
        return setGoogleServicesFile;
    },
    get setGoogleSignInReversedClientId () {
        return setGoogleSignInReversedClientId;
    },
    get withGoogle () {
        return withGoogle;
    },
    get withGoogleServicesFile () {
        return withGoogleServicesFile;
    }
});
function _plist() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/plist"));
    _plist = function() {
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
const _Paths = require("./Paths");
const _Scheme = require("./Scheme");
const _Xcodeproj = require("./utils/Xcodeproj");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const withGoogle = (config)=>{
    return (0, _iosplugins.withInfoPlist)(config, (config)=>{
        config.modResults = setGoogleConfig(config, config.modResults, config.modRequest);
        return config;
    });
};
const withGoogleServicesFile = (config)=>{
    return (0, _iosplugins.withXcodeProject)(config, (config)=>{
        config.modResults = setGoogleServicesFile(config, {
            projectRoot: config.modRequest.projectRoot,
            project: config.modResults
        });
        return config;
    });
};
function readGoogleServicesInfoPlist(relativePath, { projectRoot }) {
    const googleServiceFilePath = _path().default.resolve(projectRoot, relativePath);
    const contents = _fs().default.readFileSync(googleServiceFilePath, 'utf8');
    (0, _assert().default)(contents, 'GoogleService-Info.plist is empty');
    return _plist().default.parse(contents);
}
function getGoogleSignInReversedClientId(config, modRequest) {
    const googleServicesFileRelativePath = getGoogleServicesFile(config);
    if (googleServicesFileRelativePath === null) {
        return null;
    }
    const infoPlist = readGoogleServicesInfoPlist(googleServicesFileRelativePath, modRequest);
    return infoPlist.REVERSED_CLIENT_ID ?? null;
}
function getGoogleServicesFile(config) {
    return config.ios?.googleServicesFile ?? null;
}
function setGoogleSignInReversedClientId(config, infoPlist, modRequest) {
    const reversedClientId = getGoogleSignInReversedClientId(config, modRequest);
    if (reversedClientId === null) {
        return infoPlist;
    }
    return (0, _Scheme.appendScheme)(reversedClientId, infoPlist);
}
function setGoogleConfig(config, infoPlist, modRequest) {
    infoPlist = setGoogleSignInReversedClientId(config, infoPlist, modRequest);
    return infoPlist;
}
function setGoogleServicesFile(config, { projectRoot, project }) {
    const googleServicesFileRelativePath = getGoogleServicesFile(config);
    if (googleServicesFileRelativePath === null) {
        return project;
    }
    const googleServiceFilePath = _path().default.resolve(projectRoot, googleServicesFileRelativePath);
    _fs().default.copyFileSync(googleServiceFilePath, _path().default.join((0, _Paths.getSourceRoot)(projectRoot), 'GoogleService-Info.plist'));
    const projectName = (0, _Xcodeproj.getProjectName)(projectRoot);
    const plistFilePath = `${projectName}/GoogleService-Info.plist`;
    if (!project.hasFile(plistFilePath)) {
        project = (0, _Xcodeproj.addResourceFileToGroup)({
            filepath: plistFilePath,
            groupName: projectName,
            project,
            isBuildFile: true,
            verbose: true
        });
    }
    return project;
}

//# sourceMappingURL=Google.js.map
