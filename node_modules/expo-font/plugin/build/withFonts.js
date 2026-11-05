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
const _withFontsAndroid = require("./withFontsAndroid");
const _withFontsIos = require("./withFontsIos");
const pkg = require('../../package.json');
const withFonts = (config, props)=>{
    if (!props) {
        return config;
    }
    const iosFonts = [
        ...props.fonts ?? [],
        ...props.ios?.fonts ?? []
    ];
    if (iosFonts.length > 0) {
        config = (0, _withFontsIos.withFontsIos)(config, iosFonts);
    }
    const androidFonts = [
        ...props.fonts ?? [],
        ...props.android?.fonts ?? []
    ];
    if (androidFonts.length > 0) {
        config = (0, _withFontsAndroid.withFontsAndroid)(config, androidFonts);
    }
    return config;
};
const _default = (0, _configplugins().createRunOncePlugin)(withFonts, pkg.name, pkg.version);

//# sourceMappingURL=withFonts.js.map
