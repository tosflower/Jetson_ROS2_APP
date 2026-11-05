import type { ReactElement, ComponentProps } from 'react';
import type { ViewProps } from 'react-native';
export type TabListProps = ViewProps & {
    /** Forward props to child component and removes the extra `<View>`. Useful for custom wrappers. */
    asChild?: boolean;
};
/**
 * Wrapper component for `TabTriggers`. `TabTriggers` within the `TabList` define the tabs.
 *
 * The list pads its content by the left and right safe area insets it overlaps, such as the
 * camera rail on iPhone Duo, in addition to its own padding. With `asChild`, the child
 * component is responsible for the safe area.
 *
 * @example
 * ```tsx
 * <Tabs>
 *  <TabSlot />
 *  <TabList>
 *   <TabTrigger name="home" href="/" />
 *  </TabList>
 * </Tabs>
 * ```
 */
export declare function TabList({ asChild, style, ...props }: TabListProps): import("react").JSX.Element;
/**
 * @hidden
 */
export declare function isTabList(child: ReactElement<any>): child is ReactElement<ComponentProps<typeof TabList>>;
