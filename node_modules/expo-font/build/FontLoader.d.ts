import { Asset } from 'expo-asset';
import { type NativeFontFace } from './ExpoFontLoader';
import type { FontFaceDefinition, FontResource, FontSource } from './Font.types';
export declare function getAssetForSource(source: FontSource): Asset | FontResource;
export declare function loadSingleFontAsync(name: string, input: Asset | FontResource): Promise<void>;
export declare function getNativeFontFaces(fontDefinitions: FontFaceDefinition[]): Pick<NativeFontFace, 'weight' | 'style'>[];
export declare function loadFontFamilyAsync(fontFamily: string, fontDefinitions: FontFaceDefinition[]): Promise<void>;
