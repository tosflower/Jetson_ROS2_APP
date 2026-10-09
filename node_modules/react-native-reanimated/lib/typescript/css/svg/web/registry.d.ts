import type { UnknownRecord } from '../../../common';
import { type PropsBuilderConfig, type WebPropsBuilder } from '../../../common/web';
export declare function getWebSvgPropsBuilder(componentName: string): WebPropsBuilder | null;
export declare function registerWebSvgPropsBuilder<P extends UnknownRecord>(componentName: string | RegExp | ((name: string) => boolean), config: PropsBuilderConfig<P>): void;
//# sourceMappingURL=registry.d.ts.map