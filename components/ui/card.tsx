import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { DineFlowColors, DineFlowRadius, DineFlowShadow, DineFlowSpacing } from '@/constants/theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DineFlowColors.surface,
    borderRadius: DineFlowRadius.md,
    padding: DineFlowSpacing.lg,
    ...DineFlowShadow,
  },
});
