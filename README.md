# 小车的盒子：手机监控端

本分支的手机 App 连接 Jetson 网关后，提供终端日志查看、ROS 图像话题订阅与可视化，以及手机 GPS 和高德地图导航数据传输。

## 手机端页面

- **连接**：自动发现局域网中的 Jetson 网关，或手动输入地址；验证密码后进入监控页。
- **监控**：自动订阅 Jetson 的 ROS2 `/rosout` 日志，也可查看网关管理任务的原始终端输出；发现、订阅并全屏查看 `sensor_msgs/msg/Image` 或 `CompressedImage` 话题。
- **地图**：显示手机定位、航向和高德地图；搜索地点、规划路线，并通过 rosbridge 向 Jetson 发布手机传感器与导航数据。
- **设置**：查看或修改网关连接、外观和应用信息。

手机端不提供任务启动/停止、开发板重启/关机、命令与代码编辑、YAML 编辑或编译入口。原页面源码保存在 [`legacy-mobile/`](legacy-mobile/)，原命令状态模块保存在 [`providers/command-provider.tsx`](providers/command-provider.tsx)。这些模块不挂载到当前手机路由。Jetson 网关源码保留在 [`gateway/`](gateway/)；其已有接口仍可供单独的管理端使用。

在 Jetson 桌面或 SSH 中手动启动的 ROS2 节点，只要向 `/rosout` 发布日志，手机“监控 → 终端与 ROS 日志”就会实时显示。ROS 日志由 `rcl_interfaces/msg/Log` 订阅，使用 100 毫秒节流和长度上限避免刷屏；不需要更新 Jetson 网关。终端窗口关闭自动滚动后会冻结当前内容，便于查看旧日志；重新开启才显示最新输出。普通 shell 的原始 stdout/stderr 无法从已运行的独立终端直接读取，需通过网关启动任务，或采用 tmux／日志文件等可共享的会话来源。

## 运行

```bash
npm install
npm start
```

App 已内置默认高德 Web JS API 凭据，安装后可直接加载地图。需要更换时，在手机“设置 → 高德地图配置”中填写新凭据，或通过 `.env.local` 的 `EXPO_PUBLIC_AMAP_WEB_KEY` 和 `EXPO_PUBLIC_AMAP_SECURITY_JS_CODE` 在构建时覆盖。手机需能访问高德服务；手机与 Jetson 应处于可互访的网络。网关默认使用 `8080`，rosbridge 默认使用 `9090`。网关连接成功后会请求定位和运动传感器权限并启动传输；单独进入地图页也会启动采集。

如果项目换过目录后地图整页空白或 Android 打包提示找不到旧路径，运行 `npx expo start --clear` 重新启动开发服务；制作新安装包前也应清理 Metro 缓存。

GPS 经纬度始终以 `std_msgs/msg/String` 的 JSON 发布到 `/phone/gps_data`，字段为 `latitude`、`longitude`、`altitude`、`accuracy_m`、`timestamp_ms`；海拔缺失时 `altitude` 为 `null`。海拔有效时仍向 `/phone/gps` 发布 `sensor_msgs/msg/NavSatFix`。航向、IMU 和磁场分别发布到 `/phone/heading`、`/phone/imu` 和 `/phone/magnetic_field`。路线与导航状态发布到 `/phone/navigation/route` 和 `/phone/navigation/status`。数据格式、坐标系与频率说明见[原项目文档](legacy-mobile/README-original.md)。

在 Jetson 上可检查接收情况：

```bash
ros2 topic echo /phone/gps_data std_msgs/msg/String
ros2 topic echo /phone/gps sensor_msgs/msg/NavSatFix
ros2 topic echo /phone/navigation/route std_msgs/msg/String
ros2 topic echo /phone/navigation/status std_msgs/msg/String
```

## 验证

```bash
npx tsc --noEmit
npm run lint
node --test services/*.test.cjs services/phone-sensors/*.test.cjs services/navigation/*.test.cjs services/rosbridge/*.test.cjs
```
