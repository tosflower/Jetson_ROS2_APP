import { type NavigatorArgs } from 'standard-navigation';
import { type EventEmitter } from '../react-navigation/core';
import type { StandardNavigatorEventMapBase } from './types';
export declare function useStandardEmitter<NavigatorEventMap extends StandardNavigatorEventMapBase>(navigation: EventEmitter<NavigatorEventMap>): NavigatorArgs<Record<string, never>, NavigatorEventMap>['emitter'];
