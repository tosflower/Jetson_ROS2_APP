"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useStandardEmitter", {
    enumerable: true,
    get: function() {
        return useStandardEmitter;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function useStandardEmitter(navigation) {
    return (0, _react().useMemo)(()=>({
            emit (options) {
                // `navigation.emit` constrains the event name to `Extract<keyof EventMap, string>`,
                // but `NavigatorEventMap extends Record<string, …>` already guarantees string keys.
                const result = navigation.emit(options);
                const baseEvent = {
                    type: options.type,
                    data: options.data,
                    target: options.target
                };
                if ('defaultPrevented' in result) {
                    return Object.defineProperties(baseEvent, {
                        defaultPrevented: {
                            enumerable: true,
                            get () {
                                return result.defaultPrevented;
                            }
                        },
                        preventDefault: {
                            enumerable: true,
                            value: result.preventDefault
                        }
                    });
                }
                return baseEvent;
            }
        }), [
        navigation
    ]);
}

//# sourceMappingURL=useStandardEmitter.js.map
