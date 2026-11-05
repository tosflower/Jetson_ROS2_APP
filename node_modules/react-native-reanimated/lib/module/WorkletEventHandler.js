'use strict';

// In JS implementation (e.g. for web) we don't use Reanimated's
// event emitter, therefore we have to handle here
// the event that came from React Native and convert it.
function jsListener(eventName, handler) {
  return evt => {
    handler({
      ...evt.nativeEvent,
      eventName
    });
  };
}
export class WorkletEventHandler {
  constructor(worklet, eventNames = []) {
    this.worklet = worklet;
    this.eventNames = eventNames;
    this.listeners = {};
    this.setupWebListeners();
  }
  setupWebListeners() {
    this.listeners = {};
    this.eventNames.forEach(eventName => {
      this.listeners[eventName] = jsListener(eventName, this.worklet);
    });
  }
  updateEventHandler(newWorklet, newEvents) {
    // Update worklet and event names
    this.worklet = newWorklet;
    this.eventNames = newEvents;
    this.setupWebListeners();
  }
  registerForEvents(_viewTag, _fallbackEventName) {
    // noop
  }
  unregisterFromEvents(_viewTag) {
    // noop
  }
}
//# sourceMappingURL=WorkletEventHandler.js.map