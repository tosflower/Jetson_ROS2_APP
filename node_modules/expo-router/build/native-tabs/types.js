"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    SUPPORTED_BLUR_EFFECTS: null,
    SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES: null,
    SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get SUPPORTED_BLUR_EFFECTS () {
        return SUPPORTED_BLUR_EFFECTS;
    },
    get SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES () {
        return SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES;
    },
    get SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS () {
        return SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS;
    }
});
const SUPPORTED_BLUR_EFFECTS = [
    'none',
    'systemDefault',
    'extraLight',
    'light',
    'dark',
    'regular',
    'prominent',
    'systemUltraThinMaterial',
    'systemThinMaterial',
    'systemMaterial',
    'systemThickMaterial',
    'systemChromeMaterial',
    'systemUltraThinMaterialLight',
    'systemThinMaterialLight',
    'systemMaterialLight',
    'systemThickMaterialLight',
    'systemChromeMaterialLight',
    'systemUltraThinMaterialDark',
    'systemThinMaterialDark',
    'systemMaterialDark',
    'systemThickMaterialDark',
    'systemChromeMaterialDark'
];
const SUPPORTED_TAB_BAR_ITEM_LABEL_VISIBILITY_MODES = [
    'auto',
    'selected',
    'labeled',
    'unlabeled'
];
const SUPPORTED_TAB_BAR_MINIMIZE_BEHAVIORS = [
    'automatic',
    'never',
    'onScrollDown',
    'onScrollUp'
];
const SUPPORTED_TAB_BAR_ITEM_ROLES = [
    'bookmarks',
    'contacts',
    'downloads',
    'favorites',
    'featured',
    'history',
    'more',
    'mostRecent',
    'mostViewed',
    'recents',
    'search',
    'topRated'
];

//# sourceMappingURL=types.js.map
