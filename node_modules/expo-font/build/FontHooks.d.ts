import type { UseFontHook } from './Font.types';
/**
 * Load a map of fonts at runtime with [`loadAsync`](#loadasyncfontfamilyorfontmap-source). This returns `true` if the fonts are
 * loaded and ready to use. It also returns an error if something went wrong, to use in development.
 *
 * > Note, the fonts are not "reloaded" when you dynamically change the font map.
 *
 * > A `fontFamily` loads once. Declare all of its faces in the same `useFonts` call. A later
 * > call for an already-loaded `fontFamily` adds none of its faces, even if that call lists more.
 *
 * @param map A map of `fontFamily`s to [`FontSource`](#fontsource)s, or an array of
 * [`FontFamilyDefinition`](#fontfamilydefinition)s for loading multiple faces (for example
 * different weights or an italic cut) per family. After loading the font you can use the
 * `fontFamily` name in the `fontFamily` style prop of a `Text` element.
 *
 * @return
 * - __loaded__ (`boolean`) - A boolean to detect if the font for `fontFamily` has finished
 * loading.
 * - __error__ (`Error | null`) - An error encountered when loading the fonts.
 *
 * @example
 * ```tsx
 * const [loaded, error] = useFonts({
 *   'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
 * });
 * ```
 *
 * On web, loading multiple weights or styles of the same family lets the browser select the
 * correct face with the CSS `font-weight` and `font-style` properties:
 * ```tsx
 * const [loaded, error] = useFonts([
 *   {
 *     fontFamily: 'Inter',
 *     fontDefinitions: [
 *       { path: require('./assets/fonts/Inter-Regular.otf'), weight: 400 },
 *       { path: require('./assets/fonts/Inter-Italic.otf'), weight: 400, style: 'italic' },
 *       { path: require('./assets/fonts/Inter-Bold.otf'), weight: 700 },
 *     ],
 *   },
 * ]);
 * ```
 */
export declare const useFonts: UseFontHook;
