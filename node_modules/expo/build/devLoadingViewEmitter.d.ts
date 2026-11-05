type Listener = (data?: any) => void;
export declare function emit(event: string, data?: any): void;
export declare function addListener(event: string, listener: Listener): {
    remove: () => void;
};
export {};
