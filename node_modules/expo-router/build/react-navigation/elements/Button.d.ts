import type { Href } from '../../types';
import { type Props as PlatformPressableProps } from './PlatformPressable';
type ButtonBaseProps = Omit<PlatformPressableProps, 'children'> & {
    variant?: 'plain' | 'tinted' | 'filled';
    color?: string;
    children: string | string[];
};
type ButtonProps = Omit<ButtonBaseProps, 'href'> & {
    href?: Href;
};
export declare function Button({ href, ...rest }: ButtonProps): import("react").JSX.Element;
export {};
