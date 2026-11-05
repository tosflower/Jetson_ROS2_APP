import type { NativeStackViewEmit, NativeStackViewState } from '../../react-navigation/native-stack';
/**
 * Manages the preview transition state for link previews.
 *
 * Tracks when a preloaded screen is transitioning on the native side (after
 * the preview is committed) but before React Navigation state is updated.
 * During this window, the hook synthesizes state to keep native and JS state
 * in sync.
 */
export declare function usePreviewTransition(state: NativeStackViewState, originalEmit: NativeStackViewEmit, isPreloaded: (key: string) => boolean): {
    computedState: NativeStackViewState;
    emit: NativeStackViewEmit;
    isPreloaded: (key: string) => boolean;
};
