"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    TabContext: null,
    TabNavigatorStatesContext: null,
    TabTriggerMapContext: null,
    TabsDescriptorsContext: null,
    TabsNavigatorContext: null,
    TabsStateContext: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get TabContext () {
        return TabContext;
    },
    get TabNavigatorStatesContext () {
        return TabNavigatorStatesContext;
    },
    get TabTriggerMapContext () {
        return TabTriggerMapContext;
    },
    get TabsDescriptorsContext () {
        return TabsDescriptorsContext;
    },
    get TabsNavigatorContext () {
        return TabsNavigatorContext;
    },
    get TabsStateContext () {
        return TabsStateContext;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const TabContext = /*#__PURE__*/ (0, _react().createContext)({});
const TabTriggerMapContext = /*#__PURE__*/ (0, _react().createContext)({});
const TabNavigatorStatesContext = /*#__PURE__*/ (0, _react().createContext)({});
const TabsDescriptorsContext = /*#__PURE__*/ (0, _react().createContext)({});
const TabsNavigatorContext = /*#__PURE__*/ (0, _react().createContext)(null);
const TabsStateContext = /*#__PURE__*/ (0, _react().createContext)({
    type: 'tab',
    history: [],
    index: -1,
    key: '',
    routeKeySeq: 0,
    stale: false,
    routeNames: [],
    routes: []
});

//# sourceMappingURL=TabContext.js.map
