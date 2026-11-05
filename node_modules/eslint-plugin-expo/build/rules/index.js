"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rules", {
    enumerable: true,
    get: function() {
        return rules;
    }
});
const _nodynamicenvvar = require("./no-dynamic-env-var");
const _noenvvardestructuring = require("./no-env-var-destructuring");
const _preferboxshadow = require("./prefer-box-shadow");
const _usedomexports = require("./use-dom-exports");
const rules = {
    'no-dynamic-env-var': _nodynamicenvvar.noDynamicEnvVar,
    'no-env-var-destructuring': _noenvvardestructuring.noEnvVarDestructuring,
    'prefer-box-shadow': _preferboxshadow.preferBoxShadow,
    'use-dom-exports': _usedomexports.useDomExports
};

//# sourceMappingURL=index.js.map
