"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createBuildPodfilePropsConfigPlugin: null,
    updateIosBuildPropertiesFromConfig: null,
    updateIosBuildProperty: null,
    withJsEnginePodfileProps: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createBuildPodfilePropsConfigPlugin () {
        return createBuildPodfilePropsConfigPlugin;
    },
    get updateIosBuildPropertiesFromConfig () {
        return updateIosBuildPropertiesFromConfig;
    },
    get updateIosBuildProperty () {
        return updateIosBuildProperty;
    },
    get withJsEnginePodfileProps () {
        return withJsEnginePodfileProps;
    }
});
const _iosplugins = require("../plugins/ios-plugins");
function createBuildPodfilePropsConfigPlugin(configToPropertyRules, name) {
    const withUnknown = (config, sourceConfig)=>(0, _iosplugins.withPodfileProperties)(config, (config)=>{
            config.modResults = updateIosBuildPropertiesFromConfig(sourceConfig ?? config, config.modResults, configToPropertyRules);
            return config;
        });
    if (name) {
        Object.defineProperty(withUnknown, 'name', {
            value: name
        });
    }
    return withUnknown;
}
const withJsEnginePodfileProps = createBuildPodfilePropsConfigPlugin([
    {
        propName: 'expo.jsEngine',
        propValueGetter: (config)=>config.ios?.jsEngine ?? config.jsEngine ?? 'hermes'
    }
], 'withJsEnginePodfileProps');
function updateIosBuildPropertiesFromConfig(config, podfileProperties, configToPropertyRules) {
    for (const configToProperty of configToPropertyRules){
        const value = configToProperty.propValueGetter(config);
        updateIosBuildProperty(podfileProperties, configToProperty.propName, value);
    }
    return podfileProperties;
}
function updateIosBuildProperty(podfileProperties, name, value, options) {
    if (value) {
        podfileProperties[name] = value;
    } else if (options?.removePropWhenValueIsNull) {
        delete podfileProperties[name];
    }
    return podfileProperties;
}

//# sourceMappingURL=BuildProperties.js.map
