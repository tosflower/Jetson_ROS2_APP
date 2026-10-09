import type { UnknownRecord } from '../common';
import type { DependencyList, ReanimatedEvent } from './commonTypes';
interface GeneralHandler<TEvent extends object, TContext extends UnknownRecord> {
    (event: ReanimatedEvent<TEvent>, context: TContext): void;
}
type GeneralHandlers<TEvent extends object, TContext extends UnknownRecord> = Record<string, GeneralHandler<TEvent, TContext> | undefined>;
export interface UseHandlerContext<TContext extends UnknownRecord> {
    context: TContext;
    doDependenciesDiffer: boolean;
}
/**
 * Lets you find out whether the event handler dependencies have changed.
 *
 * @param handlers - An object of event handlers.
 * @param dependencies - An optional array of dependencies.
 * @returns An object containing a boolean indicating whether the dependencies
 *   have changed.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/useHandler
 */
export declare function useHandler<Event extends object, Context extends UnknownRecord>(handlers: GeneralHandlers<Event, Context>, dependencies?: DependencyList): UseHandlerContext<Context>;
export {};
//# sourceMappingURL=useHandler.d.ts.map