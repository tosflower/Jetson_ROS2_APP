'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Redirect", {
    enumerable: true,
    get: function() {
        return Redirect;
    }
});
const _useRouter = require("../hooks/useRouter");
const _useFocusEffect = require("../useFocusEffect");
const _PreviewRouteContext = require("./preview/PreviewRouteContext");
function Redirect({ href, relativeToDirectory, withAnchor }) {
    const router = (0, _useRouter.useRouter)();
    const isPreview = (0, _PreviewRouteContext.useIsPreview)();
    (0, _useFocusEffect.useFocusEffect)(()=>{
        if (!isPreview) {
            try {
                router.replace(href, {
                    relativeToDirectory,
                    withAnchor
                });
            } catch (error) {
                console.error(error);
            }
        }
    });
    return null;
}

//# sourceMappingURL=Redirect.js.map
