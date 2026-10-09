import * as Haptics from 'expo-haptics';
import { router, type Href } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { metrics, spacing, useThemeColors } from './tokens';

export function Screen({ children, wide = false }: React.PropsWithChildren<{ wide?: boolean }>): React.JSX.Element {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  // 旋转时只更新布局和安全区，保留同一个滚动容器及页面内部状态。
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        width: '100%', maxWidth: wide ? metrics.maxWideContentWidth : metrics.maxContentWidth, alignSelf: 'center',
        paddingLeft: spacing.xl + insets.left, paddingRight: spacing.xl + insets.right,
        paddingTop: spacing.lg, paddingBottom: spacing.xxl + Math.max(spacing.lg, insets.bottom), gap: spacing.xxl,
      }}
    >
      {children}
    </ScrollView>
  );
}

export function Section({ title, footer, children }: React.PropsWithChildren<{ title?: string; footer?: string }>): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View style={{ gap: spacing.sm }}>
      {title ? <Text selectable style={{ color: colors.secondaryLabel, fontSize: 13, fontWeight: '600', paddingHorizontal: 4, textTransform: 'uppercase' }}>{title}</Text> : null}
      <View style={{ backgroundColor: colors.surface, borderRadius: metrics.radius, borderCurve: 'continuous', overflow: 'hidden' }}>
        {children}
      </View>
      {footer ? <Text selectable style={{ color: colors.tertiaryLabel, fontSize: 13, lineHeight: 18, paddingHorizontal: 4 }}>{footer}</Text> : null}
    </View>
  );
}

export function Row({ label, value, detail, href, onPress, destructive = false, last = false }: {
  label: string; value?: string; detail?: string; href?: Href; onPress?: () => void;
  destructive?: boolean; last?: boolean;
}): React.JSX.Element {
  const colors = useThemeColors();
  const content = (
    <Pressable
      accessibilityRole={href || onPress ? 'button' : 'text'}
      onPress={() => {
        onPress?.();
        if (href) router.push(href);
      }}
      style={({ pressed }) => ({
        minHeight: metrics.rowHeight, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
        flexDirection: 'row', alignItems: 'center', gap: spacing.md,
        backgroundColor: pressed ? colors.elevated : colors.surface,
        borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.separator,
      })}
    >
      <View style={{ flex: 1, gap: 3 }}>
        <Text selectable style={{ color: destructive ? colors.destructive : colors.label, fontSize: 16 }}>{label}</Text>
        {detail ? <Text selectable numberOfLines={2} style={{ color: colors.secondaryLabel, fontSize: 13, lineHeight: 18 }}>{detail}</Text> : null}
      </View>
      {value ? <Text selectable numberOfLines={1} style={{ maxWidth: '45%', color: colors.secondaryLabel, fontSize: 14 }}>{value}</Text> : null}
      {href || onPress ? <Text style={{ color: colors.tertiaryLabel, fontSize: 22 }}>›</Text> : null}
    </Pressable>
  );
  return content;
}

export function NativeButton({ label, onPress, disabled = false, variant = 'filled' }: {
  label: string; onPress: () => void; disabled?: boolean; variant?: 'filled' | 'outlined' | 'text';
}): React.JSX.Element {
  // 连接页与其他操作共用按钮样式，Android 平板也保持一致的圆角和蓝色。
  return <ActionButton label={label} onPress={onPress} disabled={disabled} variant={variant} />;
}

export function ActionButton({ label, onPress, disabled = false, destructive = false, secondary = false, variant = 'filled' }: {
  label: string; onPress: () => void; disabled?: boolean; destructive?: boolean; secondary?: boolean;
  variant?: 'filled' | 'outlined' | 'text';
}): React.JSX.Element {
  const colors = useThemeColors();
  const filled = !secondary && variant === 'filled';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => {
        if (process.env.EXPO_OS === 'ios') void Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => ({
        minHeight: metrics.controlHeight, minWidth: 44, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: 12, borderCurve: 'continuous',
        backgroundColor: filled ? destructive ? colors.buttonDestructive : colors.buttonPrimary : secondary ? colors.elevated : 'transparent',
        borderWidth: variant === 'outlined' ? 1 : 0,
        borderColor: destructive ? colors.destructive : colors.primary,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      })}
    >
      <Text style={{ color: filled ? colors.onPrimary : destructive ? colors.destructive : secondary ? colors.label : colors.primary, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
}

export function Field({ style, ...props }: TextInputProps): React.JSX.Element {
  const colors = useThemeColors();
  return <TextInput placeholderTextColor={colors.tertiaryLabel} autoCorrect={false} style={[{
    minHeight: metrics.controlHeight, color: colors.label, backgroundColor: colors.input,
    borderColor: colors.separator, borderWidth: 1, borderRadius: 12, borderCurve: 'continuous',
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
  }, style]} {...props} />;
}

export function StatusBanner({ message, tone = 'neutral' }: { message: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' }): React.JSX.Element {
  const colors = useThemeColors();
  const color = tone === 'success' ? colors.success : tone === 'warning' ? colors.warning : tone === 'danger' ? colors.destructive : colors.secondaryLabel;
  return (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}>
      <Text style={{ color, fontSize: 13 }}>●</Text>
      <Text selectable style={{ color, flex: 1, fontSize: 13, lineHeight: 18 }}>{message}</Text>
    </Animated.View>
  );
}

export function EmptyState({ title, detail }: { title: string; detail: string }): React.JSX.Element {
  const colors = useThemeColors();
  return <View style={{ alignItems: 'center', padding: spacing.xxxl, gap: spacing.sm }}>
    <Text selectable style={{ color: colors.label, fontSize: 17, fontWeight: '600' }}>{title}</Text>
    <Text selectable style={{ color: colors.secondaryLabel, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>{detail}</Text>
  </View>;
}
