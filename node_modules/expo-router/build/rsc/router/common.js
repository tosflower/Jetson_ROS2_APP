/**
 * Copyright © 2024 650 Industries.
 * Copyright © 2024 2023 Daishi Kato
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LOCATION_ID: null,
    PARAM_KEY_SKIP: null,
    SHOULD_SKIP_ID: null,
    getComponentIds: null,
    getInputString: null,
    mintComponentId: null,
    parseInputString: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get LOCATION_ID () {
        return LOCATION_ID;
    },
    get PARAM_KEY_SKIP () {
        return PARAM_KEY_SKIP;
    },
    get SHOULD_SKIP_ID () {
        return SHOULD_SKIP_ID;
    },
    get getComponentIds () {
        return _idMinting.getComponentIds;
    },
    get getInputString () {
        return getInputString;
    },
    get mintComponentId () {
        return _idMinting.mintComponentId;
    },
    get parseInputString () {
        return parseInputString;
    }
});
const _idMinting = require("./idMinting");
function getInputString(path) {
    if (!path.startsWith('/')) {
        throw new Error('Path should start with `/`');
    }
    return path.slice(1);
}
function parseInputString(input) {
    return '/' + input;
}
const PARAM_KEY_SKIP = 'expo_router_skip';
const SHOULD_SKIP_ID = '/SHOULD_SKIP';
const LOCATION_ID = '/LOCATION';

//# sourceMappingURL=common.js.map
