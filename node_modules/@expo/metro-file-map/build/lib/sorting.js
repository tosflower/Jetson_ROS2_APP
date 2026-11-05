/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ // Utilities for working with Array.prototype.sort
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    chainComparators: null,
    compareStrings: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get chainComparators () {
        return chainComparators;
    },
    get compareStrings () {
        return compareStrings;
    }
});
function compareStrings(a, b) {
    if (a == null) {
        return b == null ? 0 : -1;
    }
    if (b == null) {
        return 1;
    }
    return a.localeCompare(b);
}
function chainComparators(...comparators) {
    return (a, b)=>{
        for (const comparator of comparators){
            const result = comparator(a, b);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}

//# sourceMappingURL=sorting.js.map
