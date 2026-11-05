import type { PropsWithChildren } from 'react';
export declare function LinkPreviewContextProvider({ children }: PropsWithChildren): import("react").JSX.Element;
export declare const useLinkPreviewContext: () => {
    isStackAnimationDisabled: boolean;
    openPreviewKey: string | undefined;
    getOpenPreviewKey: () => string | undefined;
    setOpenPreviewKey: (openPreviewKey: string | undefined) => void;
};
