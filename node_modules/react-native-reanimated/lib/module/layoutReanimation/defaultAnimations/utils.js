'use strict';

export function resolveTransformSlot(entry, index, values) {
  'worklet';

  const [key, defaultValue] = Object.entries(entry)[0];
  const value = values?.[key] ?? values?.transform?.[index]?.[key] ?? defaultValue;
  return {
    key: key,
    value
  };
}
export function resolveTransformValue(entry, index, values) {
  'worklet';

  return resolveTransformSlot(entry, index, values).value;
}
export function pickTransformValues(defaults, values) {
  'worklet';

  return defaults.map((entry, index) => {
    const {
      key,
      value
    } = resolveTransformSlot(entry, index, values);
    return {
      [key]: value
    };
  });
}
export function animateTransformToValues(defaults, values, [animation, config], delayFunction, delay) {
  'worklet';

  return defaults.map((entry, index) => {
    const {
      key,
      value
    } = resolveTransformSlot(entry, index, values);
    return {
      [key]: delayFunction(delay, animation(value, config))
    };
  });
}
//# sourceMappingURL=utils.js.map