/**
 * Copyright © 2024 650 Industries.
 * Copyright © 2024 2023 Daishi Kato
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * https://github.com/dai-shi/waku/blob/32d52242c1450b5f5965860e671ff73c42da8bd0/packages/waku/src/client.ts#L1
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    decodeActionId: null,
    encodeActionId: null,
    encodeInput: null,
    filePathToFileURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get decodeActionId () {
        return decodeActionId;
    },
    get encodeActionId () {
        return encodeActionId;
    },
    get encodeInput () {
        return encodeInput;
    },
    get filePathToFileURL () {
        return filePathToFileURL;
    }
});
const filePathToFileURL = (filePath)=>'file://' + encodeURI(filePath);
const encodeInput = (input)=>{
    if (input === '') {
        return 'index.txt';
    }
    if (input === 'index') {
        throw new Error('Input should not be `index`');
    }
    if (input.startsWith('/')) {
        throw new Error('Input should not start with `/`');
    }
    if (input.endsWith('/')) {
        throw new Error('Input should not end with `/`');
    }
    return input + '.txt';
};
const ACTION_PREFIX = 'ACTION_';
const encodeActionId = (actionId)=>{
    const [file, name] = actionId.split('#');
    if (name.includes('/')) {
        throw new Error('Unsupported action name');
    }
    return ACTION_PREFIX + file + '/' + name;
};
const decodeActionId = (encoded)=>{
    if (!encoded.startsWith(ACTION_PREFIX)) {
        return null;
    }
    const index = encoded.lastIndexOf('/');
    return encoded.slice(ACTION_PREFIX.length, index) + '#' + encoded.slice(index + 1);
};

//# sourceMappingURL=utils.js.map
