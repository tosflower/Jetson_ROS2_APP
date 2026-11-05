import type { NativeSyntheticEvent } from 'react-native';
import type { EventPayload, IWorkletEventHandler, ReanimatedEvent } from './hook/commonTypes';
type JSEvent<Event extends object> = NativeSyntheticEvent<EventPayload<Event>>;
export declare class WorkletEventHandler<Event extends object> implements IWorkletEventHandler<Event> {
    eventNames: string[];
    listeners: Record<string, (event: ReanimatedEvent<ReanimatedEvent<Event>>) => void> | Record<string, (event: JSEvent<Event>) => void>;
    worklet: (event: ReanimatedEvent<Event>) => void;
    constructor(worklet: (event: ReanimatedEvent<Event>) => void, eventNames?: string[]);
    setupWebListeners(): void;
    updateEventHandler(newWorklet: (event: ReanimatedEvent<Event>) => void, newEvents: string[]): void;
    registerForEvents(_viewTag: number, _fallbackEventName?: string): void;
    unregisterFromEvents(_viewTag: number): void;
}
export {};
//# sourceMappingURL=WorkletEventHandler.d.ts.map