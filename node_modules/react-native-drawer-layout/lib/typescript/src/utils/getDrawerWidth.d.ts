import { type StyleProp, type ViewStyle } from 'react-native';
export declare function getDrawerWidthNative({ layout, drawerStyle, }: {
    layout: {
        width: number;
        height: number;
    };
    drawerStyle?: StyleProp<ViewStyle>;
}): number;
export declare function getDrawerWidthWeb({ drawerStyle, }: {
    drawerStyle?: StyleProp<ViewStyle>;
}): string;
//# sourceMappingURL=getDrawerWidth.d.ts.map