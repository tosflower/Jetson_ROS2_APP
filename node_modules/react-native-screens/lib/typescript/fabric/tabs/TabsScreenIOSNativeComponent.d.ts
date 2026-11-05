import type { CodegenTypes as CT, HostComponent, ImageSource, ProcessedColorValue, ViewProps } from 'react-native';
import { UnsafeMixed } from '../codegenUtils';
type GenericEmptyEvent = Readonly<{}>;
export type IconType = 'image' | 'sfSymbol' | 'xcasset';
export type IconImageRenderingMode = 'default' | 'template' | 'original';
export type IconSymbolRenderingMode = 'default' | 'monochrome' | 'original';
export type ItemStateAppearance = {
    tabBarItemTitleFontFamily?: string | undefined;
    tabBarItemTitleFontSize?: CT.Float | undefined;
    tabBarItemTitleFontWeight?: string | undefined;
    tabBarItemTitleFontStyle?: string | undefined;
    tabBarItemTitleFontColor?: ProcessedColorValue | null | undefined;
    tabBarItemTitlePositionAdjustment?: {
        horizontal?: CT.Float | undefined;
        vertical?: CT.Float | undefined;
    } | undefined;
    tabBarItemIconColor?: ProcessedColorValue | null | undefined;
    tabBarItemBadgeBackgroundColor?: ProcessedColorValue | null | undefined;
};
export type ItemAppearance = {
    normal?: ItemStateAppearance | undefined;
    selected?: ItemStateAppearance | undefined;
    focused?: ItemStateAppearance | undefined;
    disabled?: ItemStateAppearance | undefined;
};
export type Appearance = {
    stacked?: ItemAppearance | undefined;
    inline?: ItemAppearance | undefined;
    compactInline?: ItemAppearance | undefined;
    tabBarBackgroundColor?: ProcessedColorValue | null | undefined;
    tabBarShadowColor?: ProcessedColorValue | null | undefined;
    tabBarBlurEffect?: CT.WithDefault<BlurEffect, 'systemDefault'>;
};
type BlurEffect = 'none' | 'systemDefault' | 'extraLight' | 'light' | 'dark' | 'regular' | 'prominent' | 'systemUltraThinMaterial' | 'systemThinMaterial' | 'systemMaterial' | 'systemThickMaterial' | 'systemChromeMaterial' | 'systemUltraThinMaterialLight' | 'systemThinMaterialLight' | 'systemMaterialLight' | 'systemThickMaterialLight' | 'systemChromeMaterialLight' | 'systemUltraThinMaterialDark' | 'systemThinMaterialDark' | 'systemMaterialDark' | 'systemThickMaterialDark' | 'systemChromeMaterialDark';
type Orientation = 'inherit' | 'all' | 'allButUpsideDown' | 'portrait' | 'portraitUp' | 'portraitDown' | 'landscape' | 'landscapeLeft' | 'landscapeRight';
type SystemItem = 'none' | 'bookmarks' | 'contacts' | 'downloads' | 'favorites' | 'featured' | 'history' | 'more' | 'mostRecent' | 'mostViewed' | 'recents' | 'search' | 'topRated';
type TabRole = 'none' | 'search';
type UserInterfaceStyle = 'unspecified' | 'light' | 'dark';
export interface NativeProps extends ViewProps {
    onWillAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onDidAppear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onWillDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    onDidDisappear?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
    screenKey: string;
    preventNativeSelection?: CT.WithDefault<boolean, false>;
    title?: string | undefined | null;
    badgeValue?: string | undefined;
    orientation?: CT.WithDefault<Orientation, 'inherit'>;
    tabBarItemTestID?: string | undefined;
    tabBarItemAccessibilityLabel?: string | undefined;
    specialEffects?: {
        repeatedTabSelection?: {
            popToRoot?: CT.WithDefault<boolean, true>;
            scrollToTop?: CT.WithDefault<boolean, true>;
        } | undefined;
    } | undefined;
    isTitleUndefined?: CT.WithDefault<boolean, true>;
    systemItem?: CT.WithDefault<SystemItem, 'none'>;
    tabRole?: CT.WithDefault<TabRole, 'none'>;
    automaticallyActivatesSearch?: CT.WithDefault<boolean, false>;
    standardAppearance?: UnsafeMixed<Appearance> | undefined;
    scrollEdgeAppearance?: UnsafeMixed<Appearance> | undefined;
    iconType?: CT.WithDefault<IconType, 'sfSymbol'>;
    iconImageRenderingMode?: CT.WithDefault<IconImageRenderingMode, 'default'>;
    iconSymbolRenderingMode?: CT.WithDefault<IconSymbolRenderingMode, 'default'>;
    iconImageSource?: ImageSource | undefined;
    iconResourceName?: string | undefined;
    selectedIconImageRenderingMode?: CT.WithDefault<IconImageRenderingMode, 'default'>;
    selectedIconSymbolRenderingMode?: CT.WithDefault<IconSymbolRenderingMode, 'default'>;
    selectedIconImageSource?: ImageSource | undefined;
    selectedIconResourceName?: string | undefined;
    overrideScrollViewContentInsetAdjustmentBehavior?: CT.WithDefault<boolean, true>;
    userInterfaceStyle?: CT.WithDefault<UserInterfaceStyle, 'unspecified'>;
}
declare const _default: HostComponent<NativeProps>;
export default _default;
//# sourceMappingURL=TabsScreenIOSNativeComponent.d.ts.map