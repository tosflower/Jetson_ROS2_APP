'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouter", {
    enumerable: true,
    get: function() {
        return useRouter;
    }
});
const _useRouterActions = require("../global-state/useRouterActions");
const _PreviewRouteContext = require("../link/preview/PreviewRouteContext");
const displayWarningForProp = (prop)=>{
    if (process.env.NODE_ENV !== 'production') {
        console.warn(`router.${prop} should not be used in a previewed screen. To fix this issue, wrap navigation calls with 'if (!isPreview) { ... }'.`);
    }
};
const createNOOPWithWarning = (prop)=>()=>displayWarningForProp(prop);
const routerWithWarnings = {
    back: createNOOPWithWarning('back'),
    canGoBack: ()=>{
        displayWarningForProp('canGoBack');
        return false;
    },
    push: createNOOPWithWarning('push'),
    navigate: createNOOPWithWarning('navigate'),
    replace: createNOOPWithWarning('replace'),
    dismiss: createNOOPWithWarning('dismiss'),
    dismissTo: createNOOPWithWarning('dismissTo'),
    dismissAll: createNOOPWithWarning('dismissAll'),
    canDismiss: ()=>{
        displayWarningForProp('canDismiss');
        return false;
    },
    setParams: createNOOPWithWarning('setParams'),
    reload: createNOOPWithWarning('reload'),
    prefetch: createNOOPWithWarning('prefetch'),
    setTransitionMode: createNOOPWithWarning('setTransitionMode')
};
function useRouter() {
    const { isPreview } = (0, _PreviewRouteContext.usePreviewInfo)();
    const router = (0, _useRouterActions.useRouterActions)();
    if (isPreview) {
        return routerWithWarnings;
    }
    return router;
}

//# sourceMappingURL=useRouter.js.map
