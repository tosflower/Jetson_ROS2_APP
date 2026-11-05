"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    insertContentsAtOffset: null,
    replaceContentsWithOffset: null,
    searchFromOffset: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get insertContentsAtOffset () {
        return insertContentsAtOffset;
    },
    get replaceContentsWithOffset () {
        return replaceContentsWithOffset;
    },
    get searchFromOffset () {
        return searchFromOffset;
    }
});
function insertContentsAtOffset(srcContents, insertion, offset) {
    const srcContentsLength = srcContents.length;
    if (offset < 0 || offset > srcContentsLength) {
        throw new Error('Invalid parameters.');
    }
    if (offset === 0) {
        return `${insertion}${srcContents}`;
    } else if (offset === srcContentsLength) {
        return `${srcContents}${insertion}`;
    }
    const prefix = srcContents.substring(0, offset);
    const suffix = srcContents.substring(offset);
    return `${prefix}${insertion}${suffix}`;
}
function replaceContentsWithOffset(contents, replacement, startOffset, endOffset) {
    const contentsLength = contents.length;
    if (startOffset < 0 || endOffset < 0 || startOffset >= contentsLength || endOffset >= contentsLength || startOffset > endOffset) {
        throw new Error('Invalid parameters.');
    }
    const prefix = contents.substring(0, startOffset);
    const suffix = contents.substring(endOffset + 1);
    return `${prefix}${replacement}${suffix}`;
}
function searchFromOffset(source, regexp, offset) {
    const target = source.substring(offset);
    const matchedIndex = target.search(regexp);
    return matchedIndex < 0 ? matchedIndex : matchedIndex + offset;
}

//# sourceMappingURL=commonCodeMod.js.map
