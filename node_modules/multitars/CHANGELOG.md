# multitars

## 1.0.2

### Patch Changes

- ⚠️ Fix tar and multipart cases that used UTF-16 instead of UTF-8 length calculations
  Submitted by [@kitten](https://github.com/kitten) (See [#33](https://github.com/expo/multitars/pull/33))
- Enforce declared `File` sizes for multipart/tar outputs, to avoid corrupted tarballs
  Submitted by [@kitten](https://github.com/kitten) (See [#31](https://github.com/expo/multitars/pull/31))
- Close stream iterators after streams are done
  Submitted by [@kitten](https://github.com/kitten) (See [#35](https://github.com/expo/multitars/pull/35))
- ⚠️ Fix multipart corruption when headers match limit exactly
  Submitted by [@kitten](https://github.com/kitten) (See [#38](https://github.com/expo/multitars/pull/38))
- Don't ignore PAX zero-size override
  Submitted by [@kitten](https://github.com/kitten) (See [#32](https://github.com/expo/multitars/pull/32))
- ⚠️ Fix incorrect combined header limit being applied
  Submitted by [@kitten](https://github.com/kitten) (See [#34](https://github.com/expo/multitars/pull/34))
- ⚠️ Fix tar input's header being concurrently readable with a cancellation padding skip. This meant that partially reading a file may have caused issues and misalignment on the next file access
  Submitted by [@kitten](https://github.com/kitten) (See [#28](https://github.com/expo/multitars/pull/28))
- ⚠️ Fix fallback conversion when `Symbol.asyncIterator` isn't available
  Submitted by [@kitten](https://github.com/kitten) (See [#29](https://github.com/expo/multitars/pull/29))
- Stop symlink `entry.size === 0` from being used for padding, corrupting the output
  Submitted by [@kitten](https://github.com/kitten) (See [#30](https://github.com/expo/multitars/pull/30))
- Apply global PAX size override to all following entries
  Submitted by [@kitten](https://github.com/kitten) (See [#39](https://github.com/expo/multitars/pull/39))
- ⚠️ Fix tar outputs with leading slash above length limit miscomputing prefix
  Submitted by [@kitten](https://github.com/kitten) (See [#27](https://github.com/expo/multitars/pull/27))
- ⚠️ Fix shared `Uint8Array` on CRLF bytes causing `workerd` regression
  Submitted by [@kitten](https://github.com/kitten) (See [#41](https://github.com/expo/multitars/pull/41))
- Restore performance (after regression due to size limit) by decreasing async generator layering overhead
  Submitted by [@kitten](https://github.com/kitten) (See [#40](https://github.com/expo/multitars/pull/40))

## 1.0.1

### Patch Changes

- Prevent a repeated `cancel` call from cancelling a stream's source twice
  Submitted by [@kitten](https://github.com/kitten) (See [#24](https://github.com/expo/multitars/pull/24))

## 1.0.0

### Major Changes

- Improve decoding performance and avoid copying blocks in unlocked passthrough scenarios
  Submitted by [@kitten](https://github.com/kitten) (See [#22](https://github.com/kitten/multitars/pull/22))

### Patch Changes

- ⚠️ Fix accidental typo in tar decoder breaking non-PAX GNU long name support
  Submitted by [@kitten](https://github.com/kitten) (See [#21](https://github.com/kitten/multitars/pull/21))

## 0.2.5

### Patch Changes

- In workerd's `ReadableStream` implementation, prevent concurrent `cancel` call on underlying source during in-flight pulls
  Submitted by [@kitten](https://github.com/kitten) (See [#19](https://github.com/kitten/multitars/pull/19))

## 0.2.4

### Patch Changes

- Update rollup config for reduced output and exclude sources from sourcemaps
  Submitted by [@kitten](https://github.com/kitten) (See [#17](https://github.com/kitten/multitars/pull/17))

## 0.2.3

### Patch Changes

- Revert trailer boundary check update
  Submitted by [@kitten](https://github.com/kitten) (See [#15](https://github.com/kitten/multitars/pull/15))

## 0.2.2

### Patch Changes

- Drop block scoping transform which interferred with generator
  Submitted by [@kitten](https://github.com/kitten) (See [#13](https://github.com/kitten/multitars/pull/13))
- Reduce `ReadableStreamBlockReader` memory complexity
  Submitted by [@kitten](https://github.com/kitten) (See [#11](https://github.com/kitten/multitars/pull/11))
- Skip `File` constructor to improve performance
  Submitted by [@kitten](https://github.com/kitten) (See [#12](https://github.com/kitten/multitars/pull/12))

## 0.2.1

### Patch Changes

- Replace `parseInt(val, 8)` for octal parsing with manual parsing (hotpath)
  Submitted by [@kitten](https://github.com/kitten) (See [#9](https://github.com/kitten/multitars/pull/9))

## 0.2.0

### Minor Changes

- Allow `parseMultipart` and `streamMultipart` to handle custom headers via a `MultipartPart` abstraction extending `StreamFile`
  Submitted by [@kitten](https://github.com/kitten) (See [#7](https://github.com/kitten/multitars/pull/7))

## 0.1.0

### Minor Changes

- Add basic README
  Submitted by [@kitten](https://github.com/kitten) (See [`87831f1`](https://github.com/kitten/multitars/commit/87831f1c7e0e163d54f1992f220440db99c5e20f))
- Accept `ReadableStream` inputs on `tar` and `streamMultipart`
  Submitted by [@kitten](https://github.com/kitten) (See [#5](https://github.com/kitten/multitars/pull/5))
- Accept `Iterable<Uint8Array>` and `AsyncIterable<Uint8Array>` on `untar` and `parseMultipart`
  Submitted by [@kitten](https://github.com/kitten) (See [#5](https://github.com/kitten/multitars/pull/5))
- Add `iterableToStream` and `streamToAsyncIterable` conversion helpers
  Submitted by [@kitten](https://github.com/kitten) (See [#4](https://github.com/kitten/multitars/pull/4))

### Patch Changes

- Improve multipart's boundary search performance
  Submitted by [@kitten](https://github.com/kitten) (See [#6](https://github.com/kitten/multitars/pull/6))

## 0.0.3

### Patch Changes

- Normalize type flag of `CONTIGUOUS_FILE` and `OLD_FILE` to `FILE`
  Submitted by [@kitten](https://github.com/kitten) (See [`d8f1785`](https://github.com/kitten/multitars/commit/d8f1785da78b9ed2359e1cb7c19387cabccd055d))
- Add missing `FormEntry` export
  Submitted by [@kitten](https://github.com/kitten) (See [`8fae4f3`](https://github.com/kitten/multitars/commit/8fae4f3740f3c9d278d6f7faee757b2d684af0cc))

## 0.0.2

### Patch Changes

- Generate random boundary ID for multipart output and expose `multipartContentType`
  Submitted by [@kitten](https://github.com/kitten) (See [`54b65ac`](https://github.com/kitten/multitars/commit/54b65ac7b50b2981c5ee182eeabaaedafb9dd489))

## 0.0.1

Initial Release.
