import type { GestureResponderHandlers } from 'react-native';
import type { AccessibilityProps, DefinitionProps, FillProps, NativeProps, StrokeProps, TouchableProps, TransformProps } from 'react-native-svg';
import { type PropsBuilderConfig } from '../../../../common/web';
type NonAnimatablePropNames = keyof GestureResponderHandlers | keyof TouchableProps | keyof DefinitionProps | keyof NativeProps | keyof AccessibilityProps;
export type SvgStyleBuilderConfig<T> = PropsBuilderConfig<Omit<T, NonAnimatablePropNames>>;
export declare const SVG_COMMON_WEB_PROPERTIES_CONFIG: {
    readonly opacity: true;
    readonly pointerEvents?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: "pointerEvents";
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<"none" | "auto" | "box-none" | "box-only" | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly translate?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly translateX?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly translateY?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly origin?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly originX?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly originY?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly scale?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly scaleX?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly scaleY?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly skew?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly skewX?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly skewY?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly rotation?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly x?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly y?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberArray | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly transform?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof TransformProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<string | readonly Readonly<import("node_modules/react-native/types_generated/Libraries/StyleSheet/private/_TransformStyle").MaximumOneOf<import("node_modules/react-native/types_generated/Libraries/StyleSheet/private/_TransformStyle").MergeUnion<{
            readonly perspective: number | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly rotate: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly rotateX: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly rotateY: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly rotateZ: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly scale: number | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly scaleX: number | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly scaleY: number | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly translateX: number | string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly translateY: number | string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly translate: [number | string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node, number | string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node] | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly skewX: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly skewY: string | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        } | {
            readonly matrix: ReadonlyArray<number | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node> | import("node_modules/react-native/types_generated/Libraries/Animated/AnimatedExports").Node;
        }>>>[] | import("react-native-svg").ColumnMajorTransformMatrix | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly stroke?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeWidth?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeOpacity?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeDasharray?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | readonly import("react-native-svg").NumberProp[] | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeDashoffset?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeLinecap?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").Linecap | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeLinejoin?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").Linejoin | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly strokeMiterlimit?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly vectorEffect?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").VectorEffect | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly fill?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof FillProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly fillOpacity?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof FillProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").NumberProp | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly fillRule?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof FillProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native-svg").FillRule | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly color?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: "color";
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal | undefined>> | undefined;
        name?: string;
    }) | undefined;
};
export {};
//# sourceMappingURL=common.d.ts.map