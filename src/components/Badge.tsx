import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../theme';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  style?: ViewStyle;
}

const variantStyles = {
  default: {
    bg: colors.primaryLight,
    border: colors.primaryBorder,
    text: colors.primary,
    dot: colors.primary,
  },
  success: {
    bg: colors.successLight,
    border: colors.success + '40',
    text: colors.success,
    dot: colors.success,
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning + '40',
    text: colors.warning,
    dot: colors.warning,
  },
  error: {
    bg: colors.errorLight,
    border: colors.error + '40',
    text: colors.error,
    dot: colors.error,
  },
  info: {
    bg: colors.infoLight,
    border: colors.info + '40',
    text: colors.info,
    dot: colors.info,
  },
};

export function Badge({ children, variant = 'default', dot = false, style }: BadgeProps) {
  const v = variantStyles[variant];

  return (
    <View style={[styles.base, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: v.dot }]} />}
      <Text style={[styles.text, { color: v.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...typography.xs,
    fontWeight: '600',
  },
});
