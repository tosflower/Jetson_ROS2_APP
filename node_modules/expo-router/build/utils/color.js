// @ts-expect-error: The package uses Flow instead of TypeScript declarations.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    alpha: null,
    darken: null,
    isDark: null,
    isLight: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get alpha () {
        return alpha;
    },
    get darken () {
        return darken;
    },
    get isDark () {
        return isDark;
    },
    get isLight () {
        return isLight;
    }
});
function _normalizecolors() {
    const data = /*#__PURE__*/ _interop_require_default(require("@react-native/normalize-colors"));
    _normalizecolors = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function rgba(value) {
    const normalized = (0, _normalizecolors().default)(value);
    if (normalized == null) {
        return undefined;
    }
    return [
        normalized >>> 24,
        normalized >>> 16 & 255,
        normalized >>> 8 & 255,
        normalized & 255
    ];
}
function serialize([red, green, blue, opacity]) {
    return `rgba(${red}, ${green}, ${blue}, ${opacity / 255})`;
}
function isDark(value) {
    const channels = rgba(value);
    if (!channels) {
        return undefined;
    }
    const [red, green, blue] = channels;
    return (red * 2126 + green * 7152 + blue * 722) / 10000 < 128;
}
function isLight(value) {
    const dark = isDark(value);
    return dark === undefined ? undefined : !dark;
}
function alpha(value, opacity) {
    if (Number.isNaN(opacity)) {
        return undefined;
    }
    const channels = rgba(value);
    if (!channels) {
        return undefined;
    }
    if (opacity === undefined) {
        return channels[3] / 255;
    }
    channels[3] = Math.max(0, Math.min(1, opacity)) * 255;
    return serialize(channels);
}
function darken(value, ratio) {
    if (Number.isNaN(ratio)) {
        return undefined;
    }
    const channels = rgba(value);
    if (!channels) {
        return undefined;
    }
    const [red, green, blue, opacity] = channels;
    const normalized = [
        red / 255,
        green / 255,
        blue / 255
    ];
    const max = Math.max(...normalized);
    const min = Math.min(...normalized);
    const lightness = (max + min) / 2;
    const delta = max - min;
    let hue = 0;
    let saturation = 0;
    if (delta !== 0) {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));
        if (max === normalized[0]) {
            hue = ((normalized[1] - normalized[2]) / delta + (normalized[1] < normalized[2] ? 6 : 0)) / 6;
        } else if (max === normalized[1]) {
            hue = ((normalized[2] - normalized[0]) / delta + 2) / 6;
        } else {
            hue = ((normalized[0] - normalized[1]) / delta + 4) / 6;
        }
    }
    const darkenedLightness = Math.max(0, Math.min(1, lightness * (1 - ratio)));
    const q = darkenedLightness < 0.5 ? darkenedLightness * (1 + saturation) : darkenedLightness + saturation - darkenedLightness * saturation;
    const p = 2 * darkenedLightness - q;
    const hueToRgb = (offset)=>{
        const channel = (offset + 1) % 1;
        if (channel < 1 / 6) return p + (q - p) * 6 * channel;
        if (channel < 1 / 2) return q;
        if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6;
        return p;
    };
    return serialize([
        Math.round(hueToRgb(hue + 1 / 3) * 255),
        Math.round(hueToRgb(hue) * 255),
        Math.round(hueToRgb(hue - 1 / 3) * 255),
        opacity
    ]);
}

//# sourceMappingURL=color.js.map
