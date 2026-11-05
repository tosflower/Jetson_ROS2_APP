"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "diffFingerprintsAsync", {
    enumerable: true,
    get: function() {
        return diffFingerprintsAsync;
    }
});
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
const _index = require("../../../build/index");
const _args = require("../utils/args");
const _errors = require("../utils/errors");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("../utils/log"));
const _readFingerprintFileAsync = /*#__PURE__*/ _interop_require_default(require("../utils/readFingerprintFileAsync"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const diffFingerprintsAsync = async (argv)=>{
    const args = (0, _args.assertArgs)({
        // Types
        '--help': Boolean,
        // Aliases
        '-h': '--help'
    }, argv ?? []);
    if (args['--help']) {
        _log.exit((0, _chalk().default)`
{bold Description}
Diff two fingerprints

{bold Usage}
  {dim $} npx @expo/fingerprint fingerprint:diff <fingerprintFile1> <fingerprintFile2>

  Options
  -h, --help                           Output usage information
    `, 0);
    }
    const fingerprintFile1 = (0, _args.getFileArgumentAtIndex)(args, 0);
    const fingerprintFile2 = (0, _args.getFileArgumentAtIndex)(args, 1);
    const [fingerprint1ToDiff, fingerprint2ToDiff] = await Promise.all([
        (0, _readFingerprintFileAsync.default)(fingerprintFile1),
        (0, _readFingerprintFileAsync.default)(fingerprintFile2)
    ]);
    try {
        const diff = (0, _index.diffFingerprints)(fingerprint1ToDiff, fingerprint2ToDiff);
        console.log(JSON.stringify(diff, null, 2));
    } catch (e) {
        throw new _errors.CommandError(e.message);
    }
};

//# sourceMappingURL=diffFingerprints.js.map
