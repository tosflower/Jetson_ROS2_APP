"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LANDSCAPE_ORIENTATIONS: null,
    PORTRAIT_ORIENTATIONS: null,
    getOrientation: null,
    setOrientation: null,
    withOrientation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LANDSCAPE_ORIENTATIONS () {
        return LANDSCAPE_ORIENTATIONS;
    },
    get PORTRAIT_ORIENTATIONS () {
        return PORTRAIT_ORIENTATIONS;
    },
    get getOrientation () {
        return getOrientation;
    },
    get setOrientation () {
        return setOrientation;
    },
    get withOrientation () {
        return withOrientation;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
const withOrientation = (0, _iosplugins.createInfoPlistPluginWithPropertyGuard)(setOrientation, {
    infoPlistProperty: 'UISupportedInterfaceOrientations',
    expoConfigProperty: 'orientation'
}, 'withOrientation');
function getOrientation(config) {
    return config.orientation ?? null;
}
const PORTRAIT_ORIENTATIONS = [
    'UIInterfaceOrientationPortrait',
    'UIInterfaceOrientationPortraitUpsideDown'
];
const LANDSCAPE_ORIENTATIONS = [
    'UIInterfaceOrientationLandscapeLeft',
    'UIInterfaceOrientationLandscapeRight'
];
function getUISupportedInterfaceOrientations(orientation) {
    if (orientation === 'portrait') {
        return PORTRAIT_ORIENTATIONS;
    } else if (orientation === 'landscape') {
        return LANDSCAPE_ORIENTATIONS;
    } else {
        return [
            ...PORTRAIT_ORIENTATIONS,
            ...LANDSCAPE_ORIENTATIONS
        ];
    }
}
function setOrientation(config, infoPlist) {
    const orientation = getOrientation(config);
    return {
        ...infoPlist,
        UISupportedInterfaceOrientations: getUISupportedInterfaceOrientations(orientation)
    };
}

//# sourceMappingURL=Orientation.js.map
