import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, Input, StatusBadge } from '@/components/ui';
import { DineFlowColors, DineFlowSpacing, DineFlowTypography } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DineFlow Design System</Text>

      <Card>
        <Text style={styles.cardTitle}>Base Components</Text>
        <Input placeholder="Search tables or orders" />

        <View style={styles.badgesRow}>
          <StatusBadge label="Pending" variant="pending" />
          <StatusBadge label="Cooking" variant="cooking" />
          <StatusBadge label="Ready" variant="ready" />
        </View>

        <View style={styles.buttonRow}>
          <Button label="Primary" fullWidth />
          <Button label="Secondary" variant="secondary" fullWidth />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DineFlowColors.background,
    padding: DineFlowSpacing.lg,
    gap: DineFlowSpacing.lg,
  },
  title: {
    marginTop: DineFlowSpacing.xl,
    fontSize: DineFlowTypography.heading,
    fontWeight: '700',
    color: DineFlowColors.textPrimary,
  },
  cardTitle: {
    marginBottom: DineFlowSpacing.md,
    fontSize: DineFlowTypography.body,
    fontWeight: '600',
    color: DineFlowColors.textPrimary,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DineFlowSpacing.sm,
    marginTop: DineFlowSpacing.md,
  },
  buttonRow: {
    marginTop: DineFlowSpacing.xl,
    gap: DineFlowSpacing.sm,
  },
});
