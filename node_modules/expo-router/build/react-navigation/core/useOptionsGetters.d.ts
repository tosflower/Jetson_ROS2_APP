type Options = {
    key?: string;
    options?: object | undefined;
};
export declare function useOptionsGetters({ key, options }: Options): {
    addOptionsGetter: (key: string, getter: () => object | undefined | null) => () => void;
    getCurrentOptions: () => object | null | undefined;
};
export {};
