# 小车的盒子

这是一个以安卓手机和平板为主要目标的 Expo 控制台。ROS2、DDS、相机和被控进程均在 Jetson 上运行，App 通过局域网连接控制网关。

## 页面流程

- 连接页：确认 `Jetson IP:8080` 并输入 Ubuntu 用户密码（该用户需有 sudo 权限），通过验证后进入控制台。
- 启动：初始提供“小车系统”和“蓝牙节点”两个示例；连接成功后自动进入启动选项。启动配置可自由新增、重命名、修改或删除，工作目录、命令和环境脚本均可配置。
- 配置：管理默认启动项、自定义 ROS2/Python 命令，以及查找、编辑和编译 YAML 参数文件。
- 监控：集中查看当前程序、多终端和图像可视化；像 rqt 一样发现 ROS 原始与压缩图像话题，可视化页面同时显示当前终端信息。
- 历史：分别查看最近运行和启动预设，可一键清除已结束的历史记录；运行中任务不会被清除。
- 地图：进入页面后自动连接 `ws://<Jetson IP>:9090` 并启动 GPS、航向、IMU 和磁力计；显示高德地图、当前位置、GPS 精度圈和朝向；在顶部面板搜索地点或轻点地图选择终点，查询自行车骑行路线、总距离和预计时间，四个 ROS Topic 仍在后台持续发布。
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

Phone Gateway 的 `8080` 与 rosbridge 的 `9090` 是两条并行通道。进入“地图”页后 App 会自动从 Phone Gateway 主机地址推导 `9090`、连接 rosbridge，并请求前台定位/运动传感器权限。即使 rosbridge 暂时离线，GPS 与航向仍供地图显示；连接恢复后自动继续发布，可在 ROS 2 端验证：

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

地图使用高德 Web JS API 2.0。Expo 获取的 WGS84 GPS 会由 `AMap.convertFrom(..., "gps")` 转为 GCJ-02，再更新车辆标记和精度圆；`/phone/heading` 直接驱动车辆标记旋转。高德底图和坐标转换需要手机能够访问互联网。

复制环境变量模板并填写新生成的 Web JS API Key 与安全密钥，然后重启 Metro：

```bash
cp .env.example .env.local
npm start
```

`.env.local` 已被 Git 忽略。当前方案通过客户端明文方式加载安全密钥，仅适合局域网原型验证；生产部署应按高德建议把安全密钥放到服务器代理中。

## 地图路线规划

1. 在手机进入“地图”，允许定位权限，等待当前位置出现。
2. 在屏幕顶部的规划面板输入地点或地址，点击“搜索”（或键盘搜索键），再点选带名称和地址的结果设为终点；可加城市名缩小搜索范围。也可以拖动地图后轻点选终点（红色“终”标记）。选点后暂停画面跟随，定位与传感器发布仍继续。
3. 点击“规划路线”，以此时的当前位置查询高德骑行路线；成功后显示蓝色路线、总距离和预计骑行时间，并调整视野显示整条路线。
4. 轻点其他位置可更换终点；旧路线会清除，再次点击“规划路线”。“清除”可取消正在进行的查询并移除终点和路线。
5. “回到当前位置”恢复定位跟随，“全览”再次显示整条路线。移动后可点击“重新规划”，使用新的当前位置作为起点。

路线功能复用现有高德 Web JS API Key 与安全密钥，通过 `AMap.Riding` 在线查询自行车推荐路线，地点搜索使用 `AMap.PlaceSearch`；手机需要联网，Key 需具备相应服务权限与额度。GPS 起点先转换为 GCJ-02，地图点选和搜索结果的终点直接使用地图坐标。修改关键词、选点或清除时会取消旧搜索，迟到的结果不会覆盖新选择。没有定位、无可用路线、服务错误或查询超过 15 秒时会提示原因；查询失败不会生成直线路线。

当前提供道路航点、手机定位导航统计和 ROS 数据接口，时间按骑行估算，不代表小车行驶时间；不会发送 Nav2 导航目标或运动指令。定位持续更新不会自动重复调用路线服务，App 进入后台时的传感器暂停行为不变。

### 道路航点与开始/停止导航

规划完成后，蓝色路线上的数字标记为道路航点，起点和终点也计入航点总数。默认约每 20 米采样；长路线会增大间距以控制点数，并额外保留明显转弯。采样点落在高德返回的道路折线上，完整折线同时保存在接口中。界面数字从 1 开始，接口 `index` 从 0 开始。

点击“开始导航”，顶部切换为紧凑面板，显示已行驶距离、剩余距离、当前速度、当前航向、下一航点方向和“停止导航”。已行驶距离来自本次开始后的有效手机 GPS 位移累计；剩余距离按当前位置在道路折线上的进度估算；速度来自手机定位提供的速度，显示单位 km/h。尚未接入小车里程计或 Nav2 反馈。开始时需要 10 秒内、精度不超过 50 米的定位，并且仍靠近本次路线起点，否则需要等待定位或重新规划。

导航时暂停终点修改；地图仍可拖动和回到当前位置。点击“停止导航”结束手机定位统计，保留原路线、终点和航点，恢复规划面板；再次开始会从零累计。停止按钮目前不控制小车制动。GPS 过期或精度不足时保留累计里程，速度/剩余距离显示“—”；偏离道路时继续导航、保留原下一航点，里程和速度继续统计，指向该航点的角度随当前位置更新；剩余距离保留偏航前的原路线估算值，回到路线后继续更新，不自动重算或停止。定位异常跳变、长时间缺测和小幅抖动不直接计入里程，因此统计值是估算值。断开 ROS 仍可在手机查看和停止导航。

### 为后续 Nav2 适配准备的数据接口

地图页复用现有 rosbridge 连接，新增以下两个 `std_msgs/msg/String` 话题，其 `data` 内容是 JSON：

| 话题 | 内容与发送时机 |
| --- | --- |
| `/phone/navigation/route` | 规划/开始/清除时发送，重连后回放当前路线；包含路线 ID、完整折线及有序航点 |
| `/phone/navigation/status` | 状态改变时立即发送；导航期间至多每秒一次，重连后回放最新状态 |

在小车端先运行订阅，再在手机规划或点击开始：

```bash
ros2 topic echo /phone/navigation/route std_msgs/msg/String
# 另开终端
ros2 topic echo /phone/navigation/status std_msgs/msg/String
```

这些话题不配置持久化/latched；晚启动的订阅者可以通过手机“重新规划”或“开始导航”再次获取路线。离线缓存仅保存在 App 内存中，重启 App 不恢复；重连只发送最新数据，离线停止后回放的是 `stopped`，不会重新触发导航。

路线 JSON（`version: 1`）字段：`route_id`、`mode: "phone_tracking"`、`coordinate_system: "GCJ-02"`、`coordinate_order: "longitude_latitude"`、`created_at_ms`、`distance_m`（高德路线长度）、`geometry_length_m`（折线长度）、`duration_s`、`path`（`[经度, 纬度]` 数组）、`waypoints`（`index`、`longitude`、`latitude`、`distance_along_m`）。其中 `distance_along_m` 从路线起点沿折线累计，单位米。清除后 `route_id` 为 null，折线与航点数组为空。

状态 JSON（`version: 1`）字段：`route_id`、`mode: "phone_tracking"`、`nav2_goal_sent: false`、`state`（`preview/tracking/stopped/cleared`）、`timestamp_ms`、`travelled_m`、`remaining_m`、`speed_mps`、`next_waypoint_index`、`next_waypoint_bearing_degrees`、`fix_state`（`fresh/stale/poor_accuracy/unavailable/off_route`）。未知或当前无法可靠估算的数据使用 null。时间戳为手机 Unix 毫秒；速度接口使用 m/s。`next_waypoint_index` 仅表示手机沿路线的位置，不代表 Nav2 已完成该航点；末端没有后续点时为 null，需手动停止统计。

**接口中的经纬度不能直接作为 Nav2 的 map 坐标。** `requires_nav2_coordinate_transform: true` 明确标记此限制。后续适配器需要先统一高德 GCJ-02 与机器人定位的地理坐标，再结合机器人地图原点/定位变换生成 map 坐标下的目标姿态，并接入 Nav2 任务、反馈和取消接口。本次没有实现或调用这些控制接口。

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


导航中的“当前航向”来自手机指南针，优先真北航向，退回磁北时标签注明“磁北”；超过 10 秒未更新时显示“—”。“下一航点方向”是从手机当前地图位置指向下一航点的地理方位角，以北为 0°、东为 90°，顺时针递增，数值范围为 [0, 360)。该角度不是相对转向角，也不是 Nav2 的 yaw；磁北航向与地图地理方位存在磁偏角差异。接口 `next_waypoint_bearing_degrees` 与界面对应，精度不足/过期定位、没有下一点或与该点距离不足 1 米时为 null。界面下一点编号为接口索引加 1。

GPS 更新间隔内，地图每 200 毫秒用最近 GPS 速度和当前手机指南针航向推算位置，并标注“推算定位”。推算同步影响路线进度、下一航点方向及已通过标记；已行驶里程仍使用真实 GPS。新 GPS 转换完成后校正到实测位置；速度缺失或低于 0.3 m/s、GPS 不合格、GPS 或航向超过 10 秒时停止推算，后台超过 1 秒的间隔不补算。推算保留原 GPS 时间戳，不延长定位有效期。手机朝向应与行进方向一致，磁北回退仍可能存在方向偏差。
