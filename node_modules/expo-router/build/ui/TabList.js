"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TabList: null,
    isTabList: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TabList () {
        return TabList;
    },
    get isTabList () {
        return isTabList;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function _reactnativesafeareacontext() {
    const data = require("react-native-safe-area-context");
    _reactnativesafeareacontext = function() {
        return data;
    };
    return data;
}
const _common = require("./common");
function TabList({ asChild, style, ...props }) {
    if (asChild) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_common.ViewSlot, {
            style: [
                styles.tabList,
                style
            ],
            ...props
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reactnativesafeareacontext().SafeAreaView, {
        edges: horizontalEdges,
        style: [
            styles.tabList,
            style
        ],
        ...props
    });
}
function isTabList(child) {
    return child.type === TabList;
}
const horizontalEdges = {
    left: 'additive',
    right: 'additive'
};
const styles = _reactnative().StyleSheet.create({
    tabList: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tabTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

//# sourceMappingURL=TabList.js.map
