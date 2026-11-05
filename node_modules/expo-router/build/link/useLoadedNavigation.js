"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    useLoadedNavigation: null,
    useOptionalNavigation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get useLoadedNavigation () {
        return useLoadedNavigation;
    },
    get useOptionalNavigation () {
        return useOptionalNavigation;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _native = require("../react-navigation/native");
function useLoadedNavigation() {
    const navigation = (0, _native.useNavigation)();
    const rootNavigation = (0, _react().use)(_native.NavigationContainerRefContext);
    const isMounted = (0, _react().useRef)(true);
    const pending = (0, _react().useRef)([]);
    (0, _react().useEffect)(()=>{
        isMounted.current = true;
        return ()=>{
            isMounted.current = false;
        };
    }, []);
    const flush = (0, _react().useCallback)(()=>{
        if (isMounted.current) {
            const pendingCallbacks = pending.current;
            pending.current = [];
            pendingCallbacks.forEach((callback)=>{
                callback(navigation);
            });
        }
    }, [
        navigation
    ]);
    (0, _react().useEffect)(()=>{
        if (rootNavigation) {
            flush();
        }
    }, [
        flush,
        rootNavigation
    ]);
    const push = (0, _react().useCallback)((fn)=>{
        pending.current.push(fn);
        if (rootNavigation) {
            flush();
        }
    }, [
        flush,
        rootNavigation
    ]);
    return push;
}
function useOptionalNavigation() {
    const [navigation, setNavigation] = (0, _react().useState)(null);
    const loadNavigation = useLoadedNavigation();
    (0, _react().useEffect)(()=>{
        loadNavigation((nav)=>setNavigation(nav));
    }, []);
    return navigation;
}

//# sourceMappingURL=useLoadedNavigation.js.map
