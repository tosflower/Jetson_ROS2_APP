'use strict';

import { WorkletsModule } from 'react-native-worklets';
import { IS_JEST, IS_WEB, IS_WINDOW_AVAILABLE, logger } from "../../common/index.js";
import { SensorType } from "../../commonTypes.js";
import { DefaultStaticFeatureFlags } from "../../featureFlags/staticFeatureFlags.js";
import { assertWorkletsVersion } from "../../platform-specific/workletsVersion.js";
export function createJSReanimatedModule() {
  return new JSReanimated();
}
class JSReanimated {
  /**
   * We keep the instance of `WorkletsModule` here to keep correct coupling of
   * the modules and initialization order.
   */
  // eslint-disable-next-line no-unused-private-class-members
  #workletsModule = WorkletsModule;
  nextSensorId = 0;
  sensors = new Map();
  platform = undefined;
  constructor() {
    if (__DEV__) {
      assertWorkletsVersion();
    }
  }
  registerEventHandler(_eventHandler, _eventName, _emitterReactTag) {
    throw new Error('[Reanimated] registerEventHandler is not available in JSReanimated.');
  }
  unregisterEventHandler(_) {
    throw new Error('[Reanimated] unregisterEventHandler is not available in JSReanimated.');
  }
  configureLayoutAnimationBatch() {
    // no-op
  }
  setShouldAnimateExitingForTag() {
    // no-op
  }
  registerSensor(sensorType, interval, _iosReferenceFrame, eventHandler) {
    if (!IS_WINDOW_AVAILABLE) {
      // the window object is unavailable when building the server portion of a site that uses SSG
      // this check is here to ensure that the server build won't fail
      return -1;
    }
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    if (!(this.getSensorName(sensorType) in window)) {
      // https://w3c.github.io/sensors/#secure-context
      logger.warn('Sensor is not available.' + (IS_WEB && location.protocol !== 'https:' ? ' Make sure you use secure origin with `npx expo start --web --https`.' : '') + (this.platform === Platform.WEB_IOS ? ' For iOS web, you will also have to also grant permission in the browser: https://dev.to/li/how-to-requestpermission-for-devicemotion-and-deviceorientation-events-in-ios-13-46g2.' : ''));
      return -1;
    }
    if (this.platform === undefined) {
      this.detectPlatform();
    }
    const sensor = this.initializeSensor(sensorType, interval);
    sensor.addEventListener('reading', this.getSensorCallback(sensor, sensorType, eventHandler));
    sensor.start();
    this.sensors.set(this.nextSensorId, sensor);
    return this.nextSensorId++;
  }
  getSensorCallback = (sensor, sensorType, eventHandler) => {
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
      case SensorType.GRAVITY:
        return () => {
          let {
            x,
            y,
            z
          } = sensor;

          // Web Android sensors have a different coordinate system than iOS
          if (this.platform === Platform.WEB_ANDROID) {
            [x, y, z] = [-x, -y, -z];
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          eventHandler({
            x,
            y,
            z,
            interfaceOrientation: 0
          });
        };
      case SensorType.GYROSCOPE:
      case SensorType.MAGNETIC_FIELD:
        return () => {
          const {
            x,
            y,
            z
          } = sensor;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          eventHandler({
            x,
            y,
            z,
            interfaceOrientation: 0
          });
        };
      case SensorType.ROTATION:
        return () => {
          const [qw, qx] = sensor.quaternion;
          let [,, qy, qz] = sensor.quaternion;

          // Android sensors have a different coordinate system than iOS
          if (this.platform === Platform.WEB_ANDROID) {
            [qy, qz] = [qz, -qy];
          }

          // reference: https://stackoverflow.com/questions/5782658/extracting-yaw-from-a-quaternion
          const yaw = -Math.atan2(2.0 * (qy * qz + qw * qx), qw * qw - qx * qx - qy * qy + qz * qz);
          const pitch = Math.sin(-2.0 * (qx * qz - qw * qy));
          const roll = -Math.atan2(2.0 * (qx * qy + qw * qz), qw * qw + qx * qx - qy * qy - qz * qz);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          eventHandler({
            qw,
            qx,
            qy,
            qz,
            yaw,
            pitch,
            roll,
            interfaceOrientation: 0
          });
        };
    }
  };
  unregisterSensor(id) {
    const sensor = this.sensors.get(id);
    if (sensor !== undefined) {
      sensor.stop();
      this.sensors.delete(id);
    }
  }
  subscribeForKeyboardEvents(_) {
    if (IS_WEB) {
      logger.warn('useAnimatedKeyboard is not available on web yet.');
    } else if (IS_JEST) {
      logger.warn('useAnimatedKeyboard is not available when using Jest.');
    } else {
      logger.warn('useAnimatedKeyboard is not available on this configuration.');
    }
    return -1;
  }
  unsubscribeFromKeyboardEvents(_) {
    // noop
  }
  initializeSensor(sensorType, interval) {
    const config = interval <= 0 ? {
      referenceFrame: 'device'
    } : {
      frequency: 1000 / interval
    };
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return new window.Accelerometer(config);
      case SensorType.GYROSCOPE:
        return new window.Gyroscope(config);
      case SensorType.GRAVITY:
        return new window.GravitySensor(config);
      case SensorType.MAGNETIC_FIELD:
        return new window.Magnetometer(config);
      case SensorType.ROTATION:
        return new window.AbsoluteOrientationSensor(config);
    }
  }
  getSensorName(sensorType) {
    switch (sensorType) {
      case SensorType.ACCELEROMETER:
        return 'Accelerometer';
      case SensorType.GRAVITY:
        return 'GravitySensor';
      case SensorType.GYROSCOPE:
        return 'Gyroscope';
      case SensorType.MAGNETIC_FIELD:
        return 'Magnetometer';
      case SensorType.ROTATION:
        return 'AbsoluteOrientationSensor';
    }
  }
  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent === undefined) {
      this.platform = Platform.UNKNOWN;
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.platform = Platform.WEB_IOS;
    } else if (/android/i.test(userAgent)) {
      this.platform = Platform.WEB_ANDROID;
    } else {
      this.platform = Platform.WEB;
    }
  }
  getViewProp(_viewTag, _propName, _component, _callback) {
    throw new Error('[Reanimated] getViewProp is not available in JSReanimated.');
  }
  getStaticFeatureFlag(name) {
    // In Jest, JSReanimated replaces the native module but lacks native-only
    // methods (e.g. getSettledUpdates) that some flags hit, so they stay off
    // in tests. On web, return the real staticFlags.json values.
    if (IS_JEST) {
      return false;
    }
    return DefaultStaticFeatureFlags[name] ?? false;
  }
  setDynamicFeatureFlag() {
    // noop
  }
  setViewStyle(_viewTag, _style) {
    throw new Error('[Reanimated] setViewStyle is not available in JSReanimated.');
  }
  markNodeAsRemovable(_shadowNodeWrapper) {
    throw new Error('[Reanimated] markNodeAsRemovable is not available in JSReanimated.');
  }
  unmarkNodeAsRemovable(_viewTag) {
    throw new Error('[Reanimated] unmarkNodeAsRemovable is not available in JSReanimated.');
  }
  registerCSSKeyframes(_animationName, _compoundComponentName, _keyframesConfig) {
    throw new Error('[Reanimated] `registerCSSKeyframes` is not available in JSReanimated.');
  }
  unregisterCSSKeyframes(_animationName, _compoundComponentName) {
    throw new Error('[Reanimated] `unregisterCSSKeyframes` is not available in JSReanimated.');
  }
  applyCSSAnimations(_shadowNodeWrapper, _compoundComponentName, _animationUpdates) {
    throw new Error('[Reanimated] `applyCSSAnimations` is not available in JSReanimated.');
  }
  unregisterCSSAnimations(_viewTag) {
    throw new Error('[Reanimated] `unregisterCSSAnimations` is not available in JSReanimated.');
  }
  runCSSTransition(_shadowNodeWrapper, _transitionConfig) {
    throw new Error('[Reanimated] `runCSSTransition` is not available in JSReanimated.');
  }
  unregisterCSSTransition(_viewTag) {
    throw new Error('[Reanimated] `unregisterCSSTransition` is not available in JSReanimated.');
  }
  getSettledUpdates() {
    throw new Error('[Reanimated] `getSettledUpdates` is not available in JSReanimated.');
  }
  registerPseudoStyles() {
    throw new Error('[Reanimated] `registerPseudoStyles` is not available in JSReanimated.');
  }
  unregisterPseudoStyles() {
    throw new Error('[Reanimated] `unregisterPseudoStyles` is not available in JSReanimated.');
  }
}

// Lack of this export breaks TypeScript generation since
// an enum transpiles into JavaScript code.
/** @knipIgnore */
export let Platform = /*#__PURE__*/function (Platform) {
  Platform["WEB_IOS"] = "web iOS";
  Platform["WEB_ANDROID"] = "web Android";
  Platform["WEB"] = "web";
  Platform["UNKNOWN"] = "unknown";
  return Platform;
}({});
//# sourceMappingURL=JSReanimated.js.map