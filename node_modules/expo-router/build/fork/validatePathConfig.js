"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "validatePathConfig", {
    enumerable: true,
    get: function() {
        return validatePathConfig;
    }
});
const formatToList = (items)=>Object.entries(items).map(([key, value])=>`- ${key} (${value})`).join('\n');
const expoOptions = new Set([
    'preserveDynamicRoutes',
    'preserveGroups',
    'shouldEncodeURISegment'
]);
function validatePathConfig(config, root = true) {
    const validation = {
        path: 'string',
        initialRouteName: 'string',
        screens: 'object',
        ...root ? null : {
            _route: 'object',
            exact: 'boolean',
            stringify: 'object',
            parse: 'object'
        }
    };
    if (typeof config !== 'object' || config === null) {
        throw new Error(`Expected the configuration to be an object, but got ${JSON.stringify(config)}.`);
    }
    const validationErrors = Object.fromEntries(Object.keys(config).filter((key)=>!root || !expoOptions.has(key)).map((key)=>{
        if (key in validation) {
            const type = validation[key];
            // @ts-expect-error: we know the key exists
            const value = config[key];
            if (value !== undefined) {
                if (typeof value !== type) {
                    return [
                        key,
                        `expected '${type}', got '${typeof value}'`
                    ];
                }
            }
        } else {
            return [
                key,
                'extraneous'
            ];
        }
        return null;
    }).filter(Boolean));
    if (Object.keys(validationErrors).length) {
        throw new Error(`Found invalid properties in the configuration:\n${formatToList(validationErrors)}\n\nYou can only specify the following properties:\n${formatToList(validation)}\n\nIf you want to specify configuration for screens, you need to specify them under a 'screens' property.\n\nExpo Router generates its linking configuration from files in the app directory.`);
    }
    if (root && 'path' in config && typeof config.path === 'string' && config.path.includes(':')) {
        throw new Error(`Found invalid path '${config.path}'. The 'path' in the top-level configuration cannot contain patterns for params.`);
    }
    if ('screens' in config && config.screens) {
        Object.entries(config.screens).forEach(([_, value])=>{
            if (typeof value !== 'string') {
                validatePathConfig(value, false);
            }
        });
    }
}

//# sourceMappingURL=validatePathConfig.js.map
