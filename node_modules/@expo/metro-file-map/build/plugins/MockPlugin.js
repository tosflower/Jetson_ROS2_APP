/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    CACHE_VERSION: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get CACHE_VERSION () {
        return CACHE_VERSION;
    },
    get default () {
        return MockPlugin;
    }
});
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _RootPathUtils = require("../lib/RootPathUtils");
const _normalizePathSeparatorsToPosix = /*#__PURE__*/ _interop_require_default(require("../lib/normalizePathSeparatorsToPosix"));
const _normalizePathSeparatorsToSystem = /*#__PURE__*/ _interop_require_default(require("../lib/normalizePathSeparatorsToSystem"));
const _getMockName = /*#__PURE__*/ _interop_require_default(require("./mocks/getMockName"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const CACHE_VERSION = 2;
class MockPlugin {
    name = 'mocks';
    #mocksPattern;
    #raw;
    #pathUtils;
    #console;
    #throwOnModuleCollision;
    constructor({ console, mocksPattern, rawMockMap = {
        duplicates: new Map(),
        mocks: new Map(),
        version: CACHE_VERSION
    }, rootDir, throwOnModuleCollision }){
        this.#mocksPattern = mocksPattern;
        if (rawMockMap.version !== CACHE_VERSION) {
            throw new Error('Incompatible state passed to MockPlugin');
        }
        this.#raw = rawMockMap;
        this.#console = console;
        this.#pathUtils = new _RootPathUtils.RootPathUtils(rootDir);
        this.#throwOnModuleCollision = throwOnModuleCollision;
    }
    async initialize({ files, pluginState }) {
        if (pluginState != null && pluginState.version === this.#raw.version) {
            // Use cached state directly if available
            this.#raw = pluginState;
        } else {
            // Otherwise, traverse all files to rebuild
            for (const { canonicalPath } of files.fileIterator({
                includeNodeModules: false,
                includeSymlinks: false
            })){
                this.#onFileAdded(canonicalPath);
            }
        }
    }
    getMockModule(name) {
        const mockPosixRelativePath = this.#raw.mocks.get(name) || this.#raw.mocks.get(name + '/index');
        if (typeof mockPosixRelativePath !== 'string') {
            return null;
        }
        return this.#pathUtils.normalToAbsolute((0, _normalizePathSeparatorsToSystem.default)(mockPosixRelativePath));
    }
    onChanged(delta) {
        // Process removals first so that moves aren't treated as duplicates.
        for (const [canonicalPath] of delta.removedFiles){
            this.#onFileRemoved(canonicalPath);
        }
        for (const [canonicalPath] of delta.addedFiles){
            this.#onFileAdded(canonicalPath);
        }
    }
    #onFileAdded(canonicalPath) {
        const absoluteFilePath = this.#pathUtils.normalToAbsolute(canonicalPath);
        if (!this.#mocksPattern.test(absoluteFilePath)) {
            return;
        }
        const mockName = (0, _getMockName.default)(absoluteFilePath);
        const posixRelativePath = (0, _normalizePathSeparatorsToPosix.default)(canonicalPath);
        const existingMockPosixPath = this.#raw.mocks.get(mockName);
        if (existingMockPosixPath != null) {
            if (existingMockPosixPath !== posixRelativePath) {
                let duplicates = this.#raw.duplicates.get(mockName);
                if (duplicates == null) {
                    duplicates = new Set([
                        existingMockPosixPath,
                        posixRelativePath
                    ]);
                    this.#raw.duplicates.set(mockName, duplicates);
                } else {
                    duplicates.add(posixRelativePath);
                }
                this.#console.warn(this.#getMessageForDuplicates(mockName, duplicates));
            }
        }
        // If there are duplicates and we don't throw, the latest mock wins.
        // This is to preserve backwards compatibility, but it's unpredictable.
        this.#raw.mocks.set(mockName, posixRelativePath);
    }
    #onFileRemoved(canonicalPath) {
        const absoluteFilePath = this.#pathUtils.normalToAbsolute(canonicalPath);
        if (!this.#mocksPattern.test(absoluteFilePath)) {
            return;
        }
        const mockName = (0, _getMockName.default)(absoluteFilePath);
        const duplicates = this.#raw.duplicates.get(mockName);
        if (duplicates != null) {
            const posixRelativePath = (0, _normalizePathSeparatorsToPosix.default)(canonicalPath);
            duplicates.delete(posixRelativePath);
            if (duplicates.size === 1) {
                this.#raw.duplicates.delete(mockName);
            }
            // Set the mock to a remaining duplicate. Should never be empty.
            // Size was checked as 1 above, so this is always defined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const remaining = duplicates.values().next().value;
            this.#raw.mocks.set(mockName, remaining);
        } else {
            this.#raw.mocks.delete(mockName);
        }
    }
    getSerializableSnapshot() {
        return {
            duplicates: new Map([
                ...this.#raw.duplicates
            ].map(([k, v])=>[
                    k,
                    new Set(v)
                ])),
            mocks: new Map(this.#raw.mocks),
            version: this.#raw.version
        };
    }
    assertValid() {
        if (!this.#throwOnModuleCollision) {
            return;
        }
        // Throw an aggregate error for each duplicate.
        const errors = [];
        for (const [mockName, relativePosixPaths] of this.#raw.duplicates){
            errors.push(this.#getMessageForDuplicates(mockName, relativePosixPaths));
        }
        if (errors.length > 0) {
            throw new Error(`Mock map has ${errors.length} error${errors.length > 1 ? 's' : ''}:\n${errors.join('\n')}`);
        }
    }
    #getMessageForDuplicates(mockName, relativePosixPaths) {
        return 'Duplicate manual mock found for `' + mockName + '`:\n' + [
            ...relativePosixPaths
        ].map((relativePosixPath)=>'    * <rootDir>' + _path().default.sep + this.#pathUtils.absoluteToNormal((0, _normalizePathSeparatorsToSystem.default)(relativePosixPath)) + '\n').join('');
    }
    getCacheKey() {
        return this.#mocksPattern.source.replaceAll('\\\\', '\\/') + ',' + this.#mocksPattern.flags;
    }
    getWorker() {
        return null;
    }
}

//# sourceMappingURL=MockPlugin.js.map
