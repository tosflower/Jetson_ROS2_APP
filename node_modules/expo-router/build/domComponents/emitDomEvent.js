"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    emitDomDismiss: null,
    emitDomDismissAll: null,
    emitDomGoBack: null,
    emitDomLinkEvent: null,
    emitDomSetParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get emitDomDismiss () {
        return emitDomDismiss;
    },
    get emitDomDismissAll () {
        return emitDomDismissAll;
    },
    get emitDomGoBack () {
        return emitDomGoBack;
    },
    get emitDomLinkEvent () {
        return emitDomLinkEvent;
    },
    get emitDomSetParams () {
        return emitDomSetParams;
    }
});
const _events = require("./events");
function emitDomEvent(type, data = {}) {
    // @ts-expect-error: ReactNativeWebView is a global variable injected by the WebView
    if (typeof $$EXPO_INITIAL_PROPS !== 'undefined' && typeof ReactNativeWebView !== 'undefined') {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type,
            data
        }));
        return true;
    }
    return false;
}
function emitDomSetParams(params = {}) {
    return emitDomEvent(_events.ROUTER_SET_PARAMS_TYPE, {
        params
    });
}
function emitDomDismiss(count, options) {
    return emitDomEvent(_events.ROUTER_DISMISS_TYPE, {
        count,
        options
    });
}
function emitDomGoBack(options) {
    return emitDomEvent(_events.ROUTER_BACK_TYPE, {
        options
    });
}
function emitDomDismissAll(options) {
    return emitDomEvent(_events.ROUTER_DISMISS_ALL_TYPE, {
        options
    });
}
function emitDomLinkEvent(href, options) {
    return emitDomEvent(_events.ROUTER_LINK_TYPE, {
        href,
        options
    });
}

//# sourceMappingURL=emitDomEvent.js.map
