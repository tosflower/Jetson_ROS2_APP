import './expect';
import './mocks';
import type { RenderResult } from '@testing-library/react-native';
import type { ExpoLinkingOptions } from '../getLinkingConfig';
import type { ReactNavigationState } from '../global-state/types';
import type { UnknownOutputParams } from '../types';
import { type MockContextConfig } from './mock-config';
export { type MockContextConfig, getMockConfig, getMockContext } from './mock-config';
declare const rnTestingLibrary: typeof import("@testing-library/react-native");
export type * from '@testing-library/react-native';
export declare const act: typeof import("@testing-library/react-native").act, cleanup: typeof import("@testing-library/react-native").cleanup, fireEvent: typeof import("@testing-library/react-native").fireEvent, waitFor: typeof import("@testing-library/react-native").waitFor, waitForElementToBeRemoved: typeof import("@testing-library/react-native").waitForElementToBeRemoved, within: typeof import("@testing-library/react-native").within, configure: typeof import("@testing-library/react-native").configure, resetToDefaults: typeof import("@testing-library/react-native").resetToDefaults, isHiddenFromAccessibility: typeof import("@testing-library/react-native").isHiddenFromAccessibility, isInaccessible: typeof import("@testing-library/react-native").isHiddenFromAccessibility, getDefaultNormalizer: typeof import("@testing-library/react-native").getDefaultNormalizer, renderHook: typeof import("@testing-library/react-native").renderHook;
export declare let screen: typeof rnTestingLibrary.screen;
export type RenderRouterOptions = Parameters<typeof rnTestingLibrary.render>[1] & {
    initialUrl?: any;
    linking?: Partial<ExpoLinkingOptions>;
};
export type RenderRouterResult = RenderResult & {
    getPathname(): string;
    getPathnameWithParams(): string;
    getSegments(): string[];
    getSearchParams(): UnknownOutputParams;
    getRouterState(): ReactNavigationState | undefined;
};
export declare function renderRouter(context?: MockContextConfig, { initialUrl, linking, ...options }?: RenderRouterOptions): Promise<RenderRouterResult>;
export declare const testRouter: {
    /** Navigate to the provided pathname and assert the pathname */
    navigate(path: string): Promise<void>;
    /** Push the provided pathname and assert the pathname */
    push(path: string): Promise<void>;
    /** Replace with provided pathname and assert the pathname */
    replace(path: string): Promise<void>;
    /** Go back in history and assert the new pathname */
    back(path?: string): Promise<void>;
    /** If there's history that supports invoking the `back` function. */
    canGoBack(): boolean;
    /** Update the current route query params and assert the new pathname */
    setParams(params: Record<string, string>, path?: string): Promise<void>;
    /** Dismiss every screen in the current stack. */
    dismissAll(): Promise<void>;
};
