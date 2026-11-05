import { type ConfigPlugin } from 'expo/config-plugins';
import type { Font, FontDefinition, FontObject } from './withFonts';
export declare const withFontsAndroid: ConfigPlugin<Font[]>;
/** A definition once the family's `path` has filled in the file it reads. */
export type ResolvedFontDefinition = FontDefinition & {
    path: string;
};
type GroupedFontObject = Record<string, ResolvedFontDefinition[]>;
export declare function groupByFamily(array: FontObject[]): GroupedFontObject;
export declare function assertAndroidCanLoadFonts(fontsByFamily: GroupedFontObject): void;
export declare function assertValidWeights(fontsByFamily: GroupedFontObject): void;
/**
 * Throws when two definitions in the same family claim the same weight and style.
 *
 * Android resolves a family by (weight, style), and `FontFamily.Builder.addFont` rejects a second
 * font carrying a pair the family already holds.
 */
export declare function assertNoConflictingDefinitions(fontsByFamily: GroupedFontObject): void;
export declare function assertValidAxes(fontsByFamily: GroupedFontObject): void;
export declare function warnAboutUnknownAxisTags(fontsByFamily: GroupedFontObject): void;
/**
 * Warns when one file backs both an upright and an italic face while the italic one sets no slant.
 */
export declare function warnAboutUnslantedItalics(fontsByFamily: GroupedFontObject): void;
export declare function getXmlSpecs(fontsDir: string, xmlFontObjects: GroupedFontObject): {
    path: string;
    xml: {
        'font-family': {
            $: {
                'xmlns:app': string;
            };
            font: {
                $: {
                    'app:font': string;
                    'app:fontStyle': "normal" | "italic";
                    'app:fontWeight': string;
                    'app:fontVariationSettings': string;
                };
            }[];
        };
    };
}[];
export declare function generateFontManagerCalls(xmlFontObjects: GroupedFontObject, language: 'java' | 'kt'): string[];
/**
 * A variable font backs one definition per weight, so the same file arrives several times and must
 * only be copied once. Throws when two different files would land on the same one.
 */
export declare function planFontCopies(resolvedFonts: string[], fontsDir: string, filenameProcessor: (filenameWithExt: string) => string): Map<string, string>;
export {};
