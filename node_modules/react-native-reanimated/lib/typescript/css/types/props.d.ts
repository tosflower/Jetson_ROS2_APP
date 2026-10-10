import type { StyleProp } from 'react-native';
import type { UnknownRecord } from '../../common';
import type { DefaultStyle } from '../../hook/commonTypes';
import type { CSSAnimationProperties } from './animation';
import type { StyleWithPseudoValues } from './pseudo';
import type { CSSTransitionCallbacks, CSSTransitionProperties } from './transition';
type PickStyleProps<P> = Pick<P, {
    [K in keyof P]-?: K extends `${string}Style` | 'style' ? K : never;
}[keyof P]>;
type CSSConfigProps<TStyle extends object = UnknownRecord> = Partial<CSSAnimationProperties<TStyle> & CSSTransitionProperties<TStyle> & CSSTransitionCallbacks>;
export type CSSStyle<TStyle = DefaultStyle> = TStyle extends object ? StyleWithPseudoValues<Omit<TStyle, keyof CSSConfigProps>> & CSSConfigProps<TStyle> : never;
type StylePropsWithCSS<P extends object> = {
    [K in keyof PickStyleProps<P>]: P[K] extends StyleProp<infer U> ? U extends object ? StyleProp<CSSStyle<U>> : never : never;
};
type RestProps<P extends object> = {
    [K in keyof Omit<P, keyof PickStyleProps<P>>]: P[K];
};
export type PropsWithCSS<P extends object> = StylePropsWithCSS<P> & RestProps<P>;
export {};
//# sourceMappingURL=props.d.ts.map