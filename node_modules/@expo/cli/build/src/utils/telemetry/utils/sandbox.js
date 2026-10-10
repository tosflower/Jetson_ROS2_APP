"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSandboxTelemetryContext", {
    enumerable: true,
    get: function() {
        return getSandboxTelemetryContext;
    }
});
function _sandboxclidetector() {
    const data = require("sandbox-cli-detector");
    _sandboxclidetector = function() {
        return data;
    };
    return data;
}
const debug = require('debug')('expo:telemetry:sandbox');
let sandboxTelemetryContext;
function getSandboxTelemetryContext() {
    if (sandboxTelemetryContext === undefined) {
        sandboxTelemetryContext = resolveSandboxTelemetryContext();
    }
    return sandboxTelemetryContext;
}
function resolveSandboxTelemetryContext() {
    try {
        const { detected, sandbox } = (0, _sandboxclidetector().detectSandbox)();
        if (!detected || sandbox == null) {
            return null;
        }
        return sandbox.id;
    } catch (error) {
        debug('Failed to detect sandbox: %s', (error == null ? void 0 : error.message) ?? error);
        return null;
    }
}

//# sourceMappingURL=sandbox.js.map