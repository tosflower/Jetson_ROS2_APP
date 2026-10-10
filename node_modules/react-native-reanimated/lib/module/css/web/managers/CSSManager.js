'use strict';

import { filterCSSAndStyleProperties } from "../../utils/index.js";
import { configureWebCSS } from "../domUtils.js";
import CSSAnimationsManager from "./CSSAnimationsManager.js";
import CSSPseudoSelectorsManager from "./CSSPseudoSelectorsManager.js";
import CSSTransitionsManager from "./CSSTransitionsManager.js";
export default class CSSManager {
  constructor(viewInfo, componentDisplayName = '') {
    configureWebCSS();
    const element = viewInfo.DOMElement;
    const svgElementTag = element?.tagName ?? componentDisplayName;
    this.animationsManager = new CSSAnimationsManager(element, svgElementTag);
    this.transitionsManager = new CSSTransitionsManager(element);
    this.pseudoSelectorsManager = new CSSPseudoSelectorsManager(element, svgElementTag);
  }
  update(style) {
    const [animationProperties, transitionProperties, pseudoStylesBySelector, transitionCallbacks] = filterCSSAndStyleProperties(style);
    this.animationsManager.update(animationProperties);
    this.transitionsManager.update(transitionProperties, transitionCallbacks);
    this.pseudoSelectorsManager.update(pseudoStylesBySelector);
  }
  unmountCleanup() {
    this.animationsManager.unmountCleanup();
    this.transitionsManager.unmountCleanup();
    this.pseudoSelectorsManager.unmountCleanup();
  }
}
//# sourceMappingURL=CSSManager.js.map