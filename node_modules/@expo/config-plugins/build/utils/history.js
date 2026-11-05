"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addHistoryItem: null,
    getHistoryItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addHistoryItem () {
        return addHistoryItem;
    },
    get getHistoryItem () {
        return getHistoryItem;
    }
});
function getHistoryItem(config, name) {
    return config._internal?.pluginHistory?.[name] ?? null;
}
function addHistoryItem(config, item) {
    if (!config._internal) {
        config._internal = {};
    }
    if (!config._internal.pluginHistory) {
        config._internal.pluginHistory = {};
    }
    if (!item.version) {
        item.version = 'UNVERSIONED';
    }
    config._internal.pluginHistory[item.name] = item;
    return config;
}

//# sourceMappingURL=history.js.map
