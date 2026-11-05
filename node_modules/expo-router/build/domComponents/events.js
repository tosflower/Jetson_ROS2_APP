"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ROUTER_BACK_TYPE: null,
    ROUTER_DISMISS_ALL_TYPE: null,
    ROUTER_DISMISS_TYPE: null,
    ROUTER_LINK_TYPE: null,
    ROUTER_SET_PARAMS_TYPE: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get ROUTER_BACK_TYPE () {
        return ROUTER_BACK_TYPE;
    },
    get ROUTER_DISMISS_ALL_TYPE () {
        return ROUTER_DISMISS_ALL_TYPE;
    },
    get ROUTER_DISMISS_TYPE () {
        return ROUTER_DISMISS_TYPE;
    },
    get ROUTER_LINK_TYPE () {
        return ROUTER_LINK_TYPE;
    },
    get ROUTER_SET_PARAMS_TYPE () {
        return ROUTER_SET_PARAMS_TYPE;
    }
});
const ROUTER_LINK_TYPE = '$$router_link';
const ROUTER_DISMISS_ALL_TYPE = '$$router_dismissAll';
const ROUTER_DISMISS_TYPE = '$$router_dismiss';
const ROUTER_BACK_TYPE = '$$router_goBack';
const ROUTER_SET_PARAMS_TYPE = '$$router_setParams';

//# sourceMappingURL=events.js.map
