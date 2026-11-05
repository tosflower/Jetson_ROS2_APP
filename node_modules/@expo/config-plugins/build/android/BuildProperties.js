"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createBuildGradlePropsConfigPlugin: null,
    updateAndroidBuildPropertiesFromConfig: null,
    updateAndroidBuildProperty: null,
    withJsEngineGradleProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createBuildGradlePropsConfigPlugin () {
        return createBuildGradlePropsConfigPlugin;
    },
    get updateAndroidBuildPropertiesFromConfig () {
        return updateAndroidBuildPropertiesFromConfig;
    },
    get updateAndroidBuildProperty () {
        return updateAndroidBuildProperty;
    },
    get withJsEngineGradleProps () {
        return withJsEngineGradleProps;
    }
});
const _androidplugins = require("../plugins/android-plugins");
function createBuildGradlePropsConfigPlugin(configToPropertyRules, name) {
    const withUnknown = (config, sourceConfig)=>(0, _androidplugins.withGradleProperties)(config, (config)=>{
            config.modResults = updateAndroidBuildPropertiesFromConfig(sourceConfig ?? config, config.modResults, configToPropertyRules);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
const withJsEngineGradleProps = createBuildGradlePropsConfigPlugin([
    {
        propName: 'hermesEnabled',
        propValueGetter: (config)=>((config.android?.jsEngine ?? config.jsEngine ?? 'hermes') === 'hermes').toString()
    }
], 'withJsEngineGradleProps');
function updateAndroidBuildPropertiesFromConfig(config, gradleProperties, configToPropertyRules) {
    for (const configToProperty of configToPropertyRules){
        const value = configToProperty.propValueGetter(config);
        updateAndroidBuildProperty(gradleProperties, configToProperty.propName, value);
    }
    return gradleProperties;
}
function updateAndroidBuildProperty(gradleProperties, name, value, options) {
    const oldPropIndex = gradleProperties.findIndex((prop)=>prop.type === 'property' && prop.key === name);
    const oldProp = oldPropIndex >= 0 ? gradleProperties[oldPropIndex] : null;
    if (value) {
        // found the matched value, add or merge new property
        const newProp = {
            type: 'property',
            key: name,
            value
        };
        if (oldProp && oldProp.type === 'property') {
            try {
                const prevValue = JSON.parse(oldProp.value);
                const newValue = JSON.parse(value);
                if (Array.isArray(prevValue) && Array.isArray(newValue)) {
                    const prevArrayWithStringifiedValues = prevValue.map((v)=>JSON.stringify(v));
                    const newArrayWithStringifiedValues = newValue.map((v)=>JSON.stringify(v));
                    const mergedValues = [
                        ...new Set([
                            ...prevArrayWithStringifiedValues,
                            ...newArrayWithStringifiedValues
                        ])
                    ].map((v)=>JSON.parse(v));
                    oldProp.value = JSON.stringify(mergedValues);
                    return gradleProperties;
                }
            } catch  {}
            oldProp.value = value;
            return gradleProperties;
        }
        gradleProperties.push(newProp);
        return gradleProperties;
    }
    if (options?.removePropWhenValueIsNull && oldPropIndex >= 0) {
        gradleProperties.splice(oldPropIndex, 1);
        return gradleProperties;
    }
    return gradleProperties;
}

//# sourceMappingURL=BuildProperties.js.map
