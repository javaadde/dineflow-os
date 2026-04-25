import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { DineFlowColors, DineFlowRadius, DineFlowShadows, DineFlowSpacing } from '@/constants/theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}>;

export function Card({ children, style, padded = true }: CardProps) {
  return <View style={[styles.card, !padded && styles.flush, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: DineFlowColors.surface,
    borderRadius: DineFlowRadius.xl,
    padding: DineFlowSpacing.md,
    ...DineFlowShadows.level1,
  },
  flush: {
    padding: 0,
  },
});
