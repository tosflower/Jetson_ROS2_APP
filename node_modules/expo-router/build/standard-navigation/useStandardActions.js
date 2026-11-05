"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useStandardActions", {
    enumerable: true,
    get: function() {
        return useStandardActions;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function useStandardActions(navigation, target) {
    return (0, _react().useMemo)(()=>({
            back: ()=>{
                navigation.dispatch({
                    type: 'GO_BACK',
                    target
                });
            },
            navigate: (name, params)=>{
                navigation.dispatch({
                    type: 'NAVIGATE',
                    payload: {
                        name,
                        params
                    },
                    target
                });
            }
        }), [
        navigation,
        target
    ]);
}

//# sourceMappingURL=useStandardActions.js.map
