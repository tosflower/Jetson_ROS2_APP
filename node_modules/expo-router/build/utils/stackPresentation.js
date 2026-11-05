"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isModalPresentation", {
    enumerable: true,
    get: function() {
        return isModalPresentation;
    }
});
const MODAL_PRESENTATIONS = [
    'modal',
    'transparentModal',
    'fullScreenModal',
    'formSheet',
    'pageSheet',
    'containedModal',
    'containedTransparentModal'
];
function isModalPresentation(options) {
    const presentation = options?.presentation;
    if (!presentation) {
        return false;
    }
    return MODAL_PRESENTATIONS.includes(presentation);
}

//# sourceMappingURL=stackPresentation.js.map
