// Re-export shim — preserves all existing import paths.
// TODO: Refactor consumers to import directly from the new modules, then delete this file.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    canDismiss: null,
    canGoBack: null,
    dismiss: null,
    dismissAll: null,
    dismissTo: null,
    goBack: null,
    linkTo: null,
    navigate: null,
    prefetch: null,
    push: null,
    reload: null,
    replace: null,
    setParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get canDismiss () {
        return _router.canDismiss;
    },
    get canGoBack () {
        return _router.canGoBack;
    },
    get dismiss () {
        return _router.dismiss;
    },
    get dismissAll () {
        return _router.dismissAll;
    },
    get dismissTo () {
        return _router.dismissTo;
    },
    get goBack () {
        return _router.goBack;
    },
    get linkTo () {
        return _router.linkTo;
    },
    get navigate () {
        return _router.navigate;
    },
    get prefetch () {
        return _router.prefetch;
    },
    get push () {
        return _router.push;
    },
    get reload () {
        return _router.reload;
    },
    get replace () {
        return _router.replace;
    },
    get setParams () {
        return _router.setParams;
    }
});
const _router = require("./router");

//# sourceMappingURL=routing.js.map
