"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateModulesProviderAsync", {
    enumerable: true,
    get: function() {
        return generateModulesProviderAsync;
    }
});
const _platforms = require("../platforms");
async function generateModulesProviderAsync(modules, params) {
    const platformLinking = (0, _platforms.getLinkingImplementationForPlatform)(params.platform);
    if (!('generateModulesProviderAsync' in platformLinking)) {
        throw new Error(`Generating modules provider is not available for platform "${params.platform}"`);
    }
    await platformLinking.generateModulesProviderAsync(modules, params.targetPath, params.entitlementPath, params);
}

//# sourceMappingURL=generatePackageList.js.map
