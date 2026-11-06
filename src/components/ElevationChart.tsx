import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ElevationPoint } from '../types/trail';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  profile: ElevationPoint[];
  elevationGainM: number;
  elevationMaxM: number;
}

export const ElevationChart: React.FC<Props> = ({
  profile,
  elevationGainM,
  elevationMaxM,
}) => {
  if (!profile || profile.length === 0) return null;

  const minAlt = Math.min(...profile.map((p) => p.altitude));
  const maxAlt = Math.max(...profile.map((p) => p.altitude));
  const range = Math.max(maxAlt - minAlt, 100);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
          <Text style={styles.title}>Profil Altimétrique</Text>
        </View>
        <View style={styles.statsBadge}>
          <Text style={styles.statsBadgeText}>+{elevationGainM} m D+</Text>
        </View>
      </View>

      <View style={styles.chartArea}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxAlt}m</Text>
          <Text style={styles.axisLabel}>{Math.round((maxAlt + minAlt) / 2)}m</Text>
          <Text style={styles.axisLabel}>{minAlt}m</Text>
        </View>

        {/* Bars/Profile Visualization */}
        <View style={styles.barsContainer}>
          {profile.map((point, index) => {
            const heightPercent = Math.max(15, Math.round(((point.altitude - minAlt) / range) * 85));
            const isHighest = point.altitude === maxAlt;

            return (
              <View key={`pt-${index}`} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPercent}%` },
                      isHighest && styles.barFillHighest,
                    ]}
                  />
                </View>
                <Text style={styles.xLabel}>{point.km}k</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <Text style={styles.legendLabel}>Altitude min :</Text>
          <Text style={styles.legendValue}>{minAlt} m</Text>
        </View>
        <View style={styles.legendDivider} />
        <View style={styles.legendItem}>
          <Text style={styles.legendLabel}>Point culminant :</Text>
          <Text style={styles.legendValue}>{elevationMaxM} m</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statsBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
  },
  statsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  chartArea: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  yAxis: {
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
    width: 50,
  },
  axisLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderDark,
    paddingBottom: 2,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '60%',
    height: 95,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xs,
    width: '100%',
  },
  barFillHighest: {
    backgroundColor: theme.colors.accent,
  },
  xLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  legendDivider: {
    width: 1,
    height: 14,
    backgroundColor: theme.colors.border,
  },
});
