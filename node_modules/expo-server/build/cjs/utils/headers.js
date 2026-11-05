"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendHeadersRecord: null,
    mergeHeaderInputs: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get appendHeadersRecord () {
        return appendHeadersRecord;
    },
    get mergeHeaderInputs () {
        return mergeHeaderInputs;
    }
});
const appendHeadersRecord = (headers, updateHeaders, shouldOverwrite)=>{
    for(const headerName in updateHeaders){
        if (Array.isArray(updateHeaders[headerName])) {
            for (const headerValue of updateHeaders[headerName]){
                headers.append(headerName, headerValue);
            }
        } else if (!shouldOverwrite && headers.has(headerName)) {
            continue;
        } else if (updateHeaders[headerName] != null) {
            headers.set(headerName, updateHeaders[headerName]);
        }
    }
};
const mergeHeaderInputs = (base, update)=>{
    const merged = {};
    for (const [headerName, value] of Object.entries(base)){
        merged[headerName.toLowerCase()] = Array.isArray(value) ? [
            ...value
        ] : value;
    }
    for(const headerName in update){
        const value = update[headerName];
        if (value == null) {
            continue;
        }
        const key = headerName.toLowerCase();
        if (Array.isArray(value)) {
            const existing = merged[key];
            merged[key] = existing != null ? [
                ...Array.isArray(existing) ? existing : [
                    existing
                ],
                ...value
            ] : [
                ...value
            ];
        } else {
            merged[key] = value;
        }
    }
    return merged;
};

//# sourceMappingURL=headers.js.map
