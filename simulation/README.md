# 高德全局路径与 GPS 仿真

独立 ROS2 + Matplotlib 桌面程序，兼容 Ubuntu 20.04 / ROS2 Foxy 及以上版本。
不需要高德 Key 或在线底图，在等比例的局部米制坐标图中显示：

- 蓝色全局路径：优先连接手机传入的完整 `path`，保持道路拐弯形状。
- 金色航点：显示全部 `waypoints`，包括起点和终点；点多时仅抽稀编号文字。
- 青色当前位置与轨迹：由实际收到的 GPS 消息更新；定位超时变灰。
- 定位精度圆、路线长度、收到的消息包数量、模拟进度。

这是二维定位与路线跟随仿真，不包含车辆动力学、避障或自动驾驶控制。

## 自动保存行走记录

所有模式默认将记录保存为 PNG，目录为运行程序的电脑上的 `~/data/gps`，不存在时自动创建。
文件名使用本机保存时间，精确到微秒，例如 `20261102_153045_123456.png`。

- 收到不同的规划路线或清除路线时，先保存上一条完整规划与本次已收到的 GPS 轨迹，再切换路线。
- 关闭窗口、按 `Ctrl+C` 或无窗口运行结束时，保存当前记录；同一记录不会因关闭和退出清理重复保存。
- 点击“回到起点”也会先保存，避免清空之前行走的轨迹；重复接收相同路线不会产生新记录。

图片包含规划路线、全部航点及 GPS 轨迹，并自动全览整段轨迹，不受当前窗口缩放影响。
长时间运行保留整段轨迹；尚未收到 GPS 时只保存规划路线，尚未收到路线时不生成图片。
`live` 模式记录手机实际定位，`demo/simulate` 模式记录收到的模拟 GPS。
强制杀进程或断电无法触发退出保存。保存失败会在终端报告错误。

需要更换目录时使用 `--record-dir /目标目录`；原有 `--output` 仍可额外导出指定文件。

## 环境

ROS2 提供 `rclpy`、`sensor_msgs`、`std_msgs`，额外需要 Matplotlib 和桌面图形后端：

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

默认接收 `/phone/gps_data` 的 JSON，海拔为空也能显示定位。也可以选择 NavSatFix：

```bash
python3 simulation/route_simulator.py --mode live \
  --gps-topic /phone/gps --gps-type navsatfix
```

开发板自己的 GPS 驱动同样可接入，只需将 `--gps-topic` 改成其实际话题。
输入已经是高德坐标时使用 `--gps-coordinates GCJ-02`，避免重复转换。

**先启动本程序，再在手机规划或重新规划一次。** 网关当前路线发布者没有保存供后来订阅者读取的
持久样本，因此启动程序前发出的路线需要手机重新发送。所有 ROS 终端必须使用相同的
`ROS_DOMAIN_ID` 和可互访的 DDS 网络配置。

## 消息与坐标

| 话题 | 类型 | 用途 |
| --- | --- | --- |
| `/phone/navigation/route` | `std_msgs/msg/String` | 手机完整路线 JSON |
| `/phone/gps_data` | `std_msgs/msg/String` | 手机真实 GPS JSON，live 默认输入 |
| `/phone/gps` | `sensor_msgs/msg/NavSatFix` | 可选真实 GPS 输入 |
| `/route_sim/route` | `std_msgs/msg/String` | demo 独立演示路线 |
| `/route_sim/gps` | `sensor_msgs/msg/NavSatFix` | demo / simulate 发布并订阅的 WGS84 模拟 GPS |

路线直接兼容 App 的 JSON：`coordinate_system=GCJ-02`、`path=[[经度,纬度],...]`、
`waypoints=[{index,longitude,latitude,...},...]`、`route_id`。只有航点、没有 `path` 时，
按航点顺序连接；已有 `path` 中出现坏点会拒绝整条路线，避免跨过缺失路段画出捷径。

GPS JSON 使用现有的 `longitude`、`latitude`、`accuracy_m`、`timestamp_ms`。
NavSatFix 使用其时间戳、定位状态和协方差；无定位状态、无效经纬度、倒序或重复时间戳不会更新当前位置。
程序不发布 TF，也不会把这里的局部绘图坐标宣称为已经标定的机器人 `map` 坐标。

[高德官方说明](https://lbs.amap.com/api/javascript-api-v2/guide/transform/convertfrom)要求 GPS 与
高德路线统一坐标系后显示。这里采用**离线近似 WGS84/GCJ-02 转换**，适合本仿真可视化，
不保证与官方转换逐点相同；局部东/北投影也只用于小范围二维显示。模拟 NavSatFix 的海拔为 0，
仅表示平面仿真场景，不表示手机实测海拔。

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
