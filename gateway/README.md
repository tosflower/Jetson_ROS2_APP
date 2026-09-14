# Jetson ROS2 移动端网关

该网关与项目根目录的 Expo App 协议对应：

- `POST /api/launch/start` 启动白名单中的感知 launch；
- `POST /api/launch/stop` 停止 launch 及其子进程；
- `WS /ws/mobile` 按客户端选择的话题发送 JPEG、FPS 和延时数据；
- `GET /health` 返回网关和图像话题状态；
- `/api/commands/*` 提供默认任务、自定义命令校验、启停、终端输出、历史与预设；
- `GET /api/images/topics` 提供类似 rqt 的图像话题发现。

## Jetson 上安装

任务页初始提供“小车系统”和“蓝牙节点”两个示例：前者运行 `run_launch.py`，后者默认通过 `python3` 运行 `/home/lee/wheel/wheel_cuda/src/wheel_perception/scripts/sub.py`。所有启动配置都可以新增、重命名、修改或删除；首次使用时需要在 App 浏览或填写真实工作目录并校验。

常见命令例如：

```bash
ros2 launch wheel_perception run_launch.py
```

请确保该包已构建，然后在同一个终端安装 Python 依赖并启动：

```bash
cd <expo_connect_app>
python3 -m pip install --user -r gateway/requirements.txt
source /opt/ros/foxy/setup.bash
source <ros2_workspace>/install/setup.bash
python3 gateway/gateway.py
```

Ubuntu 22.04/Humble 或其他 ROS2 版本时，将 `foxy` 换成对应发行版。启动成功后，网关默认监听所有网卡的 `8080` 端口。App 连接前会验证当前 Ubuntu 用户密码；该用户需要有 sudo 权限。密码仅用于当次验证，不会写入 App 或网关存储。

## 图像话题与可选配置

App 未打开图像页时不订阅图像。进入图像页后，网关发现当前 ROS 图中的 `sensor_msgs/msg/Image` 和 `sensor_msgs/msg/CompressedImage`，用户选择后才创建 `BEST_EFFORT + KEEP_LAST(1)` 订阅。多个手机可独立选择不同话题。

`ROS_IMAGE_TOPIC` 只作为手动订阅时未提供话题参数的默认值：

```bash
ROS_IMAGE_TOPIC=/your/camera/image/compressed python3 gateway/gateway.py
```

支持的配置：

| 环境变量 | 默认值 | 用途 |
| --- | --- | --- |
| `ROS_IMAGE_TOPIC` | `/camera/image_raw/compressed` | ROS2 压缩图像话题 |
| `GATEWAY_HOST` | `0.0.0.0` | HTTP/WebSocket 监听地址 |
| `GATEWAY_PORT` | `8080` | App 连接端口 |
| `MAX_STREAM_FPS` | `20` | 每个 App 连接的最大推流帧率 |

## 验证

在 Jetson 上先检查网关：

```bash
curl http://127.0.0.1:8080/health
```

再让安卓手机与 Jetson 网络互通，在 App 的连接页填写 `<Jetson IP>:8080` 并输入 Ubuntu 密码。认证成功后，网关发放仅驻留内存、8 小时过期的随机令牌；程序、参数文件、历史、图像话题和 WebSocket 均要求此令牌。关闭 App 或重启网关会使令牌失效。其余 API 不能匿名调用；关机/重启必须使用 App 设置页，每次重新输入密码并确认。

当前默认启动命令使用 HTTP，Ubuntu 密码会经过局域网传输。请仅在自己控制的可信热点/局域网使用，绝不能将 8080 端口暴露到公网或不可信网络。跨不可信网络访问前，应先配置 HTTPS 与手机信任的证书。

设置中的“开发板电源”允许远程重启或关机；每次操作都要再次输入 Ubuntu 密码并二次确认。网关只会执行固定的 `systemctl reboot` 或 `systemctl poweroff`，不会接受 App 传来的命令字符串。

## App 页面操作

更新时将整个 `gateway/` 目录（包括 `auth.py`）同步到 Jetson 并重启网关；独立 APK 也需重新构建安装。

使用顺序：

1. 连接页输入网关地址与 Ubuntu 用户密码。密码验证、HTTP 健康检查和首帧 WebSocket 认证均成功后进入控制台。
2. 两个默认任务首次使用时浏览选择真实目录，并校验命令和可选环境脚本；保存后即可一键运行。
3. 终端页可直接输入 **Jetson 上的绝对工作目录**、环境脚本和命令。每个命令在独立标签显示 stdout/stderr、PID、停止信号和退出码，每 0.5 秒刷新；最多并行 8 个。
4. 环境脚本相对路径以工作目录为准；留空则继承网关环境。需要多个 source 或 Conda 时，在 Jetson 建一个环境脚本并填写其路径。
5. 停止任务时依次使用 SIGINT、SIGTERM、SIGKILL 回收对应进程组。关闭标签或断开 App 不会自动停止任务，重连后仍可查看并停止。
6. 图像页像 rqt 一样每两秒自动查找 `Image` 与 `CompressedImage` 话题；选择后显示图像和当前终端输出。原始图像需要 Jetson 安装 `cv_bridge` 和 OpenCV，缺少依赖时仍列出但标为不可用。

参数文件页可浏览目录和编辑不超过 512 KiB 的 `.yaml/.yml`。保存采用临时文件原子替换，文件已被其他程序修改或 YAML 语法错误时拒绝覆盖。选择“保存并编译”后，网关向上查找最近的 `package.xml`，再从 `src` 定位工作区并运行 `colcon build --packages-select <包名>`；编译日志显示在独立终端。

命令类别限制为 `python3 文件.py`、`ros2 launch` 和 `ros2 run`；不执行输入中的 Shell 命令串，不支持 `cd ... && ...`。ROS 包命令根据所选环境中 `ros2 pkg prefix` 的结果检查实际安装文件，而不是假设源代码目录等于安装目录。

“成功启动”仅表示进程存活超过一秒或正常退出，不能代替业务验证。晚些时候失败的进程保留曾成功启动标记；失败原因可看最近日志。历史保存最近 100 次运行，预设独立保存；日志仅保留内存中的最近输出，重启不保留。网关异常退出前仍活动的记录恢复为“状态未知”，不会据此操作旧 PID。

默认存储文件为 `gateway/command_store.json`，可通过 `COMMAND_STORE_PATH=/绝对路径/commands.json` 修改，网关用户需有写权限。记录保存在 Jetson 上，不依赖手机存储，也不会混用不同 Jetson 的记录。

自定义白名单允许已认证连接者启动网关用户可访问的 Python/ROS 程序和环境脚本，并不是代码沙箱。

新增接口：

| 方法与路径 | 请求 / 返回 |
| --- | --- |
| `POST /api/auth/login` | `{ "password": "Ubuntu 用户密码" }`，sudo 验证后返回短期随机 token；密码不保存 |
| `POST /api/auth/logout` | Bearer token 登出并撤销当前 App 会话 |
| `POST /api/system/power` | Bearer token + `{ "action": "reboot"|"poweroff", "password": "再次输入的 Ubuntu 密码" }` |
| `GET /api/commands` | 并行活动任务、历史和预设 |
| `GET /api/commands/logs/{id}` | 指定终端的最近日志 |
| `DELETE /api/commands/history` | 清除已结束历史，保留运行中任务 |
| `POST /api/commands/directory` | `{ "cwd": "/Jetson/工作目录" }` |
| `POST /api/commands/files/read` | 读取 YAML 内容、修改时间、所属包和工作区 |
| `POST /api/commands/files/save` | 校验 YAML 与修改时间后原子保存 |
| `POST /api/commands/build` | 为指定 YAML 所属包启动独立 colcon 构建终端 |
| `POST /api/commands/validate` | `{ "cwd": "...", "command": "python3 node.py", "setup": "" }`，返回临时白名单 `id` 和解析文件路径 |
| `POST /api/commands/start` | `{ "id": "校验返回的id" }` |
| `POST /api/commands/stop` | `{ "id": "当前运行记录id" }` |
| `POST /api/commands/defaults/{id}` | 保存两个默认任务之一的实际目录、命令和环境脚本 |
| `POST /api/commands/presets` | `{ "id": "成功运行记录id", "name": "预设名称" }` |
| `DELETE /api/commands/presets/{id}` | 删除预设，不删除文件或历史 |
| `GET /api/images/topics` | 可视化图像话题、消息类型、发布者数量和本机转换支持状态 |

命令和计时单元测试无需 ROS 或硬件。接口测试通过模拟 ROS 图验证连接、双客户端订阅和释放，不替代 Jetson 实机测试：

```bash
python3 -m unittest discover -s gateway -p 'test_commands.py' -v
python3 -m unittest discover -s gateway -p 'test_streaming.py' -v
python3 -m unittest discover -s gateway -p 'test_auth.py' -v
python3 -m pip install --user -r gateway/requirements-test.txt
python3 -m unittest discover -s gateway -p 'test_gateway_api.py' -v
```
