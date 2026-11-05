'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useScrollToTop", {
    enumerable: true,
    get: function() {
        return useScrollToTop;
    }
});
function _react() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("react"));
    _react = function() {
        return data;
    };
    return data;
}
const _core = require("../core");
const _useNavigationState = require("../core/useNavigationState");
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
function getScrollableNode(ref) {
    if (ref.current == null) {
        return null;
    }
    if ('scrollToTop' in ref.current || 'scrollTo' in ref.current || 'scrollToOffset' in ref.current || 'scrollResponderScrollTo' in ref.current) {
        // This is already a scrollable node.
        return ref.current;
    } else if ('getScrollResponder' in ref.current) {
        // If the view is a wrapper like FlatList, SectionList etc.
        // We need to use `getScrollResponder` to get access to the scroll responder
        return ref.current.getScrollResponder();
    } else if ('getNode' in ref.current) {
        // When a `ScrollView` is wrapped in `Animated.createAnimatedComponent`
        // we need to use `getNode` to get the ref to the actual scrollview.
        // Note that `getNode` is deprecated in newer versions of react-native
        // this is why we check if we already have a scrollable node above.
        return ref.current.getNode();
    } else {
        return ref.current;
    }
}
function useScrollToTop(ref) {
    const navigation = (0, _react().use)(_core.NavigationContext);
    const navigatorState = (0, _react().use)(_useNavigationState.NavigatorStateContext);
    const route = (0, _core.useRoute)();
    const isDirectlyInTabNavigator = navigatorState?.type === 'tab';
    const firstRouteKey = navigatorState?.routes[0]?.key;
    if (navigation === undefined) {
        throw new Error("Couldn't find a navigation object. Is your component inside NavigationContainer?");
    }
    _react().useEffect(()=>{
        const handler = (e)=>{
            // We should scroll to top only when the screen is focused
            const isFocused = navigation.isFocused();
            // In a nested stack navigator, tab press resets the stack to first screen
            // So we should scroll to top only when we are on first screen
            const isFirst = isDirectlyInTabNavigator || firstRouteKey === route.key;
            // Run the operation in the next frame so we're sure all listeners have been run
            // This is necessary to know if preventDefault() has been called
            requestAnimationFrame(()=>{
                const scrollable = getScrollableNode(ref);
                if (isFocused && isFirst && scrollable && !e.defaultPrevented) {
                    if ('scrollToTop' in scrollable) {
                        scrollable.scrollToTop();
                    } else if ('scrollTo' in scrollable) {
                        scrollable.scrollTo({
                            y: 0,
                            animated: true
                        });
                    } else if ('scrollToOffset' in scrollable) {
                        scrollable.scrollToOffset({
                            offset: 0,
                            animated: true
                        });
                    } else if ('scrollResponderScrollTo' in scrollable) {
                        scrollable.scrollResponderScrollTo({
                            y: 0,
                            animated: true
                        });
                    }
                }
            });
        };
        const unsubscribers = [];
        let currentNavigation = navigation;
        while(currentNavigation){
            // Non-tab navigators never emit `tabPress`, so these listeners are inert.
            // @ts-expect-error: `tabPress` is emitted only by tab navigators.
            unsubscribers.push(currentNavigation.addListener('tabPress', handler));
            currentNavigation = currentNavigation.getParent();
        }
        return ()=>{
            unsubscribers.forEach((unsubscribe)=>unsubscribe());
        };
    }, [
        firstRouteKey,
        isDirectlyInTabNavigator,
        navigation,
        ref,
        route.key
    ]);
}

//# sourceMappingURL=useScrollToTop.js.map
