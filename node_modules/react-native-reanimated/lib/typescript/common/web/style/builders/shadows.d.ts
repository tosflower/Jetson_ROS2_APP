export declare const boxShadowBuilder: {
    add(property: "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius", value: import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal | Readonly<{
        width?: number | undefined;
        height?: number | undefined;
    }> | undefined): void;
    build(): Record<string, string>;
};
export declare const textShadowBuilder: {
    add(property: "textShadowColor" | "textShadowOffset" | "textShadowRadius", value: import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal | Readonly<{
        width: number;
        height: number;
    }> | undefined): void;
    build(): Record<string, string>;
};
//# sourceMappingURL=shadows.d.ts.map