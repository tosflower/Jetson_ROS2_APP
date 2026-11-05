/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 * @oncall react_native
 */
type ReadonlyJsonData = null | boolean | number | string | ReadonlyArray<ReadonlyJsonData> | {
  readonly [$$Key$$: string]: ReadonlyJsonData;
};
type DependencyMapPaths = null | undefined | {
  readonly [moduleID: number | string]: ReadonlyJsonData;
};
declare function asyncRequire<T>(moduleID: number, paths: DependencyMapPaths, moduleName?: string): Promise<T>;
export default asyncRequire;