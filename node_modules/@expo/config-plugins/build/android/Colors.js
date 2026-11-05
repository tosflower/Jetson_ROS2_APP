"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assignColorValue: null,
    getColorsAsObject: null,
    getObjectAsColorsXml: null,
    getProjectColorsXMLPathAsync: null,
    removeColorItem: null,
    setColorItem: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get assignColorValue () {
        return assignColorValue;
    },
    get getColorsAsObject () {
        return getColorsAsObject;
    },
    get getObjectAsColorsXml () {
        return getObjectAsColorsXml;
    },
    get getProjectColorsXMLPathAsync () {
        return getProjectColorsXMLPathAsync;
    },
    get removeColorItem () {
        return removeColorItem;
    },
    get setColorItem () {
        return setColorItem;
    }
});
const _Paths = require("./Paths");
const _Resources = require("./Resources");
function getProjectColorsXMLPathAsync(projectRoot, { kind } = {}) {
    return (0, _Paths.getResourceXMLPathAsync)(projectRoot, {
        kind,
        name: 'colors'
    });
}
function setColorItem(itemToAdd, colorFileContentsJSON) {
    if (colorFileContentsJSON.resources?.color) {
        const colorNameExists = colorFileContentsJSON.resources.color.filter((e)=>e.$.name === itemToAdd.$.name)[0];
        if (colorNameExists) {
            colorNameExists._ = itemToAdd._;
        } else {
            colorFileContentsJSON.resources.color.push(itemToAdd);
        }
    } else {
        if (!colorFileContentsJSON.resources || typeof colorFileContentsJSON.resources === 'string') {
            //file was empty and JSON is `{resources : ''}`
            colorFileContentsJSON.resources = {};
        }
        colorFileContentsJSON.resources.color = [
            itemToAdd
        ];
    }
    return colorFileContentsJSON;
}
function removeColorItem(named, contents) {
    if (contents.resources?.color) {
        const index = contents.resources.color.findIndex((e)=>e.$.name === named);
        if (index > -1) {
            // replace the previous value
            contents.resources.color.splice(index, 1);
        }
    }
    return contents;
}
function assignColorValue(xml, { value, name }) {
    if (value) {
        return setColorItem((0, _Resources.buildResourceItem)({
            name,
            value
        }), xml);
    }
    return removeColorItem(name, xml);
}
function getColorsAsObject(xml) {
    if (!xml?.resources?.color) {
        return null;
    }
    return (0, _Resources.getResourceItemsAsObject)(xml.resources.color);
}
function getObjectAsColorsXml(obj) {
    return {
        resources: {
            color: (0, _Resources.getObjectAsResourceItems)(obj)
        }
    };
}

//# sourceMappingURL=Colors.js.map
