# 图像链路延迟诊断

单位全部为 ms。启动更新后的感知节点和 `debug_viz_gateway`，重新加载
`~/实习/honor/expo_connect_app` 的 App，图像下方显示“链路延迟 Debug”。

```bash
source /opt/ros/humble/setup.bash
source install/setup.bash
ros2 launch wheel_phone_gateway debug_viz_gateway.launch.py
```

在 App 点击“启动感知系统”，或另一个终端启动感知 launch（不要重复启动）。
可通过 `http://<Jetson IP>:8080/health` 的 `latency_ms` 字段读取网关统计。
网关每 5 秒打印一次最近 300 个有效样本的当前值、均值、P95、最大值。
App 每秒刷新同样的滚动统计；不同阶段采样数量可能不同，丢弃的帧不计入加载耗时。
多个 App 连接时 `/health` 中的发送及回执统计汇总所有连接。

## 测量边界

| 指标 | 起点 → 终点 |
|---|---|
| grab_ms | 本轮感知开始 → 取帧及里程计发布完成；包含相机等待，数据集模式此段基本为空 |
| preprocess_ms | 取帧结束 → 模型推理前；含缩放、数据转换与 CPU/GPU 拷贝 |
| inference_ms | 模型输入尺寸查询及推理 → 推理流同步完成 |
| fusion_ms | 分割后处理 → 点云过滤、路沿提取和默认 CUDA 流同步完成 |
| cloud_publish_ms | CPU 点云整理 → 调试点云发布完成 |
| logic_ms | 道路几何分析 → 感知结果发布完成 |
| visualization_ms | 可视化取图 → 绘制和 ROS 图像构建完成 |
| perception_total_ms | 本轮感知开始 → 图像发布标记点，包含以上阶段 |
| ros_delivery_ms | 发布标记点 → 网关图像回调入口；包括诊断 JSON 构建、发布、ROS2 传递及执行器排队 |
| image_convert_ms / resize_ms / jpeg_encode_ms | 网关回调中的图像转换 / 缩放 / JPEG 编码及字节生成 |
| broadcast_wait_ms | JPEG 字节就绪 → 该客户端获得发送锁；包含广播节拍及其他客户端阻塞 |
| socket_write_ms | 获得发送锁 → 元信息和 JPEG 的 sendall 返回；只代表本机网络栈接受数据 |
| clock_rtt_ms | App 时钟探测往返，扣除服务端接收至响应发送标记间的时间 |
| network_estimate_ms | 服务端发送标记 → App 二进制消息回调入口，使用时钟偏移估算；含发送、网络及手机回调排队 |
| blob_wait_ms / blob_convert_ms | App 收到 JPEG → FileReader 开始 / FileReader 开始 → Data URI 就绪 |
| image_load_ms | Data URI 就绪 → 对应 Image.onLoad；包含 React、双缓冲排队和原生图片加载 |
| receive_to_load_ms | App 收到 JPEG → 对应 Image.onLoad |
| pipeline_to_load_estimate_ms | 本轮感知开始 → App Image.onLoad 的估计合计；只在各段齐全时计算 |
| frame_received_ack_ms / frame_loaded_ack_ms | 网关发送标记 → 网关收到该帧接收 / 加载回执；同一时钟实测，包含回程 |

感知合计和各段、手机合计和各段存在包含关系，不能重复相加。
传感器曝光到感知循环开始的时间未测量；`onLoad` 也不是屏幕实际呈现时间。
GPU 融合边界增加默认流同步，使异步 GPU 工作计入正确阶段，可能带来少量同步开销。

## 时间及关联协议

- 感知发布 `debug/viz/latency`，类型 `std_msgs/msg/String`，可靠 QoS 深度 10。
  JSON 包含 `stamp_ns`（字符串，避免 JS 整数精度损失）、`publish_mono_ms`、`latency_ms`。
  `/debug/viz` 的 `header.stamp` 标记本次发布，`frame_id` 保持原语义。
- 网关订阅图像保持 BEST_EFFORT / KEEP_LAST / depth=1。计时话题默认
  `/debug/viz/latency`，可用节点参数 `latency_topic` 修改。
- 两话题可能乱序，网关缓存最多 300 个计时记录，广播时按时间戳匹配。
  未匹配时仍发送图像，但不提供感知及 ROS2 延迟。匹配要求感知节点和网关在同一 Linux 主机，
  使用 CLOCK_MONOTONIC；不能把这里的单调时钟值用于两个 Jetson 之间直接相减。
- 每帧仍是先一条 JSON 文本，再一条二进制 JPEG。文本新增 `frame_id`、
  `send_mono_ms`、`latency_ms`，旧 App 可忽略新增字段。
- App 每 2 秒发送 `clock_ping {client_ms}`；网关返回 `clock_pong`
  和 `server_receive_ms`、`server_send_ms`。App 从最近 15 秒样本中选择最低 RTT，
  估算服务器相对手机的时钟偏移：`((server_receive-client_send)+(server_send-client_receive))/2`。
  链路不对称会产生估算误差，负值或无有效样本时不生成单向延迟样本。
- App 在接收 JPEG 和 `onLoad` 时发送
  `frame_ack {frame_id, stage: "received" | "loaded"}`；网关返回
  `latency_result {frame_id, latency_ms}`。待回执缓存限 128 帧、回执有效期 30 秒。
- 手机帧缓冲保留独立标签，即使 JPEG 内容相同也不会把两帧的耗时混淆。
  未加载的丢弃帧不发送 loaded 回执；断线重连清空手机统计。

Debug 展示最近历史样本，停止输入后旧统计保留，可通过“最近加载”时间判断是否已停流。
旧网关缺少计时协议时仍可看图，无法测得的项目显示 `—`。
App 目录另有早期 FastAPI 网关，本次图像链路使用 ROS2 包 `wheel_phone_gateway`，
应启动本包以获取完整感知链路计时。

## 验证

```bash
colcon build --packages-select wheel_perception wheel_phone_gateway --symlink-install
PYTHONPATH="$PWD/src/wheel_phone_gateway:$PYTHONPATH" /usr/bin/python3 -m pytest src/wheel_phone_gateway/test -q
cd ~/实习/honor/expo_connect_app
./node_modules/.bin/tsc --noEmit
node frameBuffer.test.cjs
node latency.test.cjs
```

已用独立 ROS_DOMAIN_ID 下的合成图像验证 ROS2 → WebSocket JPEG、元信息关联、
时钟响应、接收/加载回执及 `/health`。合成回执验证协议，不代表手机真机加载性能。
实机需要重新加载 App 后实际运行采集，查看较高的平均值/P95/最大值定位瓶颈。
