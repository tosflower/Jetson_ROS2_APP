"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createFingerprintAsync: null,
    createProjectHashAsync: null,
    diffFingerprintChangesAsync: null,
    diffFingerprints: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createFingerprintAsync () {
        return createFingerprintAsync;
    },
    get createProjectHashAsync () {
        return createProjectHashAsync;
    },
    get diffFingerprintChangesAsync () {
        return diffFingerprintChangesAsync;
    },
    get diffFingerprints () {
        return diffFingerprints;
    }
});
const _Dedup = require("./Dedup");
const _Options = require("./Options");
const _Sort = require("./Sort");
const _Hash = require("./hash/Hash");
const _Sourcer = require("./sourcer/Sourcer");
async function createFingerprintAsync(projectRoot, options) {
    const opts = await (0, _Options.normalizeOptionsAsync)(projectRoot, options);
    const sources = await (0, _Sourcer.getHashSourcesAsync)(projectRoot, opts);
    const normalizedSources = (0, _Sort.sortSources)((0, _Dedup.dedupSources)(sources, projectRoot));
    const fingerprint = await (0, _Hash.createFingerprintFromSourcesAsync)(normalizedSources, projectRoot, opts);
    return fingerprint;
}
async function createProjectHashAsync(projectRoot, options) {
    const fingerprint = await createFingerprintAsync(projectRoot, options);
    return fingerprint.hash;
}
async function diffFingerprintChangesAsync(fingerprint, projectRoot, options) {
    const newFingerprint = await createFingerprintAsync(projectRoot, options);
    if (fingerprint.hash === newFingerprint.hash) {
        return [];
    }
    return diffFingerprints(fingerprint, newFingerprint);
}
function diffFingerprints(fingerprint1, fingerprint2) {
    let index1 = 0;
    let index2 = 0;
    let source1 = fingerprint1.sources[index1];
    let source2 = fingerprint2.sources[index2];
    const diff = [];
    while(source1 != null && source2 != null){
        const compareResult = (0, _Sort.compareSource)(source1, source2);
        if (compareResult === 0) {
            if (source1.hash !== source2.hash) {
                diff.push({
                    op: 'changed',
                    beforeSource: source1,
                    afterSource: source2
                });
            }
            source1 = fingerprint1.sources[++index1];
            source2 = fingerprint2.sources[++index2];
        } else if (compareResult < 0) {
            diff.push({
                op: 'removed',
                removedSource: source1
            });
            source1 = fingerprint1.sources[++index1];
        } else {
            diff.push({
                op: 'added',
                addedSource: source2
            });
            source2 = fingerprint2.sources[++index2];
        }
    }
    while(source1 != null){
        diff.push({
            op: 'removed',
            removedSource: source1
        });
        source1 = fingerprint1.sources[++index1];
    }
    while(source2 != null){
        diff.push({
            op: 'added',
            addedSource: source2
        });
        source2 = fingerprint2.sources[++index2];
    }
    return diff;
}

//# sourceMappingURL=Fingerprint.js.map
