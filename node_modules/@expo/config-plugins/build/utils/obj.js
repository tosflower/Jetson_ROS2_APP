/** `lodash.get` */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "get", {
    enumerable: true,
    get: function() {
        return get;
    }
});
function get(obj, key) {
    const branches = key.split('.');
    let current = obj;
    let branch;
    while(branch = branches.shift()){
        if (!(branch in current)) {
            return undefined;
        }
        current = current[branch];
    }
    return current;
}

//# sourceMappingURL=obj.js.map
