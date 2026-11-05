/**
 * Get line indexes for the generated section of a file.
 *
 * @param src
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createGeneratedHeaderComment: null,
    createHash: null,
    mergeContents: null,
    removeContents: null,
    removeGeneratedContents: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createGeneratedHeaderComment () {
        return createGeneratedHeaderComment;
    },
    get createHash () {
        return createHash;
    },
    get mergeContents () {
        return mergeContents;
    },
    get removeContents () {
        return removeContents;
    },
    get removeGeneratedContents () {
        return removeGeneratedContents;
    }
});
function _crypto() {
    const data = /*#__PURE__*/ _interop_require_default(require("crypto"));
    _crypto = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getGeneratedSectionIndexes(src, tag) {
    const contents = src.split('\n');
    const start = contents.findIndex((line)=>new RegExp(`@generated begin ${tag} -`).test(line));
    const end = contents.findIndex((line)=>new RegExp(`@generated end ${tag}\\s*$`).test(line));
    return {
        contents,
        start,
        end
    };
}
function mergeContents({ src, newSrc, tag, anchor, offset, comment }) {
    const header = createGeneratedHeaderComment(newSrc, tag, comment);
    if (!src.includes(header)) {
        // Ensure the old generated contents are removed.
        const sanitizedTarget = removeGeneratedContents(src, tag);
        return {
            contents: addLines(sanitizedTarget ?? src, anchor, offset, [
                header,
                ...newSrc.split('\n'),
                `${comment} @generated end ${tag}`
            ]),
            didMerge: true,
            didClear: !!sanitizedTarget
        };
    }
    return {
        contents: src,
        didClear: false,
        didMerge: false
    };
}
function removeContents({ src, tag }) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    return {
        contents: sanitizedTarget ?? src,
        didMerge: false,
        didClear: !!sanitizedTarget
    };
}
function addLines(content, find, offset, toAdd) {
    const lines = content.split('\n');
    let lineIndex = lines.findIndex((line)=>line.match(find));
    if (lineIndex < 0) {
        const error = new Error(`Failed to match "${find}" in contents:\n${content}`);
        // @ts-ignore
        error.code = 'ERR_NO_MATCH';
        throw error;
    }
    for (const newLine of toAdd){
        lines.splice(lineIndex + offset, 0, newLine);
        lineIndex++;
    }
    return lines.join('\n');
}
function removeGeneratedContents(src, tag) {
    const { contents, start, end } = getGeneratedSectionIndexes(src, tag);
    if (start > -1 && end > -1 && start < end) {
        contents.splice(start, end - start + 1);
        // TODO: We could in theory check that the contents we're removing match the hash used in the header,
        // this would ensure that we don't accidentally remove lines that someone added or removed from the generated section.
        return contents.join('\n');
    }
    return null;
}
function createGeneratedHeaderComment(contents, tag, comment) {
    const hashKey = createHash(contents);
    // Everything after the `${tag} ` is unversioned and can be freely modified without breaking changes.
    return `${comment} @generated begin ${tag} - expo prebuild (DO NOT MODIFY) ${hashKey}`;
}
function createHash(src) {
    // this doesn't need to be secure, the shorter the better.
    const hash = _crypto().default.createHash('sha1').update(src).digest('hex');
    return `sync-${hash}`;
}

//# sourceMappingURL=generateCode.js.map
