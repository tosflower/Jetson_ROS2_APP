"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Children: null,
    LOCATION_ID: null,
    PARAM_KEY_SKIP: null,
    SHOULD_SKIP_ID: null,
    ServerRouter: null,
    Slot: null,
    decodeActionId: null,
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
    get Children () {
        return _host.Children;
    },
    get LOCATION_ID () {
        return _common.LOCATION_ID;
    },
    get PARAM_KEY_SKIP () {
        return _common.PARAM_KEY_SKIP;
    },
    get SHOULD_SKIP_ID () {
        return _common.SHOULD_SKIP_ID;
    },
    get ServerRouter () {
        return _client.ServerRouter;
    },
    get Slot () {
        return _host.Slot;
    },
    get decodeActionId () {
        return _utils.decodeActionId;
    },
    get getComponentIds () {
        return _common.getComponentIds;
    },
    get getInputString () {
        return _common.getInputString;
    },
    get mintComponentId () {
        return _common.mintComponentId;
    },
    get parseInputString () {
        return _common.parseInputString;
    }
});
const _client = require("../rsc/router/client");
const _common = require("../rsc/router/common");
const _host = require("../rsc/router/host");
const _utils = require("../rsc/router/utils");

//# sourceMappingURL=rsc.js.map
