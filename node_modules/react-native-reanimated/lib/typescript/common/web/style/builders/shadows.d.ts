export declare const boxShadowBuilder: {
    add(property: "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius", value: import("react-native").ColorValue | import("react-native").AnimatableNumericValue | Readonly<{
        width: number;
        height: number;
    }> | undefined): void;
    build(): Record<string, string>;
};
export declare const textShadowBuilder: {
    add(property: "textShadowColor" | "textShadowOffset" | "textShadowRadius", value: number | import("react-native").ColorValue | {
        width: number;
        height: number;
    } | undefined): void;
    build(): Record<string, string>;
};
//# sourceMappingURL=shadows.d.ts.map