'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LinkZoomTransitionAlignmentRectDetector: null,
    LinkZoomTransitionEnabler: null,
    LinkZoomTransitionSource: null,
    NativeLinkPreview: null,
    NativeLinkPreviewAction: null,
    NativeLinkPreviewContent: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LinkZoomTransitionAlignmentRectDetector () {
        return LinkZoomTransitionAlignmentRectDetector;
    },
    get LinkZoomTransitionEnabler () {
        return LinkZoomTransitionEnabler;
    },
    get LinkZoomTransitionSource () {
        return LinkZoomTransitionSource;
    },
    get NativeLinkPreview () {
        return NativeLinkPreview;
    },
    get NativeLinkPreviewAction () {
        return NativeLinkPreviewAction;
    },
    get NativeLinkPreviewContent () {
        return NativeLinkPreviewContent;
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
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
// TODO(@kitten): Replace with `globalThis`, add typings in `expo`
const areNativeViewsAvailable = process.env.EXPO_OS === 'ios' && !_reactnative().Platform.isTV && global.RN$Bridgeless === true;
const LinkPreviewNativeActionView = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'LinkPreviewNativeActionView') : null;
function NativeLinkPreviewAction(props) {
    if (!LinkPreviewNativeActionView) {
        return null;
    }
    // Needed to pass shared object ID to native side
    const imageObjectId = props.image?.__expo_shared_object_id__;
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkPreviewNativeActionView, {
        ...props,
        image: imageObjectId
    });
}
const NativeLinkPreviewView = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'NativeLinkPreviewView') : null;
function NativeLinkPreview(props) {
    if (!NativeLinkPreviewView) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NativeLinkPreviewView, {
        ...props
    });
}
const NativeLinkPreviewContentView = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'NativeLinkPreviewContentView') : null;
function NativeLinkPreviewContent(props) {
    if (!NativeLinkPreviewContentView) {
        return null;
    }
    const style = _reactnative().StyleSheet.flatten([
        props.style,
        {
            position: 'absolute',
            top: 0,
            left: 0
        }
    ]);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(NativeLinkPreviewContentView, {
        ...props,
        style: style
    });
}
const LinkZoomTransitionEnablerNativeView = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'LinkZoomTransitionEnabler') : null;
function LinkZoomTransitionEnabler(props) {
    if (!LinkZoomTransitionEnablerNativeView) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkZoomTransitionEnablerNativeView, {
        ...props,
        disableForceFlatten: true,
        style: {
            display: 'contents'
        }
    });
}
const LinkZoomTransitionSourceNativeView = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'LinkZoomTransitionSource') : null;
function LinkZoomTransitionSource(props) {
    if (!LinkZoomTransitionSourceNativeView) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkZoomTransitionSourceNativeView, {
        ...props,
        disableForceFlatten: true,
        collapsable: false,
        collapsableChildren: false,
        style: {
            display: 'contents'
        }
    });
}
// #endregion
// #region Zoom transition rect detector
const LinkZoomTransitionAlignmentRectDetectorNative = areNativeViewsAvailable ? (0, _expo().requireNativeView)('ExpoRouterNativeLinkPreview', 'LinkZoomTransitionAlignmentRectDetector') : _react().Fragment;
function LinkZoomTransitionAlignmentRectDetector(props) {
    if (!LinkZoomTransitionAlignmentRectDetectorNative) {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(LinkZoomTransitionAlignmentRectDetectorNative, {
        ...props,
        disableForceFlatten: true,
        collapsable: false,
        collapsableChildren: false,
        style: {
            display: 'contents'
        }
    });
} // #endregion

//# sourceMappingURL=native.js.map
