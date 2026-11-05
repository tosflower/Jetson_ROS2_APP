'use strict';

import { BounceIn, BounceInData, BounceOut, BounceOutData } from "./animation/Bounce.js";
import { FadeIn, FadeInData, FadeOut, FadeOutData } from "./animation/Fade.js";
import { FlipIn, FlipInData, FlipOut, FlipOutData } from "./animation/Flip.js";
import { LightSpeedIn, LightSpeedInData, LightSpeedOut, LightSpeedOutData } from "./animation/Lightspeed.js";
import { Pinwheel, PinwheelData } from "./animation/Pinwheel.js";
import { RollIn, RollInData, RollOut, RollOutData } from "./animation/Roll.js";
import { RotateIn, RotateInData, RotateOut, RotateOutData } from "./animation/Rotate.js";
import { SlideIn, SlideInData, SlideOut, SlideOutData } from "./animation/Slide.js";
import { StretchIn, StretchInData, StretchOut, StretchOutData } from "./animation/Stretch.js";
import { ZoomIn, ZoomInData, ZoomOut, ZoomOutData } from "./animation/Zoom.js";
export let TransitionType = /*#__PURE__*/function (TransitionType) {
  TransitionType[TransitionType["LINEAR"] = 0] = "LINEAR";
  TransitionType[TransitionType["SEQUENCED"] = 1] = "SEQUENCED";
  TransitionType[TransitionType["FADING"] = 2] = "FADING";
  TransitionType[TransitionType["JUMPING"] = 3] = "JUMPING";
  TransitionType[TransitionType["CURVED"] = 4] = "CURVED";
  TransitionType[TransitionType["ENTRY_EXIT"] = 5] = "ENTRY_EXIT";
  return TransitionType;
}({});
export const AnimationsData = {
  ...FadeInData,
  ...FadeOutData,
  ...BounceInData,
  ...BounceOutData,
  ...FlipInData,
  ...FlipOutData,
  ...StretchInData,
  ...StretchOutData,
  ...ZoomInData,
  ...ZoomOutData,
  ...SlideInData,
  ...SlideOutData,
  ...LightSpeedInData,
  ...LightSpeedOutData,
  ...PinwheelData,
  ...RotateInData,
  ...RotateOutData,
  ...RollInData,
  ...RollOutData
};
export const Animations = {
  ...FadeIn,
  ...FadeOut,
  ...BounceIn,
  ...BounceOut,
  ...FlipIn,
  ...FlipOut,
  ...StretchIn,
  ...StretchOut,
  ...ZoomIn,
  ...ZoomOut,
  ...SlideIn,
  ...SlideOut,
  ...LightSpeedIn,
  ...LightSpeedOut,
  ...Pinwheel,
  ...RotateIn,
  ...RotateOut,
  ...RollIn,
  ...RollOut
};
//# sourceMappingURL=config.js.map