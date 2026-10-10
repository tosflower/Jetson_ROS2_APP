import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { MonitoredRun } from '@/providers/monitor-provider';

/** 将网关的真实进程输出呈现为终端；翻页保留任务，用户可暂停自动滚动查看前文。 */
export default function TerminalWindow({ run, logs, message, sourceLabel }: {
  run?: MonitoredRun | null; logs: string; message: string; sourceLabel?: string;
}): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const [follow, setFollow] = useState(true);
  const [frozen, setFrozen] = useState<{ run?: MonitoredRun | null; logs: string; message: string } | null>(null);
  // 暂停时冻结整个终端内容，避免有界日志裁掉开头后把正在阅读的行顶走。
  const visible = frozen ?? { run, logs, message };
  const scrollToEnd = (): void => { if (follow) scrollRef.current?.scrollToEnd({ animated: false }); };
  const toggleFollow = (): void => {
    if (follow) {
      setFrozen({ run: run ? { ...run } : run, logs, message });
      setFollow(false);
    } else {
      setFrozen(null);
      setFollow(true);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: false }));
    }
  };
  // 去除常见 ANSI 控制码，避免 ROS 的彩色输出在移动端显示为乱码。
  const output = visible.logs.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');
  return <View style={styles.window}>
    <View style={styles.bar}>
      <Text style={styles.title}>● {sourceLabel ?? 'Jetson Terminal'}</Text>
      <Pressable accessibilityRole="button" onPress={toggleFollow} style={styles.toggle}>
        <Text style={styles.toggleText}>{follow ? '自动滚动：开' : '自动滚动：关'}</Text>
      </Pressable>
    </View>
    <ScrollView ref={scrollRef} nestedScrollEnabled style={styles.output} onContentSizeChange={scrollToEnd}>
      <Text selectable style={styles.text}>
        <Text style={styles.prompt}>{visible.run ? `[cwd] ${visible.run.cwd}\n$ ${visible.run.command}\n` : sourceLabel ? '[订阅 Jetson ROS2 /rosout]\n' : '$ 等待运行任务\n'}</Text>
        {visible.run?.setup ? `[环境] ${visible.run.setup}\n` : ''}
        {output || '[暂无程序输出]\n'}
        {visible.run && !['starting', 'running', 'stopping'].includes(visible.run.state)
          ? `\n[进程结束] ${visible.run.message}${visible.run.returncode == null ? '' : ` · exit ${visible.run.returncode}`}\n` : ''}
        {visible.message ? `\n[控制台] ${visible.message}` : ''}
      </Text>
    </ScrollView>
    <Text style={styles.hint}>{follow ? '程序输出 · 长按文本可选择复制 · 保留最近输出' : '画面已固定 · 可滚动和复制 · 开启自动滚动后恢复最新输出'}</Text>
  </View>;
}

const styles = StyleSheet.create({
  window: { backgroundColor: '#050a10', borderColor: '#36516d', borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  bar: { backgroundColor: '#1c2b3e', paddingHorizontal: 12, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#75e2a7', fontSize: 14, fontWeight: '600' },
  toggle: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 },
  toggleText: { color: '#c6d5e5', fontSize: 12 },
  output: { height: 320, padding: 12 },
  text: { color: '#d8e4ee', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13, lineHeight: 20, paddingBottom: 24 },
  prompt: { color: '#75e2a7' },
  hint: { color: '#8da1b7', fontSize: 11, padding: 10 },
});
