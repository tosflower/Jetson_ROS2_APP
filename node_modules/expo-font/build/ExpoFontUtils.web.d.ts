import { NativeModule } from 'expo-modules-core';
import type { RenderToImageOptions } from './FontUtils.types';
declare class ExpoFontUtils extends NativeModule {
    renderToImageAsync(glyphs: string, options?: RenderToImageOptions): Promise<string>;
}
declare const _default: ExpoFontUtils;
export default _default;
