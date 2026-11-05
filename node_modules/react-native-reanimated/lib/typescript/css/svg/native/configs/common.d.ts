import type { GestureResponderHandlers } from 'react-native';
import type { AccessibilityProps, ClipProps, ColorProps, CommonFilterProps, CommonMarkerProps, CommonMaskProps, DefinitionProps, FillProps, NativeProps, ResponderProps, StrokeProps, TouchableProps, TransformProps } from 'react-native-svg';
import type { PropsBuilderConfig } from '../../../../common';
type NonAnimatablePropNames = keyof GestureResponderHandlers | keyof TouchableProps | keyof DefinitionProps | keyof NativeProps | keyof AccessibilityProps;
export type SvgStyleBuilderConfig<T> = PropsBuilderConfig<Omit<T, NonAnimatablePropNames>>;
export declare const SVG_COMMON_PROPERTIES_CONFIG: {
    readonly opacity: {
        readonly process: (percentage: import("react-native-svg").NumberProp) => number;
    };
    readonly filter: (boolean | import("../../../../common").ConfigPropertyAlias<CommonFilterProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly mask: (boolean | import("../../../../common").ConfigPropertyAlias<CommonMaskProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly marker: (boolean | import("../../../../common").ConfigPropertyAlias<CommonMarkerProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly markerStart: (boolean | import("../../../../common").ConfigPropertyAlias<CommonMarkerProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly markerMid: (boolean | import("../../../../common").ConfigPropertyAlias<CommonMarkerProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly markerEnd: (boolean | import("../../../../common").ConfigPropertyAlias<CommonMarkerProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly pointerEvents: (boolean | import("../../../../common").ConfigPropertyAlias<Omit<ResponderProps, "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onMoveShouldSetResponderCapture" | "onResponderGrant" | "onResponderMove" | "onResponderReject" | "onResponderRelease" | "onResponderStart" | "onResponderEnd" | "onResponderTerminate" | "onResponderTerminationRequest" | "onStartShouldSetResponderCapture">>) | {
        process: import("../../../../common").ValueProcessor<"none" | "auto" | "box-none" | "box-only", any>;
    };
    readonly translate: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly translateX: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly translateY: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly origin: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly originX: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly originY: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly scale: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly scaleX: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly scaleY: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly skew: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly skewX: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly skewY: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly rotation: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly x: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly y: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberArray, any>;
    };
    readonly transform: (boolean | import("../../../../common").ConfigPropertyAlias<TransformProps>) | {
        process: import("../../../../common").ValueProcessor<string | readonly Readonly<import("node_modules/react-native/types_generated/Libraries/StyleSheet/private/_TransformStyle").MaximumOneOf<import("node_modules/react-native/types_generated/Libraries/StyleSheet/private/_TransformStyle").MergeUnion<{
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
        }>>>[] | import("react-native-svg").ColumnMajorTransformMatrix, any>;
    };
    readonly clipRule: (boolean | import("../../../../common").ConfigPropertyAlias<ClipProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").FillRule, any>;
    };
    readonly clipPath: (boolean | import("../../../../common").ConfigPropertyAlias<ClipProps>) | {
        process: import("../../../../common").ValueProcessor<string, any>;
    };
    readonly stroke: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal, any>;
    };
    readonly strokeWidth: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly strokeOpacity: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly strokeDasharray: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp | readonly import("react-native-svg").NumberProp[], any>;
    };
    readonly strokeDashoffset: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly strokeLinecap: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").Linecap, any>;
    };
    readonly strokeLinejoin: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").Linejoin, any>;
    };
    readonly strokeMiterlimit: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly vectorEffect: (boolean | import("../../../../common").ConfigPropertyAlias<StrokeProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").VectorEffect, any>;
    };
    readonly fill: (boolean | import("../../../../common").ConfigPropertyAlias<FillProps>) | {
        process: import("../../../../common").ValueProcessor<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal, any>;
    };
    readonly fillOpacity: (boolean | import("../../../../common").ConfigPropertyAlias<FillProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").NumberProp, any>;
    };
    readonly fillRule: (boolean | import("../../../../common").ConfigPropertyAlias<FillProps>) | {
        process: import("../../../../common").ValueProcessor<import("react-native-svg").FillRule, any>;
    };
    readonly color: (boolean | import("../../../../common").ConfigPropertyAlias<ColorProps>) | {
        process: import("../../../../common").ValueProcessor<import("node_modules/react-native/types_generated/Libraries/StyleSheet/StyleSheetTypes").____ColorValue_Internal, any>;
    };
};
export {};
//# sourceMappingURL=common.d.ts.map