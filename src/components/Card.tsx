import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '../theme';

export type CardVariant = 'default' | 'bordered' | 'elevated';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({
  children,
  variant = 'default',
  onPress,
  style,
  padding = spacing.lg,
}: CardProps) {
  const content = (
    <View style={[styles.base, styles[variant], { padding }, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && { opacity: 0.85 }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  default: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: colors.border,
  },
  bordered: {
    backgroundColor: 'transparent',
    borderColor: colors.borderHover,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
