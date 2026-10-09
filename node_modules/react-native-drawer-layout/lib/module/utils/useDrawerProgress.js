"use strict";

import * as React from 'react';
import { DrawerProgressContext } from "./DrawerProgressContext.js";
export function useDrawerProgress() {
  const progress = React.useContext(DrawerProgressContext);
  if (progress === undefined) {
    throw new Error("Couldn't find a drawer. Is your component inside a drawer?");
  }
  return progress;
}
//# sourceMappingURL=useDrawerProgress.js.map