"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    applyRedirects: null,
    convertRedirect: null,
    getRedirectModule: null,
    mergeVariablesWithPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get applyRedirects () {
        return applyRedirects;
    },
    get convertRedirect () {
        return convertRedirect;
    },
    get getRedirectModule () {
        return getRedirectModule;
    },
    get mergeVariablesWithPath () {
        return mergeVariablesWithPath;
    }
});
function _expolinking() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("expo-linking"));
    _expolinking = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
const _getStateFromPathforks = require("./fork/getStateFromPath-forks");
const _matchers = require("./matchers");
const _url = require("./utils/url");
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function applyRedirects(url, redirects) {
    if (typeof url !== 'string' || !redirects) {
        return url;
    }
    const nextUrl = (0, _getStateFromPathforks.cleanPath)(url);
    const redirect = redirects.find(([regex])=>regex.test(nextUrl));
    if (!redirect) {
        return url;
    }
    // If the redirect is external, open the URL
    if (redirect[2]) {
        let href = redirect[1].destination;
        if (href.startsWith('//') && process.env.EXPO_OS !== 'web') {
            href = `https:${href}`;
        }
        // TODO: Revisit whether redirect resolution should open external URLs or only return them.
        _expolinking().openURL(href);
        return href;
    }
    return applyRedirects(convertRedirect(url, redirect[1]), redirects);
}
function getRedirectModule(redirectConfig) {
    return {
        default: function RedirectComponent() {
            const pathname = require('./hooks').usePathname();
            const isExternal = (0, _url.shouldLinkExternally)(redirectConfig.destination);
            (0, _react().useEffect)(()=>{
                if (isExternal) {
                    let href = redirectConfig.destination;
                    if (href.startsWith('//') && process.env.EXPO_OS !== 'web') {
                        href = `https:${href}`;
                    }
                    _expolinking().openURL(href);
                }
            }, []);
            if (isExternal) {
                return null;
            }
            const href = convertRedirect(pathname, redirectConfig);
            return /*#__PURE__*/ (0, _react().createElement)(require('./link/Link').Redirect, {
                href
            });
        }
    };
}
function convertRedirect(path, config) {
    const params = {};
    const parts = path.split('/');
    const sourceParts = config.source.split('/');
    for (const [index, sourcePart] of sourceParts.entries()){
        const dynamicName = (0, _matchers.matchDynamicName)(sourcePart);
        if (!dynamicName) {
            continue;
        } else if (!dynamicName.deep) {
            params[dynamicName.name] = parts[index];
            continue;
        } else {
            params[dynamicName.name] = parts.slice(index);
            break;
        }
    }
    return mergeVariablesWithPath(config.destination, params);
}
function mergeVariablesWithPath(path, params) {
    return path.split('/').map((part)=>{
        const dynamicName = (0, _matchers.matchDynamicName)(part);
        if (!dynamicName) {
            return part;
        } else {
            const param = params[dynamicName.name];
            delete params[dynamicName.name];
            return param;
        }
    }).filter(Boolean).join('/');
}

//# sourceMappingURL=getRoutesRedirects.js.map
