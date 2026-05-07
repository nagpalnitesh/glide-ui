import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '../theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy' | 'away';
  style?: ViewStyle;
}

const sizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const statusColors = {
  online: colors.success,
  offline: colors.textMuted,
  busy: colors.error,
  away: colors.warning,
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function stringToColor(str: string) {
  const palette = [colors.primary, colors.success, '#f97316', '#ec4899', '#06b6d4'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({ src, name = '', size = 'md', status, style }: AvatarProps) {
  const dim = sizes[size];
  const bg = stringToColor(name);
  const statusDim = dim * 0.28;

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      {src ? (
        <Image
          source={{ uri: src }}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
        />
      ) : (
        <View style={[styles.fallback, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: bg }]}>
          <Text style={[styles.initials, { fontSize: dim * 0.35, color: '#fff' }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {status && (
        <View style={[
          styles.status,
          {
            width: statusDim,
            height: statusDim,
            borderRadius: statusDim / 2,
            backgroundColor: statusColors[status],
            bottom: 0,
            right: 0,
          },
        ]} />
      )}
    </View>
  );
}

// Avatar group
export function AvatarGroup({ avatars, max = 3 }: { avatars: AvatarProps[]; max?: number }) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={styles.group}>
      {visible.map((a, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: visible.length - i }}>
          <Avatar {...a} size="sm" style={styles.groupItem} />
        </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.fallback, styles.groupItem, styles.remainder, { marginLeft: -10 }]}>
          <Text style={styles.remainderText}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {},
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
  status: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderWidth: 2,
    borderColor: colors.bg,
  },
  remainder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  remainderText: {
    ...typography.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
