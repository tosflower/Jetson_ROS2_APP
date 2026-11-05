'use strict';

import { WorkletsModule } from '../WorkletsModule/NativeWorklets';
import { createSerializable } from './serializable';
export function createSynchronizable(initialValue, config) {
  const isFixed = !!config?.fixedType;
  if (__DEV__ && isFixed && !(typeof initialValue === 'number' || typeof initialValue === 'boolean')) {
    throw new Error('[Worklets] `fixedType` requires a number or boolean initial value.');
  }
  const synchronizableRef = WorkletsModule.createSynchronizable(isFixed ? initialValue : createSerializable(initialValue), isFixed);
  return globalThis.__synchronizableUnpacker(synchronizableRef, isFixed);
}
//# sourceMappingURL=synchronizable.native.js.map