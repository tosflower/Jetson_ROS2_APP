#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _arg() {
    const data = /*#__PURE__*/ _interop_require_default(require("arg"));
    _arg = function() {
        return data;
    };
    return data;
}
function _chalk() {
    const data = /*#__PURE__*/ _interop_require_default(require("chalk"));
    _chalk = function() {
        return data;
    };
    return data;
}
function _debug() {
    const data = /*#__PURE__*/ _interop_require_default(require("debug"));
    _debug = function() {
        return data;
    };
    return data;
}
function _getenv() {
    const data = require("getenv");
    _getenv = function() {
        return data;
    };
    return data;
}
const _runLegacyCLIAsync = require("./runLegacyCLIAsync");
const _errors = require("./utils/errors");
const _log = /*#__PURE__*/ _interop_require_wildcard(require("./utils/log"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
// Setup before requiring `debug`.
if ((0, _getenv().boolish)('EXPO_DEBUG', false)) {
    _debug().default.enable('@expo/fingerprint:*');
} else if (_debug().default.enabled('@expo/fingerprint:')) {
    process.env.EXPO_DEBUG = '1';
}
const commands = {
    // Add a new command here
    'fingerprint:generate': ()=>import('./commands/generateFingerprint.js').then((i)=>i.generateFingerprintAsync),
    'fingerprint:diff': ()=>import('./commands/diffFingerprints.js').then((i)=>i.diffFingerprintsAsync)
};
const args = (0, _arg().default)({
    // Types
    '--version': Boolean,
    '--help': Boolean,
    // Aliases
    '-h': '--help'
}, {
    permissive: true
});
if (args['--version']) {
    // Version is added in the build script.
    const packageJSON = require('../../package.json');
    console.log(packageJSON.version);
    process.exit(0);
}
const command = args._[0];
const commandArgs = args._.slice(1);
// Handle `--help` flag
if (args['--help'] && !command || !command) {
    _log.exit((0, _chalk().default)`
{bold Usage}
  {dim $} npx @expo/fingerprint <command>

{bold Commands}
  ${Object.keys(commands).sort().join(', ')}

{bold Options}
  --help, -h      Displays this message

For more information run a command with the --help flag
  {dim $} npx @expo/fingerprint fingerprint:generate --help
  `, 0);
}
// Push the help flag to the subcommand args.
if (args['--help']) {
    commandArgs.push('--help');
}
// Install exit hooks
process.on('SIGINT', ()=>process.exit(0));
process.on('SIGTERM', ()=>process.exit(0));
if (!commands[command]) {
    (0, _runLegacyCLIAsync.runLegacyCLIAsync)(args._).catch(_errors.logCmdError);
} else {
    commands[command]().then((exec)=>exec(commandArgs)).catch(_errors.logCmdError);
}

//# sourceMappingURL=cli.js.map
