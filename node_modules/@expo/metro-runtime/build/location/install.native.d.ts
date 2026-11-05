import 'react-native/setup-env';
import 'whatwg-fetch';
import 'expo';
declare const polyfillSymbol: unique symbol;
export declare function wrapFetchWithWindowLocation(fetch: Function & {
    [polyfillSymbol]?: boolean;
}): Function & {
    [polyfillSymbol]?: boolean;
};
export {};
