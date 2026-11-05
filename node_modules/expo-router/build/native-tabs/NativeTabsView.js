/**
 * TypeScript / non-native fallback. The real implementations live in
 * `NativeTabsView.ios.tsx`, `NativeTabsView.android.tsx`, and
 * `NativeTabsView.web.tsx`
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NativeTabsView", {
    enumerable: true,
    get: function() {
        return NativeTabsView;
    }
});
function NativeTabsView(_props) {
    throw new Error('You are using NativeTabs on an unsupported platform. This is likely an internal Expo Router bug.');
}

//# sourceMappingURL=NativeTabsView.js.map
