import { Platform } from 'react-native';

export const DineFlowColors = {
  background: '#f5f0df',
  surface: '#fdf9f2',
  surfaceContainer: '#ebe4d4',
  surfaceContainerLow: '#f2ece2',
  surfaceContainerHigh: '#e4dcc8',
  surfaceContainerHighest: '#ddd4c0',
  surfaceVariant: '#e3d1b4',
  primary: '#d94624',
  primaryPressed: '#a9351b',
  primarySoft: '#ffdcce',
  primaryMuted: '#ffbea8',
  secondary: '#8b3a35',
  secondaryContainer: '#e87f86',
  tertiary: '#5f3735',
  textPrimary: '#1a1614',
  textSecondary: '#5c4845',
  border: '#d4b59f',
  outline: '#8b756b',
  success: '#15803D',
  warning: '#B45309',
  danger: '#ba1a1a',
  dangerSoft: '#ffdad6',
} as const;

export const DineFlowSpacing = {
  xs: 4,
  sm: 12,
  md: 24,
  lg: 32,
  xl: 48,
  touchTarget: 56,
} as const;

export const DineFlowRadius = {
  sm: 4,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const DineFlowTypography = {
  display: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
  },
  headline: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
} as const;

export const DineFlowShadows = {
  level1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  level2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  nav: {
    shadowColor: '#d94624',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

export const DineFlowFontFamily = 'PlusJakartaSans';

export const DineFlowTheme = {
  colors: DineFlowColors,
  spacing: DineFlowSpacing,
  radius: DineFlowRadius,
  typography: DineFlowTypography,
  shadows: DineFlowShadows,
  fontFamily: DineFlowFontFamily,
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
    sans: DineFlowFontFamily,
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: DineFlowFontFamily,
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "PlusJakartaSans, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
