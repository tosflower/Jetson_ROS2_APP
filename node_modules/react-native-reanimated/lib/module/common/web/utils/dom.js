'use strict';

export function removeElementAnimation(element) {
  if (!element.style) {
    return;
  }
  element.style.animationName = '';
  element.style.animationDuration = '';
  element.style.animationDelay = '';
  element.style.animationFillMode = '';
  element.style.animationPlayState = '';
  element.style.animationDirection = '';
  element.style.animationTimingFunction = '';
  element.style.animationIterationCount = '';
}
//# sourceMappingURL=dom.js.map