"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useDomComponentNavigation", {
    enumerable: true,
    get: function() {
        return useDomComponentNavigation;
    }
});
function _global() {
    const data = require("expo/dom/global");
    _global = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _useRouterActions = require("../global-state/useRouterActions");
const _events = require("./events");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function useDomComponentNavigation() {
    const router = (0, _useRouterActions.useRouterActions)();
    _react().default.useEffect(()=>{
        if (process.env.EXPO_OS === 'web') {
            return ()=>{};
        }
        return (0, _global().addGlobalDomEventListener)(({ type, data })=>{
            switch(type){
                case _events.ROUTER_LINK_TYPE:
                    router.linkTo(data.href, data.options);
                    break;
                case _events.ROUTER_DISMISS_ALL_TYPE:
                    router.dismissAll(data.options);
                    break;
                case _events.ROUTER_DISMISS_TYPE:
                    router.dismiss(data.count, data.options);
                    break;
                case _events.ROUTER_BACK_TYPE:
                    router.back(data.options);
                    break;
                case _events.ROUTER_SET_PARAMS_TYPE:
                    router.setParams(data.params);
                    break;
            }
        });
    }, [
        router
    ]);
}

//# sourceMappingURL=useDomComponentNavigation.js.map
