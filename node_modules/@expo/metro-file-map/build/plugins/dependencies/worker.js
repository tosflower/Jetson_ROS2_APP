/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */ 'use strict';
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return DependencyExtractorWorker;
    }
});
const _dependencyExtractor = require("./dependencyExtractor");
class DependencyExtractorWorker {
    #dependencyExtractor;
    constructor({ dependencyExtractor }){
        if (dependencyExtractor != null) {
            const mod = require(dependencyExtractor);
            this.#dependencyExtractor = mod.__esModule === true && 'default' in mod ? mod.default : mod;
        }
    }
    async processFile(data, utils) {
        const content = (await utils.getContent()).toString();
        const { filePath } = data;
        const dependencies = this.#dependencyExtractor != null ? this.#dependencyExtractor.extract(content, filePath, _dependencyExtractor.extract) : (0, _dependencyExtractor.extract)(content);
        // Return as array (PerFileData type)
        return Array.from(dependencies);
    }
}

//# sourceMappingURL=worker.js.map
