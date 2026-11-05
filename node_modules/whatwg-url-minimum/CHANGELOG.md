# whatwg-url-minimum

## 0.2.0

### Minor Changes

- Enforce minor version bump, due to added DIAN/TR46 support
  Submitted by [@kitten](https://github.com/kitten) (See [#16](https://github.com/expo/whatwg-url-minimum/pull/16))

### Patch Changes

- Close compliance gaps with existing WPT tests (exclusions removed)
  Submitted by [@kitten](https://github.com/kitten) (See [#8](https://github.com/expo/whatwg-url-minimum/pull/8))
- Apply small optimisations to ASCII `normalizeDomain` and `parseScheme`/`parseSchemeStart` cases
  Submitted by [@kitten](https://github.com/kitten) (See [#13](https://github.com/expo/whatwg-url-minimum/pull/13))
- Improve URLSearchParams synchronization and URL encoding hot paths
  Submitted by [@kitten](https://github.com/kitten) (See [#5](https://github.com/expo/whatwg-url-minimum/pull/5))
- Improve URL parser throughput with direct string parsing and recursive parser transitions
  Submitted by [@kitten](https://github.com/kitten) (See [#6](https://github.com/expo/whatwg-url-minimum/pull/6))
- Add UTS #46 dataset for full WPT compliance
  Submitted by [@kitten](https://github.com/kitten) (See [#9](https://github.com/expo/whatwg-url-minimum/pull/9))
- ⚠️ Fix minor IDL spec divergences
  Submitted by [@kitten](https://github.com/kitten) (See [#14](https://github.com/expo/whatwg-url-minimum/pull/14))
- Passthrough to `decodeURIComponent` to bypass `TextDecoder` reliance
  Submitted by [@kitten](https://github.com/kitten) (See [#17](https://github.com/expo/whatwg-url-minimum/pull/17))
- Add fast path for appending URL search param
  Submitted by [@kitten](https://github.com/kitten) (See [#7](https://github.com/expo/whatwg-url-minimum/pull/7))
- Add check to approximate Bidi validation
  Submitted by [@kitten](https://github.com/kitten) (See [#15](https://github.com/expo/whatwg-url-minimum/pull/15))

## 0.1.2

### Patch Changes

- Add missing `Symbol.toStringTag` annotations to `URL` and `URLSearchParams`
  Submitted by [@kitten](https://github.com/kitten) (See [#3](https://github.com/kitten/whatwg-url-minimum/pull/3))

## 0.1.1

### Patch Changes

- Update rollup sourcemap output to exclude sources
  Submitted by [@kitten](https://github.com/kitten) (See [#1](https://github.com/kitten/whatwg-url-minimum/pull/1))

## 0.1.0

Initial Release.
