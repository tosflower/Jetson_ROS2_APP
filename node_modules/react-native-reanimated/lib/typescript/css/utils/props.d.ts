import type { UnknownRecord } from '../../common';
import type { CSSStyle, CSSTransitionCallbacks, CSSTransitionProperties, ExistingCSSAnimationProperties } from '../types';
export type PseudoStylesBySelector = Record<string, {
    selectorStyle: UnknownRecord;
    defaultStyle: UnknownRecord;
}>;
export declare function filterCSSAndStyleProperties<S extends object>(style: CSSStyle<S>): [
    ExistingCSSAnimationProperties | null,
    CSSTransitionProperties | null,
    PseudoStylesBySelector | null,
    CSSTransitionCallbacks | null,
    UnknownRecord
];
//# sourceMappingURL=props.d.ts.map