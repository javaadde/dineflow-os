import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import {
  DineFlowColors,
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
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && !disabled && (variant === 'primary' ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}>
      <Text style={[styles.label, variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: DineFlowSpacing.xl,
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
    borderWidth: 1,
    borderColor: DineFlowColors.border,
  },
  secondaryPressed: {
    backgroundColor: '#F9FAFB',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: DineFlowTypography.button,
    fontWeight: '600',
  },
  primaryLabel: {
    color: DineFlowColors.surface,
  },
  secondaryLabel: {
    color: DineFlowColors.textPrimary,
  },
});
