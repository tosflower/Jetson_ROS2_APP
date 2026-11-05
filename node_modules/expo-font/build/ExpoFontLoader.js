import { requireNativeModule } from 'expo-modules-core';
const m = typeof window === 'undefined' ? {
    getLoadedFonts () {
        return [];
    },
    loadAsync () {
        return Promise.resolve();
    },
    loadFontFamilyAsync () {
        return Promise.resolve();
    }
} : requireNativeModule('ExpoFontLoader');
export default m;

//# sourceMappingURL=ExpoFontLoader.js.map
