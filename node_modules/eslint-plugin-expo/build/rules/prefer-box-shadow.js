"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "preferBoxShadow", {
    enumerable: true,
    get: function() {
        return preferBoxShadow;
    }
});
function _utils() {
    const data = require("@typescript-eslint/utils");
    _utils = function() {
        return data;
    };
    return data;
}
const createRule = _utils().ESLintUtils.RuleCreator((name)=>`https://github.com/expo/expo/blob/main/packages/eslint-plugin-expo/docs/rules/${name}.md`);
const preferBoxShadow = createRule({
    name: 'prefer-box-shadow',
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Box shadow is a simpler, more consistent way of defining shadows on components. It is recommended for web builds.'
        },
        schema: [],
        messages: {
            preferBoxShadow: 'prefer box shadow'
        }
    },
    defaultOptions: [],
    create (context) {
        const oldShadowProps = [
            'shadowColor',
            'shadowOffset',
            'shadowOpacity',
            'shadowRadius',
            'elevation'
        ];
        return {
            ObjectExpression (node) {
                for (const property of node.properties){
                    if (property.type === 'Property' && property.key.type === 'Identifier' && oldShadowProps.includes(property.key.name)) {
                        context.report({
                            node: property,
                            messageId: 'preferBoxShadow'
                        });
                    }
                }
            }
        };
    }
});

//# sourceMappingURL=prefer-box-shadow.js.map
