import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

export interface ToastProps {
  message: string;
  description?: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  onClose?: () => void;
  visible: boolean;
  style?: ViewStyle;
}

const variantConfig = {
  default: {
    bg: colors.surface,
    border: colors.border,
    icon: '💬',
    textColor: colors.textPrimary,
  },
  success: {
    bg: colors.successLight,
    border: colors.success + '40',
    icon: '✓',
    textColor: colors.success,
  },
  error: {
    bg: colors.errorLight,
    border: colors.error + '40',
    icon: '✕',
    textColor: colors.error,
  },
  warning: {
    bg: colors.warningLight,
    border: colors.warning + '40',
    icon: '⚠',
    textColor: colors.warning,
  },
  info: {
    bg: colors.infoLight,
    border: colors.info + '40',
    icon: 'ℹ',
    textColor: colors.info,
  },
};

export function Toast({
  message,
  description,
  variant = 'default',
  position = 'top',
  duration = 3000,
  onClose,
  visible,
  style,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const v = variantConfig[variant];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 6,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => hide(), duration);
        return () => clearTimeout(timer);
      }
    } else {
      hide();
    }
  }, [visible]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose?.());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.top : styles.bottom,
        { transform: [{ translateY }], opacity },
        style,
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
          },
        ]}
      >
        <Text style={[styles.icon, { color: v.textColor }]}>{v.icon}</Text>
        <View style={styles.content}>
          <Text style={[styles.message, { color: v.textColor }]}>{message}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        {onClose && (
          <TouchableOpacity onPress={hide} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  top: {
    top: Platform.OS === 'ios' ? 60 : 40,
  },
  bottom: {
    bottom: Platform.OS === 'ios' ? 100 : 80,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.xl,
    borderWidth: 1,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  message: {
    ...typography.sm,
    fontWeight: '600',
  },
  description: {
    ...typography.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
