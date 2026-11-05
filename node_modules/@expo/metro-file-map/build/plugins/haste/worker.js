/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Worker;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _workerExclusionList = /*#__PURE__*/ _interop_require_default(require("../../workerExclusionList"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const PACKAGE_JSON = _path().default.sep + 'package.json';
class Worker {
    #hasteImpl = null;
    constructor({ hasteImplModulePath }){
        if (hasteImplModulePath != null) {
            const mod = require(hasteImplModulePath);
            this.#hasteImpl = mod.__esModule === true && 'default' in mod ? mod.default : mod;
        }
    }
    async processFile(data, utils) {
        let hasteName = null;
        const { filePath } = data;
        if (filePath.endsWith(PACKAGE_JSON)) {
            // Process a package.json that is returned as a PACKAGE type with its name.
            try {
                const fileData = JSON.parse((await utils.getContent()).toString());
                if (fileData.name) {
                    hasteName = fileData.name;
                }
            } catch (err) {
                throw new Error(`Cannot parse ${filePath} as JSON: ${err.message}`);
            }
        } else if (!_workerExclusionList.default.has(filePath.substr(filePath.lastIndexOf('.')))) {
            if (!this.#hasteImpl) {
                throw new Error('computeHaste is true but hasteImplModulePath not set');
            }
            // Process a random file that is returned as a MODULE.
            hasteName = this.#hasteImpl.getHasteName(filePath) || null;
        }
        return hasteName;
    }
}

//# sourceMappingURL=worker.js.map
