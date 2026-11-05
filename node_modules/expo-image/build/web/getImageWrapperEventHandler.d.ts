import type { SyntheticEvent } from 'react';
import type { ImageSource } from '../Image.types';
import type { ImageWrapperEvents } from './ImageWrapper.types';
export declare function getImageWrapperEventHandler(events: ImageWrapperEvents | undefined, source: ImageSource): {
    onLoad: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
    onTransitionEnd: () => void | undefined;
    onError: () => void;
};
