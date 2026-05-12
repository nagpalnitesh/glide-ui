import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const sizes = {
  sm: { width: 36, height: 20, thumb: 14, padding: 3 },
  md: { width: 44, height: 24, thumb: 18, padding: 3 },
  lg: { width: 52, height: 28, thumb: 22, padding: 3 },
};

export function Switch({
  value,
  onValueChange,
  label,
  disabled = false,
  size = 'md',
  style,
}: SwitchProps) {
  const s = sizes[size];
  const translateX = useRef(new Animated.Value(value ? s.width - s.thumb - s.padding * 2 : 0)).current;
  const bgOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;

  const toggle = () => {
    if (disabled) return;
    const toValue = !value ? s.width - s.thumb - s.padding * 2 : 0;
    Animated.parallel([
      Animated.spring(translateX, {
        toValue,
        useNativeDriver: true,
        bounciness: 4,
      }),
      Animated.timing(bgOpacity, {
        toValue: !value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    onValueChange(!value);
  };

  const trackBg = bgOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.1)', colors.primary],
  });

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: s.width,
            height: s.height,
            borderRadius: s.height / 2,
            backgroundColor: trackBg,
            padding: s.padding,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: s.thumb,
              height: s.thumb,
              borderRadius: s.thumb / 2,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
      {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  thumb: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    ...typography.base,
    color: colors.textPrimary,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
});
