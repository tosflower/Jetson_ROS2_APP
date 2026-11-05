"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isStreamingRenderer", {
    enumerable: true,
    get: function() {
        return isStreamingRenderer;
    }
});
function isStreamingRenderer(module) {
    return 'getStreamingContent' in module;
}

//# sourceMappingURL=rendering.js.map
