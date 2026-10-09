'use strict';

import { Image } from 'react-native';
import { createAnimatedComponent } from "../createAnimatedComponent/index.js";

// Since createAnimatedComponent return type is ComponentClass that has the props of the argument,
// but not things like NativeMethods, etc. we need to add them manually by extending the type.

// is-tree-shakable-suppress
export const AnimatedImage = createAnimatedComponent(Image);
//# sourceMappingURL=Image.js.map