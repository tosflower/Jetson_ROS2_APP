"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assignStylesValue: null,
    getAppThemeGroup: null,
    getAppThemeLightNoActionBarGroup: null,
    getProjectStylesXMLPathAsync: null,
    getStyleParent: null,
    getStylesGroupAsObject: null,
    getStylesItem: null,
    readStylesXMLAsync: null,
    removeStylesItem: null,
    setStylesItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assignStylesValue () {
        return assignStylesValue;
    },
    get getAppThemeGroup () {
        return getAppThemeGroup;
    },
    get getAppThemeLightNoActionBarGroup () {
        return getAppThemeLightNoActionBarGroup;
    },
    get getProjectStylesXMLPathAsync () {
        return getProjectStylesXMLPathAsync;
    },
    get getStyleParent () {
        return getStyleParent;
    },
    get getStylesGroupAsObject () {
        return getStylesGroupAsObject;
    },
    get getStylesItem () {
        return getStylesItem;
    },
    get readStylesXMLAsync () {
        return readStylesXMLAsync;
    },
    get removeStylesItem () {
        return removeStylesItem;
    },
    get setStylesItem () {
        return setStylesItem;
    }
});
const _Paths = require("./Paths");
const _Resources = require("./Resources");
// Adds support for `tools:x`
const fallbackResourceString = `<?xml version="1.0" encoding="utf-8"?><resources xmlns:tools="http://schemas.android.com/tools"></resources>`;
async function readStylesXMLAsync({ path, fallback = fallbackResourceString }) {
    return (0, _Resources.readResourcesXMLAsync)({
        path,
        fallback
    });
}
async function getProjectStylesXMLPathAsync(projectRoot, { kind } = {}) {
    return (0, _Paths.getResourceXMLPathAsync)(projectRoot, {
        kind,
        name: 'styles'
    });
}
function ensureDefaultStyleResourceXML(xml) {
    xml = (0, _Resources.ensureDefaultResourceXML)(xml);
    if (!Array.isArray(xml?.resources?.style)) {
        xml.resources.style = [];
    }
    return xml;
}
function getStyleParent(xml, group) {
    return (0, _Resources.findResourceGroup)(xml.resources.style, group);
}
function getStylesItem({ name, xml, parent }) {
    xml = ensureDefaultStyleResourceXML(xml);
    const appTheme = getStyleParent(xml, parent);
    if (!appTheme) {
        return null;
    }
    if (appTheme.item) {
        const existingItem = appTheme.item.filter(({ $: head })=>head.name === name)[0];
        // Don't want to 2 of the same item, so if one exists, we overwrite it
        if (existingItem) {
            return existingItem;
        }
    }
    return null;
}
function setStylesItem({ item, xml, parent }) {
    xml = ensureDefaultStyleResourceXML(xml);
    let appTheme = getStyleParent(xml, parent);
    if (!appTheme) {
        appTheme = (0, _Resources.buildResourceGroup)({
            parent: 'Theme.AppCompat.Light.NoActionBar',
            ...parent
        });
        xml.resources.style.push(appTheme);
    }
    if (appTheme.item) {
        const existingItem = appTheme.item.filter(({ $: head })=>head.name === item.$.name)[0];
        // Don't want to 2 of the same item, so if one exists, we overwrite it
        if (existingItem) {
            existingItem._ = item._;
            existingItem.$ = item.$;
        } else {
            appTheme.item.push(item);
        }
    } else {
        appTheme.item = [
            item
        ];
    }
    return xml;
}
function removeStylesItem({ name, xml, parent }) {
    xml = ensureDefaultStyleResourceXML(xml);
    const appTheme = getStyleParent(xml, parent);
    if (appTheme?.item) {
        const index = appTheme.item.findIndex(({ $: head })=>head.name === name);
        if (index > -1) {
            appTheme.item.splice(index, 1);
        }
    }
    return xml;
}
function getAppThemeLightNoActionBarGroup() {
    return {
        name: 'AppTheme',
        parent: 'Theme.AppCompat.Light.NoActionBar'
    };
}
function getAppThemeGroup() {
    return {
        name: 'AppTheme'
    };
}
function assignStylesValue(xml, { add, value, targetApi, name, parent }) {
    if (add) {
        return setStylesItem({
            xml,
            parent,
            item: (0, _Resources.buildResourceItem)({
                name,
                targetApi,
                value
            })
        });
    }
    return removeStylesItem({
        xml,
        parent,
        name
    });
}
function getStylesGroupAsObject(xml, group) {
    const xmlGroup = getStyleParent(xml, group);
    return xmlGroup?.item ? (0, _Resources.getResourceItemsAsObject)(xmlGroup.item) : null;
}

//# sourceMappingURL=Styles.js.map
