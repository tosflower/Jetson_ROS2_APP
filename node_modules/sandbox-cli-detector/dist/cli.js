#!/usr/bin/env node
import {
  detectSandbox
} from "./chunk-HZH3SATY.js";

// src/cli.ts
var args = new Set(process.argv.slice(2));
if (args.has("-h") || args.has("--help")) {
  console.log(`Usage: sandbox-cli-detector [options]

Detect whether this process runs inside a sandboxed environment.

Options:
  --json    Print the full detection result as JSON
  --quiet   No output, exit code only
  -h, --help  Show this help

Exit codes:
  0  sandbox detected
  1  no sandbox detected`);
  process.exit(0);
}
var result = detectSandbox();
if (!args.has("--quiet")) {
  if (args.has("--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.sandbox) {
    console.log(`detected: ${result.sandbox.name}`);
  } else {
    console.log("no sandbox detected");
  }
}
process.exitCode = result.detected ? 0 : 1;
//# sourceMappingURL=cli.js.map