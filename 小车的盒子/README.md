# 小车的盒子

这是一个以安卓手机和平板为主要目标的 Expo 控制台。ROS2、DDS、相机和被控进程均在 Jetson 上运行，App 通过局域网连接控制网关。

## 页面流程

- 连接页：确认 `Jetson IP:8080` 并输入 Ubuntu 用户密码（该用户需有 sudo 权限），通过验证后进入控制台。
- 启动：初始提供“小车系统”和“蓝牙节点”两个示例；连接成功后自动进入启动选项。启动配置可自由新增、重命名、修改或删除，工作目录、命令和环境脚本均可配置。
- 配置：管理默认启动项、自定义 ROS2/Python 命令，以及查找、编辑和编译 YAML 参数文件。
- 监控：集中查看当前程序、多终端和图像可视化；像 rqt 一样发现 ROS 原始与压缩图像话题，可视化页面同时显示当前终端信息。
- 历史：分别查看最近运行和启动预设，可一键清除已结束的历史记录；运行中任务不会被清除。
- 测试：GPS、航向、IMU 和磁力计通过独立的 `ws://<Jetson IP>:9090` rosbridge 共用一个 WebSocket 发布标准 ROS 2 消息；页面以四个可切换终端展示当前会话历史，断线后自动退避重连。
- 设置：管理网关连接、应用信息、可切换并记忆深浅外观，以及开发板电源入口。重启/关机每次都需再次输入 Ubuntu 密码并确认。

前端使用 Expo Router 原生标签和 Stack 组织页面，业务连接与命令状态位于根级 Provider，因此切换页面不会停止 Jetson 程序或丢失终端状态。

## 平板、横屏与图像放大

- 手机和平板支持随系统自动旋转。Android 设备需开启系统“自动旋转”；切换方向不会重新登录或停止正在运行的任务。
- 图像页在宽屏下并排显示话题选择和图像预览，窄屏下纵向排列；安全区和大字体参与布局适配。
- 在“监控 → 图像可视化”订阅话题后，轻点画面进入全屏。可双指缩放至 1–4 倍、放大后拖动、双击放大/还原，也可用底部按钮缩放。旋转后画面重新适应窗口。
- 点击“完成”或 Android 返回键退出全屏。全屏与普通预览复用同一图像流，隐藏的预览暂停加载新帧；断线时保留最后画面并提示离线。
- Android 和 iOS 共用 Apple 风格的分组卡片、圆角按钮与浅深配色；设置页可切换外观。

应用图标使用 [`assets/icon.png`](assets/icon.png)，为提供的机器人图片原图。方向和图标属于原生配置，旧 APK 不会通过刷新 JavaScript 获得这些更改，需要重新构建安装：

```bash
npx eas-cli@latest build --platform android --profile preview
```

`eas.json` 的 `preview` 已配置输出可直接安装的 APK。构建完成后下载安装包；在真机上验证旋转、图像手势和桌面图标。完整用例见 [TEST_CASES.md](TEST_CASES.md)。

## Jetson 网关

与 App 对应的网关位于 [`gateway/`](gateway/README.md)，需要把整个目录同步到 Jetson。它按手机选择动态订阅 ROS 图像话题，并通过校验后的临时白名单启停 ROS2/Python 进程组。

Phone Gateway 的 `8080` 与 rosbridge 的 `9090` 是两条并行通道。“测试”页可单独修改 rosbridge 地址。连接后点击“启动全部传感器”并授予前台定位/运动传感器权限，可在 ROS 2 端验证：

```bash
ros2 topic echo /phone/gps
ros2 topic echo /phone/heading
ros2 topic echo /phone/imu
ros2 topic echo /phone/magnetic_field
ros2 topic hz /phone/gps
ros2 topic hz /phone/heading
ros2 topic hz /phone/imu
ros2 topic hz /phone/magnetic_field
```

GPS 发布上限为 2 Hz，航向为 5 Hz，IMU 为 25 Hz，磁力计为 10 Hz。`/phone/heading` 使用 `std_msgs/msg/Float64`，单位为度，约定真北 0°、顺时针增加；真北不可用时回退为磁北。手机顶部默认与车头同向，固定安装存在偏角时修改 `PHONE_HEADING_MOUNT_OFFSET_DEGREES`。加速度从 `g` 转为 `m/s²`，磁场从 `μT` 转为 `T`，陀螺仪保持 `rad/s`。尚未校验的姿态按 `sensor_msgs/msg/Imu` 约定标记为未知；原始设备轴使用 `phone_imu_link`，安装方向标定后再转换到 `base_link`。时间戳使用手机采样/回调时间，用于融合前需先校验手机与 Jetson 时钟偏差。

四个手机终端各保留最近 200 条已发布数据。终端顶部可单独清空，测试页和设置页也可一次性清除四者；清除只影响显示缓存，不停止 ROS Topic 发布。

## Jetson 网关协议

Jetson 默认监听所有网卡的 `8080` 端口。安卓设备连接 Jetson 热点后填写 Jetson 热点地址，例如 `10.42.0.1:8080`。

| 用途 | 地址 | 请求或消息 |
| --- | --- | --- |
| 健康检查 | `GET /health` | 返回能力列表，App 据此拒绝旧版网关 |
| 任务和终端 | `/api/commands/*` | 校验、启动、停止、状态、日志、历史、预设 |
| 图像话题 | `GET /api/images/topics` | 返回可订阅图像话题、类型和发布者数量 |
| 实时图像 | `WS /ws/mobile?topic=...&message_type=...` | 帧元数据与二进制 JPEG |

网关必须将 `launch_id` 映射到服务端白名单内的确定 launch 文件，并逐项校验参数；绝不能把 App 输入拼接后直接执行 Shell 命令。

App 登录密码不会保存在手机或网关，但默认网关使用 HTTP，因此密码会经过局域网传输。请仅在可信热点使用，勿暴露到公网；不可信网络应先部署 HTTPS。

除 `GET /health` 和 `POST /api/auth/login` 外，HTTP API 均要求 `Authorization: Bearer <token>`；WebSocket 在连接后首帧发送认证 token。登录 token 只保存在 App 运行内存中，网关重启或 8 小时过期后需重新输入 Ubuntu 密码。关机与重启接口还会逐次重新验证密码。

网关支持 ROS2 的 `sensor_msgs/msg/Image` 与 `sensor_msgs/msg/CompressedImage`，使用 `BEST_EFFORT` 与 `KEEP_LAST(1)` QoS，只转发最新 JPEG 帧；压缩图像无需额外转换，延迟更低。

## 在安卓设备上开发运行

1. 在安卓设备安装 Expo Go，或构建 APK。
2. 安卓设备、开发电脑与 Jetson 保持网络可达。
3. 在本目录执行：

   ```bash
   npm install
   npm start
   ```

4. 用 Expo Go 扫描二维码。
5. 在首页填写 Jetson 地址，显示“连接成功”后进入任务页。

如 Metro 发现受限，可执行 `npm run start:tunnel` 加载开发代码；Jetson 控制和图像仍使用局域网地址。

EAS 独立包无法像 Expo Go 一样从 Metro 自动推导电脑 IP，默认网关由
`eas.json` 中的 `EXPO_PUBLIC_GATEWAY_ADDRESS` 在构建时写入。电脑局域网 IP 变更后，
请更新该值并重新构建；App 内仍可手动输入新地址并重新连接。

安卓配置已允许局域网 HTTP 明文访问，并使用安全区域、键盘 resize、系统返回键和最小 48dp 操作按钮适配手机屏幕。

## 当前限制

- 当前使用 WebSocket 二进制 JPEG；更高分辨率或弱网环境可进一步改为 WebRTC。
- 网关认证不等于公网安全防护；默认 HTTP 会明文传输 Ubuntu 密码，仅用于受信任的局域网测试，不应暴露到公网。
- 一个网关最多同时运行 8 个受控任务；关闭手机终端标签不会停止对应进程。
- “终端”不是任意 Shell：支持 `ros2 launch`、`ros2 run`、`python3 文件.py` 及参数；工作目录和环境脚本分别输入，不执行管道、重定向、`&&` 或任意系统命令。

## 自定义命令控制

成功运行记录可加入预设。部署时需要同步更新整个 `gateway/` 目录（包括认证模块 `auth.py`），再重启 Jetson 网关。参数文件编辑仅允许 `.yaml/.yml`，构建命令由网关根据最近的 `package.xml` 自动生成。详细操作见[网关说明](gateway/README.md#app-页面操作)。
