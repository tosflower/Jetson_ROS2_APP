"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getDrawerStatusFromState", {
    enumerable: true,
    get: function() {
        return getDrawerStatusFromState;
    }
});
function getDrawerStatusFromState(state, defaultStatus) {
    const entry = state.history?.findLast((it)=>it.type === 'drawer');
    return entry?.status ?? defaultStatus;
}

//# sourceMappingURL=getDrawerStatusFromState.js.map
