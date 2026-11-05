"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _createLegacyPlugin = require("../createLegacyPlugin");
const _withAndroidRootViewBackgroundColor = require("./withAndroidRootViewBackgroundColor");
const _withAndroidUserInterfaceStyle = require("./withAndroidUserInterfaceStyle");
const _withIosRootViewBackgroundColor = require("./withIosRootViewBackgroundColor");
const _withIosUserInterfaceStyle = require("./withIosUserInterfaceStyle");
const _default = (0, _createLegacyPlugin.createLegacyPlugin)({
    packageName: 'expo-system-ui',
    fallback: [
        _withAndroidRootViewBackgroundColor.withAndroidRootViewBackgroundColor,
        _withIosRootViewBackgroundColor.withIosRootViewBackgroundColor,
        _withAndroidUserInterfaceStyle.withAndroidUserInterfaceStyle,
        _withIosUserInterfaceStyle.withIosUserInterfaceStyle
    ]
});

//# sourceMappingURL=expo-system-ui.js.map
