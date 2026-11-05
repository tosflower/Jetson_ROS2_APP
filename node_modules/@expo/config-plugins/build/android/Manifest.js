"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    addMetaDataItemToMainApplication: null,
    addUsesLibraryItemToMainApplication: null,
    ensureToolsAvailable: null,
    findMetaDataItem: null,
    findUsesLibraryItem: null,
    getMainActivity: null,
    getMainActivityOrThrow: null,
    getMainApplication: null,
    getMainApplicationMetaDataValue: null,
    getMainApplicationOrThrow: null,
    getRunnableActivity: null,
    prefixAndroidKeys: null,
    readAndroidManifestAsync: null,
    removeMetaDataItemFromMainApplication: null,
    removeUsesLibraryItemFromMainApplication: null,
    writeAndroidManifestAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get addMetaDataItemToMainApplication () {
        return addMetaDataItemToMainApplication;
    },
    get addUsesLibraryItemToMainApplication () {
        return addUsesLibraryItemToMainApplication;
    },
    get ensureToolsAvailable () {
        return ensureToolsAvailable;
    },
    get findMetaDataItem () {
        return findMetaDataItem;
    },
    get findUsesLibraryItem () {
        return findUsesLibraryItem;
    },
    get getMainActivity () {
        return getMainActivity;
    },
    get getMainActivityOrThrow () {
        return getMainActivityOrThrow;
    },
    get getMainApplication () {
        return getMainApplication;
    },
    get getMainApplicationMetaDataValue () {
        return getMainApplicationMetaDataValue;
    },
    get getMainApplicationOrThrow () {
        return getMainApplicationOrThrow;
    },
    get getRunnableActivity () {
        return getRunnableActivity;
    },
    get prefixAndroidKeys () {
        return prefixAndroidKeys;
    },
    get readAndroidManifestAsync () {
        return readAndroidManifestAsync;
    },
    get removeMetaDataItemFromMainApplication () {
        return removeMetaDataItemFromMainApplication;
    },
    get removeUsesLibraryItemFromMainApplication () {
        return removeUsesLibraryItemFromMainApplication;
    },
    get writeAndroidManifestAsync () {
        return writeAndroidManifestAsync;
    }
});
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
const _XML = /*#__PURE__*/ _interop_require_wildcard(require("../utils/XML"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function writeAndroidManifestAsync(manifestPath, androidManifest) {
    const manifestXml = _XML.format(androidManifest);
    await _fs().default.promises.mkdir(_path().default.dirname(manifestPath), {
        recursive: true
    });
    await _fs().default.promises.writeFile(manifestPath, manifestXml);
}
async function readAndroidManifestAsync(manifestPath) {
    const xml = await _XML.readXMLAsync({
        path: manifestPath
    });
    if (!isManifest(xml)) {
        throw new Error('Invalid manifest found at: ' + manifestPath);
    }
    return xml;
}
function isManifest(xml) {
    // TODO: Maybe more validation
    return !!xml.manifest;
}
function getMainApplication(androidManifest) {
    return androidManifest?.manifest?.application?.filter((e)=>e?.$?.['android:name'].endsWith('.MainApplication'))[0] ?? null;
}
function getMainApplicationOrThrow(androidManifest) {
    const mainApplication = getMainApplication(androidManifest);
    (0, _assert().default)(mainApplication, 'AndroidManifest.xml is missing the required MainApplication element');
    return mainApplication;
}
function getMainActivityOrThrow(androidManifest) {
    const mainActivity = getMainActivity(androidManifest);
    (0, _assert().default)(mainActivity, 'AndroidManifest.xml is missing the required MainActivity element');
    return mainActivity;
}
function getRunnableActivity(androidManifest) {
    const firstApplication = androidManifest?.manifest?.application?.[0] ?? getMainApplication(androidManifest);
    if (!firstApplication) {
        return null;
    }
    // Get enabled activities
    const enabledActivities = firstApplication.activity?.filter?.((e)=>e.$['android:enabled'] !== 'false' && e.$['android:enabled'] !== false);
    if (!enabledActivities) {
        return null;
    }
    const isIntentFilterRunnable = (intentFilter)=>{
        return !!intentFilter.action?.some((action)=>action.$['android:name'] === 'android.intent.action.MAIN') && !!intentFilter.category?.some((category)=>category.$['android:name'] === 'android.intent.category.LAUNCHER');
    };
    // Get the activity that has a runnable intent-filter
    for (const activity of enabledActivities){
        if (Array.isArray(activity['intent-filter'])) {
            for (const intentFilter of activity['intent-filter']){
                if (isIntentFilterRunnable(intentFilter)) {
                    return activity;
                }
            }
        }
    }
    const enabledActivityNames = enabledActivities.map((e)=>e.$['android:name']);
    // If no runnable activity is found, check for matching activity-alias that may be runnable
    const aliases = (firstApplication['activity-alias'] ?? []).filter(// https://developer.android.com/guide/topics/manifest/activity-alias-element
    (e)=>e.$['android:enabled'] !== 'false' && enabledActivityNames.includes(e.$['android:targetActivity']));
    if (aliases.length) {
        for (const alias of aliases){
            if (Array.isArray(alias['intent-filter'])) {
                for (const intentFilter of alias['intent-filter']){
                    if (isIntentFilterRunnable(intentFilter)) {
                        const matchingActivity = enabledActivities.find((e)=>e.$['android:name'] === alias.$['android:targetActivity']);
                        if (matchingActivity) {
                            return matchingActivity;
                        }
                    }
                }
            }
        }
    }
    return null;
}
function getMainActivity(androidManifest) {
    const mainActivity = androidManifest?.manifest?.application?.[0]?.activity?.filter?.((e)=>e.$['android:name'] === '.MainActivity');
    return mainActivity?.[0] ?? null;
}
function addMetaDataItemToMainApplication(mainApplication, itemName, itemValue, itemType = 'value') {
    let existingMetaDataItem;
    const newItem = {
        $: prefixAndroidKeys({
            name: itemName,
            [itemType]: itemValue
        })
    };
    if (mainApplication['meta-data']) {
        existingMetaDataItem = mainApplication['meta-data'].filter((e)=>e.$['android:name'] === itemName);
        if (existingMetaDataItem[0] != null) {
            existingMetaDataItem[0].$[`android:${itemType}`] = itemValue;
        } else {
            mainApplication['meta-data'].push(newItem);
        }
    } else {
        mainApplication['meta-data'] = [
            newItem
        ];
    }
    return mainApplication;
}
function removeMetaDataItemFromMainApplication(mainApplication, itemName) {
    const index = findMetaDataItem(mainApplication, itemName);
    if (mainApplication?.['meta-data'] && index > -1) {
        mainApplication['meta-data'].splice(index, 1);
    }
    return mainApplication;
}
function findApplicationSubItem(mainApplication, category, itemName) {
    const parent = mainApplication[category];
    if (Array.isArray(parent)) {
        const index = parent.findIndex((e)=>e.$['android:name'] === itemName);
        return index;
    }
    return -1;
}
function findMetaDataItem(mainApplication, itemName) {
    return findApplicationSubItem(mainApplication, 'meta-data', itemName);
}
function findUsesLibraryItem(mainApplication, itemName) {
    return findApplicationSubItem(mainApplication, 'uses-library', itemName);
}
function getMainApplicationMetaDataValue(androidManifest, name) {
    const mainApplication = getMainApplication(androidManifest);
    if (mainApplication?.hasOwnProperty('meta-data')) {
        const item = mainApplication?.['meta-data']?.find((e)=>e.$['android:name'] === name);
        return item?.$['android:value'] ?? null;
    }
    return null;
}
function addUsesLibraryItemToMainApplication(mainApplication, item) {
    let existingMetaDataItem;
    const newItem = {
        $: prefixAndroidKeys(item)
    };
    if (mainApplication['uses-library']) {
        existingMetaDataItem = mainApplication['uses-library'].filter((e)=>e.$['android:name'] === item.name);
        if (existingMetaDataItem[0] != null) {
            existingMetaDataItem[0].$ = newItem.$;
        } else {
            mainApplication['uses-library'].push(newItem);
        }
    } else {
        mainApplication['uses-library'] = [
            newItem
        ];
    }
    return mainApplication;
}
function removeUsesLibraryItemFromMainApplication(mainApplication, itemName) {
    const index = findUsesLibraryItem(mainApplication, itemName);
    if (mainApplication?.['uses-library'] && index > -1) {
        mainApplication['uses-library'].splice(index, 1);
    }
    return mainApplication;
}
function prefixAndroidKeys(head) {
    // prefix all keys with `android:`
    return Object.entries(head).reduce((prev, [key, curr])=>({
            ...prev,
            [`android:${key}`]: curr
        }), {});
}
function ensureToolsAvailable(manifest) {
    return ensureManifestHasNamespace(manifest, {
        namespace: 'xmlns:tools',
        url: 'http://schemas.android.com/tools'
    });
}
/**
 * Ensure a particular namespace is available in the manifest.
 *
 * @param manifest `AndroidManifest.xml`
 * @returns manifest with the provided namespace available
 */ function ensureManifestHasNamespace(manifest, { namespace, url }) {
    if (manifest?.manifest?.$?.[namespace]) {
        return manifest;
    }
    manifest.manifest.$[namespace] = url;
    return manifest;
}

//# sourceMappingURL=Manifest.js.map
