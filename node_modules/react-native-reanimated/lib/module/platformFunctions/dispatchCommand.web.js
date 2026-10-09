'use strict';

import { logger } from "../common/index.js";
function dispatchCommandWeb(_animatedRef, _commandName, _args = []) {
  logger.warn('dispatchCommand() is not supported on web.');
}
export const dispatchCommand = dispatchCommandWeb;
//# sourceMappingURL=dispatchCommand.web.js.map