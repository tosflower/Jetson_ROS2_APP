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
function _configplugins() {
    const data = require("expo/config-plugins");
    _configplugins = function() {
        return data;
    };
    return data;
}
const pkg = require('../../package.json');
const withExpoImage = (config, props)=>{
    const disableLibdav1d = props?.disableLibdav1d ?? false;
    return (0, _configplugins().withPodfileProperties)(config, (config)=>{
        config.modResults['expo-image.disable-libdav1d'] = disableLibdav1d ? 'true' : 'false';
        return config;
    });
};
const _default = (0, _configplugins().createRunOncePlugin)(withExpoImage, pkg.name, pkg.version);

//# sourceMappingURL=withExpoImage.js.map
