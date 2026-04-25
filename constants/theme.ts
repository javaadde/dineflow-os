import { Platform } from 'react-native';

export const DineFlowColors = {
  background: '#F3F4F6',
  surface: '#FFFFFF',
  primary: '#B00012',
  primaryPressed: '#8E000E',
  primaryMuted: '#FDE7EA',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#15803D',
  warning: '#B45309',
  danger: '#B00012',
} as const;

export const DineFlowSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const DineFlowRadius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const DineFlowTypography = {
  title: 24,
  heading: 20,
  body: 16,
  caption: 13,
  button: 15,
} as const;

export const DineFlowShadow = {
  shadowColor: '#111827',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
} as const;

export const Colors = {
  light: {
    text: DineFlowColors.textPrimary,
    background: DineFlowColors.background,
    tint: DineFlowColors.primary,
    icon: DineFlowColors.textSecondary,
    tabIconDefault: DineFlowColors.textSecondary,
    tabIconSelected: DineFlowColors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
