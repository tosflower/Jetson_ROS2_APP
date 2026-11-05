"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Assets: null,
    Background: null,
    Badge: null,
    Button: null,
    Header: null,
    HeaderBackButton: null,
    HeaderBackContext: null,
    HeaderBackground: null,
    HeaderButton: null,
    HeaderHeightContext: null,
    HeaderShownContext: null,
    HeaderTitle: null,
    Label: null,
    Lazy: null,
    MissingIcon: null,
    PlatformPressable: null,
    ResourceSavingView: null,
    SafeAreaProviderCompat: null,
    Screen: null,
    Text: null,
    getDefaultHeaderHeight: null,
    getDefaultSidebarWidth: null,
    getHeaderTitle: null,
    getLabel: null,
    useFrameSize: null,
    useHeaderHeight: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Assets () {
        return Assets;
    },
    get Background () {
        return _Background.Background;
    },
    get Badge () {
        return _Badge.Badge;
    },
    get Button () {
        return _Button.Button;
    },
    get Header () {
        return _Header.Header;
    },
    get HeaderBackButton () {
        return _HeaderBackButton.HeaderBackButton;
    },
    get HeaderBackContext () {
        return _HeaderBackContext.HeaderBackContext;
    },
    get HeaderBackground () {
        return _HeaderBackground.HeaderBackground;
    },
    get HeaderButton () {
        return _HeaderButton.HeaderButton;
    },
    get HeaderHeightContext () {
        return _HeaderHeightContext.HeaderHeightContext;
    },
    get HeaderShownContext () {
        return _HeaderShownContext.HeaderShownContext;
    },
    get HeaderTitle () {
        return _HeaderTitle.HeaderTitle;
    },
    get Label () {
        return _Label.Label;
    },
    get Lazy () {
        return _Lazy.Lazy;
    },
    get MissingIcon () {
        return _MissingIcon.MissingIcon;
    },
    get PlatformPressable () {
        return _PlatformPressable.PlatformPressable;
    },
    get ResourceSavingView () {
        return _ResourceSavingView.ResourceSavingView;
    },
    get SafeAreaProviderCompat () {
        return _SafeAreaProviderCompat.SafeAreaProviderCompat;
    },
    get Screen () {
        return _Screen.Screen;
    },
    get Text () {
        return _Text.Text;
    },
    get getDefaultHeaderHeight () {
        return _getDefaultHeaderHeight.getDefaultHeaderHeight;
    },
    get getDefaultSidebarWidth () {
        return _getDefaultSidebarWidth.getDefaultSidebarWidth;
    },
    get getHeaderTitle () {
        return _getHeaderTitle.getHeaderTitle;
    },
    get getLabel () {
        return _getLabel.getLabel;
    },
    get useFrameSize () {
        return _useFrameSize.useFrameSize;
    },
    get useHeaderHeight () {
        return _useHeaderHeight.useHeaderHeight;
    }
});
0 && __export(require("./types"));
const _backiconmaskpng = /*#__PURE__*/ _interop_require_default(require("../../../assets/react-navigation/elements/back-icon-mask.png"));
const _backiconpng = /*#__PURE__*/ _interop_require_default(require("../../../assets/react-navigation/elements/back-icon.png"));
const _cleariconpng = /*#__PURE__*/ _interop_require_default(require("../../../assets/react-navigation/elements/clear-icon.png"));
const _closeiconpng = /*#__PURE__*/ _interop_require_default(require("../../../assets/react-navigation/elements/close-icon.png"));
const _searchiconpng = /*#__PURE__*/ _interop_require_default(require("../../../assets/react-navigation/elements/search-icon.png"));
const _Background = require("./Background");
const _Badge = require("./Badge");
const _Button = require("./Button");
const _getDefaultSidebarWidth = require("./getDefaultSidebarWidth");
const _getDefaultHeaderHeight = require("./Header/getDefaultHeaderHeight");
const _getHeaderTitle = require("./Header/getHeaderTitle");
const _Header = require("./Header/Header");
const _HeaderBackButton = require("./Header/HeaderBackButton");
const _HeaderBackContext = require("./Header/HeaderBackContext");
const _HeaderBackground = require("./Header/HeaderBackground");
const _HeaderButton = require("./Header/HeaderButton");
const _HeaderHeightContext = require("./Header/HeaderHeightContext");
const _HeaderShownContext = require("./Header/HeaderShownContext");
const _HeaderTitle = require("./Header/HeaderTitle");
const _useHeaderHeight = require("./Header/useHeaderHeight");
const _getLabel = require("./Label/getLabel");
const _Label = require("./Label/Label");
const _Lazy = require("./Lazy");
const _MissingIcon = require("./MissingIcon");
const _PlatformPressable = require("./PlatformPressable");
const _ResourceSavingView = require("./ResourceSavingView");
const _SafeAreaProviderCompat = require("./SafeAreaProviderCompat");
const _Screen = require("./Screen");
const _Text = require("./Text");
const _useFrameSize = require("./useFrameSize");
_export_star(require("./types"), exports);
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const Assets = [
    _backiconpng.default,
    _backiconmaskpng.default,
    _searchiconpng.default,
    _closeiconpng.default,
    _cleariconpng.default
];

//# sourceMappingURL=index.js.map
