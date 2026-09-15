
# AGENTS.md

## 项目目录边界

- 当前项目：`/honor/rosbridge_phone`
  - 负责 rosbridge 手机通信功能。
  - 所有新增 rosbridge 代码默认写入当前目录。

- 现有项目：`/honor/小车的盒子`
  - 包含已经实现的 Phone Gateway 和 App 功能。
  - 默认只允许读取和参考。
  - 除非用户明确要求，不得修改该目录中的文件。

两个项目是并行模块：

- `小车的盒子`：视频、进程管理、日志和现有 App 功能。
- `rosbridge_phone`：ROS Topic、Service、Action、手机 GPS 和 IMU。


## 1. 项目目标

本项目是在现有 Expo 手机 App 和 Phone Gateway 的基础上，增量接入 ROS 2 `rosbridge_suite`，实现手机与 ROS 2 之间的标准化数据通信。

当前阶段的主要目标：

1. Expo App 通过 WebSocket 连接 `rosbridge_server`。
2. 完成 ROS 2 Topic 的双向通信。
3. 将手机 GPS、加速度计、陀螺仪、姿态等数据发布为标准 ROS 2 消息。
4. 逐步支持 ROS Service 和 Action。
5. 保持现有 Phone Gateway 稳定运行，不重写、不删除已有功能。

除非用户明确要求，不要一次性接入 Nav2、定位融合、全部传感器和所有控制功能。按本文的阶段顺序逐步实现，每个阶段先完成验证再进入下一阶段。

---

## 2. 已有系统背景

项目已经包含：

- Expo / React Native 手机 App。
- 自定义 Phone Gateway，通常监听 `8080` 端口。
- Phone Gateway 已承担部分视频、进程管理、日志或系统状态功能。
- Jetson / Ubuntu 上运行 ROS 2。
- 手机和机器人一般通过局域网或 Jetson 热点通信。

开始修改前，必须先检查实际项目，不要假设目录、ROS 2 发行版或依赖版本固定不变：

```bash
pwd
rg --files -g 'package.json' -g 'app.json' -g 'app.config.*' -g '*.launch.py' -g '*.launch.xml'
echo "$ROS_DISTRO"
ros2 --version 2>/dev/null || true
```

同时检查：

- `package.json` 中的 Expo、React Native 和 TypeScript 版本。
- App 当前网络层、状态管理方式和目录结构。
- Phone Gateway 已有的 HTTP/WebSocket 接口和端口。
- 项目中是否已经存在 rosbridge 客户端实现。
- 工作区是否有用户尚未提交的修改。

必须保留用户已有修改。不要覆盖无关文件，不要执行破坏性 Git 命令。

---

## 3. 不可破坏的架构边界

Phone Gateway 与 rosbridge 是并行的两条通信通道，不互相套娃，也不互相替代。

```text
                         Expo App
                            │
              ┌─────────────┴─────────────┐
              │                           │
        Phone Gateway                 rosbridge
           :8080                         :9090
              │                           │
       系统级与高带宽功能              ROS 2 数据接口
              │                           │
     视频/进程/日志/状态          Topic/Service/Action
                                          │
                                  GPS/IMU/控制/导航接口
```

职责划分：

| 功能                  | 推荐通道                                   |
| --------------------- | ------------------------------------------ |
| JPEG/H.264 视频       | Phone Gateway / WebRTC / 专用流媒体通道    |
| 启停 `ros2 launch`    | Phone Gateway，优先通过受控的 systemd 服务 |
| 进程状态、系统日志    | Phone Gateway                              |
| 任意系统命令          | 禁止从手机直接执行                         |
| ROS Topic 发布与订阅  | rosbridge                                  |
| ROS Service           | rosbridge                                  |
| ROS Action            | rosbridge                                  |
| 手机 GPS、IMU、磁力计 | rosbridge                                  |
| `/cmd_vel` 等控制消息 | rosbridge，但必须满足安全约束              |

禁止：

- 删除或重写已能工作的 Phone Gateway。
- 把图像逐帧编码成 rosbridge JSON 传输。
- 让 rosbridge 或 App 接收并执行任意 shell 命令。
- 为了接入 rosbridge 大规模改动已有 UI 或业务功能。
- 在未完成最小链路验证前引入 Nav2、EKF 或复杂状态管理框架。

---

## 4. 技术策略

### 4.1 第一版客户端

第一版优先使用 Expo / React Native 自带的 `WebSocket`，直接实现 rosbridge JSON 协议。不要默认引入 `roslibjs`。

只有在以下情况下才考虑增加第三方库：

- 已验证第三方库与当前 Expo/React Native 版本兼容。
- 它确实减少了 Service、Action 或复杂类型支持的维护成本。
- 用户同意新增依赖。

### 4.2 ROS 2 类型名称

使用 ROS 2 完整类型名称，例如：

```text
std_msgs/msg/String
sensor_msgs/msg/NavSatFix
sensor_msgs/msg/Imu
sensor_msgs/msg/MagneticField
geometry_msgs/msg/Twist
std_srvs/srv/SetBool
```

不要使用 ROS 1 风格类型名代替已经确认可用的 ROS 2 类型名。

### 4.3 建议目录

优先适配项目已有结构；如果没有清晰结构，再采用：

```text
src/
├── services/
│   ├── phoneGateway/
│   └── rosbridge/
│       ├── RosbridgeClient.ts
│       ├── protocol.ts
│       ├── topics.ts
│       ├── services.ts
│       └── types.ts
├── sensors/
│   ├── location.ts
│   ├── imu.ts
│   ├── orientation.ts
│   └── frameTransform.ts
├── hooks/
│   └── useRosbridge.ts
└── screens/
```

不要仅为了符合该目录示例移动大量现有文件。

---

## 5. RosbridgeClient 设计要求

`RosbridgeClient` 应是唯一直接持有 rosbridge WebSocket 的模块。UI、传感器采集和业务逻辑不应各自创建连接。

至少提供这些能力：

```ts
connect(url: string): Promise<void>
disconnect(): void
subscribe<T>(topic: string, type: string, callback: (msg: T) => void, options?): () => void
advertise(topic: string, type: string): void
unadvertise(topic: string): void
publish<T>(topic: string, msg: T): void
callService<TArgs, TResult>(service: string, args: TArgs, timeoutMs?: number): Promise<TResult>
getConnectionState(): RosbridgeConnectionState
```

连接状态使用明确的联合类型，不要只用一个布尔值：

```ts
type RosbridgeConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';
```

实现要求：

- 保证同一时刻只有一个有效 WebSocket。
- `connect()` 可重复调用，但不能产生重复连接或重复订阅。
- 解析消息前验证基本字段，不信任任意 JSON。
- 使用请求 `id` 匹配 Service 响应。
- Service 调用必须有超时和清理机制。
- 取消订阅时向 rosbridge 发送 `unsubscribe`。
- 不再发布某 Topic 时发送 `unadvertise`。
- WebSocket 关闭后清理定时器、回调和未完成请求。
- 自动重连采用有限指数退避，例如 1、2、4、8 秒，设置最大间隔。
- 用户主动断开时不得自动重连。
- 重连成功后，仅恢复仍然有效的订阅和 advertise。
- App 进入后台、回到前台或网络切换时，不得出现重复监听器。
- 日志不得打印密码、令牌或完整敏感位置历史。

不要假设 rosbridge 自带业务级心跳。如果需要在线状态，单独设计轻量的状态 Topic 或 Gateway 健康检查，并明确其协议。

---

## 6. rosbridge 协议最小示例

### 6.1 订阅 ROS Topic

```json
{
  "op": "subscribe",
  "id": "sub:/ros_test",
  "topic": "/ros_test",
  "type": "std_msgs/msg/String",
  "throttle_rate": 0,
  "queue_length": 1
}
```

接收到的消息通常形如：

```json
{
  "op": "publish",
  "topic": "/ros_test",
  "msg": {
    "data": "hello phone"
  }
}
```

### 6.2 发布 ROS Topic

先 advertise：

```json
{
  "op": "advertise",
  "id": "adv:/phone/test",
  "topic": "/phone/test",
  "type": "std_msgs/msg/String"
}
```

再 publish：

```json
{
  "op": "publish",
  "topic": "/phone/test",
  "msg": {
    "data": "hello from phone"
  }
}
```

### 6.3 调用 ROS Service

```json
{
  "op": "call_service",
  "id": "service:enable_robot:001",
  "service": "/enable_robot",
  "type": "std_srvs/srv/SetBool",
  "args": {
    "data": true
  }
}
```

所有协议对象都应在 TypeScript 中定义类型，不要在多个页面复制 JSON 字面量。

---

## 7. 手机传感器消息规范

### 7.1 GPS

Topic：

```text
/phone/gps
```

类型：

```text
sensor_msgs/msg/NavSatFix
```

要求：

- `latitude`、`longitude` 单位为度。
- `altitude` 单位为米；无法获得时按消息规范明确表达未知，不得伪造为 0。
- 将手机提供的水平/垂直精度合理转换到协方差；无法判断时设置正确的 covariance type。
- `header.frame_id` 建议使用 `phone_gps_link`。
- 时间戳策略必须统一，并记录是手机采样时间还是机器人接收时间。
- 初始发布频率建议 1–5 Hz，不要用 IMU 频率发布 GPS。

### 7.2 IMU

Topic：

```text
/phone/imu
```

类型：

```text
sensor_msgs/msg/Imu
```

单位必须符合 ROS 约定：

- `angular_velocity`：rad/s。
- `linear_acceleration`：m/s²。
- `orientation`：归一化四元数。

要求：

- 不要把角度/秒直接当 rad/s。
- 不要把重力单位 `g` 直接当 m/s²。
- 不要把 Euler 角直接填写到四元数字段。
- 若 orientation 不可用，按消息规范标记未知，不得填写单位四元数冒充测量值。
- 初始频率建议 20–50 Hz；确认网络和处理稳定后再提高。
- 传感器采样与 WebSocket 发布解耦，避免 UI 每次重渲染创建订阅。

### 7.3 坐标系

ROS 机器人常用机体坐标约定为：

```text
x 向前，y 向左，z 向上
```

手机坐标系会受到 iOS/Android、屏幕方向、手机安装姿态和传感器 API 定义影响。因此：

- 不允许未经验证就直接把手机 `x/y/z` 填入 ROS 消息。
- 先定义 `phone_link` 或 `phone_imu_link`。
- 记录手机在轮椅上的固定安装方向。
- 优先发布手机坐标系下的原始测量，再通过明确的固定旋转转换到 `base_link`。
- 通过静止、向前加速、左转和绕各轴旋转实验验证符号与轴对应关系。
- 坐标变换逻辑必须集中在一个模块并有单元测试。

### 7.4 时间戳

手机时间和 Jetson/Ubuntu 时间可能不同步。实现时必须选择并记录一种策略：

1. 使用手机采样时间，并确保手机与机器人时间同步；或
2. 在机器人侧以接收时间重新盖章，同时单独保留手机采样时间用于延迟分析。

不要混用 Unix 毫秒、秒和 ROS `sec/nanosec`。转换后保证：

```text
0 <= nanosec < 1_000_000_000
```

用于传感器融合前，必须测量端到端延迟、抖动和时钟偏差。

---

## 8. 控制安全要求

如果 App 通过 rosbridge 发布 `/cmd_vel` 或其他运动控制命令，下列约束是强制的：

- 机器人侧必须有独立于手机的 command timeout / dead-man watchdog。
- 超过设定时间未收到新命令时，机器人必须主动输出零速度并停车。
- App 按钮松开、页面退出、App 进入后台、WebSocket 关闭或网络切换时，应立即请求零速度。
- 不能把“App 已发送零速度”作为唯一安全保证；最终停车责任在机器人控制侧。
- 对线速度和角速度进行机器人侧限幅。
- 控制权需要明确，避免手机和自主导航同时向同一控制器竞争。
- 未验证急停、失联停车和限速前，不得进行载人测试。

---

## 9. 网络与安全

- 默认连接地址为 `ws://<robot-ip>:9090`，实际 IP 必须可配置，不得散落硬编码在多个页面。
- 连接前明确手机和机器人是否位于同一网段，并检查端口监听和防火墙。
- 不要把 `9090` 直接暴露到公网。
- rosbridge 默认不应被视为具备完善的身份认证和访问控制。
- 若跨不可信网络使用，应增加 VPN、反向代理、TLS 和认证授权，并限制可访问接口。
- App UI 应区分 Phone Gateway 与 rosbridge 的连接状态。
- 网络异常信息应可读，例如：IP 无效、连接超时、连接拒绝、异常关闭。

排查命令：

```bash
echo "$ROS_DISTRO"
ros2 node list
ros2 topic list
ss -lntp | rg ':8080|:9090'
ip -4 addr
ip route
```

---

## 10. 分阶段开发与验收

### 阶段 0：环境确认

任务：

- 确认 ROS 2 发行版。
- 确认 `rosbridge_suite` 是否已安装。
- 确认 Phone Gateway 的 `8080` 没有端口冲突。
- 启动 rosbridge 并确认 `9090` 正在监听。

通用安装形式：

```bash
sudo apt update
sudo apt install "ros-${ROS_DISTRO}-rosbridge-suite"
```

启动：

```bash
source "/opt/ros/${ROS_DISTRO}/setup.bash"
ros2 launch rosbridge_server rosbridge_websocket_launch.xml
```

验收：

```bash
ros2 node list
ss -lntp | rg ':9090'
```

### 阶段 1：ROS → Phone

ROS 端：

```bash
ros2 topic pub /ros_test std_msgs/msg/String "{data: 'hello phone'}" -r 1
```

App 订阅 `/ros_test`。

验收标准：

- App 能显示或记录 `hello phone`。
- 连续运行 5 分钟不产生重复消息或重复连接。
- 断网再恢复后订阅能够自动恢复。

### 阶段 2：Phone → ROS

App advertise 并发布 `/phone/test`。

ROS 端：

```bash
ros2 topic echo /phone/test
ros2 topic info /phone/test --verbose
```

验收标准：

- 每次点击只发布一条预期消息。
- 页面多次进入/退出不会累积重复监听器。
- 断线时发布会得到明确处理，不静默丢失关键操作。

### 阶段 3：封装客户端

任务：

- 将连接、订阅、发布、重连和错误处理集中到 `RosbridgeClient`。
- UI 不再直接拼 rosbridge JSON。
- 为协议解析、时间戳和坐标转换增加测试。

验收标准：

- TypeScript 检查通过。
- 项目已有 lint/test/build 命令通过。
- Phone Gateway 相关功能无回归。

### 阶段 4：GPS

任务：

- 请求并处理系统定位权限。
- 发布 `/phone/gps`。
- 清楚显示权限拒绝、定位关闭和精度不足状态。

ROS 端验证：

```bash
ros2 topic echo /phone/gps
ros2 topic hz /phone/gps
ros2 topic info /phone/gps --verbose
```

验收标准：

- 经纬度、海拔、时间戳、状态和协方差语义正确。
- 发布频率受控。
- App 后台/前台切换不会产生多个定位订阅。

### 阶段 5：IMU

任务：

- 接入加速度计、陀螺仪和可用的姿态数据。
- 统一单位、坐标系和时间戳。
- 发布 `/phone/imu`。

ROS 端验证：

```bash
ros2 topic echo /phone/imu
ros2 topic hz /phone/imu
ros2 topic bw /phone/imu
```

验收标准：

- 静止时数值符合预期。
- 单轴旋转时对应轴符号正确。
- 四元数归一化。
- 实际频率接近配置值，没有明显消息突发。

### 阶段 6：Service

先用简单服务完成请求—响应闭环，再接真实业务服务。

验收标准：

- 并发请求可依靠唯一 `id` 正确匹配。
- 超时、服务不存在和失败响应能反馈到 UI。
- 页面卸载后不保留无效 Promise 或回调。

### 阶段 7：Action / Nav2

只有 Topic 和 Service 已稳定后再开始。

任务：

- 明确目标 Action 类型及 ROS 2 / rosbridge 版本支持方式。
- 支持 goal、feedback、result 和 cancel。
- 导航 UI 必须能区分发送成功、执行中、完成、取消和失败。

---

## 11. 测试矩阵

每个相关改动至少考虑：

| 场景                   | 预期结果                     |
| ---------------------- | ---------------------------- |
| 正确 IP，同一局域网    | 正常连接                     |
| 错误 IP                | 超时并给出可读错误           |
| `9090` 未启动          | 显示连接拒绝/不可达          |
| Wi-Fi 切换为热点       | 旧连接关闭，新地址可重新连接 |
| App 后台再前台         | 不重复订阅，状态正确恢复     |
| rosbridge 重启         | App 退避重连并恢复有效订阅   |
| 收到未知 `op`          | 忽略或记录，不导致崩溃       |
| 收到非法 JSON          | 捕获异常，不导致连接层崩溃   |
| 高频 IMU               | UI 流畅，频率和带宽受控      |
| 控制链路断开           | 机器人侧 watchdog 停车       |
| Phone Gateway 同时运行 | `8080` 与 `9090` 互不冲突    |

---

## 12. 编码规范

- 优先使用 TypeScript 严格类型，避免 `any`。
- 协议消息使用可辨识联合类型。
- 网络层、传感器层和 UI 层分离。
- 不在 React render 流程中创建传感器或 WebSocket 订阅。
- 所有订阅、计时器和事件监听器必须有对称清理。
- IP、端口、Topic 名和频率集中配置。
- 错误消息同时面向开发日志和用户界面，但避免泄露敏感信息。
- 高频数据不要直接驱动整个页面重新渲染；进行节流或局部更新。
- 遵循项目已有 formatter、lint、测试和命名规范。
- 除非用户明确要求，不新增大型依赖，不升级 Expo/React/ROS 版本。
- 不修改无关 UI，不改变现有功能行为。

---

## 13. Agent 工作方式

接到 rosbridge 相关开发任务时：

1. 先读取本文件和距离目标文件最近的其他 `AGENTS.md`。
2. 检查当前代码和工作区状态，理解已有实现后再修改。
3. 明确本次任务属于 Phone Gateway 还是 rosbridge，不混淆职责。
4. 给出简短实施计划，限制本次改动范围。
5. 实施最小、可回退的修改。
6. 运行与改动直接相关的类型检查、测试或构建。
7. 如无法访问真实手机或 ROS 环境，明确哪些验证没有执行，不得声称已经通过。
8. 最终说明：修改了什么、如何验证、用户下一步应运行什么命令。

遇到以下情况必须暂停并询问用户：

- 无法确定目标 Expo 项目目录。
- 需要选择会显著改变架构的状态管理或网络库。
- 需要修改现有 Phone Gateway 协议且可能破坏 App 兼容性。
- 需要开放公网端口、配置 TLS/认证或调整系统防火墙。
- 需要真机权限、证书、账号或其他用户授权。
- 发现与本任务重叠且来源不明的未提交修改。

不要因为缺少真机而停止所有开发。可以先完成类型、协议封装和可测试逻辑，并清楚列出真机验收步骤。

---

## 14. 当前推荐的第一个任务

如果项目尚未接入 rosbridge，第一项开发任务固定为：

> 新建一个最小 `RosbridgeClient`，连接可配置的 `ws://<robot-ip>:9090`，订阅 `/ros_test`，并让 App 显示连接状态和接收到的字符串；不要改动 Phone Gateway。

完成条件：

- ROS 端发布 `/ros_test` 时，App 能收到消息。
- rosbridge 关闭时，App 显示断开且不崩溃。
- rosbridge 恢复后，App 能重连并恢复一次订阅。
- Phone Gateway 的现有图像、进程或日志功能保持正常。

只有完成该里程碑，才开始 `/phone/test`、GPS、IMU、Service 和 Action。
