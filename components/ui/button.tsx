import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import {
  DineFlowColors,
  DineFlowFontFamily,
  DineFlowRadius,
  DineFlowSpacing,
  DineFlowTypography,
} from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  loading = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const labelStyle = variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && !isDisabled && (variant === 'primary' ? styles.primaryPressed : styles.secondaryPressed),
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? DineFlowColors.surface : DineFlowColors.primary} />
      ) : (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: DineFlowSpacing.touchTarget,
    paddingHorizontal: DineFlowSpacing.md,
    borderRadius: DineFlowRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: DineFlowColors.primary,
  },
  primaryPressed: {
    backgroundColor: DineFlowColors.primaryPressed,
  },
  secondary: {
    backgroundColor: DineFlowColors.surface,
    borderWidth: 2,
    borderColor: DineFlowColors.secondaryContainer,
  },
  secondaryPressed: {
    backgroundColor: DineFlowColors.primarySoft,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...DineFlowTypography.label,
    fontFamily: DineFlowFontFamily,
  },
  primaryLabel: {
    color: DineFlowColors.surface,
  },
  secondaryLabel: {
    color: DineFlowColors.primary,
  },
});
