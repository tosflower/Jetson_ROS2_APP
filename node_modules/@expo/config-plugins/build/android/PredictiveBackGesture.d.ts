import type { ExpoConfig } from '@expo/config-types';
import type { ConfigPlugin } from '../Plugin.types';
import type { AndroidManifest } from './Manifest';
export declare const withPredictiveBackGesture: ConfigPlugin;
export declare function setPredictiveBackGesture(config: Pick<ExpoConfig, 'android'>, androidManifest: AndroidManifest): AndroidManifest;
export declare function getPredictiveBackGestureValue(config: Pick<ExpoConfig, 'android'>): "false" | "true";
