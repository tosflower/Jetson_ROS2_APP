"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createAndroidScreenAppearance", {
    enumerable: true,
    get: function() {
        return createAndroidScreenAppearance;
    }
});
const _color = require("../color");
function createAndroidScreenAppearance(options) {
    const labelStyle = options.labelStyle;
    const selectedLabelStyle = options.selectedLabelStyle;
    const tintColor = options.tintColor;
    const normal = {
        tabBarItemTitleFontColor: labelStyle?.color ?? _color.Color.android.dynamic.onSurfaceVariant,
        tabBarItemIconColor: options.iconColor ?? _color.Color.android.dynamic.onSurfaceVariant
    };
    const selected = {
        tabBarItemTitleFontColor: selectedLabelStyle?.color ?? labelStyle?.color ?? tintColor ?? _color.Color.android.dynamic.onSurface,
        tabBarItemIconColor: options.selectedIconColor ?? options.iconColor ?? tintColor ?? _color.Color.android.dynamic.onSecondaryContainer
    };
    return {
        tabBarBackgroundColor: options.backgroundColor ?? _color.Color.android.dynamic.surfaceContainer,
        tabBarItemRippleColor: options.rippleColor ?? _color.Color.android.dynamic.primary,
        tabBarItemLabelVisibilityMode: options.labelVisibilityMode,
        tabBarItemActiveIndicatorColor: options.indicatorColor ?? _color.Color.android.dynamic.secondaryContainer,
        tabBarItemActiveIndicatorEnabled: !options.disableIndicator,
        tabBarItemTitleFontFamily: labelStyle?.fontFamily,
        tabBarItemTitleSmallLabelFontSize: labelStyle?.fontSize,
        tabBarItemTitleLargeLabelFontSize: selectedLabelStyle?.fontSize ?? labelStyle?.fontSize,
        tabBarItemTitleFontWeight: labelStyle?.fontWeight,
        tabBarItemTitleFontStyle: labelStyle?.fontStyle,
        tabBarItemBadgeBackgroundColor: options.badgeBackgroundColor,
        tabBarItemBadgeTextColor: options.badgeTextColor,
        normal,
        selected
    };
}

//# sourceMappingURL=appearance.android.js.map
