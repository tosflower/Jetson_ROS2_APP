"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addObjcImports: null,
    addSwiftImports: null,
    findObjcFunctionCodeBlock: null,
    findObjcInterfaceCodeBlock: null,
    findSwiftFunctionCodeBlock: null,
    insertContentsInsideObjcFunctionBlock: null,
    insertContentsInsideObjcInterfaceBlock: null,
    insertContentsInsideSwiftClassBlock: null,
    insertContentsInsideSwiftFunctionBlock: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addObjcImports () {
        return addObjcImports;
    },
    get addSwiftImports () {
        return addSwiftImports;
    },
    get findObjcFunctionCodeBlock () {
        return findObjcFunctionCodeBlock;
    },
    get findObjcInterfaceCodeBlock () {
        return findObjcInterfaceCodeBlock;
    },
    get findSwiftFunctionCodeBlock () {
        return findSwiftFunctionCodeBlock;
    },
    get insertContentsInsideObjcFunctionBlock () {
        return insertContentsInsideObjcFunctionBlock;
    },
    get insertContentsInsideObjcInterfaceBlock () {
        return insertContentsInsideObjcInterfaceBlock;
    },
    get insertContentsInsideSwiftClassBlock () {
        return insertContentsInsideSwiftClassBlock;
    },
    get insertContentsInsideSwiftFunctionBlock () {
        return insertContentsInsideSwiftFunctionBlock;
    }
});
const _commonCodeMod = require("../utils/commonCodeMod");
const _matchBrackets = require("../utils/matchBrackets");
function addObjcImports(source, imports) {
    const lines = source.split('\n');
    // Try to insert statements after first #import where would probably not in #if block
    const lineIndexWithFirstImport = lines.findIndex((line)=>line.match(/^#import .*$/));
    for (const importElement of imports){
        if (!source.includes(importElement)) {
            const importStatement = `#import ${importElement}`;
            lines.splice(lineIndexWithFirstImport + 1, 0, importStatement);
        }
    }
    return lines.join('\n');
}
function addSwiftImports(source, imports) {
    const lines = source.split('\n');
    // Try to insert statements after first import where would probably not in #if block
    const lineIndexWithFirstImport = lines.findIndex((line)=>line.match(/^import .*$/));
    for (const importElement of imports){
        if (!source.includes(importElement)) {
            const importStatement = `import ${importElement}`;
            lines.splice(lineIndexWithFirstImport + 1, 0, importStatement);
        }
    }
    return lines.join('\n');
}
function findObjcInterfaceCodeBlock(contents, declaration) {
    const start = contents.search(new RegExp(`^${declaration}\\W`, 'm'));
    if (start < 0) {
        return null;
    }
    let end = contents.indexOf('\n@end', start);
    end += 5; // '\n@end'.length === 5
    return {
        start,
        end,
        code: contents.substring(start, end)
    };
}
function findObjcFunctionCodeBlock(contents, selector) {
    const symbols = selector.split(':');
    const argsCount = symbols.length - 1;
    let pattern = '^[\\-+]\\s*\\(.+?\\)';
    if (argsCount === 0) {
        pattern += `${symbols[0]}\\s+`;
    } else {
        for(let i = 0; i < argsCount; ++i){
            const argSymbol = `${symbols[i]}:\\(.+\\)\\w+`;
            pattern += `${argSymbol}\\s+`;
        }
    }
    pattern += '{';
    let start = contents.search(new RegExp(pattern, 'm'));
    if (start < 0) {
        return null;
    }
    start = contents.indexOf('{', start);
    const end = (0, _matchBrackets.findMatchingBracketPosition)(contents, '{', start);
    return {
        start,
        end,
        code: contents.substring(start, end + 1)
    };
}
function insertContentsInsideObjcFunctionBlock(srcContents, selector, insertion, options) {
    return insertContentsInsideFunctionBlock(srcContents, selector, insertion, options, 'objc');
}
function insertContentsInsideObjcInterfaceBlock(srcContents, declaration, insertion, options) {
    const codeBlock = findObjcInterfaceCodeBlock(srcContents, declaration);
    if (!codeBlock) {
        return srcContents;
    }
    const { position } = options;
    if (position === 'head') {
        const firstNewLineIndex = srcContents.indexOf('\n', codeBlock.start);
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, firstNewLineIndex);
    } else if (position === 'tail') {
        const endLen = '@end'.length;
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, codeBlock.end - endLen);
    }
    return srcContents;
}
function findSwiftFunctionCodeBlock(contents, selector) {
    const parenthesesIndex = selector.indexOf('(');
    // `functName` === 'doSomething' of 'doSomething(_:withSomeValue:)'
    const funcName = selector.substring(0, parenthesesIndex);
    // `argLabels` === ['_', 'withSomeValue'] 'doSomething(_:withSomeValue:)'
    const argLabels = selector.substring(parenthesesIndex + 1, selector.length - 2).split(':');
    let searchOffset = 0;
    const funcCandidateRegExp = new RegExp(`\\sfunc\\s+${funcName}\\(`, 'm');
    let funcCandidateOffset = (0, _commonCodeMod.searchFromOffset)(contents, funcCandidateRegExp, searchOffset);
    while(funcCandidateOffset >= 0){
        // Parse function parameters
        const paramsStartOffset = contents.indexOf('(', funcCandidateOffset);
        const paramsEndOffset = (0, _matchBrackets.findMatchingBracketPosition)(contents, '(', paramsStartOffset);
        const paramsString = contents.substring(paramsStartOffset + 1, paramsEndOffset);
        const params = paramsString.split(',').map(parseSwiftFunctionParam);
        // Prepare offset for next round
        searchOffset = paramsEndOffset + 1;
        funcCandidateOffset = (0, _commonCodeMod.searchFromOffset)(contents, funcCandidateRegExp, searchOffset);
        // Try to match function parameters
        if (argLabels.length !== params.length) {
            continue;
        }
        for(let i = 0; i < argLabels.length; ++i){
            if (argLabels[i] !== params[i]?.argumentLabel) {
                continue;
            }
        }
        // This function is matched one, get the code block.
        const codeBlockStart = contents.indexOf('{', paramsEndOffset);
        const codeBlockEnd = (0, _matchBrackets.findMatchingBracketPosition)(contents, '{', paramsEndOffset);
        const codeBlock = contents.substring(codeBlockStart, codeBlockEnd + 1);
        return {
            start: codeBlockStart,
            end: codeBlockEnd,
            code: codeBlock
        };
    }
    return null;
}
function parseSwiftFunctionParam(paramTuple) {
    const semiIndex = paramTuple.indexOf(':');
    const [argumentLabel = '', parameterName = ''] = paramTuple.substring(0, semiIndex).split(/\s+/);
    const typeString = paramTuple.substring(semiIndex + 1).trim();
    return {
        argumentLabel,
        parameterName,
        typeString
    };
}
function insertContentsInsideSwiftClassBlock(srcContents, declaration, insertion, options) {
    const start = srcContents.search(new RegExp(`\\s*${declaration}.*?[\\(\\{]`));
    if (start < 0) {
        throw new Error(`Unable to find class code block - declaration[${declaration}]`);
    }
    const { position } = options;
    if (position === 'head') {
        const firstBracketIndex = srcContents.indexOf('{', start);
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, firstBracketIndex + 1);
    } else if (position === 'tail') {
        const endBracketIndex = (0, _matchBrackets.findMatchingBracketPosition)(srcContents, '{', start);
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, endBracketIndex);
    }
    return srcContents;
}
function insertContentsInsideSwiftFunctionBlock(srcContents, selector, insertion, options) {
    return insertContentsInsideFunctionBlock(srcContents, selector, insertion, options, 'swift');
}
function insertContentsInsideFunctionBlock(srcContents, selector, insertion, options, language) {
    const codeBlock = language === 'objc' ? findObjcFunctionCodeBlock(srcContents, selector) : findSwiftFunctionCodeBlock(srcContents, selector);
    if (!codeBlock) {
        return srcContents;
    }
    const { position } = options;
    const indent = ' '.repeat(options.indent ?? 2);
    if (position === 'head') {
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, `\n${indent}${insertion}`, codeBlock.start + 1);
    } else if (position === 'tail') {
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, `\n${indent}${insertion}`, codeBlock.end - 1);
    } else if (position === 'tailBeforeLastReturn') {
        let lastReturnIndex = srcContents.lastIndexOf(' return ', codeBlock.end);
        if (lastReturnIndex < 0) {
            throw new Error(`Cannot find last return statement:\n${srcContents}`);
        }
        lastReturnIndex += 1; // +1 for the prefix space
        srcContents = (0, _commonCodeMod.insertContentsAtOffset)(srcContents, `${insertion}\n${indent}`, lastReturnIndex);
    }
    return srcContents;
}

//# sourceMappingURL=codeMod.js.map
