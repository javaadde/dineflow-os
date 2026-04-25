import { StyleSheet, Text, View } from 'react-native';

import {
  DineFlowColors,
  DineFlowRadius,
  DineFlowSpacing,
  DineFlowTypography,
} from '@/constants/theme';

type StatusVariant = 'pending' | 'cooking' | 'ready';

type StatusBadgeProps = {
  label: string;
  variant: StatusVariant;
};

const badgeMap = {
  pending: { bg: '#FFF7ED', color: DineFlowColors.warning },
  cooking: { bg: '#FEF2F2', color: DineFlowColors.primary },
  ready: { bg: '#ECFDF3', color: DineFlowColors.success },
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
    paddingHorizontal: DineFlowSpacing.md,
    paddingVertical: DineFlowSpacing.xs,
  },
  text: {
    fontSize: DineFlowTypography.caption,
    fontWeight: '600',
  },
});
