import { useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Run } from './CommandPanel';

/** 将网关的真实进程输出呈现为终端；翻页保留任务，用户可暂停自动滚动查看前文。 */
export default function TerminalWindow({ run, logs, message }: {
  run?: Run | null; logs: string; message: string;
}): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const [follow, setFollow] = useState(true);
  const scrollToEnd = (): void => { if (follow) scrollRef.current?.scrollToEnd({ animated: false }); };
  // 去除常见 ANSI 控制码，避免 ROS 的彩色输出在移动端显示为乱码。
  const output = logs.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');
  return <View style={styles.window}>
    <View style={styles.bar}>
      <Text style={styles.title}>● Jetson Terminal</Text>
      <Pressable accessibilityRole="button" onPress={() => setFollow(!follow)} style={styles.toggle}>
        <Text style={styles.toggleText}>{follow ? '自动滚动：开' : '自动滚动：关'}</Text>
      </Pressable>
    </View>
    <ScrollView ref={scrollRef} nestedScrollEnabled style={styles.output} onContentSizeChange={scrollToEnd}>
      <Text selectable style={styles.text}>
        <Text style={styles.prompt}>{run ? `[cwd] ${run.cwd}\n$ ${run.command}\n` : '$ 等待运行任务\n'}</Text>
        {run?.setup ? `[环境] ${run.setup}\n` : ''}
        {output || '[暂无程序输出]\n'}
        {run && !['starting', 'running', 'stopping'].includes(run.state)
          ? `\n[进程结束] ${run.message}${run.returncode == null ? '' : ` · exit ${run.returncode}`}\n` : ''}
        {message ? `\n[控制台] ${message}` : ''}
      </Text>
    </ScrollView>
    <Text style={styles.hint}>程序输出 · 长按文本可选择复制 · 保留最近输出</Text>
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
