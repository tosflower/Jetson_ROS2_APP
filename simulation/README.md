# 高德全局路径、手机 GPS 与 ZED2i 里程计对比

独立 ROS2 + Matplotlib 桌面程序，兼容 Ubuntu 20.04 / ROS2 Foxy 及以上版本。
不需要高德 Key 或在线底图，在等比例的局部米制坐标图中显示：

- 蓝色全局路径：优先连接手机传入的完整 `path`，保持道路拐弯形状。
- 金色航点：显示全部 `waypoints`，包括起点和终点；点多时仅抽稀编号文字。
- 青色当前位置与轨迹：由实际收到的 GPS 消息更新；定位超时变灰。
- 红色轨迹：独立 ZED2i 视觉惯性里程计，经固定变换叠图，不融合 GPS、不吸附规划线。
- 定位精度圆、路线长度、收到的消息包数量、模拟进度。

这是二维定位与路线跟随仿真，不包含车辆动力学、避障或自动驾驶控制。

## 自动保存行走记录

所有模式默认将记录保存为 PNG 和同名 JSON，目录为运行程序的电脑上的 `~/data/gps`，不存在时自动创建。
文件名使用本机保存时间，精确到微秒，例如 `20261102_153045_123456.png`。

- 收到不同的规划路线或清除路线时，先保存上一条完整规划与本次已收到的 GPS 轨迹，再切换路线。
- 每条规划是一轮记录。重新规划或清除路线时，先保存上一轮，再清空旧 GPS/里程计轨迹和里程计原点。新的有效路线与 GPS 就绪后开始下一轮；清除路线后停止里程计记录。同一路线重复发送不触发重置。
- 关闭窗口、按 `Ctrl+C` 或无窗口运行结束时，保存当前记录；同一记录不会因关闭和退出清理重复保存。
- 点击“回到起点”也会先保存，避免清空之前行走的轨迹；重复接收相同路线不会产生新记录。

图片包含规划路线、全部航点、GPS 与已对齐的里程计轨迹，自动全览，不受当前窗口缩放影响。
每轮长时间运行保留整段轨迹；没有路线也能显示 GPS，但只有 GPS 与有效路线同时就绪后才记录 ZED。三条线显示在同一主图，没有独立轨迹小图。默认仅将本轮里程计起点对齐到 GPS，不设置或推算朝向。
`live` 模式记录手机实际定位，`demo/simulate` 模式记录收到的模拟 GPS。
强制杀进程或断电无法触发退出保存。保存失败会在终端报告错误。

需要更换目录时使用 `--record-dir /目标目录`；原有 `--output` 仍可额外导出指定文件。

## 环境

以 **ROS2 Humble** 为目标环境，ROS2 提供 `rclpy`、`sensor_msgs`、`std_msgs`、`nav_msgs`，额外需要 Matplotlib 和桌面图形后端：

```bash
sudo apt-get install python3-matplotlib python3-tk fonts-noto-cjk
source /opt/ros/humble/setup.bash
```

Foxy 环境将 `humble` 改为 `foxy`。以下命令在本项目根目录运行；无须 colcon 构建。

## 1. 无手机演示

```bash
python3 simulation/route_simulator.py --mode demo --speed-mps 8
```

内置人工构造的演示折线。程序发布 `/route_sim/route` 路线消息，并沿折线生成
`/route_sim/gps` 定位消息，当前位置始终通过订阅该 GPS 话题得到。
窗口支持暂停/继续、回到起点和全览路径，工具栏可缩放、平移和保存图片。
行驶到终点后保持终点定位，不会跳回起点。

可在另一个同 ROS 域终端观察 GPS 消息：

```bash
ros2 topic echo /route_sim/gps sensor_msgs/msg/NavSatFix
```

## 2. 手机规划路线，程序模拟自身 GPS 行驶

先启动网关、手机连接，再启动：

```bash
python3 simulation/route_simulator.py --mode simulate --speed-mps 3 --noise-m 1.5
```

随后在手机点击“规划路线”。程序接收 `/phone/navigation/route`，显示全部路线与航点，
从起点开始按指定速度沿完整道路折线行驶。`--noise-m` 是模拟 GPS 在东、北两个方向的
高斯噪声标准差，默认为 0，便于先检查路径和定位是否重合。

手机重新规划会替换整条路线并从新起点仿真；清除路线会停止 GPS 仿真、清除图中路线和轨迹。
同一份路线重复发送不会重置运动进度。模拟 GPS 使用独立 `/route_sim/gps`，不会覆盖手机实测消息。

## 3. 显示真实手机 GPS 与规划路线

```bash
python3 simulation/route_simulator.py --mode live
```

默认接收 `/phone/gps_gcj02` 的 JSON，直接绘制手机经高德官方转换的 GCJ-02 定位，与全局路线使用相同坐标系，跳过 Python 本地转换；海拔为空也能显示定位。手机需打开并成功加载配置好的高德地图页，保持 App 前台和联网。官方转换失败时不会有新的 GCJ-02 样本，缓存结果保留原始时间戳，界面会显示实际包龄。

保留原始 GPS 调试入口（以下两种已知原始话题自动按 WGS84 处理）：

```bash
python3 simulation/route_simulator.py --mode live \
  --gps-topic /phone/gps --gps-type navsatfix
python3 simulation/route_simulator.py --mode live --gps-topic /phone/gps_data
```

开发板自己的 GPS 驱动同样可接入，将 `--gps-topic` 改成其实际话题，按消息类型指定 `--gps-type navsatfix` 或 `json`。原始 WGS84 JSON 自定义话题需显式指定 `--gps-coordinates WGS84`；GCJ-02 JSON 必须标注 `coordinate_system: "GCJ-02"`，坐标系不匹配的消息会被拒绝。

**先启动本程序，再在手机规划或重新规划一次。** 网关当前路线发布者没有保存供后来订阅者读取的
持久样本，因此启动程序前发出的路线需要手机重新发送。所有 ROS 终端必须使用相同的
`ROS_DOMAIN_ID` 和可互访的 DDS 网络配置。

## 消息与坐标

| 话题 | 类型 | 用途 |
| --- | --- | --- |
| `/phone/navigation/route` | `std_msgs/msg/String` | 手机完整路线 JSON |
| `/phone/gps_gcj02` | `std_msgs/msg/String` | 高德官方转换后的 GCJ-02 JSON，live 默认输入，直接绘制 |
| `/phone/gps_data` | `std_msgs/msg/String` | 手机原始 WGS84 GPS JSON，可选输入 |
| `/phone/gps` | `sensor_msgs/msg/NavSatFix` | 可选真实 GPS 输入 |
| `/zed2i/odom` | `nav_msgs/msg/Odometry` | 独立 ZED 相机位姿，米制局部坐标，live 默认订阅 |
| `/zed2i/tracking_status` | `std_msgs/msg/String` | ZED 追踪状态、会话坐标系、置信度，可录入 rosbag |
| `/route_sim/route` | `std_msgs/msg/String` | demo 独立演示路线 |
| `/route_sim/gps` | `sensor_msgs/msg/NavSatFix` | demo / simulate 发布并订阅的 WGS84 模拟 GPS |

路线直接兼容 App 的 JSON：`coordinate_system=GCJ-02`、`path=[[经度,纬度],...]`、
`waypoints=[{index,longitude,latitude,...},...]`、`route_id`。只有航点、没有 `path` 时，
按航点顺序连接；已有 `path` 中出现坏点会拒绝整条路线，避免跨过缺失路段画出捷径。

GPS JSON 使用现有的 `longitude`、`latitude`、`accuracy_m`、`timestamp_ms`。新话题还包含 `coordinate_system: "GCJ-02"`、`source_coordinate_system: "WGS84"` 和 `conversion_provider: "AMap.convertFrom"`；海拔、精度和时间戳来自转换对应的原始采样，不用转换完成时间替代采样时间，也不使用手机推算的位置。
NavSatFix 使用其时间戳、定位状态和协方差；无定位状态、无效经纬度、倒序或重复时间戳不会更新当前位置。
程序不发布 TF，也不会把这里的局部绘图坐标宣称为已经标定的机器人 `map` 坐标。

[高德官方示例](https://lbs.amap.com/demo/javascript-api-v2/example/other-gaode/othertoamap)使用 `AMap.convertFrom(..., 'gps')` 将 GPS 转为高德坐标。默认 live 链路复用手机官方转换结果；只有显式选择原始 WGS84 输入或运行 demo/simulate 时才采用**离线近似 WGS84/GCJ-02 转换**，不保证与官方转换逐点相同。局部东/北投影只用于小范围二维显示。模拟 NavSatFix 的海拔为 0，
仅表示平面仿真场景，不表示手机实测海拔。

## 4. ZED2i、手机 GPS、高德路线同时采集

三个来源分别发布话题，不互相修改。手机和网关已有 GPS/路线话题，无需重复封装。ZED2i 固定于车身，手机随车但朝向可变，因此 **不使用手机航向旋转里程计**。里程计原始 `position_m` / `orientation_xyzw` 与用于绘图的 `aligned_gcj02` 分开记录。

### 启动独立 ZED 里程计

在连接相机的开发板上安装与该机 CUDA/JetPack 匹配的 ZED SDK 和 Python API；本项目已核对 SDK / pyzed **4.2.5** 的接口。只安装 `pip` 包不能代替完整 SDK。缺少 Python API 时按 [Stereolabs 官方安装说明](https://www.stereolabs.com/docs/development/zed-sdk/language-support/python)安装。

```bash
source /opt/ros/humble/setup.bash
python3 simulation/zed2i_odometry.py
```

节点默认 HD720、30 FPS，SDK 坐标为米制 `x 前 / y 左 / z 上`。发布 `Odometry` 的位姿和 SDK 协方差，使用 SDK 图像采样时间；未提供速度测量，twist 的大方差表示不可用。关闭区域记忆/回环修正，保留里程计漂移；仅追踪 `OK` 时发布位姿，失锁不伪造静止点。状态话题每秒或状态变化时发布。节点不订阅 GPS/路线，不广播全局 TF。接口参考 [官方位置追踪教程](https://docs.stereolabs.com/docs/tutorials/positional-tracking)。

可使用 `--serial-number 实际序列号` 选择相机，或 `--fps 15` 降低负载。不要与另一个进程同时独占打开同一 ZED；已有驱动发布里程计时，可跳过此节点，将 simulation 的 `--odom-topic` 指向通过 `ros2 topic list -t` 核实的话题，确保单位、轴向和时间戳符合本节约定。

### 默认只对齐初始 GPS 起点，不需要朝向

```bash
source /opt/ros/humble/setup.bash
python3 simulation/route_simulator.py --mode live
```

先启动 ZED 节点和本程序，再在手机加载定位并规划路线。GPS 与有效全局路径均就绪后，才开始本轮 ZED 记录；等待期间收到的里程计包只计数，不写入本轮轨迹。三条线始终显示在同一主图：蓝色全局路径、青色 GPS、红色里程计。

本轮首次有效 ZED 位姿作为 `(0,0,0)` 米，对应当前 GPS 绘图起点。之后只绘制相对首帧的位移，不旋转、不估计朝向，也不读取手机指南针。同一轮内 GPS 更新和手机转动不会纠偏红线。GPS 后续暂时中断时，已开始的 ZED 记录继续独立运行。

重新规划时先保存旧记录，随后移除旧全局路线和 GPS/里程计轨迹，显示新路线；下一轮首个 ZED 点重新归零。清除路线时三条旧线都消失，ZED 停止记录，等待新的有效路线。迟到的上一轮里程计包不会进入新一轮；重复发送同一路线不会清空轨迹。重置发生在 simulation 的本轮记录与绘图中，不重启相机，也不改变其他节点订阅到的 SDK 原始位姿。

单个 GPS 定位点提供位置；此模式不声称红线原始 x/y 已经标定到地图的东/北方向。JSON 的 `direction_aligned=false` 明确记录这一点，`aligned_gcj02` 是绘图副本，原始位姿另存。`gps_odom_pairs` 的距离是当前显示变换下的差值，不是方向已标定后的绝对误差。

本轮起点使用就绪时的 GPS 位置和首次 ZED 位姿，只平移一次，并保留双方真实采样时间。导出的 GPS/里程计时间配对容差默认 0.5 秒，可用 `--odom-sync-tolerance-s` 调整。默认不按 GPS 精度过滤起点；需要门槛时显式添加 `--odom-anchor-max-accuracy-m 20`。界面分别显示 ZED 的“收到 / 本轮记录”计数：收到为 0 时检查驱动、话题、ROS 域和 DDS 网络；收到大于 0 但本轮记录为 0 时，查看等待 GPS/路线或新采样的提示。

### 可选：手工设置起点或旋转绘图副本

任意局部里程计都无法自行知道地理起点和真北。先让车辆静止，确定 **simulation 首个收到的 ZED 位姿** 对应的相机 GCJ-02 起点与镜头前向，填入下面参数后开始移动。以下 `113.38 23.05 / 90` 仅为演示值，必须替换为现场值：

```bash
source /opt/ros/humble/setup.bash
python3 simulation/route_simulator.py --mode live \
  --odom-origin 113.38 23.05 --odom-heading-deg 90
```

`--odom-heading-deg` 是可选的旋转参数，以北为 0、东为 90，指 **相机镜头前向**，不是手机朝向；不提供时不旋转，记录点不需要它。如果镜头与车头有固定偏角：镜头初始朝向 = 车辆初始朝向 + 安装偏角，顺时针为正。`--odom-origin` 是手工指定的地理起点，不会读取或跟随实时 GPS，也可单独使用，不必同时指定朝向。

启动 simulation 后在手机重新规划一次以发送路线；同轮内 GPS 不修正红线，红线不更新 GPS；换路时保存后重置两条实测轨迹。手机与相机的位置差、初始方向差、GPS 漂移都会体现在对比中。叠图使用局部二维近似，不提供已标定的机器人地图或导航 TF。

如果需要保留默认的 GPS 起点，但显式按已知方向旋转绘图副本，可使用：

```bash
python3 simulation/route_simulator.py --mode live \
  --odom-anchor gps --odom-heading-deg 90
```

这只影响绘图副本，原始记录保持不变；初始化后变换锁定，不做持续融合。初始化时车辆应静止，手机应靠近相机。

### 时间记录、失锁和重启

同名 JSON 包含 `gps`、`odometry`、`route_updates`、`recording_round`、`odometry_alignment` 和 `gps_odom_pairs`。原始里程计保留纳秒采样时间、接收时间、三维位置、四元数、协方差和 frame，另以 `relative_position_m` 保存相对本轮首帧的位移，第一点恒为零；GPS 保留采样/接收时间；规划消息保存完整 JSON 与接收时间。最近时间配对仅用于导出 `delta_ms` 和两轨迹间距，不改动源数据，不代表硬件同步。手机、开发板、绘图电脑需使用同一真实时间基准；`/phone/heading` 不参与默认对齐。

里程计采样间隔超过 `--odom-break-gap-s`（默认 1 秒）时红线断开。发布节点重启生成新的 `zed2i_odom_<会话编号>` 坐标系，主图不沿用旧变换，提示重新规划以开启新一轮；两次原点重置不会被静默拼接。

需要完整保存原始 ROS 消息以供离线回放，可在第三个终端同时运行：

```bash
source /opt/ros/humble/setup.bash
ros2 bag record /zed2i/odom /zed2i/tracking_status \
  /phone/gps_data /phone/gps_gcj02 /phone/navigation/route /phone/heading
```

所有终端应采用一致的 `ROS_DOMAIN_ID`。跨开发板和绘图电脑通信时，不要设置 `ROS_LOCALHOST_ONLY=1`；该选项只用于下面的本机隔离测试。

## 回放和无显示器验证

保存 App 路线为 JSON 文件后可离线回放，不需要调用高德：

```bash
python3 simulation/route_simulator.py --mode demo --route-file /绝对路径/route.json
```

无显示器运行并输出图片：

```bash
ROS_DOMAIN_ID=97 ROS_LOCALHOST_ONLY=1 python3 simulation/route_simulator.py \
  --mode demo --headless --duration 8 --speed-mps 30 --output /tmp/route-simulation.png
```

无显示器模式在未收到有效路线或 GPS 时返回非零状态。GUI 模式使用当前终端的图形后端；
SSH 无桌面环境时使用 `--headless`。查看所有参数用 `--help`。

几何和消息校验测试：

```bash
python3 -m unittest discover -s simulation -p 'test_*.py' -v
```

启用真实 ROS2 / DDS 集成测试（隔离测试域，测试结束自动销毁节点）：

```bash
RUN_ROS_INTEGRATION=1 ROS_DOMAIN_ID=97 ROS_LOCALHOST_ONLY=1 \
  python3 -m unittest discover -s simulation -p 'test_*.py' -v
```
