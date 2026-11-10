#!/usr/bin/env bash
set -euo pipefail

# 构建当前完整 App：使用本机 SDK，不上传 Expo 云端；默认只构建平板所需 arm64。
project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"
: "${JAVA_HOME:?请设置 JAVA_HOME，指向项目兼容的 JDK 17}"
: "${ANDROID_HOME:?请设置 ANDROID_HOME，指向本机 Android SDK}"
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-$project_root/.build-cache/gradle}"
export ANDROID_USER_HOME="${ANDROID_USER_HOME:-$project_root/.build-cache/android}"
export CI=1
export EXPO_NO_TELEMETRY=1
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

# 已有工程直接增量编译；更改 Expo 插件或 app.json 后可显式重新生成。
if [[ ! -f android/gradlew || "${REGENERATE_ANDROID:-0}" == 1 ]]; then
  npx expo prebuild --platform android --no-install
fi
# 限制 JS 打包进程数，避免与 Gradle/C++ 并行编译时耗尽本机内存。
mkdir -p "$project_root/.build-cache"
local_init="$project_root/.build-cache/android-local.init.gradle"
cat > "$local_init" <<'GRADLE'
gradle.beforeProject { project ->
  project.pluginManager.withPlugin('com.facebook.react') {
    project.extensions.getByName('react').extraPackagerArgs.addAll(['--max-workers', '2'])
  }
}
GRADLE
cd android
# 本地测试包使用生成工程中的调试签名，包含离线 JS bundle，无需连接 Metro。
"${GRADLE_EXECUTABLE:-./gradlew}" :location-probe:testDebugUnitTest :app:assembleRelease \
  --no-daemon --max-workers=2 --init-script "$local_init" \
  -PreactNativeArchitectures="${ANDROID_ARCHITECTURES:-arm64-v8a}" \
  -Pandroid.enableMinifyInReleaseBuilds=false
mkdir -p "$project_root/artifacts"
cp app/build/outputs/apk/release/app-release.apk "$project_root/artifacts/app-navigation-gps-metrics.apk"
(
  cd "$project_root/artifacts"
  sha256sum app-navigation-gps-metrics.apk > app-navigation-gps-metrics.apk.sha256
  cat app-navigation-gps-metrics.apk.sha256
)
# 终版复制成功并生成校验信息后，移除 Gradle 输出目录中的重复安装包。
rm -- app/build/outputs/apk/release/app-release.apk
