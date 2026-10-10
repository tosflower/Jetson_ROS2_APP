"use strict";

import * as React from 'react';
class FakeSharedValue {
  _listeners = new Map();
  constructor(value) {
    this._value = value;
  }
  addListener(id, listener) {
    this._listeners.set(id, listener);
  }
  removeListener(id) {
    this._listeners.delete(id);
  }
  modify(modifier) {
    this.value = modifier !== undefined ? modifier(this.value) : this.value;
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value;
  }
  set value(value) {
    this._value = value;
    for (const listener of this._listeners.values()) {
      listener(value);
    }
  }
  get value() {
    return this._value;
  }
  _isReanimatedSharedValue = true;
}

/**
 * Compatibility layer for `useDrawerProgress` with `react-native-reanimated`
 */
export function useFakeSharedValue(value) {
  const sharedValue = React.useRef(null);
  if (sharedValue.current === null) {
    sharedValue.current = new FakeSharedValue(value);
  }
  return sharedValue.current;
}
//# sourceMappingURL=useFakeSharedValue.js.map