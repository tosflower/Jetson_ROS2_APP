"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerStaticRootComponent", {
    enumerable: true,
    get: function() {
        return registerStaticRootComponent;
    }
});
function _reactnativeweb() {
    const data = require("react-native-web");
    _reactnativeweb = function() {
        return data;
    };
    return data;
}
const APP_KEY = 'App';
function registerStaticRootComponent(component, initialProps) {
    _reactnativeweb().AppRegistry.registerComponent(APP_KEY, ()=>component);
    return _reactnativeweb().AppRegistry.getApplication(APP_KEY, {
        initialProps
    });
}

//# sourceMappingURL=registerRootComponent.js.map
