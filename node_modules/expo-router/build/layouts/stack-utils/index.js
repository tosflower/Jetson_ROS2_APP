"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    StackHeader: null,
    StackScreen: null,
    StackSearchBar: null,
    StackTitle: null,
    appendScreenStackPropsToOptions: null,
    appendStackTitlePropsToOptions: null,
    mapProtectedScreen: null,
    validateStackPresentation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get StackHeader () {
        return StackHeader;
    },
    get StackScreen () {
        return _StackScreen.StackScreen;
    },
    get StackSearchBar () {
        return _StackSearchBar.StackSearchBar;
    },
    get StackTitle () {
        return _StackTitle.StackTitle;
    },
    get appendScreenStackPropsToOptions () {
        return _StackScreen.appendScreenStackPropsToOptions;
    },
    get appendStackTitlePropsToOptions () {
        return _StackTitle.appendStackTitlePropsToOptions;
    },
    get mapProtectedScreen () {
        return _mapProtectedScreen.mapProtectedScreen;
    },
    get validateStackPresentation () {
        return _StackScreen.validateStackPresentation;
    }
});
0 && __export(require("./toolbar")) && __export(require("./screen"));
const _StackHeaderComponent = require("./StackHeaderComponent");
const _StackSearchBar = require("./StackSearchBar");
_export_star(require("./toolbar"), exports);
_export_star(require("./screen"), exports);
const _StackTitle = require("./StackTitle");
const _StackScreen = require("./StackScreen");
const _mapProtectedScreen = require("./mapProtectedScreen");
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
const StackHeader = _StackHeaderComponent.StackHeaderComponent;

//# sourceMappingURL=index.js.map
