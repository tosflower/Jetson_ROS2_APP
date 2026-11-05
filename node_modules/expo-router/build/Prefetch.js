"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Prefetch", {
    enumerable: true,
    get: function() {
        return Prefetch;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _imperativeapi = require("./imperative-api");
const _useLoadedNavigation = require("./link/useLoadedNavigation");
function Prefetch(props) {
    const navigation = (0, _useLoadedNavigation.useOptionalNavigation)();
    // TODO(@ubax): This layout effect runs before the router bridge binds on the first commit. It works only because useOptionalNavigation returns null on the first pass. Move to useRouterActions().
    (0, _react().useLayoutEffect)(()=>{
        if (navigation?.isFocused()) {
            _imperativeapi.router.prefetch(props.href);
        }
    }, [
        navigation,
        props.href
    ]);
    return null;
}

//# sourceMappingURL=Prefetch.js.map
