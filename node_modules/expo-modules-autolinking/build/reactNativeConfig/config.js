"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "loadConfigAsync", {
    enumerable: true,
    get: function() {
        return loadConfigAsync;
    }
});
function _requireutils() {
    const data = require("@expo/require-utils");
    _requireutils = function() {
        return data;
    };
    return data;
}
function _promises() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs/promises"));
    _promises = function() {
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
const _memoize = require("../memoize");
const _utils = require("../utils");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const mockedNativeModules = _path().default.join(__dirname, '..', '..', 'node_modules_mock');
const loadConfigAsync = (0, _memoize.memoize)(async function loadConfigAsync(packageRoot) {
    const configPath = (await Promise.all([
        'react-native.config.js',
        'react-native.config.ts'
    ].map(async (fileName)=>{
        const file = _path().default.join(packageRoot, fileName);
        return await (0, _utils.fileExistsAsync)(file) ? file : null;
    }))).find((path)=>path != null);
    if (configPath) {
        const mod = (0, _requireutils().evalModule)(await _promises().default.readFile(configPath, 'utf8'), configPath, // NOTE: We need to mock the Community CLI temporarily, because
        // some packages are checking the version of the CLI in the `react-native.config.js` file.
        // We can remove this once we remove this check from packages.
        {
            paths: [
                mockedNativeModules
            ]
        });
        return mod.default ?? mod ?? null;
    } else {
        return null;
    }
});

//# sourceMappingURL=config.js.map
