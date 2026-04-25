import { StyleSheet, Text, View } from 'react-native';

import {
  DineFlowColors,
  DineFlowFontFamily,
  DineFlowRadius,
  DineFlowSpacing,
  DineFlowTypography,
} from '@/constants/theme';

type StatusVariant = 'pending' | 'cooking' | 'ready' | 'available' | 'occupied' | 'neutral';

type StatusBadgeProps = {
  label: string;
  variant: StatusVariant;
};

const badgeMap = {
  pending: { bg: '#FFF7ED', color: DineFlowColors.warning },
  cooking: { bg: DineFlowColors.primarySoft, color: DineFlowColors.primary },
  ready: { bg: '#ECFDF3', color: DineFlowColors.success },
  available: { bg: '#ECFDF3', color: DineFlowColors.success },
  occupied: { bg: DineFlowColors.primarySoft, color: DineFlowColors.primary },
  neutral: { bg: DineFlowColors.surfaceContainerHigh, color: DineFlowColors.textSecondary },
} as const;

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  const style = badgeMap[variant];

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: DineFlowRadius.pill,
    paddingHorizontal: DineFlowSpacing.sm,
    paddingVertical: DineFlowSpacing.xs,
  },
  text: {
    ...DineFlowTypography.labelSmall,
    fontFamily: DineFlowFontFamily,
  },
});
