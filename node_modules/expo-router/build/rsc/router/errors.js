/**
 * Copyright © 2024 650 Industries.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    MetroServerError: null,
    NetworkError: null,
    ReactServerError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get MetroServerError () {
        return MetroServerError;
    },
    get NetworkError () {
        return NetworkError;
    },
    get ReactServerError () {
        return ReactServerError;
    }
});
class MetroServerError extends Error {
    url;
    code = 'METRO_SERVER_ERROR';
    constructor(errorObject, url){
        super(errorObject.message), this.url = url;
        this.name = 'MetroServerError';
        for(const key in errorObject){
            this[key] = errorObject[key];
        }
    }
}
class ReactServerError extends Error {
    url;
    statusCode;
    headers;
    code = 'REACT_SERVER_ERROR';
    constructor(message, url, statusCode, /** Response headers from the server. */ headers){
        super(message), this.url = url, this.statusCode = statusCode, this.headers = headers;
        this.name = 'ReactServerError';
    }
}
class NetworkError extends Error {
    url;
    code = 'NETWORK_ERROR';
    constructor(message, url){
        super(message), this.url = url;
        this.name = 'NetworkError';
    }
}

//# sourceMappingURL=errors.js.map
