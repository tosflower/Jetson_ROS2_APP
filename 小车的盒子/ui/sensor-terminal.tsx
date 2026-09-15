import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SensorTerminalEntry } from '@/services/phone-sensors/history';

/** 以独立终端展示某个手机传感器已发布到 ROS 的历史数据。 */
export function SensorTerminal({ title, topic, type, messages, totalCount, onClear }: {
  title: string;
  topic: string;
  type: string;
  messages: SensorTerminalEntry[];
  totalCount: number;
  onClear: () => void;
}): React.JSX.Element {
  const scrollRef = useRef<ScrollView>(null);
  const [follow, setFollow] = useState(true);
  const scrollToEnd = (): void => {
    if (follow) scrollRef.current?.scrollToEnd({ animated: false });
  };

  return (
    <View style={styles.window}>
      <View style={styles.bar}>
        <Text selectable style={styles.title}>● {title}</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`切换 ${title} 自动滚动`}
            onPress={() => setFollow((enabled) => !enabled)}
            style={styles.action}
          >
            <Text style={styles.actionText}>{follow ? '跟随：开' : '跟随：关'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`清空 ${title} 终端`}
            disabled={!messages.length}
            onPress={onClear}
            style={({ pressed }) => [styles.action, { opacity: !messages.length ? 0.35 : pressed ? 0.65 : 1 }]}
          >
            <Text style={styles.clearText}>清空</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.topicBar}>
        <Text selectable style={styles.topic}>{topic}</Text>
        <Text selectable style={styles.type}>{type}</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        style={styles.output}
        contentContainerStyle={styles.outputContent}
        onContentSizeChange={scrollToEnd}
      >
        {messages.length ? messages.map((entry) => (
          <Text selectable key={entry.id} style={styles.line}>
            <Text style={styles.timestamp}>[{new Date(entry.publishedAt).toLocaleTimeString()}] </Text>
            <Text style={styles.prompt}>PUB </Text>
            {entry.data}{'\n'}
          </Text>
        )) : (
          <Text selectable style={styles.placeholder}>$ 启动 {title} 后在此显示已发布数据…</Text>
        )}
      </ScrollView>
      <Text selectable style={styles.hint}>
        已发布 {totalCount} 条 · 当前保留 {messages.length}/200 条 · 长按可复制
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#050a10',
    borderColor: '#36516d',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    minHeight: 48,
    backgroundColor: '#1c2b3e',
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: { flex: 1, color: '#75e2a7', fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  action: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 9 },
  actionText: { color: '#c6d5e5', fontSize: 12 },
  clearText: { color: '#ff8a80', fontSize: 12, fontWeight: '600' },
  topicBar: { paddingHorizontal: 12, paddingVertical: 8, gap: 2, backgroundColor: '#111c29' },
  topic: { color: '#64b5f6', fontFamily: 'monospace', fontSize: 12 },
  type: { color: '#8da1b7', fontFamily: 'monospace', fontSize: 11 },
  output: { height: 360 },
  outputContent: { padding: 12 },
  line: {
    color: '#d8e4ee',
    fontFamily: process.env.EXPO_OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 19,
  },
  timestamp: { color: '#75e2a7' },
  prompt: { color: '#ffb74d' },
  placeholder: {
    color: '#8da1b7',
    fontFamily: process.env.EXPO_OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 19,
  },
  hint: { color: '#8da1b7', fontSize: 11, padding: 10, fontVariant: ['tabular-nums'] },
});
