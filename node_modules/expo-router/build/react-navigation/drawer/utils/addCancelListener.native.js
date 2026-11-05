"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addCancelListener", {
    enumerable: true,
    get: function() {
        return addCancelListener;
    }
});
function _reactnative() {
    const data = require("react-native");
    _reactnative = function() {
        return data;
    };
    return data;
}
const addCancelListener = (callback)=>{
    const subscription = _reactnative().BackHandler.addEventListener('hardwareBackPress', callback);
    return ()=>{
        subscription.remove();
    };
};

//# sourceMappingURL=addCancelListener.native.js.map
