import type { UnknownRecord } from '../../common';
import type { CSSAnimationCallbacks, CSSStyle, CSSTransitionCallbacks, CSSTransitionProperties, ExistingCSSAnimationProperties } from '../types';
export type PseudoStylesBySelector = Record<string, {
    selectorStyle: UnknownRecord;
    defaultStyle: UnknownRecord;
}>;
export declare function filterCSSAndStyleProperties<S extends object>(style: CSSStyle<S>): [
    ExistingCSSAnimationProperties | null,
    CSSTransitionProperties | null,
    PseudoStylesBySelector | null,
    UnknownRecord
];
/** Splits the callback props into their animation and transition halves. */
export declare function splitCSSCallbacks(props: Readonly<UnknownRecord>): [CSSAnimationCallbacks | null, CSSTransitionCallbacks | null];
//# sourceMappingURL=props.d.ts.map