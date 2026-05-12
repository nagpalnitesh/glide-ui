import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

// Linear Progress
export interface ProgressProps {
  value: number; // 0-100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export function Progress({
  value,
  color = colors.primary,
  trackColor = 'rgba(255,255,255,0.08)',
  height = 6,
  showLabel = false,
  label,
  animated = true,
  style,
}: ProgressProps) {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(width, {
        toValue: Math.min(Math.max(value, 0), 100),
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      width.setValue(Math.min(Math.max(value, 0), 100));
    }
  }, [value]);

  return (
    <View style={[styles.container, style]}>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label || 'Progress'}</Text>
          <Text style={styles.valueText}>{Math.round(value)}%</Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2, backgroundColor: trackColor },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              borderRadius: height / 2,
              backgroundColor: color,
              width: width.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

// Circular Progress
export interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showLabel?: boolean;
  style?: ViewStyle;
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 4,
  color = colors.primary,
  trackColor = 'rgba(255,255,255,0.08)',
  showLabel = true,
  style,
}: CircularProgressProps) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: value / 100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      {/* Track */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: trackColor,
          position: 'absolute',
        }}
      />
      {/* Progress indicator (simple rotation approach) */}
      <Animated.View
        style={{
          width: size - strokeWidth,
          height: (size - strokeWidth) / 2,
          borderTopLeftRadius: (size - strokeWidth) / 2,
          borderTopRightRadius: (size - strokeWidth) / 2,
          borderTopWidth: strokeWidth,
          borderLeftWidth: strokeWidth,
          borderRightWidth: strokeWidth,
          borderColor: color,
          position: 'absolute',
          top: 0,
          transform: [{ rotate: spin }],
          transformOrigin: `${(size - strokeWidth) / 2}px ${(size - strokeWidth) / 2}px`,
        }}
      />
      {showLabel && (
        <Text style={[styles.circularLabel, { fontSize: size * 0.22 }]}>
          {Math.round(value)}%
        </Text>
      )}
    </View>
  );
}

// Stepped Progress
export interface SteppedProgressProps {
  steps: number;
  currentStep: number;
  color?: string;
  style?: ViewStyle;
}

export function SteppedProgress({
  steps,
  currentStep,
  color = colors.primary,
  style,
}: SteppedProgressProps) {
  return (
    <View style={[styles.steppedContainer, style]}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            { flex: 1 },
            i < currentStep
              ? { backgroundColor: color }
              : { backgroundColor: 'rgba(255,255,255,0.08)' },
            i < steps - 1 && { marginRight: 4 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  labelText: {
    ...typography.sm,
    color: colors.textSecondary,
  },
  valueText: {
    ...typography.sm,
    color: colors.textMuted,
  },
  track: {
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  circularLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  steppedContainer: {
    flexDirection: 'row',
    height: 4,
  },
  step: {
    borderRadius: 2,
  },
});
