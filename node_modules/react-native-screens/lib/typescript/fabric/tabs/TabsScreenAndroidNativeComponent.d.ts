import type { CodegenTypes as CT, HostComponent, ImageSource, ProcessedColorValue, ViewProps } from 'react-native';
type GenericEmptyEvent = Readonly<{}>;
type TabBarItemLabelVisibilityMode = 'auto' | 'selected' | 'labeled' | 'unlabeled';
export type IconTinting = 'default' | 'tinted' | 'original';
export type ItemStateAppearance = {
    tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
    tabBarItemIconColor?: ProcessedColorValue | null | undefined;
};
export type Appearance = {
    tabBarBackgroundColor?: ProcessedColorValue | null | undefined;
    tabBarItemRippleColor?: ProcessedColorValue | null | undefined;
    tabBarItemLabelVisibilityMode?: CT.WithDefault<TabBarItemLabelVisibilityMode, 'auto'>;
    normal?: ItemStateAppearance | undefined;
    selected?: ItemStateAppearance | undefined;
    focused?: ItemStateAppearance | undefined;
    disabled?: ItemStateAppearance | undefined;
    tabBarItemIconSize?: CT.Float | undefined;
    tabBarItemActiveIndicatorColor?: ProcessedColorValue | null | undefined;
    tabBarItemActiveIndicatorEnabled?: CT.WithDefault<boolean, true>;
    tabBarItemActiveIndicatorWidth?: CT.Float | undefined;
    tabBarItemActiveIndicatorHeight?: CT.Float | undefined;
    tabBarItemTitleFontFamily?: string | undefined;
    tabBarItemTitleSmallLabelFontSize?: CT.Float | undefined;
    tabBarItemTitleLargeLabelFontSize?: CT.Float | undefined;
    tabBarItemTitleFontWeight?: string | undefined;
    tabBarItemTitleFontStyle?: string | undefined;
    tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null | undefined;
    tabBarItemBadgeTextColor?: ProcessedColorValue | null | undefined;
};
export interface NativeProps extends ViewProps {
    onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    screenKey: string;
    preventNativeSelection?: CT.WithDefault<boolean, false>;
    title?: string | undefined | null;
    badgeValue?: string | undefined;
    tabBarItemTestID?: string | undefined;
    tabBarItemAccessibilityLabel?: string | undefined;
    specialEffects?: {
        repeatedTabSelection?: {
            popToRoot?: CT.WithDefault<boolean, true>;
            scrollToTop?: CT.WithDefault<boolean, true>;
        } | undefined;
    } | undefined;
    drawableIconResourceName?: string | undefined;
    imageIconResource?: ImageSource | undefined;
    selectedDrawableIconResourceName?: string | undefined;
    selectedImageIconResource?: ImageSource | undefined;
    iconTinting?: CT.WithDefault<IconTinting, 'default'>;
    selectedIconTinting?: CT.WithDefault<IconTinting, 'default'>;
    standardAppearance?: Appearance | undefined;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=TabsScreenAndroidNativeComponent.d.ts.map