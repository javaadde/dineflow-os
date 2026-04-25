import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import {
  DineFlowColors,
  DineFlowFontFamily,
  DineFlowRadius,
  DineFlowShadows,
  DineFlowSpacing,
  DineFlowTypography,
} from '@/constants/theme';

type InputProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...props}
        placeholderTextColor={DineFlowColors.textSecondary}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: DineFlowRadius.pill,
    backgroundColor: DineFlowColors.surface,
    paddingHorizontal: DineFlowSpacing.md,
    minHeight: DineFlowSpacing.touchTarget,
    justifyContent: 'center',
    ...DineFlowShadows.level1,
  },
  input: {
    color: DineFlowColors.textPrimary,
    ...DineFlowTypography.body,
    fontFamily: DineFlowFontFamily,
    padding: 0,
  },
});
