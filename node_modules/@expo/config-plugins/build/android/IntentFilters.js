"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getIntentFilters: null,
    setAndroidIntentFilters: null,
    withAndroidIntentFilters: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get default () {
        return renderIntentFilters;
    },
    get getIntentFilters () {
        return getIntentFilters;
    },
    get setAndroidIntentFilters () {
        return setAndroidIntentFilters;
    },
    get withAndroidIntentFilters () {
        return withAndroidIntentFilters;
    }
});
const _androidplugins = require("../plugins/android-plugins");
const _Manifest = require("./Manifest");
const GENERATED_TAG = 'data-generated';
const withAndroidIntentFilters = (0, _androidplugins.createAndroidManifestPlugin)(setAndroidIntentFilters, 'withAndroidIntentFilters');
function getIntentFilters(config) {
    return config.android?.intentFilters ?? [];
}
function setAndroidIntentFilters(config, androidManifest) {
    // Always ensure old tags are removed.
    const mainActivity = (0, _Manifest.getMainActivityOrThrow)(androidManifest);
    // Remove all generated tags from previous runs...
    if (mainActivity['intent-filter']?.length) {
        mainActivity['intent-filter'] = mainActivity['intent-filter'].filter((value)=>value.$?.[GENERATED_TAG] !== 'true');
    }
    const intentFilters = getIntentFilters(config);
    if (!intentFilters.length) {
        return androidManifest;
    }
    mainActivity['intent-filter'] = mainActivity['intent-filter']?.concat(renderIntentFilters(intentFilters));
    return androidManifest;
}
function renderIntentFilters(intentFilters) {
    return intentFilters.map((intentFilter)=>{
        // <intent-filter>
        return {
            $: {
                'android:autoVerify': intentFilter.autoVerify ? 'true' : undefined,
                // Add a custom "generated" tag that we can query later to remove.
                [GENERATED_TAG]: 'true'
            },
            action: [
                // <action android:name="android.intent.action.VIEW"/>
                {
                    $: {
                        'android:name': `android.intent.action.${intentFilter.action}`
                    }
                }
            ],
            data: renderIntentFilterData(intentFilter.data),
            category: renderIntentFilterCategory(intentFilter.category)
        };
    });
}
/** Like `<data android:scheme="exp"/>` */ function renderIntentFilterData(data) {
    return (Array.isArray(data) ? data : [
        data
    ]).filter(Boolean).map((datum)=>({
            $: Object.entries(datum ?? {}).reduce((prev, [key, value])=>({
                    ...prev,
                    [`android:${key}`]: value
                }), {})
        }));
}
/** Like `<category android:name="android.intent.category.DEFAULT"/>` */ function renderIntentFilterCategory(category) {
    return (Array.isArray(category) ? category : [
        category
    ]).filter(Boolean).map((cat)=>({
            $: {
                'android:name': `android.intent.category.${cat}`
            }
        }));
}

//# sourceMappingURL=IntentFilters.js.map
