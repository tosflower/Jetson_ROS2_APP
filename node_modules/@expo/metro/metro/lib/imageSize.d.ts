/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 * @oncall react_native
 *
 * @lint-ignore-every LICENSELINT
 * This file retains the MIT notice required for the derived parsers below.
 */

/**
 * Image dimension parsing is derived from image-size's format support, reduced
 * to the formats Metro treats as images. See the third-party notice below.
 */

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}
export declare function getImageDimensions(type: string, content: Buffer, filePath: string): Dimensions;