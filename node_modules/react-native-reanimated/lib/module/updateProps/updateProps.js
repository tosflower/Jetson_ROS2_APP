'use strict';

import { processBoxShadowWeb, processFilterWeb } from "../common/web/index.js";
import { _updatePropsJS } from "../ReanimatedModule/js-reanimated/index.js";
const updateProps = (viewDescriptors, updates, isAnimatedProps) => {
  'worklet';

  viewDescriptors.value?.forEach(viewDescriptor => {
    const component = viewDescriptor.tag;
    if ('boxShadow' in updates) {
      updates.boxShadow = processBoxShadowWeb(updates.boxShadow);
    }
    if ('filter' in updates) {
      updates.filter = processFilterWeb(updates.filter);
    }
    _updatePropsJS(updates, component, isAnimatedProps);
  });
};
export default updateProps;
//# sourceMappingURL=updateProps.js.map