import type CSSKeyframesRuleImpl from './CSSKeyframesRuleImpl';
/**
 * This class is responsible for managing the registry of CSS animation
 * keyframes. It keeps track of views that use specific animations and handles
 * native-side registration. Animation keyframes are registered on the native
 * side only when used for the first time and unregistered when removed from the
 * last view that uses them.
 */
declare class CSSKeyframesRegistry {
    private readonly cssTextToNames_;
    private readonly nameToKeyframes_;
    get(nameOrCssText: string): CSSKeyframesRuleImpl<import("../../../hook/commonTypes").DefaultStyle> | undefined;
    add(keyframesRule: CSSKeyframesRuleImpl, viewTag: number, compoundComponentName: string): void;
    remove(animationName: string, viewTag: number, compoundComponentName: string): void;
    clear(): void;
}
declare const cssKeyframesRegistry: CSSKeyframesRegistry;
export default cssKeyframesRegistry;
//# sourceMappingURL=CSSKeyframesRegistry.d.ts.map