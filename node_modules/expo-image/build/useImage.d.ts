import type { DependencyList } from 'react';
import type { ImageLoadOptions, ImageRef, ImageSource } from './Image.types';
/**
 * A hook that loads an image from the given source and returns a reference
 * to the native image instance, or `null` until the first image is successfully loaded.
 *
 * It loads a new image every time the `uri` of the provided source changes.
 * To trigger reloads in some other scenarios, you can provide an additional dependency list.
 *
 * On Android, when neither `maxWidth` nor `maxHeight` is provided, large images may be
 * downsampled to fit the platform's bitmap size limit. The returned `ImageRef.width` and
 * `ImageRef.height` reflect the decoded size and may differ from the original dimensions or iOS.
 *
 * > **warning** Avoid using this hook for large images without specifying size constraints,
 * > as it may cause crashes due to excessive memory usage. It is recommended to use either
 * > `maxWidth` or `maxHeight` option to scale down the image appropriately for your use case.
 *
 * @platform android
 * @platform ios
 * @platform web
 *
 * @example
 * ```ts
 * import { useImage, Image } from 'expo-image';
 * import { Text } from 'react-native';
 *
 * export default function MyImage() {
 *   const image = useImage('https://picsum.photos/1000/800', {
 *     maxWidth: 800,
 *     onError(error, retry) {
 *       console.error('Loading failed:', error.message);
 *     }
 *   });
 *
 *   if (!image) {
 *     return <Text>Image is loading...</Text>;
 *   }
 *
 *   return <Image source={image} style={{ width: image.width / 2, height: image.height / 2 }} />;
 * }
 * ```
 */
export declare function useImage(source: ImageSource | string | number, options?: ImageLoadOptions, dependencies?: DependencyList): ImageRef | null;
