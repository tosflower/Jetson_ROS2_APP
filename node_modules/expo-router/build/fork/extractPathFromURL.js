"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    extractExpoPathFromURL: null,
    parsePathAndParamsFromExpoGoLink: null,
    parsePathFromExpoGoLink: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get extractExpoPathFromURL () {
        return extractExpoPathFromURL;
    },
    get parsePathAndParamsFromExpoGoLink () {
        return parsePathAndParamsFromExpoGoLink;
    },
    get parsePathFromExpoGoLink () {
        return parsePathFromExpoGoLink;
    }
});
function _expolinking() {
    const data = require("expo-linking");
    _expolinking = function() {
        return data;
    };
    return data;
}
const _url = require("../utils/url");
function parsePathAndParamsFromExpoGoLink(url) {
    // If the URL is defined (default in Expo Go dev apps) and the URL has no path:
    // `exp://192.168.87.39:19000/` then use the default `exp://192.168.87.39:19000/--/`
    const href = parsePathFromExpoGoLink(url);
    const results = href.match(/([^?]*)(\?.*)?/);
    return {
        pathname: results?.[1] ?? '',
        queryString: results?.[2] ?? ''
    };
}
function parsePathFromExpoGoLink(url) {
    // If the URL is defined (default in Expo Go dev apps) and the URL has no path:
    // `exp://192.168.87.39:19000/` then use the default `exp://192.168.87.39:19000/--/`
    return url.match(/exps?:\/\/.*?\/--\/(.*)/)?.[1] ?? '';
}
// This is only run on native.
function extractExactPathFromURL(url) {
    // Resolve launch URLs to the URL the app should route, dropping the reserved `__expo_*` params.
    url = (0, _expolinking().unwrapDevLaunchURL)(url);
    if (// If a universal link / app link / web URL is used, we should use the path
    // from the URL, while stripping the origin.
    url.match(/^https?:\/\//)) {
        const { origin, href, hostname } = new URL(url);
        if (hostname === 'exp.host' || hostname === 'u.expo.dev') {
            // These are QR code generated deep-links that always link to the '/' path
            // TODO: In the future, QR code may link to a specific path and this logic will need to be updated
            return '';
        }
        return href.replace(origin, '');
    }
    const isExpoGo = typeof expo !== 'undefined' && globalThis.expo?.modules?.ExpoGo;
    // Handle special URLs used in Expo Go: `/--/pathname` -> `pathname`
    if (isExpoGo && // while not exhaustive, `exp` and `exps` are the only two schemes which
    // are passed through to other apps in Expo Go.
    url.match(/^exp(s)?:\/\//)) {
        const pathname = parsePathFromExpoGoLink(url);
        if (pathname) {
            return fromDeepLink('a://' + pathname);
        }
        // Match the `?.*` segment of the URL.
        const queryParams = url.match(/exps?:\/\/.*\?(.*)/)?.[1];
        if (queryParams) {
            return fromDeepLink('a://?' + queryParams);
        }
        return '';
    }
    return fromDeepLink(url);
}
function fromDeepLink(url) {
    let res;
    try {
        // This is for all standard deep links, e.g. `foobar://` where everything
        // after the `://` is the path.
        res = new URL(url);
    } catch  {
        /**
     * We failed to parse the URL. This can occur for a variety of reasons, including:
     * - Its a partial URL (e.g. `/route?query=param`).
     * - It has a valid App scheme, but the scheme isn't a valid URL scheme (e.g. `my_app://`)
     */ // If `url` is already a path (starts with `/`), return it as-is
        if (url.startsWith('/')) {
            return url;
        }
        /**
     * App schemes are not valid URL schemes, so they will fail to parse.
     * We need to strip the scheme from these URLs
     */ return url.replace(/^[^:]+:\/\//, '');
    }
    let results = '';
    if (res.host) {
        results += res.host;
    }
    if (res.pathname) {
        results += res.pathname;
    }
    const qs = !res.search ? '' : [
        ...res.searchParams.entries()
    ].map(([k, v])=>`${k}=${(0, _url.safeDecodeURIComponent)(v)}`).join('&');
    if (qs) {
        results += '?' + qs;
    }
    return results;
}
function extractExpoPathFromURL(_prefixes, url = '') {
    return extractExactPathFromURL(url)// TODO: We should get rid of this, dropping specificities is not good
    .replace(/^\//, '');
}

//# sourceMappingURL=extractPathFromURL.js.map
