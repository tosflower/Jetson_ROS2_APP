import type { ExpoFontLoaderModule } from './ExpoFontLoader';
import type { UnloadFontOptions } from './Font';
import type { FontResource } from './Font.types';
export declare function _matchesFontFaceOptions(rule: Pick<CSSFontFaceRule, 'style'>, fontFamilyName: string, options?: UnloadFontOptions): boolean;
export declare function _fontFaceRuleSrcMatches(rule: Pick<CSSFontFaceRule, 'style'>, uri: string | number | undefined): boolean;
declare const ExpoFontLoader: Required<Omit<ExpoFontLoaderModule, 'loadFontFamilyAsync'>>;
declare const _default: typeof ExpoFontLoader;
export default _default;
export declare function _createWebFontTemplate(fontFamily: string, resource: FontResource): string;
