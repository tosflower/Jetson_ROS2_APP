"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withDangerousMod", {
    enumerable: true,
    get: function() {
        return withDangerousMod;
    }
});
const _withMod = require("./withMod");
const withDangerousMod = (config, [platform, action])=>{
    return (0, _withMod.withMod)(config, {
        platform,
        mod: 'dangerous',
        action
    });
};

//# sourceMappingURL=withDangerousMod.js.map
