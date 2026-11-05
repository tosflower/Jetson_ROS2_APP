/**
 * Component-ID encoding for RSC routing.
 *
 * Component IDs identify a slot in the rendered React tree (a layout or a page).
 * Both client and server mint the same IDs from the same inputs so they can agree
 * about caching, skip lists, and component resolution.
 *
 * Convention: take the URL pathname segments, then suffix with `'layout'` or
 * `'page'`. `mintComponentId('/posts/[id]', 'page') === 'posts/[id]/page'`.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getComponentIds: null,
    mintComponentId: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getComponentIds () {
        return getComponentIds;
    },
    get mintComponentId () {
        return mintComponentId;
    }
});
function mintComponentId(path, kind) {
    return [
        ...path.split('/').filter(Boolean),
        kind
    ].join('/');
}
function getComponentIds(path) {
    const segments = path.split('/').filter(Boolean);
    const layouts = [];
    for(let i = 0; i <= segments.length; i++){
        layouts.push(mintComponentId(segments.slice(0, i).join('/'), 'layout'));
    }
    return {
        layouts,
        page: mintComponentId(segments.join('/'), 'page')
    };
}

//# sourceMappingURL=idMinting.js.map
