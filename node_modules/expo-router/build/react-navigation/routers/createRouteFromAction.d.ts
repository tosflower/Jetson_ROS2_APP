type Options = {
    key: string;
    action: {
        payload: {
            name: string;
            params?: object;
        };
    };
};
export declare function createRouteFromAction({ action, key }: Options): {
    key: string;
    name: string;
    params: object | undefined;
};
export {};
