import { useColorScheme, type ColorSchemeName } from 'react-native';

/**
 * 两个平台共用 Apple 风格的语义色，避免 Android 系统品牌色改变应用外观。
 * 组件通过 hook 订阅外观变化，切换时只重新渲染，不卸载连接与终端 Provider。
 */
const lightColors = {
  background: '#F2F2F7',
  grouped: '#F2F2F7',
  surface: '#FFFFFF',
  elevated: '#E5E5EA',
  separator: 'rgba(60,60,67,0.18)',
  primary: '#007AFF',
  buttonPrimary: '#0066CC',
  buttonDestructive: '#C9342C',
  onPrimary: '#FFFFFF',
  success: '#218739',
  warning: '#8A6200',
  destructive: '#C9342C',
  label: '#111114',
  secondaryLabel: '#636366',
  tertiaryLabel: '#6C6C70',
  input: '#FFFFFF',
};

export type ThemeColors = typeof lightColors;

const darkColors: ThemeColors = {
  background: '#0B0D10',
  grouped: '#111419',
  surface: '#171A20',
  elevated: '#262A32',
  separator: 'rgba(255,255,255,0.10)',
  primary: '#0A84FF',
  buttonPrimary: '#0066CC',
  buttonDestructive: '#C9342C',
  onPrimary: '#FFFFFF',
  success: '#30D158',
  warning: '#FFD60A',
  destructive: '#FF453A',
  label: '#F5F5F7',
  secondaryLabel: '#A1A1AA',
  tertiaryLabel: '#98989F',
  input: '#0D1014',
};

export function getThemeColors(scheme: ColorSchemeName): ThemeColors {
  return scheme === 'light' ? lightColors : darkColors;
}

export function useThemeColors(): ThemeColors {
  return getThemeColors(useColorScheme());
}

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

export const metrics = {
  maxContentWidth: 760,
  maxWideContentWidth: 1280,
  rowHeight: 58,
  controlHeight: 50,
  radius: 14,
} as const;
