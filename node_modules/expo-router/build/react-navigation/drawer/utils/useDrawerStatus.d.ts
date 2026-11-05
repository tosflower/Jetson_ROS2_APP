import type { DrawerStatus } from '../../native';
/**
 * Hook to detect the drawer's status in a parent navigator.
 * Returns 'open' if the drawer is open, 'closed' if the drawer is closed.
 */
export declare function useDrawerStatus(): DrawerStatus;
