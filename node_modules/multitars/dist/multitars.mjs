const e = {
  highWaterMark: 0
};

function createReadableStream(t) {
  const {pull: n, cancel: i} = t;
  if (n && i) {
    let e;
    let a;
    t.pull = function wrappedPull(t) {
      return e = n(t);
    };
    t.cancel = function wrappedCancel() {
      if (null != a) {
        return a;
      } else if (null != e) {
        const settle = () => i();
        return a = Promise.resolve(e).then(settle, settle);
      }
      return a = Promise.resolve(i());
    };
  }
  const a = new ReadableStream(t, e);
  if (t.cancel) {
    const e = a.cancel;
    a.cancel = async function cancel(n) {
      return (a.locked ? t.cancel : e).call(a, n);
    };
  }
  return a;
}

function streamToAsyncIterable(e) {
  if (!e[Symbol.asyncIterator]) {
    return async function*() {
      const t = e.getReader();
      let n = !1;
      try {
        while (1) {
          const e = await t.read();
          if (e.done) {
            n = !0;
            return e.value;
          }
          yield e.value;
        }
      } finally {
        try {
          if (!n) {
            await t.cancel();
          }
        } finally {
          t.releaseLock();
        }
      }
    }();
  } else {
    return e;
  }
}

async function* streamToSizedAsyncIterable(e, t, n) {
  if (null == t) {
    yield* streamToAsyncIterable(e);
  } else {
    const i = e.getReader();
    let a = t;
    let r = !1;
    try {
      while (1) {
        const e = await i.read();
        if (e.done) {
          r = !0;
          break;
        }
        a -= e.value.byteLength;
        if (a < 0) {
          throw new Error(`${n} body exceeds declared size`);
        }
        yield e.value;
      }
      if (a > 0) {
        throw new Error(`${n} body is shorter than declared size`);
      }
    } finally {
      try {
        if (!r) {
          await i.cancel();
        }
      } finally {
        i.releaseLock();
      }
    }
  }
}

function streamLikeToIterator(e) {
  const t = "getReader" in e && "function" == typeof e.getReader ? streamToAsyncIterable(e) : e;
  const n = t[Symbol.asyncIterator] ? t[Symbol.asyncIterator]() : t[Symbol.iterator]();
  let i = !1;
  const a = {
    [Symbol.asyncIterator]: () => a,
    async next() {
      if (i) {
        return {
          done: !0,
          value: void 0
        };
      }
      const e = await n.next();
      i = !!e.done;
      return e.done ? {
        done: !0,
        value: void 0
      } : e;
    },
    async return() {
      if (!i) {
        i = !0;
        await (n.return?.());
      }
      return {
        done: !0,
        value: void 0
      };
    }
  };
  return a;
}

function iterableToStream(e, t) {
  const n = t?.signal;
  const i = new AbortController;
  let a;
  return Object.assign(new ReadableStream({
    expectedLength: t?.expectedLength,
    start() {
      a = e[Symbol.asyncIterator] ? e[Symbol.asyncIterator]() : e[Symbol.iterator]();
      n?.throwIfAborted();
      n?.addEventListener("abort", () => i.abort(n.reason));
    },
    async pull(e) {
      try {
        n?.throwIfAborted();
        const t = await a.next();
        if (t.value) {
          e.enqueue(t.value);
        }
        if (t.done) {
          e.close();
        }
      } catch (t) {
        e.error(t);
        i.abort(t);
      }
    },
    async cancel(e) {
      if (e) {
        await (a.throw?.(e));
      }
      await (a.return?.());
    }
  }, {
    highWaterMark: 0
  }), {
    signal: i.signal
  });
}

const t = new TextEncoder;

const n = new TextDecoder;

function _File() {}

_File.prototype = Object.create(File.prototype);

class StreamFile extends((() => _File)()){
  #e;
  #t;
  #n;
  #i;
  #a;
  constructor(e, t, n) {
    super([], t, n);
    this.#e = Array.isArray(e) ? new Blob(e).stream() : e;
    this.#i = n.type ?? "application/octet-stream";
    this.#t = n.lastModified || 0;
    this.#n = n.size || 0;
    this.#a = t;
  }
  get lastModified() {
    return this.#t;
  }
  get size() {
    return this.#n;
  }
  get name() {
    return this.#a;
  }
  set name(e) {
    this.#a = e;
  }
  get type() {
    return this.#i;
  }
  set type(e) {
    this.#i = e;
  }
  stream() {
    return this.#e;
  }
  async bytes() {
    return await async function streamToBuffer(e) {
      let t = 0;
      const n = [];
      for await (const i of streamToAsyncIterable(e)) {
        t += i.byteLength;
        n.push(i);
      }
      const i = new Uint8Array(t);
      for (let e = 0, t = 0; e < n.length; e++) {
        const a = n[e];
        i.set(a, t);
        t += a.byteLength;
      }
      return i;
    }(this.#e);
  }
  async arrayBuffer() {
    return (await this.bytes()).buffer;
  }
  async text() {
    return await async function streamToText(e) {
      let t = "";
      for await (const i of streamToAsyncIterable(e)) {
        t += n.decode(i, {
          stream: !0
        });
      }
      return t + n.decode();
    }(this.#e);
  }
  async json() {
    return JSON.parse(await this.text());
  }
  slice() {
    throw new TypeError("StreamFiles are streams and don't support conversion to Blobs");
  }
}

class MultipartPart extends StreamFile {
  constructor(e, t, n) {
    super(e, t, n ?? {});
    this.headers = n?.headers || Object.create(null);
    if (n?.size) {
      this.headers["content-length"] = `${n.size}`;
    }
    if (n?.type) {
      this.headers["content-type"] = `${n.type}`;
    }
  }
}

class ReadableStreamBlockReader {
  constructor(e, t) {
    this.next = streamLikeToIterator(e);
    this.input = null;
    this.inputOffset = 0;
    this.blockLocked = !1;
    this.blockRewind = 0;
    this.blockSize = t;
    this.block = new Uint8Array(t);
    this.buffer = null;
  }
  async close() {
    await this.next.return();
  }
  async read() {
    const {blockSize: e, block: t} = this;
    let n = 0;
    if (this.blockRewind > 0) {
      n += this.blockRewind;
      t.copyWithin(0, -this.blockRewind);
      this.blockRewind = 0;
    }
    let i = e - n;
    if (null != this.input && i > 0) {
      if (this.input.byteLength - this.inputOffset > i) {
        const e = this.input.subarray(this.inputOffset, this.inputOffset += i);
        return (this.blockLocked = 0 !== n) ? (t.set(e, n), t) : e;
      } else {
        const e = this.input.subarray(this.inputOffset);
        t.set(e, n);
        n += e.byteLength;
        this.input = null;
      }
    }
    while ((i = e - n) > 0) {
      const {done: e, value: a} = await this.next.next();
      if (e || !a?.byteLength) {
        break;
      } else if (a.byteLength > i) {
        this.input = a;
        const e = this.input.subarray(0, this.inputOffset = i);
        return (this.blockLocked = 0 !== n) ? (t.set(e, n), t) : e;
      } else {
        t.set(a, n);
        n += a.byteLength;
      }
    }
    this.blockLocked = !0;
    if (n === e) {
      return t;
    } else if (n > 0) {
      t.copyWithin(e - n, 0, n);
      return t.subarray(e - n);
    } else {
      return null;
    }
  }
  async pull(e = this.blockSize) {
    const {block: t, blockRewind: n} = this;
    if (n > 0) {
      this.blockLocked = !0;
      return this.blockRewind <= e ? (this.blockRewind = 0, t.subarray(-n)) : t.subarray(-n, -(this.blockRewind -= e));
    } else if (null != this.input) {
      this.blockLocked = !1;
      if (this.input.byteLength - this.inputOffset <= e) {
        const e = this.input.subarray(this.inputOffset);
        this.input = null;
        return e;
      } else {
        return this.input.subarray(this.inputOffset, this.inputOffset += e);
      }
    }
    this.blockLocked = !1;
    const {done: i, value: a} = await this.next.next();
    if (i) {
      return null;
    } else if (a.byteLength > e) {
      this.input = a;
      return a.subarray(0, this.inputOffset = e);
    } else {
      return a;
    }
  }
  async skip(e) {
    let t = e;
    this.blockLocked = !1;
    if (this.blockRewind >= t) {
      this.blockRewind -= t;
      return 0;
    } else if (this.blockRewind > 0) {
      t -= this.blockRewind;
      this.blockRewind = 0;
    }
    if (null != this.input) {
      if (this.input.byteLength - this.inputOffset > t) {
        this.inputOffset += t;
        return 0;
      } else {
        t -= this.input.byteLength - this.inputOffset;
        this.input = null;
      }
    }
    while (t > 0) {
      const {done: e, value: n} = await this.next.next();
      if (e) {
        return t;
      } else if (n.byteLength > t) {
        this.input = n;
        this.inputOffset = t;
        return 0;
      } else {
        t -= n.byteLength;
      }
    }
    return t;
  }
  rewind(e) {
    if (this.blockLocked) {
      this.blockRewind += e;
    } else if (null != this.input) {
      this.inputOffset -= e;
    }
  }
  copy(e) {
    this.buffer ||= new ArrayBuffer(this.blockSize);
    const t = new Uint8Array(this.buffer, 0, e.byteLength);
    t.set(e);
    return t;
  }
}

function bytesToSkipTable(e) {
  const t = new Uint8Array(256).fill(e.byteLength);
  const n = e.byteLength - 1;
  for (let i = 0; i < n; i++) {
    t[e[i]] = n - i;
  }
  return t;
}

function indexOf(e, t, n, i) {
  const a = t.byteLength - 1;
  const r = e.byteLength - t.byteLength;
  const o = t[a];
  const s = t[0];
  let l = n;
  while (l <= r) {
    const t = e[l + a];
    if (t === o) {
      if (e[l] === s) {
        return l;
      }
    }
    l += i[t];
  }
  return e.indexOf(s, l);
}

async function* readUntilBoundary(e, t, n) {
  if (t.byteLength > e.blockSize) {
    throw new TypeError(`Boundary must be shorter than block size (${t.byteLength} > ${e.blockSize})`);
  }
  for (let i = await e.read(), a = null; null != i || null != (i = await e.read()); a = null) {
    let r = -1;
    while ((r = indexOf(i, t, r + 1, n)) > -1) {
      let n = r + 1;
      let o = 1;
      while (o < t.byteLength && n < i.byteLength && t[o] === i[n]) {
        o++;
        n++;
      }
      if (o === t.byteLength) {
        e.rewind(i.byteLength - n);
        yield i.subarray(0, r);
        return;
      } else if (n === i.byteLength) {
        if (!a) {
          i = e.copy(i);
          a = await e.read();
          if (!a) {
            yield null;
            return;
          }
        }
        n = 0;
        while (o < t.byteLength && n < a.byteLength && t[o] === a[n]) {
          o++;
          n++;
        }
        if (o === t.byteLength) {
          e.rewind(a.byteLength - n);
          yield i.subarray(0, r);
          return;
        }
      }
    }
    const o = i;
    i = a;
    yield o;
  }
  yield null;
}

const i = `----formdata-${Math.random().toString(36).slice(2)}`;

const pencode = e => {
  switch (e) {
   case "\\":
    return "\\\\";

   case '"':
    return "%22";

   case "\n":
    return "%0A";

   default:
    return `%${e.charCodeAt(0).toString(16).toUpperCase()}`;
  }
};

const a = /["\n\\]/g;

function encodeName(e) {
  return e.replace(a, pencode);
}

const r = /\\(?:u[0-9a-f]{4}|x[0-9a-f]{2}|.)/gi;

const o = /%[0-9a-f]{2}/gi;

const decodeBackslashEscape = e => {
  if ("\\" !== e[0]) {
    return e;
  }
  switch (e[1]) {
   case "u":
   case "x":
    const t = e.slice(2);
    return t.length > 1 ? String.fromCharCode(parseInt(t, 16)) : e;

   case "b":
    return "\b";

   case "f":
    return "\f";

   case "n":
    return "\n";

   case "r":
    return "\r";

   case "t":
    return "\t";

   default:
    return null != e[2] ? e[2] : e;
  }
};

const pdecode = e => String.fromCharCode(parseInt("%" === e[0] ? e.slice(1) : e, 16));

function decodeName(e) {
  return e.replace(r, decodeBackslashEscape).replace(o, pdecode);
}

const s = new Uint8Array([ 13, 10 ]);

const l = bytesToSkipTable(s);

const c = /boundary="?([^=";]+)"?/i;

const d = new TextDecoder("utf-8", {
  fatal: !0,
  ignoreBOM: !0
});

function utf8Encode(e) {
  return "string" == typeof e ? t.encode(e) : new Uint8Array("buffer" in e ? e.buffer : e);
}

function parseContentLength(e) {
  if (e) {
    const t = parseInt(e, 10);
    return Number.isSafeInteger(t) && t > 0 ? t : null;
  } else {
    return null;
  }
}

function parseContentDisposition(e) {
  let t = 0, n = -1;
  if (!e || (t = e.indexOf(";")) < 0 || "form-data" !== e.slice(0, t).trimEnd()) {
    return null;
  }
  const i = {
    name: null,
    filename: null
  };
  do {
    n = e.indexOf(";", t);
    const a = e.slice(t, n > -1 ? n : void 0);
    t = n + 1;
    const r = a.indexOf("=");
    if (r > -1) {
      const e = a.slice(0, r).trim();
      let t = a.slice(r + 1).trim();
      if ("name" !== e && "filename" !== e) {
        continue;
      } else if ('"' === t[0] && '"' === t[t.length - 1]) {
        i[e] = decodeName(t.slice(1, -1));
      } else {
        i[e] = decodeName(t);
      }
    }
  } while (n > 0);
  return i;
}

async function expectTrailer(e, t) {
  for await (const n of readUntilBoundary(e, t.trailer, t.trailerSkipTable)) {
    if (null == n || 0 !== n.byteLength) {
      throw new Error("Invalid Multipart Part: Expected trailing boundary");
    } else {
      break;
    }
  }
}

async function decodeHeaders(e) {
  let t = 0;
  const n = Object.create(null);
  while (t <= 32e3) {
    let i = "";
    let a = 0;
    for await (const n of readUntilBoundary(e, s, l)) {
      if (null == n) {
        throw new Error("Invalid Multipart Headers: Unexpected EOF");
      } else if (!t && !i && 45 === n[0] && 45 === n[1]) {
        return null;
      } else {
        a += n.byteLength;
        if (a > 16e3) {
          throw new Error("Invalid Multipart Headers: A header exceeded its maximum length of 16kB");
        }
        i += d.decode(n, {
          stream: !0
        });
      }
    }
    i += d.decode();
    if (i) {
      const e = i.indexOf(":");
      if (e > -1) {
        const r = i.slice(0, e).trim().toLowerCase();
        const o = i.slice(e + 1).trim();
        if (o) {
          n[r] = o;
        }
        t += a + s.byteLength;
      } else {
        throw new Error("Invalid Multipart Headers: Invalid header value missing `:`");
      }
    } else if (t > 0) {
      break;
    }
  }
  if (t > 32e3) {
    throw new Error("Invalid Multipart Headers: Headers exceeded their maximum length of 32kB");
  }
  return n;
}

async function* parseMultipart(e, t) {
  const n = new ReadableStreamBlockReader(e, 4096);
  try {
    yield* async function* readMultipart(e, t) {
      const n = function convertToBoundaryBytes(e) {
        const t = e.match(c);
        const n = `--${t?.[1] || "-"}`;
        const i = `\r\n${n}`;
        const a = utf8Encode(n);
        const r = utf8Encode(i);
        return {
          raw: a,
          rawSkipTable: bytesToSkipTable(a),
          trailer: r,
          trailerSkipTable: bytesToSkipTable(r)
        };
      }(t.contentType);
      await async function expectPreamble(e, t) {
        let n = 0;
        for await (const i of readUntilBoundary(e, t.raw, t.rawSkipTable)) {
          if (null == i) {
            throw new Error("Invalid Multipart Preamble: Unexpected EOF");
          } else if ((n += i?.byteLength) > 16e3) {
            throw new Error("Invalid Multipart Preamble: Boundary not found within the first 16kB");
          }
        }
      }(e, n);
      let i;
      while (i = await decodeHeaders(e)) {
        const t = i["content-type"];
        const a = parseContentDisposition(i["content-disposition"]);
        const r = a?.filename || a?.name;
        const o = parseContentLength(i["content-length"]);
        if (!r) {
          throw new Error("Invalid Multipart Part: Missing Content-Disposition name or filename parameter");
        }
        let s = !1;
        let l = 0;
        let c;
        if (null !== o) {
          l = o;
          c = createReadableStream({
            expectedLength: o,
            async cancel() {
              if (l > 0) {
                l = await e.skip(l);
                if (l > 0) {
                  throw new Error("Invalid Multipart Part: Unexpected EOF");
                }
              }
              if (!s) {
                await expectTrailer(e, n);
                s = !0;
              }
            },
            async pull(t) {
              if (l) {
                const n = await e.pull(l);
                if (!n) {
                  throw new Error("Invalid Multipart Part: Unexpected EOF");
                }
                l -= n.byteLength;
                t.enqueue(e.blockLocked ? n.slice() : n);
              }
              if (!l) {
                await expectTrailer(e, n);
                s = !0;
                t.close();
              }
            }
          });
        } else {
          const t = readUntilBoundary(e, n.trailer, n.trailerSkipTable);
          c = createReadableStream({
            async cancel() {
              for await (const e of t) {
                if (!e) {
                  throw new Error("Invalid Multipart Part: Unexpected EOF");
                }
              }
              s = !0;
            },
            async pull(e) {
              const n = await t.next();
              if (n.done) {
                e.close();
                s = !0;
              } else if (!n.value) {
                throw new Error("Invalid Multipart Part: Unexpected EOF");
              } else {
                e.enqueue(n.value.slice());
              }
            }
          });
        }
        yield new MultipartPart(c, r, {
          type: t ?? void 0,
          size: o ?? void 0,
          headers: i
        });
        if (l > 0 || !s) {
          await c.cancel();
        }
      }
    }(n, t);
  } finally {
    await n.close();
  }
}

const u = "\r\n";

const f = "--";

const h = f + i + f + u + u;

const isBlob = e => "object" == typeof e && null != e && (e instanceof MultipartPart || e instanceof Blob || "type" in e);

const makeFormHeader = (e, t) => {
  let n = f + i + u;
  const a = encodeName(e.name);
  n += `Content-Disposition: form-data; name="${a}"`;
  if (null != e.filename) {
    n += `; filename="${e.filename === e.name ? a : encodeName(e.filename)}"`;
  }
  if (t) {
    if (t.type) {
      n += `${u}Content-Type: ${t.type}`;
    }
    if (t.size) {
      n += `${u}Content-Length: ${t.size}`;
    }
    if ("headers" in t) {
      for (const e in t.headers) {
        if ("content-length" !== e && "content-type" !== e && "content-disposition" !== e) {
          n += `${u}${e}: ${t.headers[e]}`;
        }
      }
    }
  }
  n += u;
  n += u;
  return n;
};

const y = `multipart/form-data; boundary=${i}`;

async function* streamMultipart(e) {
  for await (const [n, i] of streamLikeToIterator(e)) {
    if (isBlob(i)) {
      yield t.encode(makeFormHeader({
        name: n,
        filename: "name" in i ? i.name : n
      }, i));
      const e = i.stream();
      yield* streamToSizedAsyncIterable(e, i.size || null, "Invalid Multipart: Part");
    } else {
      yield t.encode(makeFormHeader({
        name: n
      }, void 0));
      yield "string" == typeof i ? t.encode(i) : i;
    }
    yield t.encode(u);
  }
  yield t.encode(h);
}

const m = 512;

function blockPad(e) {
  const t = 511 & e;
  return t && m - t;
}

let p = function(e) {
  e[e.FILE = 48] = "FILE";
  e[e.LINK = 49] = "LINK";
  e[e.SYMLINK = 50] = "SYMLINK";
  e[e.DIRECTORY = 53] = "DIRECTORY";
  return e;
}({});

function initTarHeader(e) {
  return {
    name: e?.name || "",
    mode: e?.mode || 0,
    uid: e?.uid || 0,
    gid: e?.gid || 0,
    size: e?.size || 0,
    mtime: e?.mtime || 0,
    typeflag: e?.typeflag || p.FILE,
    linkname: e?.linkname || null,
    uname: e?.uname || null,
    gname: e?.gname || null,
    devmajor: e?.devmajor || 0,
    devminor: e?.devminor || 0,
    _paxSize: e?._paxSize
  };
}

const getTarName = e => {
  if (e._longName) {
    return e._longName;
  } else if (e._paxName) {
    return e._paxName;
  } else if (e._prefix) {
    return `${e._prefix}/${e.name}`;
  } else {
    return e.name;
  }
};

const getTarSize = e => e._paxSize ?? e.size;

class TarChunk extends StreamFile {
  constructor(e, t) {
    super(e, getTarName(t), {
      lastModified: 1e3 * t.mtime,
      size: getTarSize(t)
    });
    this.mode = t.mode;
    this.uid = t.uid;
    this.gid = t.gid;
    this.mtime = t.mtime;
    this.typeflag = t.typeflag;
    this.linkname = (e => e._longLinkName || e._paxLinkName || e.linkname || null)(t);
    this.uname = t.uname;
    this.gname = t.gname;
    this.devmajor = t.devmajor;
    this.devminor = t.devminor;
  }
}

class TarFile extends StreamFile {
  static from(e, t, n) {
    const i = initTarHeader(null);
    i.name = t;
    i.mtime = n.lastModified ? Math.floor(n.lastModified / 1e3) : 0;
    i.size = n.size || 0;
    return new TarFile(e, i);
  }
  constructor(e, t) {
    super(e, getTarName(t), {
      lastModified: 1e3 * t.mtime,
      size: getTarSize(t)
    });
    this.mode = t.mode;
    this.uid = t.uid;
    this.gid = t.gid;
    this.mtime = t.mtime;
    this.typeflag = p.FILE;
    this.linkname = null;
    this.uname = t.uname;
    this.gname = t.gname;
    this.devmajor = t.devmajor;
    this.devminor = t.devminor;
  }
}

async function decodePax(e, t, i) {
  let a = i.size;
  const r = [];
  while (a > 0) {
    const t = await e.read();
    if (!t || t.byteLength !== e.blockSize) {
      throw new Error("Invalid Tar: Unexpected EOF while parsing PAX data");
    }
    const n = Math.min(a, t.byteLength);
    r.push(t.slice(0, n));
    a -= n;
  }
  const o = new Uint8Array(i.size);
  for (let e = 0, t = 0; e < r.length; e++) {
    o.set(r[e], t);
    t += r[e].byteLength;
  }
  for (let e = 0, a = 0; e < o.byteLength; a = e) {
    while (a < o.byteLength && 32 !== o[a]) {
      a++;
    }
    const r = parseInt(n.decode(o.subarray(e, a)), 10);
    if (!r || r != r) {
      break;
    }
    if (10 !== o[e + r - 1]) {
      break;
    }
    const s = n.decode(o.subarray(a + 1, e + r - 1));
    const l = s.indexOf("=");
    if (-1 === l) {
      break;
    }
    const c = s.slice(0, l);
    const d = s.slice(l + 1);
    e += r;
    switch (c) {
     case "path":
      if (t) {
        t._paxName = d;
      }
      i._paxName = d;
      break;

     case "linkpath":
      if (t) {
        t._paxLinkName = d;
      }
      i._paxLinkName = d;
      break;

     case "size":
      if (t) {
        t._paxSize = +d;
      }
      i._paxSize = +d;
      break;

     case "gid":
     case "uid":
     case "mode":
     case "mtime":
      if (t) {
        t[c] = +d;
      }
      i[c] = +d;
      break;

     case "uname":
     case "gname":
      if (t) {
        t[c] = d;
      }
      i[c] = d;
    }
  }
}

function getTypeFlag(e) {
  return e[156];
}

function checkMagic(e) {
  return 117 === e[257] && 115 === e[258] && 116 === e[259] && 97 === e[260] && 114 === e[261] && (0 === e[262] || 32 === e[262]);
}

function checkChecksum(e) {
  let t = 256;
  const n = decodeOctal(e, 148, 156);
  if (n === t) {
    return t;
  }
  for (let n = 0; n < 148; n++) {
    t += e[n];
  }
  for (let n = 156; n < 512; n++) {
    t += e[n];
  }
  return t === n ? t : 0;
}

function decodeString(e, t, i) {
  let a = t;
  while (a < i && 0 !== e[a]) {
    a++;
  }
  return a > t ? n.decode(e.subarray(t, a)) : "";
}

async function decodeLongString(e, t) {
  let i = t;
  let a = "";
  let r = -1;
  while (i > 0) {
    let t = await e.read();
    if (!t || t.byteLength !== e.blockSize) {
      throw new Error("Invalid Tar: Unexpected EOF while parsing long string");
    }
    i -= t.byteLength;
    if (-1 === r) {
      r = t.indexOf(0);
      if (r > -1) {
        t = t.subarray(0, r);
      }
      a += n.decode(t, {
        stream: !0
      });
    }
  }
  a += n.decode();
  return a;
}

function decodeOctal(e, t, n) {
  let i = 0;
  let a = n;
  if (128 === e[t]) {
    let n = 1;
    while (a-- > t + 1) {
      i += e[a] * n;
      n *= 256;
    }
    return i;
  } else if (255 === e[t]) {
    let n = 1;
    let r = !1;
    while (a-- > t) {
      i -= (255 & (r ? 255 ^ e[a] : 1 + (255 ^ e[a]))) * n;
      n *= 256;
      r ||= 0 !== e[a];
    }
    return i;
  } else {
    a = t;
    while (a < n && (32 === e[a] || 0 === e[a])) {
      a++;
    }
    while (a < n && e[a] >= 48 && e[a] <= 55) {
      i = 8 * i + (e[a++] - 48);
    }
    return i;
  }
}

function decodeBase(e, t) {
  e.name = decodeString(t, 0, 100);
  e.mode ||= decodeOctal(t, 100, 108);
  e.uid ||= decodeOctal(t, 108, 116);
  e.gid ||= decodeOctal(t, 116, 124);
  e.size = decodeOctal(t, 124, 136);
  e.mtime ||= decodeOctal(t, 136, 148);
  e.typeflag = getTypeFlag(t);
  e.linkname = decodeString(t, 157, 257) || null;
  e.uname ||= decodeString(t, 265, 297) || null;
  e.gname ||= decodeString(t, 297, 329) || null;
  e.devmajor = decodeOctal(t, 329, 337);
  e.devminor = decodeOctal(t, 337, 345);
  if (0 !== t[345]) {
    e._prefix = decodeString(t, 345, 500);
  }
  if (0 === e.typeflag && e.name.endsWith("/")) {
    e.typeflag = p.DIRECTORY;
  }
}

async function decodeHeader(e, t) {
  let n;
  let i = initTarHeader(t);
  while ((n = await e.read()) && checkMagic(n)) {
    if (n.byteLength !== e.blockSize) {
      throw new Error("Invalid Tar: Unexpected EOF while reading header");
    }
    switch (getTypeFlag(n)) {
     case 76:
     case 78:
      decodeBase(i, n);
      i._longName = await decodeLongString(e, i.size);
      continue;

     case 75:
      decodeBase(i, n);
      i._longLinkName = await decodeLongString(e, i.size);
      continue;

     case 103:
      decodeBase(i, n);
      await decodePax(e, t, i);
      continue;

     case 120:
      decodeBase(i, n);
      await decodePax(e, null, i);
      continue;

     case 0:
     case 55:
     case p.FILE:
     case p.LINK:
     case p.SYMLINK:
     case p.DIRECTORY:
      decodeBase(i, n);
      return i;

     default:
      if (!checkChecksum(n)) {
        throw new Error("Invalid Tar: Unexpected block with invalid checksum");
      }
      decodeBase(i, n);
      return i;
    }
  }
  for (let e = 0; n && e < n.byteLength; e++) {
    if (0 !== n[e]) {
      throw new Error("Invalid Tar: Unexpected non-header block");
    }
  }
  return;
}

async function* untar(e) {
  const t = new ReadableStreamBlockReader(e, m);
  try {
    yield* async function* readTar(e) {
      const t = initTarHeader(null);
      let n;
      while (null != (n = await decodeHeader(e, t))) {
        const t = n._paxSize ?? n.size;
        if (!Number.isSafeInteger(t) || t < 0) {
          throw new Error(`Invalid Tar: Invalid entry size ${t}`);
        }
        const i = blockPad(t);
        let a = 0 === i;
        let r = t;
        const o = createReadableStream({
          expectedLength: t,
          async cancel() {
            if (!a) {
              r += i;
            }
            if (r > 0) {
              if (await e.skip(r) > 0) {
                throw new Error("Invalid Tar: Unexpected EOF");
              }
              r = 0;
            }
            a = !0;
          },
          async pull(t) {
            if (r) {
              const n = await e.pull(r);
              if (!n) {
                throw new Error("Invalid Tar: Unexpected EOF");
              }
              r -= n.byteLength;
              t.enqueue(e.blockLocked ? n.slice() : n);
            }
            if (!r) {
              if (!a) {
                if (await e.skip(i) > 0) {
                  throw new Error("Invalid Tar: Unexpected EOF");
                }
                a = !0;
              }
              t.close();
            }
          }
        });
        let s;
        switch (n.typeflag) {
         case 0:
         case 55:
         case p.FILE:
          s = new TarFile(o, n);
          break;

         case p.LINK:
         case p.SYMLINK:
         case p.DIRECTORY:
          s = new TarChunk(o, n);
          break;

         default:
          await o.cancel();
          continue;
        }
        yield s;
        if (r > 0 || !a) {
          await o.cancel();
        }
      }
    }(t);
  } finally {
    await t.close();
  }
}

const b = 100;

const w = new Uint8Array(m);

const g = /[^\x00-\x7f]/;

function encodeString(e, n, i, a) {
  if (a) {
    t.encodeInto(a, e.subarray(n, i));
  }
}

function encodeOctal(e, t, n, i) {
  const a = n - t <= 8 ? 2097151 : 8589934591;
  if (i > a) {
    e[t] = 128;
    let a = i;
    for (let i = n - 1; i > t; a = Math.floor(a / 256), i--) {
      e[i] = 255 & a;
    }
  } else if (i < 0) {
    e[t] = 255;
    let a = -i;
    let r = !1;
    for (let i = n - 1; i > t; a = Math.floor(a / 256), i--) {
      const t = 255 & a;
      e[i] = r ? 255 & (255 ^ t) : 1 + (255 ^ t) & 255;
      r ||= 0 !== t;
    }
  } else if (i) {
    let r = n - 2;
    let o = i;
    if (8 * o <= a) {
      e[r--] = 32;
    }
    while (o > 0) {
      const t = o % 8;
      e[r--] = 48 + t;
      o = (o - t) / 8;
    }
    while (r >= t) {
      e[r--] = 48;
    }
  }
}

function encodeHeader(e) {
  const t = new Uint8Array(m);
  !function encodeBase(e, t) {
    if (!t.typeflag) {
      t.typeflag = function modeToType(e) {
        switch (61440 & e) {
         case 24576:
          return 52;

         case 8192:
          return 51;

         case 16384:
          return p.DIRECTORY;

         case 4096:
          return 54;

         case 40960:
          return p.SYMLINK;

         default:
          return p.FILE;
        }
      }(t.mode);
    }
    if (!t.mode) {
      t.mode = t.typeflag === p.DIRECTORY ? 493 : 420;
    }
    if (!t.mtime) {
      t.mtime = Math.floor(Date.now() / 1e3);
    }
    encodeString(e, 0, 100, t.name);
    encodeOctal(e, 100, 108, 4095 & t.mode);
    encodeOctal(e, 108, 116, t.uid);
    encodeOctal(e, 116, 124, t.gid);
    encodeOctal(e, 124, 136, t.size);
    encodeOctal(e, 136, 148, t.mtime);
    e[156] = t.typeflag;
    encodeString(e, 157, 257, t.linkname);
    encodeString(e, 257, 265, "ustar\x0000");
    encodeString(e, 265, 297, t.uname);
    encodeString(e, 297, 329, t.gname);
    encodeOctal(e, 329, 337, t.devmajor);
    encodeOctal(e, 337, 345, t.devminor);
    encodeString(e, 345, 500, t._prefix);
    !function encodeChecksum(e) {
      let t = 256;
      for (let n = 0; n < 148; n++) {
        t += e[n];
      }
      for (let n = 156; n < 512; n++) {
        t += e[n];
      }
      encodeOctal(e, 148, 156, t);
    }(e);
  }(t, e);
  return t;
}

function encodePax(e) {
  function encodePaxEntry(e, n) {
    const i = ` ${e}=${n}\n`;
    let a = t.encode(i).byteLength;
    const r = `${a}`;
    a += r.length;
    if (1 + Math.floor(Math.log10(a)) > r.length) {
      a += 1;
    }
    return `${a}${i}`;
  }
  let n = "";
  if (e._paxName) {
    n += encodePaxEntry("path", e._paxName);
  }
  if (e._paxLinkName) {
    n += encodePaxEntry("linkpath", e._paxLinkName);
  }
  return n ? t.encode(n) : null;
}

function truncateHeaderString(e) {
  let t = 99;
  while (128 == (192 & e[t])) {
    t--;
  }
  return n.decode(e.subarray(0, t));
}

function prepareHeaderStrings(e) {
  if (e.name.length > 33 && (e.name.length > b || g.test(e.name))) {
    const i = t.encode(e.name);
    if (i.byteLength > b) {
      const t = function indexOfPrefixEnd(e) {
        if (e.byteLength <= 255) {
          let t = e.byteLength;
          while ((t = e.lastIndexOf(47, t - 1)) > 0) {
            if (t < 155 && e.byteLength - t - 1 < b) {
              return t;
            }
          }
        }
        return -1;
      }(i);
      if (t > -1) {
        e._prefix = n.decode(i.subarray(0, t));
        e.name = n.decode(i.subarray(t + 1));
      } else {
        e._paxName = e.name;
        e.name = truncateHeaderString(i);
      }
    }
  }
  if (e.linkname && e.linkname.length > 33 && (e.linkname.length > b || g.test(e.linkname))) {
    const n = t.encode(e.linkname);
    if (n.byteLength > b) {
      e._paxLinkName = e.linkname;
      e.linkname = truncateHeaderString(n);
    }
  }
}

async function* tar(e) {
  for await (const t of streamLikeToIterator(e)) {
    const e = initTarHeader(t);
    if (!Number.isSafeInteger(e.size) || e.size < 0) {
      throw new Error(`Invalid Tar: Cannot safely encode part with size ${e.size}`);
    }
    if (t.lastModified && !e.mtime) {
      e.mtime = Math.floor(t.lastModified / 1e3);
    }
    if (e.typeflag === p.DIRECTORY && !e.name.endsWith("/")) {
      e.name += "/";
    } else if (e.typeflag === p.SYMLINK) {
      e.size = 0;
    }
    prepareHeaderStrings(e);
    const n = encodePax(e);
    if (n) {
      const e = initTarHeader(null);
      e.typeflag = 120;
      e.size = n.byteLength;
      yield encodeHeader(e);
      yield n;
      const t = blockPad(n.byteLength);
      if (t) {
        yield w.subarray(0, t);
      }
    }
    yield encodeHeader(e);
    const i = t.stream();
    if (e.size) {
      yield* streamToSizedAsyncIterable(i, e.size, "Invalid Tar: Entry");
    } else if (!i.locked) {
      await i.cancel();
    }
    const a = blockPad(e.size);
    if (a) {
      yield w.subarray(0, a);
    }
  }
  yield new Uint8Array(1024);
}

export { MultipartPart, StreamFile, TarChunk, TarFile, p as TarTypeFlag, iterableToStream, y as multipartContentType, parseMultipart, streamMultipart, streamToAsyncIterable, tar, untar };
//# sourceMappingURL=multitars.mjs.map
