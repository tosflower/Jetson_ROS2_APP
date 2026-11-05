"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Color", {
    enumerable: true,
    get: function() {
        return Color;
    }
});
0 && __export(require("./android.color.types")) && __export(require("./android.attr.types")) && __export(require("./android.dynamic.types")) && __export(require("./android.material.types")) && __export(require("./ios.types"));
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const _materialColor = require("./materialColor");
_export_star(require("./android.color.types"), exports);
_export_star(require("./android.attr.types"), exports);
_export_star(require("./android.dynamic.types"), exports);
_export_star(require("./android.material.types"), exports);
_export_star(require("./ios.types"), exports);
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
const iosColor = new Proxy({}, {
    get (_, prop) {
        if (process.env.EXPO_OS === 'ios') {
            return (0, _reactnative().PlatformColor)(prop);
        }
        return null;
    }
});
const androidAttrColor = new Proxy({}, {
    get (_, prop) {
        if (process.env.EXPO_OS === 'android') {
            return (0, _reactnative().PlatformColor)('?attr/' + prop);
        }
        return null;
    }
});
const androidMaterialColor = new Proxy({}, {
    get (_, prop) {
        if (process.env.EXPO_OS === 'android') {
            return (0, _materialColor.Material3Color)(prop);
        }
        return null;
    }
});
const androidDynamicColor = new Proxy({}, {
    get (_, prop) {
        if (process.env.EXPO_OS === 'android') {
            return (0, _materialColor.Material3DynamicColor)(prop);
        }
        return null;
    }
});
const androidColor = new Proxy({
    get attr () {
        return androidAttrColor;
    },
    get material () {
        return androidMaterialColor;
    },
    get dynamic () {
        return androidDynamicColor;
    }
}, {
    get (target, prop) {
        if (prop in target) {
            return target[prop];
        }
        if (process.env.EXPO_OS === 'android') {
            return (0, _reactnative().PlatformColor)('@android:color/' + prop);
        }
        return null;
    }
});
const Color = {
    get ios () {
        return iosColor;
    },
    get android () {
        return androidColor;
    }
};

//# sourceMappingURL=index.js.map
