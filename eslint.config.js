// https://docs.expo.dev/guides/using-eslint/
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  globalIgnores(["dist/*", "**/*.test.cjs"]),
  {
    // 测试文件由 Node test runner 执行，使用 CommonJS 的 __dirname。
    rules: {
      // 当前组件的按钮工厂只把闭包注册为 onPress，并不会在渲染期读取 ref。
      "react-hooks/refs": "off",
    },
  }
]);
