"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeTabsView", {
    enumerable: true,
    get: function() {
        return NativeTabsView;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _reacttabs() {
    const data = require("@radix-ui/react-tabs");
    _reacttabs = function() {
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
const _nativetabsmodulecss = /*#__PURE__*/ _interop_require_default(require("../../assets/native-tabs.module.css"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function NativeTabsView(props) {
    const { tabs, focusedIndex } = props;
    const currentTab = tabs[focusedIndex];
    const defaultTab = (0, _react().useMemo)(()=>currentTab, // We don't specify currentTab here, as we don't want to change the default tab when focusedIndex changes
    []);
    const value = currentTab.name;
    const items = tabs.map((tab)=>/*#__PURE__*/ (0, _jsxruntime().jsx)(TabItem, {
            name: tab.name,
            title: tab.options.title ?? tab.name,
            badgeValue: tab.options.badgeValue
        }, tab.name));
    const children = tabs.map((tab)=>{
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(_reacttabs().TabsContent, {
            value: tab.name,
            className: _nativetabsmodulecss.default.tabContent,
            forceMount: true,
            children: tab.contentRenderer()
        }, tab.name);
    });
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reacttabs().Tabs, {
        className: _nativetabsmodulecss.default.nativeTabsContainer,
        defaultValue: defaultTab.name,
        value: value,
        onValueChange: (value)=>{
            props.onTabChange({
                selectedKey: value,
                provenance: 0,
                isNativeAction: true
            });
        },
        style: convertNativeTabsPropsToStyleVars(props, currentTab.options),
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)(_reacttabs().TabsList, {
                "aria-label": "Main",
                className: _nativetabsmodulecss.default.navigationMenuRoot,
                children: items
            }),
            children
        ]
    });
}
function TabItem(props) {
    const { title, badgeValue, name } = props;
    const isBadgeEmpty = badgeValue === ' ';
    return /*#__PURE__*/ (0, _jsxruntime().jsxs)(_reacttabs().TabsTrigger, {
        value: name,
        className: _nativetabsmodulecss.default.navigationMenuTrigger,
        children: [
            /*#__PURE__*/ (0, _jsxruntime().jsx)("span", {
                className: _nativetabsmodulecss.default.tabText,
                children: title
            }),
            badgeValue && /*#__PURE__*/ (0, _jsxruntime().jsx)("div", {
                className: `${_nativetabsmodulecss.default.tabBadge} ${isBadgeEmpty ? _nativetabsmodulecss.default.emptyTabBadge : ''}`,
                children: badgeValue
            })
        ]
    });
}
function convertNativeTabsPropsToStyleVars(props, currentTabOptions) {
    const vars = {};
    if (!props) {
        return vars;
    }
    const optionsLabelStyle = currentTabOptions?.labelStyle;
    if (optionsLabelStyle?.fontFamily) {
        vars['--expo-router-tabs-font-family'] = String(optionsLabelStyle.fontFamily);
    }
    if (optionsLabelStyle?.fontSize) {
        vars['--expo-router-tabs-font-size'] = String(optionsLabelStyle.fontSize);
    }
    if (optionsLabelStyle?.fontWeight) {
        vars['--expo-router-tabs-font-weight'] = String(optionsLabelStyle.fontWeight);
    }
    if (optionsLabelStyle?.fontStyle) {
        vars['--expo-router-tabs-font-style'] = String(optionsLabelStyle.fontStyle);
    }
    if (optionsLabelStyle?.color) {
        vars['--expo-router-tabs-text-color'] = String(optionsLabelStyle.color);
    }
    if (currentTabOptions?.selectedLabelStyle?.color) {
        vars['--expo-router-tabs-active-text-color'] = String(currentTabOptions?.selectedLabelStyle?.color);
    } else if (props.tintColor) {
        vars['--expo-router-tabs-active-text-color'] = String(props.tintColor);
    }
    if (currentTabOptions?.selectedLabelStyle?.fontSize) {
        vars['--expo-router-tabs-active-font-size'] = String(currentTabOptions?.selectedLabelStyle?.fontSize);
    }
    if (currentTabOptions?.indicatorColor) {
        vars['--expo-router-tabs-active-background-color'] = String(currentTabOptions.indicatorColor);
    }
    if (currentTabOptions?.backgroundColor) {
        vars['--expo-router-tabs-background-color'] = String(currentTabOptions.backgroundColor);
    }
    if (currentTabOptions?.badgeBackgroundColor) {
        vars['--expo-router-tabs-badge-background-color'] = String(currentTabOptions.badgeBackgroundColor);
    }
    if (currentTabOptions?.badgeTextColor) {
        vars['--expo-router-tabs-badge-text-color'] = String(currentTabOptions.badgeTextColor);
    }
    return vars;
}

//# sourceMappingURL=NativeTabsView.web.js.map
