"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "runLegacyCLIAsync", {
    enumerable: true,
    get: function() {
        return runLegacyCLIAsync;
    }
});
const _index = require("../../build/index.js");
const _readFingerprintFileAsync = /*#__PURE__*/ _interop_require_default(require("./utils/readFingerprintFileAsync.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function runLegacyCLIAsync(args) {
    const projectRoot = args[0];
    if (projectRoot == null || args.length !== 1 && args.length !== 2 && args.length !== 3) {
        console.log(`Usage: npx @expo/fingerprint <projectRoot> [fingerprintFile1ToDiff] [fingerprintFile2ToDiff]`);
        process.exit(1);
    }
    const fingerprintFile1ToDiff = args[1];
    const fingerprintFile2ToDiff = args[2];
    const [fingerprint1ToDiff, fingerprint2ToDiff] = await Promise.all([
        fingerprintFile1ToDiff ? (0, _readFingerprintFileAsync.default)(fingerprintFile1ToDiff) : null,
        fingerprintFile2ToDiff ? (0, _readFingerprintFileAsync.default)(fingerprintFile2ToDiff) : null
    ]);
    const options = {
        debug: !!process.env.DEBUG,
        useRNCoreAutolinkingFromExpo: process.env.USE_RNCORE_AUTOLINKING_FROM_EXPO ? [
            '1',
            'true'
        ].includes(process.env.USE_RNCORE_AUTOLINKING_FROM_EXPO) : undefined
    };
    try {
        if (fingerprint1ToDiff && fingerprint2ToDiff) {
            const diff = (0, _index.diffFingerprints)(fingerprint1ToDiff, fingerprint2ToDiff);
            console.log(JSON.stringify(diff, null, 2));
        } else if (fingerprint1ToDiff) {
            const diff = await (0, _index.diffFingerprintChangesAsync)(fingerprint1ToDiff, projectRoot, options);
            console.log(JSON.stringify(diff, null, 2));
        } else {
            const fingerprint = await (0, _index.createFingerprintAsync)(projectRoot, options);
            console.log(JSON.stringify(fingerprint, null, 2));
        }
    } catch (e) {
        console.error('Uncaught Error', e);
        process.exit(1);
    }
}

//# sourceMappingURL=runLegacyCLIAsync.js.map
