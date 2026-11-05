"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    reverseSortString: null,
    sortObjWithOrder: null,
    sortObject: null,
    sortWithOrder: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get reverseSortString () {
        return reverseSortString;
    },
    get sortObjWithOrder () {
        return sortObjWithOrder;
    },
    get sortObject () {
        return sortObject;
    },
    get sortWithOrder () {
        return sortWithOrder;
    }
});
function sortObject(obj, compareFn) {
    return Object.keys(obj).sort(compareFn).reduce((acc, key)=>({
            ...acc,
            [key]: obj[key]
        }), {});
}
function sortObjWithOrder(obj, order) {
    const sorted = sortWithOrder(Object.keys(obj), order);
    return sorted.reduce((acc, key)=>({
            ...acc,
            [key]: obj[key]
        }), {});
}
function sortWithOrder(obj, order) {
    const groupOrder = [
        ...new Set(order.concat(obj))
    ];
    const sorted = [];
    while(groupOrder.length){
        const key = groupOrder.shift();
        const index = obj.indexOf(key);
        if (index > -1) {
            const [item] = obj.splice(index, 1);
            if (item != null) {
                sorted.push(item);
            }
        }
    }
    return sorted;
}
const reverseSortString = (a, b)=>{
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
};

//# sourceMappingURL=sortObject.js.map
