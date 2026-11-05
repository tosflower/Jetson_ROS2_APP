"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getConfiguration", {
    enumerable: true,
    get: function() {
        return getConfiguration;
    }
});
const _platforms = require("../platforms");
function getConfiguration({ autolinkingOptions }) {
    const platformLinking = (0, _platforms.getLinkingImplementationForPlatform)(autolinkingOptions.platform);
    if ('getConfiguration' in platformLinking) {
        return platformLinking.getConfiguration(autolinkingOptions);
    } else {
        return undefined;
    }
}

//# sourceMappingURL=getConfiguration.js.map
