"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    dedupSources: null,
    mergeSourceWithReasons: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get dedupSources () {
        return dedupSources;
    },
    get mergeSourceWithReasons () {
        return mergeSourceWithReasons;
    }
});
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const debug = require('debug')('expo:fingerprint:Dedup');
function dedupSources(sources, projectRoot) {
    const newSources = [];
    for (const source of sources){
        const [duplicatedItemIndex, shouldSwapSource] = findDuplicatedSourceIndex(newSources, source, projectRoot);
        const duplicatedItem = newSources[duplicatedItemIndex];
        if (duplicatedItem != null) {
            debug(`Skipping duplicated source: ${JSON.stringify(source)}`);
            if (shouldSwapSource) {
                newSources[duplicatedItemIndex] = {
                    ...source,
                    reasons: [
                        ...source.reasons,
                        ...duplicatedItem.reasons
                    ]
                };
            } else {
                duplicatedItem.reasons = [
                    ...duplicatedItem.reasons,
                    ...source.reasons
                ];
            }
        } else {
            newSources.push(source);
        }
    }
    return newSources;
}
function mergeSourceWithReasons(dst, src) {
    return dst;
}
/**
 * Find the duplicated `source` in `newSources`
 * @return tuple of [duplicatedItemIndexInNewSources, shouldSwapSource]
 */ function findDuplicatedSourceIndex(newSources, source, projectRoot) {
    let shouldSwapSource = false;
    if (source.type === 'contents') {
        return [
            newSources.findIndex((item)=>item.type === source.type && item.id === source.id) ?? null,
            shouldSwapSource
        ];
    }
    if (source.type === 'package') {
        const key = source.overrideHashKey ?? `${source.name}@${source.version}`;
        return [
            newSources.findIndex((item)=>item.type === 'package' && (item.overrideHashKey ?? `${item.name}@${item.version}`) === key) ?? null,
            shouldSwapSource
        ];
    }
    for (const [index, existingSource] of newSources.entries()){
        if (existingSource.type === 'contents' || existingSource.type === 'package') {
            continue;
        }
        if (isDescendant(source, existingSource, projectRoot)) {
            return [
                index,
                shouldSwapSource
            ];
        }
        // If the new source is ancestor of existing source, swap the existing source with the new source
        if (isDescendant(existingSource, source, projectRoot)) {
            shouldSwapSource = true;
            return [
                index,
                shouldSwapSource
            ];
        }
    }
    return [
        -1,
        shouldSwapSource
    ];
}
function isDescendant(from, to, projectRoot) {
    if (from === to) {
        return true;
    }
    const fromPath = _path().default.join(projectRoot, from.filePath);
    const toPath = _path().default.join(projectRoot, to.filePath);
    const result = _path().default.relative(fromPath, toPath).match(/^[./\\/]*$/) != null;
    if (result) {
        (0, _assert().default)(!(to.type === 'file' && from.type === 'dir'), `Unexpected case which a dir is a descendant of a file - from[${fromPath}] to[${toPath}]`);
    }
    return result;
}

//# sourceMappingURL=Dedup.js.map
