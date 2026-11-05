/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noformat
 * @generated SignedSource<<3f5cec7a825e191667892d7c3602ca6b>>
 *
 * This file was translated from Flow by scripts/generateTypeScriptDefinitions.js
 * Original file: packages/metro-file-map/src/lib/RootPathUtils.js
 * To regenerate, run:
 *   js1 build metro-ts-defs (internal) OR
 *   yarn run build-ts-defs (OSS) 
 */

export declare class RootPathUtils {
  constructor(rootDir: string);
  getBasenameOfNthAncestor(n: number): string;
  getParts(): ReadonlyArray<string>;
  absoluteToNormal(absolutePath: string): string;
  normalToAbsolute(normalPath: string): string;
  relativeToNormal(relativePath: string): string;
  getAncestorOfRootIdx(normalPath: string): null | undefined | number;
  joinNormalToRelative(normalPath: string, relativePath: string): {normalPath: string; collapsedSegments: number};
  relative(from: string, to: string): string;
}
