import { type ReactNode } from 'react';
export interface SplitViewColumnProps {
    children?: React.ReactNode;
}
export declare function SplitViewColumn(props: SplitViewColumnProps): import("react").JSX.Element;
/**
 * Split.Column must see a Split.Stack as its direct child, and the native split screen must see its header config
 * as a direct subview. Only the other children are wrapped in a SafeAreaProvider. The result is an array, because
 * Split.Column does not look into fragments.
 */
export declare function getSplitColumnChildren(children: ReactNode): (string | number | bigint | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react").JSX.Element)[];
/**
 * @platform iOS 26+
 */
export declare function SplitViewInspector(props: SplitViewColumnProps): import("react").JSX.Element;
