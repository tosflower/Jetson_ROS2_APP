"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetch", {
    enumerable: true,
    get: function() {
        return fetch;
    }
});
function _fetch() {
    const data = require("expo/fetch");
    _fetch = function() {
        return data;
    };
    return data;
}
const _errors = require("./errors");
async function fetch(input, init) {
    try {
        return await (0, _fetch().fetch)(input, init);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.match(/(Network request failed|fetch failed): (The network connection was lost|Could not connect to the server)/)) {
                throw new _errors.NetworkError(error.message, input);
            }
        }
        throw error;
    }
}

//# sourceMappingURL=fetch.js.map
