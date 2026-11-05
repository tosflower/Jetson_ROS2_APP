export declare class MetroServerError extends Error {
    code: string;
    url: string;
    constructor(errorObject: {
        message: string;
    } & Record<string, any>, url: string);
}
