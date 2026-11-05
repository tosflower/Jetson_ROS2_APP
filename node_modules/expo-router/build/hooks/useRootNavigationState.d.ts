import type { NavigationState } from '../react-navigation/native';
/**
 * Returns the navigation state of the root navigator — the top-level navigator that
 * contains the current screen. Its shape follows the `NavigationState` type of the
 * installed `expo-router` version.
 *
 * @example
 * ```tsx
 * import { useRootNavigationState } from 'expo-router';
 *
 * export default function Route() {
 *  const { routes } = useRootNavigationState();
 *
 *  return <Text>{routes[0].name}</Text>;
 * }
 * ```
 *
 * @returns The current `NavigationState` of the root navigator.
 */
export declare function useRootNavigationState(): NavigationState;
