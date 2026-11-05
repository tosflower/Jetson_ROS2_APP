"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    filterAllowedChildrenElements: null,
    getAllChildrenNotOfType: null,
    getAllChildrenOfType: null,
    getFirstChildOfType: null,
    isChildOfType: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get filterAllowedChildrenElements () {
        return filterAllowedChildrenElements;
    },
    get getAllChildrenNotOfType () {
        return getAllChildrenNotOfType;
    },
    get getAllChildrenOfType () {
        return getAllChildrenOfType;
    },
    get getFirstChildOfType () {
        return getFirstChildOfType;
    },
    get isChildOfType () {
        return isChildOfType;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function isChildOfType(element, type) {
    return (0, _react().isValidElement)(element) && element.type === type;
}
function getFirstChildOfType(children, type) {
    return _react().Children.toArray(children).find((child)=>isChildOfType(child, type));
}
function getAllChildrenOfType(children, type) {
    return _react().Children.toArray(children).filter((child)=>isChildOfType(child, type));
}
function getAllChildrenNotOfType(children, type) {
    return _react().Children.toArray(children).filter((child)=>!isChildOfType(child, type));
}
function filterAllowedChildrenElements(children, components) {
    return _react().Children.toArray(children).filter((child)=>(0, _react().isValidElement)(child) && components.includes(child.type));
}

//# sourceMappingURL=children.js.map
