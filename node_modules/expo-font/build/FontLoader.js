import { Asset } from 'expo-asset';
import { CodedError } from 'expo-modules-core';
import ExpoFontLoader from './ExpoFontLoader';
import { normalizeStyle, normalizeWeight, resolveFaceStyle, resolveFaceWeight } from './fontFaceValidation';
export function getAssetForSource(source) {
    if (source instanceof Asset) {
        return source;
    }
    if (typeof source === 'string') {
        return Asset.fromURI(source);
    } else if (typeof source === 'number') {
        return Asset.fromModule(source);
    } else if (typeof source === 'object' && typeof source.uri !== 'undefined') {
        return getAssetForSource(source.uri);
    }
    return source;
}
async function downloadFontAssetAsync(name, input) {
    const asset = input;
    if (!asset.downloadAsync) {
        throw new CodedError(`ERR_FONT_SOURCE`, '`loadSingleFontAsync` expected resource of type `Asset` from expo-asset on native');
    }
    await asset.downloadAsync();
    if (!asset.downloaded) {
        throw new CodedError(`ERR_DOWNLOAD`, `Failed to download asset for font "${name}"`);
    }
    return asset;
}
export async function loadSingleFontAsync(name, input) {
    const asset = await downloadFontAssetAsync(name, input);
    await ExpoFontLoader.loadAsync(name, asset.localUri);
}
export function getNativeFontFaces(fontDefinitions) {
    return fontDefinitions.map((face)=>({
            weight: normalizeWeight(resolveFaceWeight(face)),
            style: normalizeStyle(resolveFaceStyle(face))
        }));
}
export async function loadFontFamilyAsync(fontFamily, fontDefinitions) {
    const normalizedFaces = getNativeFontFaces(fontDefinitions);
    const assets = fontDefinitions.map((face)=>getAssetForSource(face.path));
    await Promise.all(assets.map((asset)=>downloadFontAssetAsync(fontFamily, asset)));
    const faces = assets.map((asset, index)=>{
        // `normalizedFaces` has one entry per `fontDefinitions`/`assets` entry, in the same order.
        const { weight, style } = normalizedFaces[index];
        const face = {
            localUri: asset.localUri
        };
        if (weight !== undefined) {
            face.weight = weight;
        }
        if (style !== undefined) {
            face.style = style;
        }
        return face;
    });
    await ExpoFontLoader.loadFontFamilyAsync(fontFamily, faces);
}

//# sourceMappingURL=FontLoader.js.map
