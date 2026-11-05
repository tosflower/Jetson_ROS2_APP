'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useLocalSearchParams", {
    enumerable: true,
    get: function() {
        return useLocalSearchParams;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _Route = require("../Route");
const _PreviewRouteContext = require("../link/preview/PreviewRouteContext");
const _NavigationStateContext = require("../react-navigation/core/NavigationStateContext");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function useLocalSearchParams() {
    let params = _react().default.use(_Route.LocalRouteParamsContext) ?? {};
    const node = (0, _Route.useRouteNode)();
    const { params: previewParams } = (0, _PreviewRouteContext.usePreviewInfo)();
    if (node?.type === 'layout' && !previewParams) {
        // TODO(@ubax): Reading this context re-renders the layout on any navigation, even when params do not
        // change; outside it via https://github.com/react/react/issues/35397. Investigate a selector subscription.
        let { state } = _react().default.use(_NavigationStateContext.NavigationStateContext);
        while(state){
            const child = state.routes[state.index ?? 0];
            if (!child) break;
            params = {
                ...params,
                ...child.params
            };
            state = child.state;
        }
    }
    return Object.fromEntries(Object.entries(previewParams ?? params).map(([key, value])=>{
        // React Navigation doesn't remove `undefined` values from the params object, and you cannot remove them via
        // `navigation.setParams()` as it shallow merges. Hence, we hide them here. We also pass `null` through unchanged
        // for the same reason; running it through `decodeURIComponent()` would otherwise stringify it to `null`.
        if (value == null) {
            return [
                key,
                value
            ];
        }
        if (Array.isArray(value)) {
            return [
                key,
                value.map((v)=>{
                    try {
                        return decodeURIComponent(v);
                    } catch  {
                        return v;
                    }
                })
            ];
        } else {
            try {
                return [
                    key,
                    decodeURIComponent(value)
                ];
            } catch  {
                return [
                    key,
                    value
                ];
            }
        }
    }));
}

//# sourceMappingURL=useLocalSearchParams.js.map
