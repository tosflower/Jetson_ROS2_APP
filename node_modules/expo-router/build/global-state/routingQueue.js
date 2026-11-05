"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "markActionEnqueuedAndReturnId", {
    enumerable: true,
    get: function() {
        return markActionEnqueuedAndReturnId;
    }
});
const _performance = require("../performance");
let lastActionId = 0;
function markActionEnqueuedAndReturnId() {
    const actionId = ++lastActionId;
    (0, _performance.mark)('expo-router:action-enqueued', {
        actionId
    });
    return actionId;
}

//# sourceMappingURL=routingQueue.js.map
