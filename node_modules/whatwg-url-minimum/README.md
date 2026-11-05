# whatwg-url-minimum

`whatwg-url-minimum` is a compact [WHATWG URL Standard](https://url.spec.whatwg.org/) implementation for JavaScript runtimes that need `URL` and `URLSearchParams` without the size and runtime assumptions of larger URL packages.

It is derived from [jsdom/whatwg-url](https://github.com/jsdom/whatwg-url), ported to TypeScript, and optimized for small bundles and React Native / Expo-style environments.

This package is primarily intended for Expo and React Native projects that need a standards-oriented URL implementation with predictable behavior across JavaScript engines, while keeping application bundles small.

## Implementation

The goal of `whatwg-url-minimum` is to keep the observable `URL` and `URLSearchParams` behavior close to the platform standard while reducing implementation size and avoiding runtime features that are not consistently available outside browsers and Node.js.

The implementation focuses on:

- **Compact parser code**: A small TypeScript URL parser with special-scheme, file URL, host, path, query, and fragment handling.
- **Small IDNA/TR46 support**: Domain normalization includes UTS #46 mapping, punycode encoding, joiner validation, and selected validity checks without shipping a full Unicode processing stack.
- **Fast `URLSearchParams` operations**: Query parsing, mutation, sorting, and serialization are optimized for repeated use.

## Quick Start

```ts
import { URL, URLSearchParams } from 'whatwg-url-minimum';

const url = new URL('https://Bücher.de/search?q=hello world');

url.hostname; // "xn--bcher-kva.de"
url.searchParams.append('page', '1');
url.href; // "https://xn--bcher-kva.de/search?q=hello%20world&page=1"

const params = new URLSearchParams('a=1&a=2');
params.getAll('a'); // ["1", "2"]
```

## API Reference

### `class URL`

`URL` follows the standard constructor and static helper shape:

```ts
new URL(input: string, base?: string);
URL.canParse(input: string, base?: string): boolean;
URL.parse(input: string, base?: string): URL | null;
```

Supported instance properties and methods include the standard URL surface:

- `href`
- `origin`
- `protocol`
- `username`
- `password`
- `host`
- `hostname`
- `port`
- `pathname`
- `search`
- `searchParams`
- `hash`
- `toString()`
- `toJSON()`

### `class URLSearchParams`

`URLSearchParams` supports the standard constructor forms and mutation/query methods:

```ts
new URLSearchParams();
new URLSearchParams('a=1&b=2');
new URLSearchParams([['a', '1']]);
new URLSearchParams({ a: '1' });
```

Supported methods and properties include:

- `append(name, value)`
- `delete(name, value?)`
- `get(name)`
- `getAll(name)`
- `has(name, value?)`
- `set(name, value)`
- `sort()`
- `forEach(callback, thisArg?)`
- `keys()`
- `values()`
- `entries()`
- `size`
- `toString()`

## Conformance

The test suite runs downloaded Web Platform Tests for URL parsing, URL setters, `URLSearchParams`, static helpers, and WebIDL behavior. It also includes local coverage for WPT resources that cannot be run directly in Vitest, such as `toascii.window.js` and `percent-encoding.window.js`.

Additional local tests compare IDNA/TR46 behavior against `whatwg-url` for the active `toascii.json` cases and seeded mixed-script domain cases.

Current known divergence:

- Full RFC 5893 CheckBidi validation is not implemented. The implementation contains a small mixed Latin/RTL rejection that covers the active URL WPT `toascii` cases without adding generated Bidi_Class tables.
- Revalidation of pre-existing `xn--` labels after UTS #46 mapping is intentionally omitted. This avoids shipping a punycode decoder solely for obsolete/removed IDNA validity coverage.
- `IdnaTestV2-removed.any.js` is intentionally omitted because it contains obsolete/deprecated IDNA cases outside this package's active conformance target.
