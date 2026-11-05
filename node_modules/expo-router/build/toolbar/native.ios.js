"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    RouterToolbarHost: null,
    RouterToolbarItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get RouterToolbarHost () {
        return RouterToolbarHost;
    },
    get RouterToolbarItem () {
        return RouterToolbarItem;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _expo() {
    const data = require("expo");
    _expo = function() {
        return data;
    };
    return data;
}
const RouterToolbarHostView = (0, _expo().requireNativeView)('ExpoRouterToolbarModule', 'RouterToolbarHostView');
function RouterToolbarHost(props) {
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(RouterToolbarHostView, {
        ...props,
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            backgroundColor: 'transparent'
        }
    });
}
const RouterToolbarItemView = (0, _expo().requireNativeView)('ExpoRouterToolbarModule', 'RouterToolbarItemView');
function RouterToolbarItem(props) {
    // Needed to pass shared object ID to native side
    const imageObjectId = props.image?.__expo_shared_object_id__;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(RouterToolbarItemView, {
        ...props,
        image: imageObjectId
    });
}

//# sourceMappingURL=native.ios.js.map
