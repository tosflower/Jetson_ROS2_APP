"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withFinalizedMod", {
    enumerable: true,
    get: function() {
        return withFinalizedMod;
    }
});
const _withMod = require("./withMod");
const withFinalizedMod = (config, [platform, action])=>{
    return (0, _withMod.withMod)(config, {
        platform,
        mod: 'finalized',
        action
    });
};

//# sourceMappingURL=withFinalizedMod.js.map
