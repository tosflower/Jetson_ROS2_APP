# sandbox-cli-detector

Detect whether the current process is running inside a sandboxed developer
environment.

Please [open an issue](https://github.com/davidmokos/sandbox-cli-detector/issues/new)
if your sandbox is not properly detected.

[![npm](https://img.shields.io/npm/v/sandbox-cli-detector.svg)](https://www.npmjs.com/package/sandbox-cli-detector)
[![Tests](https://github.com/davidmokos/sandbox-cli-detector/actions/workflows/test.yml/badge.svg)](https://github.com/davidmokos/sandbox-cli-detector/actions/workflows/test.yml)
[![License](https://img.shields.io/npm/l/sandbox-cli-detector.svg)](LICENSE)

## Installation

```sh
npm install sandbox-cli-detector
```

## Usage

```ts
import { detectSandbox } from "sandbox-cli-detector";

const result = detectSandbox();

if (result.detected && result.sandbox) {
  console.log("The name of the sandbox is:", result.sandbox.name);
} else {
  console.log("This program is not running inside a known sandbox");
}
```

## Supported sandboxes

Officially supported sandbox environments:

| Name | ID |
| --- | --- |
| [Replit](https://replit.com) | `replit` |
| [bolt.new](https://bolt.new) | `bolt` |
| [E2B](https://e2b.dev) | `e2b` |
| [Vercel Sandbox](https://vercel.com/docs/sandbox) | `vercel-sandbox` |
| [Daytona](https://daytona.io) | `daytona` |
| [Modal](https://modal.com) | `modal` |
| [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/) | `cloudflare-sandbox` |
| [GitHub Codespaces](https://github.com/features/codespaces) | `codespaces` |
| [CodeSandbox](https://codesandbox.io) | `codesandbox` |

Detection is data-driven. The exact environment variables for each sandbox
live in [`src/sandboxes.ts`](src/sandboxes.ts).

## API

### `detectSandbox(options?)`

Returns a detection result:

```ts
{
  detected: true,
  sandbox: {
    id: "e2b",
    name: "E2B"
  }
}
```

When no sandbox is detected, it returns `{ detected: false }`.

### `result.detected`

A boolean that is `true` when the process is running inside a known sandbox and
`false` otherwise.

### `result.sandbox.id`

A stable identifier for the detected sandbox. Prefer comparing this value over
`result.sandbox.name`.

### `result.sandbox.name`

The display name of the detected sandbox. This may change without it being a
breaking change.

### `isRunningInSandbox(options?)`

A convenience function that returns `result.detected` as a boolean:

```ts
import { isRunningInSandbox } from "sandbox-cli-detector";

if (isRunningInSandbox()) {
  // Adjust CLI behavior for sandboxed execution.
}
```

### Custom sandboxes

Pass custom definitions when you need to detect an internal environment:

```ts
import { defaultSandboxes, detectSandbox } from "sandbox-cli-detector";

const result = detectSandbox({
  sandboxes: [
    {
      id: "internal",
      name: "Internal Sandbox",
      env: [{ name: "INTERNAL_SANDBOX", value: "true" }],
    },
    ...defaultSandboxes,
  ],
});
```

Each environment signal matches either an exact `value` or any non-empty value
when `value` is omitted. If multiple sandboxes match, the first definition is
returned.

## CLI

The package also ships a CLI:

```sh
npx sandbox-cli-detector
npx sandbox-cli-detector --json
npx sandbox-cli-detector --quiet
```

It exits with `0` when a sandbox is detected and `1` otherwise.

## Contributing detections

Please include the platform name, a redacted `env | sort` captured inside the
platform, and the variables that identify it.

## License

[MIT](LICENSE)
