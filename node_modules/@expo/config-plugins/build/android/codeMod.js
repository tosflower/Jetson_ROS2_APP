"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addImports: null,
    appendContentsInsideDeclarationBlock: null,
    appendContentsInsideGradlePluginBlock: null,
    findGradlePluginCodeBlock: null,
    findNewInstanceCodeBlock: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addImports () {
        return addImports;
    },
    get appendContentsInsideDeclarationBlock () {
        return appendContentsInsideDeclarationBlock;
    },
    get appendContentsInsideGradlePluginBlock () {
        return appendContentsInsideGradlePluginBlock;
    },
    get findGradlePluginCodeBlock () {
        return findGradlePluginCodeBlock;
    },
    get findNewInstanceCodeBlock () {
        return findNewInstanceCodeBlock;
    }
});
const _commonCodeMod = require("../utils/commonCodeMod");
const _matchBrackets = require("../utils/matchBrackets");
function findNewInstanceCodeBlock(contents, classDeclaration, language) {
    const isJava = language === 'java';
    let start = isJava ? contents.indexOf(` new ${classDeclaration}(`) : contents.search(new RegExp(` (object\\s*:\\s*)?${classDeclaration}\\(`));
    if (start < 0) {
        return null;
    }
    // `+ 1` for the prefix space
    start += 1;
    let end = (0, _matchBrackets.findMatchingBracketPosition)(contents, '(', start);
    // For anonymous class, should search further to the {} block.
    // ```java
    // new Foo() {
    //   @Override
    //   protected void interfaceMethod {}
    // };
    // ```
    //
    // ```kotlin
    // object : Foo() {
    //   override fun interfaceMethod {}
    // }
    // ```
    const nextBrace = contents.indexOf('{', end + 1);
    const isAnonymousClass = nextBrace >= end && !!contents.substring(end + 1, nextBrace).match(/^\s*$/);
    if (isAnonymousClass) {
        end = (0, _matchBrackets.findMatchingBracketPosition)(contents, '{', end);
    }
    return {
        start,
        end,
        code: contents.substring(start, end + 1)
    };
}
function appendContentsInsideDeclarationBlock(srcContents, declaration, insertion) {
    const start = srcContents.search(new RegExp(`\\s*${declaration}.*?[\\(\\{]`));
    if (start < 0) {
        throw new Error(`Unable to find code block - declaration[${declaration}]`);
    }
    const end = (0, _matchBrackets.findMatchingBracketPosition)(srcContents, '{', start);
    return (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, end);
}
function addImports(source, imports, isJava) {
    const lines = source.split('\n');
    const lineIndexWithPackageDeclaration = lines.findIndex((line)=>line.match(/^package .*;?$/));
    for (const javaImport of imports){
        if (!source.includes(javaImport)) {
            const importStatement = `import ${javaImport}${isJava ? ';' : ''}`;
            lines.splice(lineIndexWithPackageDeclaration + 1, 0, importStatement);
        }
    }
    return lines.join('\n');
}
function findGradlePluginCodeBlock(contents, plugin) {
    const pluginStart = contents.search(new RegExp(`${plugin}\\s*\\{`, 'm'));
    if (pluginStart < 0) {
        return null;
    }
    const codeBlockStart = contents.indexOf('{', pluginStart);
    const codeBlockEnd = (0, _matchBrackets.findMatchingBracketPosition)(contents, '{', codeBlockStart);
    const codeBlock = contents.substring(codeBlockStart, codeBlockEnd + 1);
    return {
        start: codeBlockStart,
        end: codeBlockEnd,
        code: codeBlock
    };
}
function appendContentsInsideGradlePluginBlock(srcContents, plugin, insertion) {
    const codeBlock = findGradlePluginCodeBlock(srcContents, plugin);
    if (!codeBlock) {
        throw new Error(`Unable to find Gradle plugin block - plugin[${plugin}]`);
    }
    return (0, _commonCodeMod.insertContentsAtOffset)(srcContents, insertion, codeBlock.end);
}

//# sourceMappingURL=codeMod.js.map
