"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "processHeaderItemsForPlatform", {
    enumerable: true,
    get: function() {
        return processHeaderItemsForPlatform;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _children = require("../../../utils/children");
const _StackToolbarButton = require("./StackToolbarButton");
const _StackToolbarMenu = require("./StackToolbarMenu");
const _StackToolbarSpacer = require("./StackToolbarSpacer");
const _StackToolbarView = require("./StackToolbarView");
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
function convertToolbarChildrenToUnstableItems(children, side) {
    const allChildren = _react().default.Children.toArray(children);
    const actions = allChildren.filter((child)=>(0, _children.isChildOfType)(child, _StackToolbarButton.StackToolbarButton) || (0, _children.isChildOfType)(child, _StackToolbarMenu.StackToolbarMenu) || (0, _children.isChildOfType)(child, _StackToolbarSpacer.StackToolbarSpacer) || (0, _children.isChildOfType)(child, _StackToolbarView.StackToolbarView));
    if (actions.length !== allChildren.length && process.env.NODE_ENV !== 'production') {
        const otherElements = allChildren.filter((child)=>!actions.some((action)=>action === child)).map((e)=>{
            if (/*#__PURE__*/ (0, _react().isValidElement)(e)) {
                if (e.type === _react().Fragment) {
                    return '<Fragment>';
                } else {
                    return e.type?.name ?? e.type;
                }
            }
            return String(e);
        });
        console.warn(`Stack.Toolbar with placement="${side}" only accepts <Stack.Toolbar.Button>, <Stack.Toolbar.Menu>, <Stack.Toolbar.View>, and <Stack.Toolbar.Spacer> as children. Found invalid children: ${otherElements.join(', ')}`);
    }
    return ()=>actions.map((action)=>{
            if ((0, _children.isChildOfType)(action, _StackToolbarButton.StackToolbarButton)) {
                return (0, _StackToolbarButton.convertStackToolbarButtonPropsToRNHeaderItem)(action.props);
            } else if ((0, _children.isChildOfType)(action, _StackToolbarMenu.StackToolbarMenu)) {
                return (0, _StackToolbarMenu.convertStackToolbarMenuPropsToRNHeaderItem)(action.props);
            } else if ((0, _children.isChildOfType)(action, _StackToolbarSpacer.StackToolbarSpacer)) {
                return (0, _StackToolbarSpacer.convertStackToolbarSpacerPropsToRNHeaderItem)(action.props);
            }
            return (0, _StackToolbarView.convertStackToolbarViewPropsToRNHeaderItem)(action.props);
        }).filter((item)=>!!item);
}
function processHeaderItemsForPlatform(children, placement, _colors) {
    if (placement !== 'left' && placement !== 'right') {
        return null;
    }
    if (placement === 'left') {
        return {
            headerShown: true,
            unstable_headerLeftItems: convertToolbarChildrenToUnstableItems(children, 'left')
        };
    }
    return {
        headerShown: true,
        unstable_headerRightItems: convertToolbarChildrenToUnstableItems(children, 'right')
    };
}

//# sourceMappingURL=processHeaderItemsForPlatform.ios.js.map
