/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

import type { DebuggerShellPreparationResult } from "../";
declare function prepareDebuggerShellFromDotSlashFile(
  filePath: string,
): Promise<DebuggerShellPreparationResult>;
export { prepareDebuggerShellFromDotSlashFile };
