"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Head", {
    enumerable: true,
    get: function() {
        return Head;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
function _react() {
    const data = /*#__PURE__*/ _interop_require_default(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _hooks = require("../hooks");
const _useIsFocused = require("../useIsFocused");
const _ExpoHeadModule = require("./ExpoHeadModule");
const _url = require("./url");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function urlToId(url) {
    return url.replace(/[^a-zA-Z0-9]/g, '-');
}
function getLastSegment(path) {
    // Remove the extension
    const lastSegment = path.split('/').pop() ?? '';
    return lastSegment.replace(/\.[^/.]+$/, '').split('?')[0];
}
// TODO: Use Head Provider to collect all props so only one Head is rendered for a given route.
function useAddressableLink() {
    const pathname = (0, _hooks.useUnstableGlobalHref)();
    const params = (0, _hooks.useLocalSearchParams)();
    const url = (0, _url.getStaticUrlFromExpoRouter)(pathname);
    return {
        url,
        pathname,
        params
    };
}
function useMetaChildren(children) {
    return _react().default.useMemo(()=>{
        const renderableChildren = [];
        const metaChildren = [];
        _react().default.Children.forEach(children, (child)=>{
            if (!/*#__PURE__*/ _react().default.isValidElement(child)) {
                return;
            }
            if (typeof child.type === 'string') {
                metaChildren.push(child);
            } else {
                renderableChildren.push(child);
            }
        });
        return {
            children: renderableChildren,
            metaChildren
        };
    }, [
        children
    ]);
}
function serializedMetaChildren(meta) {
    const validMeta = meta.filter((child)=>child.type === 'meta' || child.type === 'title');
    return validMeta.map((child)=>{
        if (child.type === 'title') {
            return {
                type: 'title',
                props: {
                    children: child.props && typeof child.props === 'object' && 'children' in child.props && typeof child.props.children === 'string' ? child.props.children : undefined
                }
            };
        }
        return {
            type: 'meta',
            props: {
                property: child.props && typeof child.props === 'object' && 'property' in child.props && typeof child.props.property === 'string' ? child.props.property : undefined,
                content: child.props && typeof child.props === 'object' && 'content' in child.props && typeof child.props.content === 'string' ? child.props.content : undefined
            }
        };
    });
}
function buildUserActivity(sortedMeta) {
    const userActivity = {};
    sortedMeta.forEach((child)=>{
        if (child.type === 'meta') {
            const { property, content } = child.props;
            switch(property){
                case 'og:description':
                    userActivity.description = content;
                    break;
                case 'expo:handoff':
                    userActivity.isEligibleForHandoff = isTruthy(content);
                    break;
                case 'expo:spotlight':
                    userActivity.isEligibleForSearch = isTruthy(content);
                    break;
            }
        }
    });
    return userActivity;
}
function useActivityFromMetaChildren(meta) {
    const { url: href, pathname } = useAddressableLink();
    const sortedMeta = _react().default.useMemo(()=>serializedMetaChildren(meta), [
        meta
    ]);
    const activity = _react().default.useMemo(()=>buildUserActivity(sortedMeta), [
        sortedMeta
    ]);
    const url = _react().default.useMemo(()=>{
        const urlMeta = sortedMeta.find((child)=>child.type === 'meta' && child.props.property === 'og:url');
        if (urlMeta) {
            // Support =`/foo/bar` -> `https://example.com/foo/bar`
            if (urlMeta.props.content?.startsWith('/')) {
                return (0, _url.getStaticUrlFromExpoRouter)(urlMeta.props.content);
            }
            return urlMeta.props.content;
        }
        return href;
    }, [
        sortedMeta,
        href
    ]);
    const title = _react().default.useMemo(()=>{
        const titleTag = sortedMeta.find((child)=>child.type === 'title');
        if (titleTag) {
            return titleTag.props.children ?? '';
        }
        const titleMeta = sortedMeta.find((child)=>child.type === 'meta' && child.props.property === 'og:title');
        if (titleMeta) {
            return titleMeta.props.content ?? '';
        }
        return getLastSegment(pathname);
    }, [
        sortedMeta,
        pathname
    ]);
    const parsedActivity = {
        keywords: [
            title
        ],
        ...activity,
        title,
        webpageURL: url,
        activityType: _ExpoHeadModule.ExpoHead.activities.INDEXED_ROUTE,
        userInfo: {
            // TODO: This may need to be  versioned in the future, e.g. `_v1` if we change the format.
            href
        }
    };
    return parsedActivity;
}
function isTruthy(value) {
    return [
        true,
        'true'
    ].includes(value);
}
function HeadNative(props) {
    const isFocused = (0, _useIsFocused.useIsFocused)();
    if (!isFocused) {
        return /*#__PURE__*/ (0, _jsxruntime().jsx)(UnfocusedHead, {});
    }
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(FocusedHead, {
        ...props
    });
}
function UnfocusedHead(props) {
    const { children } = useMetaChildren(props.children);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
        children: children
    });
}
function FocusedHead(props) {
    const { metaChildren, children } = useMetaChildren(props.children);
    const activity = useActivityFromMetaChildren(metaChildren);
    useRegisterCurrentActivity(activity);
    return /*#__PURE__*/ (0, _jsxruntime().jsx)(_jsxruntime().Fragment, {
        children: children
    });
}
// segments => activity
const activities = new Map();
function useRegisterCurrentActivity(activity) {
    // ID is tied to Expo Router and agnostic of URLs to ensure dynamic parameters are not considered.
    // Using all segments ensures that cascading routes are considered.
    const activityId = urlToId((0, _hooks.usePathname)() || '/');
    const cascadingId = urlToId((0, _hooks.useSegments)().join('-') || '-');
    const activityIds = Array.from(activities.keys());
    const cascadingActivity = _react().default.useMemo(()=>{
        // Get all nested activities together, then update the id to match the current pathname.
        // This enables cases like `/user/[name]/post/[id]` to match all nesting, while still having a URL-specific ID, i.e. `/user/evanbacon/post/123`
        const cascadingActivity = activities.has(cascadingId) ? {
            ...activities.get(cascadingId),
            ...activity,
            id: activityId
        } : {
            ...activity,
            id: activityId
        };
        activities.set(cascadingId, cascadingActivity);
        return cascadingActivity;
    }, [
        cascadingId,
        activityId,
        activity,
        activityIds
    ]);
    const previousActivity = _react().default.useRef(null);
    _react().default.useEffect(()=>{
        if (!cascadingActivity) {
            return ()=>{};
        }
        if (!!previousActivity.current && deepObjectCompare(previousActivity.current, cascadingActivity)) {
            return ()=>{};
        }
        previousActivity.current = cascadingActivity;
        if (!cascadingActivity.id) {
            throw new Error('Activity must have an ID');
        }
        // If no features are enabled, then skip registering the activity
        if (cascadingActivity.isEligibleForHandoff || cascadingActivity.isEligibleForSearch) {
            _ExpoHeadModule.ExpoHead?.createActivity(cascadingActivity);
        }
        return ()=>{};
    }, [
        cascadingActivity
    ]);
    _react().default.useEffect(()=>{
        return ()=>{
            if (activityId) {
                _ExpoHeadModule.ExpoHead?.suspendActivity(activityId);
            }
        };
    }, [
        activityId
    ]);
}
function deepObjectCompare(a, b) {
    if (typeof a !== typeof b) {
        return false;
    }
    if (typeof a === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) {
            return false;
        }
        if (Array.isArray(a)) {
            if (a.length !== b.length) {
                return false;
            }
            return a.every((item, index)=>deepObjectCompare(item, b[index]));
        }
        // handle null
        if (a === null || b === null) {
            return a === b;
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        return aKeys.every((key)=>deepObjectCompare(a[key], b[key]));
    }
    return a === b;
}
HeadNative.Provider = _react().default.Fragment;
function HeadShim(props) {
    return null;
}
HeadShim.Provider = _react().default.Fragment;
const Head = _ExpoHeadModule.ExpoHead ? HeadNative : HeadShim;

//# sourceMappingURL=ExpoHead.ios.js.map
