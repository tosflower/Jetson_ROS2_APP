import type { DrawerNavigationState, DrawerStatus, ParamListBase } from '../../native';
/**
 * Returns the drawer's current status.
 *
 * @param defaultStatus Status returned when the state has no drawer history entry.
 * @deprecated Use `useDrawerStatus` instead.
 */
export declare function getDrawerStatusFromState(state: DrawerNavigationState<ParamListBase>, defaultStatus: DrawerStatus): DrawerStatus;
