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
        process?: import("../../../../common/web").ValueProcessor<NonNullable<string | readonly (({
            perspective: import("react-native").AnimatableNumericValue;
        } & {
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotate: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            rotateZ: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scale: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scaleX: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            scaleY: import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            translateX: `${number}%` | import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            translateY: `${number}%` | import("react-native").AnimatableNumericValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            skewX?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            skewX: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewY?: undefined;
            matrix?: undefined;
        }) | ({
            skewY: import("react-native").AnimatableStringValue;
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            matrix?: undefined;
        }) | ({
            matrix: import("react-native").AnimatableNumericValue[];
        } & {
            perspective?: undefined;
            rotate?: undefined;
            rotateX?: undefined;
            rotateY?: undefined;
            rotateZ?: undefined;
            scale?: undefined;
            scaleX?: undefined;
            scaleY?: undefined;
            translateX?: undefined;
            translateY?: undefined;
            skewX?: undefined;
            skewY?: undefined;
        }))[] | import("react-native-svg").ColumnMajorTransformMatrix | undefined>> | undefined;
        name?: string;
    }) | undefined;
    readonly stroke?: (import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, Record<string, string>> | import("../../../../common/web").RuleBuilder<import("../../../../common").UnknownRecord, unknown> | (string | boolean | {
        as: keyof StrokeProps;
    }) | {
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native").ColorValue | undefined>> | undefined;
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
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native").ColorValue | undefined>> | undefined;
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
        process?: import("../../../../common/web").ValueProcessor<NonNullable<import("react-native").ColorValue | undefined>> | undefined;
        name?: string;
    }) | undefined;
};
export {};
//# sourceMappingURL=common.d.ts.map