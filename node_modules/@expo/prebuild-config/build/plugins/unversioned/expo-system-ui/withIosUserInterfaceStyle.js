"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getUserInterfaceStyle: null,
    setUserInterfaceStyle: null,
    withIosUserInterfaceStyle: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getUserInterfaceStyle () {
        return getUserInterfaceStyle;
    },
    get setUserInterfaceStyle () {
        return setUserInterfaceStyle;
    },
    get withIosUserInterfaceStyle () {
        return withIosUserInterfaceStyle;
    }
});
function _iosplugins() {
    const data = require("@expo/config-plugins/build/plugins/ios-plugins");
    _iosplugins = function() {
        return data;
    };
    return data;
}
const withIosUserInterfaceStyle = (0, _iosplugins().createInfoPlistPluginWithPropertyGuard)(setUserInterfaceStyle, {
    infoPlistProperty: 'UIUserInterfaceStyle',
    expoConfigProperty: 'userInterfaceStyle | ios.userInterfaceStyle',
    expoPropertyGetter: getUserInterfaceStyle
}, 'withIosUserInterfaceStyle');
function getUserInterfaceStyle(config) {
    return config.ios?.userInterfaceStyle ?? config.userInterfaceStyle ?? 'light';
}
function setUserInterfaceStyle(config, { UIUserInterfaceStyle, ...infoPlist }) {
    const userInterfaceStyle = getUserInterfaceStyle(config);
    const style = mapUserInterfaceStyleForInfoPlist(userInterfaceStyle);
    if (!style) {
        return infoPlist;
    }
    return {
        ...infoPlist,
        UIUserInterfaceStyle: style
    };
}
function mapUserInterfaceStyleForInfoPlist(userInterfaceStyle) {
    switch(userInterfaceStyle){
        case 'light':
            return 'Light';
        case 'dark':
            return 'Dark';
        case 'automatic':
            return 'Automatic';
    }
    return null;
}

//# sourceMappingURL=withIosUserInterfaceStyle.js.map
