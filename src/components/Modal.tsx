import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

export type ModalVariant = 'default' | 'sheet' | 'alert' | 'fullscreen';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: ModalVariant;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  variant = 'default',
  closeOnBackdrop = true,
  showCloseButton = true,
  style,
  contentStyle,
}: ModalProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 4,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: variant === 'sheet' ? 100 : 20,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const isSheet = variant === 'sheet';
  const isFullscreen = variant === 'fullscreen';

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        {/* Backdrop */}
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
        <Pressable
          style={styles.backdropPress}
          onPress={closeOnBackdrop ? onClose : undefined}
        />

        {/* Content */}
        <Animated.View
          style={[
            isSheet ? styles.sheet : isFullscreen ? styles.fullscreen : styles.dialog,
            { transform: [{ translateY }, ...(isSheet ? [] : [{ scale }])] },
            style,
          ]}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Body */}
          <View style={[styles.body, contentStyle]}>{children}</View>
        </Animated.View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

// Alert Modal shorthand
export interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function AlertModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
}: AlertModalProps) {
  return (
    <Modal visible={visible} onClose={onCancel} showCloseButton={false} closeOnBackdrop={false}>
      <Text style={styles.alertTitle}>{title}</Text>
      <Text style={styles.alertMessage}>{message}</Text>
      <View style={styles.alertActions}>
        <Pressable
          onPress={onCancel}
          style={[styles.alertBtn, styles.alertBtnCancel]}
        >
          <Text style={styles.alertBtnCancelText}>{cancelText}</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[
            styles.alertBtn,
            destructive ? styles.alertBtnDestructive : styles.alertBtnConfirm,
          ]}
        >
          <Text
            style={[
              styles.alertBtnConfirmText,
              destructive && { color: colors.error },
            ]}
          >
            {confirmText}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    width: '88%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl + 4,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
    overflow: 'hidden',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl + 4,
    borderTopRightRadius: radius.xl + 4,
    borderWidth: 1,
    borderColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  body: {
    padding: spacing.lg,
  },
  alertTitle: {
    ...typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  alertMessage: {
    ...typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  alertActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  alertBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  alertBtnCancel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertBtnCancelText: {
    ...typography.base,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  alertBtnConfirm: {
    backgroundColor: colors.primary,
  },
  alertBtnDestructive: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  alertBtnConfirmText: {
    ...typography.base,
    fontWeight: '700',
    color: '#000',
  },
});
