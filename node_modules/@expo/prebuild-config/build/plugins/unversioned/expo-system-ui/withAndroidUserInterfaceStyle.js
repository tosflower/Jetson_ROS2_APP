"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withAndroidUserInterfaceStyle", {
    enumerable: true,
    get: function() {
        return withAndroidUserInterfaceStyle;
    }
});
function _configplugins() {
    const data = require("@expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const withAndroidUserInterfaceStyle = (config)=>{
    return (0, _configplugins().withStringsXml)(config, (config)=>{
        const userInterfaceStyle = config.android?.userInterfaceStyle ?? config.userInterfaceStyle;
        if (userInterfaceStyle) {
            _configplugins().WarningAggregator.addWarningAndroid('userInterfaceStyle', // TODO: Maybe warn that they need a certain version of React Native as well?
            'Install expo-system-ui in your project to enable this feature.');
        }
        return config;
    });
};

//# sourceMappingURL=withAndroidUserInterfaceStyle.js.map
