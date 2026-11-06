import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrailWeather } from '../types/trail';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  weather: TrailWeather;
}

export const WeatherCard: React.FC<Props> = ({ weather }) => {
  const getWeatherIcon = (
    condition: TrailWeather['condition']
  ): { name: keyof typeof Ionicons.glyphMap; color: string } => {
    switch (condition) {
      case 'Ensoleillé':
        return { name: 'sunny', color: '#f59e0b' };
      case 'Nuageux':
        return { name: 'cloud', color: '#64748b' };
      case 'Pluvieux':
        return { name: 'rainy', color: '#0284c7' };
      case 'Brouillard':
        return { name: 'cloud-outline', color: '#94a3b8' };
      case 'Orageux':
        return { name: 'thunderstorm', color: '#7c3aed' };
    }
  };

  const iconInfo = getWeatherIcon(weather.condition);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="partly-sunny" size={20} color={theme.colors.primary} />
          <Text style={styles.title}>Météo du Sentier</Text>
        </View>
        <View style={styles.conditionBadge}>
          <Ionicons name={iconInfo.name} size={16} color={iconInfo.color} />
          <Text style={styles.conditionText}>{weather.condition}</Text>
        </View>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.tempGroup}>
          <Text style={styles.temp}>{weather.temp}°C</Text>
          <Text style={styles.tempLabel}>Ressenti actuel</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Ionicons name="speedometer-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.metricValue}>{weather.windKmH} km/h</Text>
            <Text style={styles.metricLabel}>Vent</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="sunny-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.metricValue}>UV {weather.uvIndex}</Text>
            <Text style={styles.metricLabel}>Indice</Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="water-outline" size={16} color={theme.colors.textMuted} />
            <Text style={styles.metricValue}>{weather.humidity}%</Text>
            <Text style={styles.metricLabel}>Humidité</Text>
          </View>
        </View>
      </View>

      <View style={styles.adviceBox}>
        <Ionicons name="information-circle" size={18} color={theme.colors.primary} />
        <Text style={styles.adviceText}>{weather.advice}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tempGroup: {
    justifyContent: 'center',
  },
  temp: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text,
  },
  tempLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: -2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  adviceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: 10,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  adviceText: {
    fontSize: 12,
    color: theme.colors.primaryDark,
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
});
