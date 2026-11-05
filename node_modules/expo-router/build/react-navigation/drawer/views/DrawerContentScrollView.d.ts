import * as React from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';
type Props = ScrollViewProps & {
    ref?: React.Ref<React.ComponentRef<typeof ScrollView>>;
    children: React.ReactNode;
};
declare function DrawerContentScrollViewInner({ ref, contentContainerStyle, style, children, ...rest }: Props): React.JSX.Element;
export declare const DrawerContentScrollView: typeof DrawerContentScrollViewInner;
export {};
