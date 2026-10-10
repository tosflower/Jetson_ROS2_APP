export declare const PATH_COMMAND_LENGTHS: Record<string, number>;
export declare const SEGMENT_PATTERN: RegExp;
export declare const NUMBER_PATTERN: RegExp;
export declare function reflectControlPoint(curX: number, curY: number, oldX: number, oldY: number): [number, number];
export declare function lineToCubic(x1: number, y1: number, x2: number, y2: number): number[];
export declare function quadraticToCubic(curX: number, curY: number, qcx: number, qcy: number, x: number, y: number): [number, number, number, number, number, number];
export declare function arcToCubic(startX: number, startY: number, radiusX: number, radiusY: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, endX: number, endY: number): number[][];
//# sourceMappingURL=path.d.ts.map