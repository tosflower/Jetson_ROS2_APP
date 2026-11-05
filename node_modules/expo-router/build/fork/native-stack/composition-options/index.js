"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CompositionContext: null,
    mergeOptions: null,
    useCompositionOption: null,
    useCompositionRegistry: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CompositionContext () {
        return _CompositionOptionsContext.CompositionContext;
    },
    get mergeOptions () {
        return _mergeOptions.mergeOptions;
    },
    get useCompositionOption () {
        return _CompositionOptionsContext.useCompositionOption;
    },
    get useCompositionRegistry () {
        return _CompositionOptionsContext.useCompositionRegistry;
    }
});
const _mergeOptions = require("./mergeOptions");
const _CompositionOptionsContext = require("./CompositionOptionsContext");

//# sourceMappingURL=index.js.map
