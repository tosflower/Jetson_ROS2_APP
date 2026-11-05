/* eslint-disable n/no-missing-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

export function installSynchronizableUnpacker() {
  'worklet';
  'no-worklet-closure';

  // TODO: Add cache for synchronizables.
  const serializer = globalThis.__RUNTIME_KIND === 1 || globalThis._WORKLETS_BUNDLE_MODE_ENABLED ? require('./serializable').createSerializable : value => globalThis.__serializer(value);
  function synchronizableUnpacker(synchronizableRef, isFixed) {
    const synchronizable = synchronizableRef;
    const proxy = globalThis.__workletsModuleProxy;
    synchronizable.__synchronizableRef = true;
    synchronizable.getDirty = () => {
      return proxy.synchronizableGetDirty(synchronizable);
    };
    synchronizable.getBlocking = () => {
      return proxy.synchronizableGetBlocking(synchronizable);
    };
    const setBlockingValue = newValue => {
      proxy.synchronizableSetBlocking(synchronizable, isFixed ? newValue : serializer(newValue));
    };
    synchronizable.setBlocking = valueOrFunction => {
      if (typeof valueOrFunction === 'function') {
        const func = valueOrFunction;
        synchronizable.lock();
        if (__DEV__) {
          try {
            const prev = synchronizable.getBlocking();
            setBlockingValue(func(prev));
          } finally {
            synchronizable.unlock();
          }
        } else {
          const prev = synchronizable.getBlocking();
          setBlockingValue(func(prev));
          synchronizable.unlock();
        }
      } else {
        setBlockingValue(valueOrFunction);
      }
    };
    synchronizable.lock = () => {
      proxy.synchronizableLock(synchronizable);
    };
    synchronizable.unlock = () => {
      proxy.synchronizableUnlock(synchronizable);
    };
    if (isFixed) {
      synchronizable.setDirty = value => {
        proxy.synchronizableSetDirty(synchronizable, value);
      };
    }
    return synchronizable;
  }
  globalThis.__synchronizableUnpacker = synchronizableUnpacker;
}
//# sourceMappingURL=synchronizableUnpacker.native.js.map