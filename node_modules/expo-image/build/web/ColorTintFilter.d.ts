export declare function getTintColorStyle(tintId: string, tintColor?: string | null): {
    filter?: undefined;
} | {
    filter: string;
};
type TintColorFilterProps = {
    id: string;
    tintColor?: string | null;
};
export default function TintColorFilter({ id, tintColor }: TintColorFilterProps): import("react").JSX.Element | null;
export {};
