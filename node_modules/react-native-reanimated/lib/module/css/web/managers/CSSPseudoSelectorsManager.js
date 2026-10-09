'use strict';

import { logger } from "../../../common/index.js";
import { webPropsBuilder } from "../../../common/web/index.js";
import { ANIMATION_NAME_PREFIX, NATIVE_PSEUDO_SELECTORS, NATIVE_PSEUDO_SELECTORS_PRIORITY } from "../../constants/index.js";
import { getWebSvgPropsBuilder } from "../../svg/web/index.js";
import { deepEqual } from "../../utils/index.js";
import { insertPseudoSelectorCSS, removePseudoSelectorCSS } from "../domUtils.js";
let pseudoSelectorCounter = 0;
const VIEW_ATTRIBUTE = `data-${ANIMATION_NAME_PREFIX}rps`;
const ACTIVE_MARKER_ATTRIBUTE = `data-${ANIMATION_NAME_PREFIX}rps-active`;

// Known selectors first (in cascade-priority order), then any arbitrary ones the
// web layer passes through unchanged. Order matters: later rules win on overlap.
function orderSelectors(pseudoStylesBySelector) {
  const known = NATIVE_PSEUDO_SELECTORS_PRIORITY.filter(sel => sel in pseudoStylesBySelector);
  const unknown = Object.keys(pseudoStylesBySelector).filter(sel => !NATIVE_PSEUDO_SELECTORS.has(sel));
  return [...known, ...unknown];
}
const SELECTOR_INJECTION_PATTERN = /[{};,]/;
function buildSelectorRule(viewId, selector, pseudoStylesBySelector, propsBuilder) {
  if (SELECTOR_INJECTION_PATTERN.test(selector)) {
    if (__DEV__) {
      logger.warn(`Ignoring unsupported pseudo-selector "${selector}".`);
    }
    return null;
  }

  // !important is required so the pseudo styles override the element's inline
  // styles (where the default values live).
  const declarations = propsBuilder.build(pseudoStylesBySelector[selector].selectorStyle, {
    important: true,
    includeUnprocessed: true
  });
  if (!declarations) {
    return null;
  }
  const base = `[${VIEW_ATTRIBUTE}="${viewId}"]`;
  if (selector === ':active-deepest') {
    return `${base}:active:not(:has([${ACTIVE_MARKER_ATTRIBUTE}="true"]:active)) { ${declarations} }`;
  }
  return `${base}${selector} { ${declarations} }`;
}
function buildRules(viewId, pseudoStylesBySelector, propsBuilder) {
  return orderSelectors(pseudoStylesBySelector).map(selector => buildSelectorRule(viewId, selector, pseudoStylesBySelector, propsBuilder)).filter(rule => rule !== null);
}
export default class CSSPseudoSelectorsManager {
  viewId = null;
  prevPseudoStylesBySelector = null;
  constructor(element, svgElementTag = '') {
    this.element = element;
    this.svgElementTag = svgElementTag;
  }
  update(pseudoStylesBySelector) {
    if (deepEqual(pseudoStylesBySelector, this.prevPseudoStylesBySelector)) {
      return;
    }
    this.prevPseudoStylesBySelector = pseudoStylesBySelector;
    if (!pseudoStylesBySelector) {
      this.detach();
      return;
    }
    const propsBuilder = getWebSvgPropsBuilder(this.svgElementTag) ?? webPropsBuilder;
    const viewId = this.ensureViewId();
    this.syncActiveMarker(pseudoStylesBySelector);
    insertPseudoSelectorCSS(viewId, buildRules(viewId, pseudoStylesBySelector, propsBuilder));
  }
  unmountCleanup() {
    this.detach();
  }
  ensureViewId() {
    if (this.viewId === null) {
      this.viewId = String(pseudoSelectorCounter++);
      this.element.setAttribute(VIEW_ATTRIBUTE, this.viewId);
    }
    return this.viewId;
  }
  syncActiveMarker(pseudoStylesBySelector) {
    // The marker is set for both :active and :active-deepest registrants, so
    // an ancestor's :active-deepest yields to a pressed descendant that has
    // either of them (matches the iOS arbitration in REAPseudoSelectorObserver).
    const hasAnyActive = ':active' in pseudoStylesBySelector || ':active-deepest' in pseudoStylesBySelector;
    if (hasAnyActive) {
      this.element.setAttribute(ACTIVE_MARKER_ATTRIBUTE, 'true');
    } else {
      this.element.removeAttribute(ACTIVE_MARKER_ATTRIBUTE);
    }
  }
  detach() {
    if (this.viewId !== null) {
      this.element.removeAttribute(VIEW_ATTRIBUTE);
      this.element.removeAttribute(ACTIVE_MARKER_ATTRIBUTE);
      removePseudoSelectorCSS(this.viewId);
      this.viewId = null;
    }
  }
}
//# sourceMappingURL=CSSPseudoSelectorsManager.js.map