"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Link: null,
    Redirect: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Link () {
        return Link;
    },
    get Redirect () {
        return _Redirect.Redirect;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
const _ExpoLink = require("./ExpoLink");
const _elements = require("./elements");
const _href = require("./href");
const _linkapplezoom = require("./zoom/link-apple-zoom");
const _linkapplezoomtarget = require("./zoom/link-apple-zoom-target");
const _Redirect = require("./Redirect");
const Link = Object.assign(/**
   * Component that renders a link using [`href`](#href) to another route.
   * By default, it accepts children and wraps them in a `<Text>` component.
   *
   * Uses an anchor tag (`<a>`) on web and performs a client-side navigation to preserve
   * the state of the website and navigate faster. The web-only attributes such as `target`,
   * `rel`, and `download` are supported and passed to the anchor tag on web. See
   * [`WebAnchorProps`](#webanchorprops) for more details.
   *
   * > **Note**: Client-side navigation works with both single-page apps,
   * and [static-rendering](/router/web/static-rendering/).
   *
   * @example
   * ```tsx
   * import { Link } from 'expo-router';
   * import { View } from 'react-native';
   *
   * export default function Route() {
   *  return (
   *   <View>
   *    <Link href="/about">About</Link>
   *   </View>
   *  );
   *}
   * ```
   */ // TODO(@ubax): Expose pending status scoped to this link's navigation.
function Link(props) {
    // Re-exporting ExpoLink here so that Link.* can be used in server components.
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_ExpoLink.ExpoLink, {
        ...props
    });
}, {
    resolveHref: _href.resolveHref,
    Menu: _elements.LinkMenu,
    Trigger: _elements.LinkTrigger,
    Preview: _elements.LinkPreview,
    MenuAction: _elements.LinkMenuAction,
    AppleZoom: _linkapplezoom.LinkAppleZoom,
    AppleZoomTarget: _linkapplezoomtarget.LinkAppleZoomTarget
});

//# sourceMappingURL=Link.js.map
