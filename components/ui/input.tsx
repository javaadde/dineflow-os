import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';

import {
  DineFlowColors,
  DineFlowRadius,
  DineFlowSpacing,
  DineFlowTypography,
} from '@/constants/theme';

type InputProps = TextInputProps;

export function Input(props: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={DineFlowColors.textSecondary}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: DineFlowColors.border,
    borderRadius: DineFlowRadius.pill,
    backgroundColor: DineFlowColors.surface,
    paddingHorizontal: DineFlowSpacing.lg,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    color: DineFlowColors.textPrimary,
    fontSize: DineFlowTypography.body,
    padding: 0,
  },
});
