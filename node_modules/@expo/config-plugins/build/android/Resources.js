"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    buildResourceGroup: null,
    buildResourceItem: null,
    ensureDefaultResourceXML: null,
    findResourceGroup: null,
    getObjectAsResourceGroup: null,
    getObjectAsResourceItems: null,
    getResourceItemsAsObject: null,
    readResourcesXMLAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get buildResourceGroup () {
        return buildResourceGroup;
    },
    get buildResourceItem () {
        return buildResourceItem;
    },
    get ensureDefaultResourceXML () {
        return ensureDefaultResourceXML;
    },
    get findResourceGroup () {
        return findResourceGroup;
    },
    get getObjectAsResourceGroup () {
        return getObjectAsResourceGroup;
    },
    get getObjectAsResourceItems () {
        return getObjectAsResourceItems;
    },
    get getResourceItemsAsObject () {
        return getResourceItemsAsObject;
    },
    get readResourcesXMLAsync () {
        return readResourcesXMLAsync;
    }
});
const _XML = require("../utils/XML");
const fallbackResourceString = `<?xml version="1.0" encoding="utf-8"?><resources></resources>`;
async function readResourcesXMLAsync({ path, fallback = fallbackResourceString }) {
    const xml = await (0, _XML.readXMLAsync)({
        path,
        fallback
    });
    // Ensure the type is expected.
    if (!xml.resources) {
        xml.resources = {};
    }
    return xml;
}
function ensureDefaultResourceXML(xml) {
    if (!xml) {
        xml = {
            resources: {}
        };
    }
    if (!xml.resources) {
        xml.resources = {};
    }
    return xml;
}
function buildResourceItem({ name, value, targetApi, translatable }) {
    const item = {
        $: {
            name
        },
        _: value
    };
    if (targetApi) {
        item.$['tools:targetApi'] = targetApi;
    }
    if (translatable !== undefined) {
        item.$['translatable'] = String(translatable);
    }
    return item;
}
function buildResourceGroup(parent) {
    return {
        $: {
            name: parent.name,
            parent: parent.parent
        },
        item: parent.items ?? []
    };
}
function findResourceGroup(xml, group) {
    const app = xml?.filter?.(({ $: head })=>{
        let matches = head.name === group.name;
        if (group.parent != null && matches) {
            matches = head.parent === group.parent;
        }
        return matches;
    })?.[0];
    return app ?? null;
}
function getResourceItemsAsObject(xml) {
    return xml.reduce((prev, curr)=>({
            ...prev,
            [curr.$.name]: curr._
        }), {});
}
function getObjectAsResourceItems(obj) {
    return Object.entries(obj).map(([name, value])=>({
            $: {
                name
            },
            _: value
        }));
}
function getObjectAsResourceGroup(group) {
    return {
        $: {
            name: group.name,
            parent: group.parent
        },
        item: getObjectAsResourceItems(group.item)
    };
}

//# sourceMappingURL=Resources.js.map
