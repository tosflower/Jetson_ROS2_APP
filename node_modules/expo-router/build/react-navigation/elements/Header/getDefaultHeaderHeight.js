"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDefaultHeaderHeight", {
    enumerable: true,
    get: function() {
        return getDefaultHeaderHeight;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
function getDefaultHeaderHeight(layout, modalPresentation, topInset) {
    let headerHeight;
    // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
    const hasDynamicIsland = _reactnative().Platform.OS === 'ios' && topInset > 50;
    const statusBarHeight = hasDynamicIsland ? topInset - (5 + 1 / _reactnative().PixelRatio.get()) : topInset;
    const isLandscape = layout.width > layout.height;
    if (_reactnative().Platform.OS === 'ios') {
        if (_reactnative().Platform.isPad || _reactnative().Platform.isTV) {
            if (modalPresentation) {
                headerHeight = 56;
            } else {
                headerHeight = 50;
            }
        } else {
            if (isLandscape) {
                headerHeight = 32;
            } else {
                if (modalPresentation) {
                    headerHeight = 56;
                } else {
                    headerHeight = 44;
                }
            }
        }
    } else {
        headerHeight = 64;
    }
    return headerHeight + statusBarHeight;
}

//# sourceMappingURL=getDefaultHeaderHeight.js.map
