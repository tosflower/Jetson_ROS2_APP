"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BaseRouter: null,
    CommonActions: null,
    DrawerActions: null,
    DrawerRouter: null,
    StackActions: null,
    StackRouter: null,
    TabActions: null,
    TabRouter: null,
    attachRouteState: null,
    extendRouter: null,
    extendRouterActions: null,
    isActionHandled: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BaseRouter () {
        return _BaseRouter.BaseRouter;
    },
    get CommonActions () {
        return _CommonActions;
    },
    get DrawerActions () {
        return _DrawerRouter.DrawerActions;
    },
    get DrawerRouter () {
        return _DrawerRouter.DrawerRouter;
    },
    get StackActions () {
        return _StackRouter.StackActions;
    },
    get StackRouter () {
        return _StackRouter.StackRouter;
    },
    get TabActions () {
        return _TabRouter.TabActions;
    },
    get TabRouter () {
        return _TabRouter.TabRouter;
    },
    get attachRouteState () {
        return _attachRouteState.attachRouteState;
    },
    get extendRouter () {
        return _extendRouter.extendRouter;
    },
    get extendRouterActions () {
        return _extendRouter.extendRouterActions;
    },
    get isActionHandled () {
        return _utils.isActionHandled;
    }
});
0 && __export(require("./types"));
const _CommonActions = /*#__PURE__*/ _interop_require_wildcard(require("./CommonActions"));
const _BaseRouter = require("./BaseRouter");
const _attachRouteState = require("./attachRouteState");
const _DrawerRouter = require("./DrawerRouter");
const _extendRouter = require("./extendRouter");
const _StackRouter = require("./StackRouter");
const _TabRouter = require("./TabRouter");
_export_star(require("./types"), exports);
const _utils = require("./utils");
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}

//# sourceMappingURL=index.js.map
