"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compareSource: null,
    sortSources: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get compareSource () {
        return compareSource;
    },
    get sortSources () {
        return sortSources;
    }
});
function sortSources(sources) {
    return sources.sort(compareSource);
}
const typeOrder = {
    file: 0,
    dir: 1,
    contents: 2,
    package: 3
};
function compareSource(a, b) {
    const typeResult = typeOrder[a.type] - typeOrder[b.type];
    if (typeResult === 0) {
        if (a.type === 'file' && b.type === 'file') {
            const aValue = a.overrideHashKey ?? a.filePath;
            const bValue = b.overrideHashKey ?? b.filePath;
            return aValue.localeCompare(bValue);
        } else if (a.type === 'dir' && b.type === 'dir') {
            const aValue = a.overrideHashKey ?? a.filePath;
            const bValue = b.overrideHashKey ?? b.filePath;
            return aValue.localeCompare(bValue);
        } else if (a.type === 'contents' && b.type === 'contents') {
            return a.id.localeCompare(b.id);
        } else if (a.type === 'package' && b.type === 'package') {
            const aValue = a.overrideHashKey ?? `${a.name}@${a.version}`;
            const bValue = b.overrideHashKey ?? `${b.name}@${b.version}`;
            return aValue.localeCompare(bValue);
        }
    }
    return typeResult;
}

//# sourceMappingURL=Sort.js.map
