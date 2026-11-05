"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DarkTheme: null,
    DefaultTheme: null,
    LinkingContext: null,
    LocaleDirContext: null,
    ServerContainer: null,
    useLinkBuilder: null,
    useLinkTo: null,
    useLocale: null,
    useRoutePath: null,
    useScrollToTop: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DarkTheme () {
        return _DarkTheme.DarkTheme;
    },
    get DefaultTheme () {
        return _DefaultTheme.DefaultTheme;
    },
    get LinkingContext () {
        return _LinkingContext.LinkingContext;
    },
    get LocaleDirContext () {
        return _LocaleDirContext.LocaleDirContext;
    },
    get ServerContainer () {
        return _ServerContainer.ServerContainer;
    },
    get useLinkBuilder () {
        return _useLinkBuilder.useLinkBuilder;
    },
    get useLinkTo () {
        return _useLinkTo.useLinkTo;
    },
    get useLocale () {
        return _useLocale.useLocale;
    },
    get useRoutePath () {
        return _useRoutePath.useRoutePath;
    },
    get useScrollToTop () {
        return _useScrollToTop.useScrollToTop;
    }
});
0 && __export(require("./types")) && __export(require("../core"));
const _LinkingContext = require("./LinkingContext");
const _LocaleDirContext = require("./LocaleDirContext");
const _ServerContainer = require("./ServerContainer");
const _DarkTheme = require("./theming/DarkTheme");
const _DefaultTheme = require("./theming/DefaultTheme");
_export_star(require("./types"), exports);
const _useLinkBuilder = require("./useLinkBuilder");
const _useLinkTo = require("./useLinkTo");
const _useLocale = require("./useLocale");
const _useRoutePath = require("./useRoutePath");
const _useScrollToTop = require("./useScrollToTop");
_export_star(require("../core"), exports);
function _export_star(from, to) {
    Object.keys(from).forEach(function(k) {
        if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) {
            Object.defineProperty(to, k, {
                enumerable: true,
                get: function() {
                    return from[k];
                }
            });
        }
    });
    return from;
}

//# sourceMappingURL=index.js.map
