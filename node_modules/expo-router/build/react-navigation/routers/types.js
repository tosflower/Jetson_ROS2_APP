"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RouterActionHandling", {
    enumerable: true,
    get: function() {
        return RouterActionHandling;
    }
});
var RouterActionHandling = /*#__PURE__*/ function(RouterActionHandling) {
    /**
   * Lets the base router handle the action. Only an `extendRouter` extension or an
   * `extendRouterActions` reducer can return it.
   */ RouterActionHandling["Delegate"] = "DELEGATE";
    /** Leaves the action unhandled, so the navigator ignores it. */ RouterActionHandling["Unhandled"] = "UNHANDLED";
    return RouterActionHandling;
}({});

//# sourceMappingURL=types.js.map
