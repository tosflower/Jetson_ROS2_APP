import { Asset } from 'expo-asset';
import type { FontFaceDefinition, FontResource, FontSource } from './Font.types';
export declare function getAssetForSource(source: FontSource): Asset | FontResource;
export declare function loadFontFamilyAsync(fontFamily: string, fontDefinitions: FontFaceDefinition[]): Promise<void>;
export declare function loadSingleFontAsync(name: string, input: Asset | FontResource): Promise<void>;
