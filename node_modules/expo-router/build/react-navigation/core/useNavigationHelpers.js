'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useNavigationHelpers", {
    enumerable: true,
    get: function() {
        return useNavigationHelpers;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _routingQueueContext = require("../../global-state/routingQueueContext");
const _useLatestCallback = /*#__PURE__*/ _interop_require_default(require("../../utils/useLatestCallback"));
const _routers = require("../routers");
const _utils = require("../routers/utils");
const _NavigationContext = require("./NavigationContext");
const _types = require("./types");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
// This is to make TypeScript compiler happy
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
_types.PrivateValueStore;
function useNavigationHelpers({ id: navigatorId, handleAction, state, emitter, router }) {
    const parentNavigationHelpers = (0, _react().use)(_NavigationContext.NavigationContext);
    const enqueue = (0, _routingQueueContext.useEnqueueRoutingIntent)();
    // Unlike handler-only Effect Events, the public accessor can be called during render.
    const getState = (0, _useLatestCallback.default)(()=>state);
    return _react().useMemo(()=>{
        const dispatchSync = (action)=>{
            handleAction(action);
        };
        const dispatch = (action)=>{
            enqueue({
                type: 'ACTION',
                payload: {
                    action,
                    originKey: getState().key
                }
            });
        };
        const actions = {
            ...router.actionCreators,
            ..._routers.CommonActions
        };
        const helpers = Object.keys(actions).reduce((acc, name)=>{
            // @ts-expect-error: name is a valid key, but TypeScript is dumb
            acc[name] = (...args)=>dispatch(actions[name](...args));
            return acc;
        }, {});
        const navigationHelpers = {
            ...parentNavigationHelpers,
            ...helpers,
            dispatch,
            dispatchSync,
            emit: emitter.emit,
            isFocused: parentNavigationHelpers ? parentNavigationHelpers.isFocused : ()=>true,
            canGoBack: ()=>{
                const state = getState();
                const result = router.getStateForAction(state, _routers.CommonActions.goBack(), {
                    routeNames: state.routeNames,
                    routeGetIdList: {}
                });
                return (0, _utils.isActionHandled)(result) || parentNavigationHelpers?.canGoBack() || false;
            },
            getId: ()=>navigatorId,
            getParent: (id)=>{
                if (id !== undefined) {
                    let current = navigationHelpers;
                    while(current && id !== current.getId()){
                        current = current.getParent();
                    }
                    return current;
                }
                return parentNavigationHelpers;
            },
            getState: ()=>{
                return getState();
            }
        };
        return navigationHelpers;
    }, [
        enqueue,
        router,
        parentNavigationHelpers,
        emitter.emit,
        handleAction,
        navigatorId
    ]);
}

//# sourceMappingURL=useNavigationHelpers.js.map
