import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { TrailCard } from '../../components/TrailCard';
import { EmptyState } from '../../components/EmptyState';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteTrails, favoritesCount } = useFavorites();

  const totalDistance = favoriteTrails.reduce((acc, t) => acc + t.distanceKm, 0);
  const totalElevation = favoriteTrails.reduce((acc, t) => acc + t.elevationGainM, 0);

  const renderHeader = () => {
    if (favoritesCount === 0) return null;

    return (
      <View style={styles.statsBanner}>
        <View style={styles.statColumn}>
          <View style={styles.statIconRow}>
            <Ionicons name="bookmark" size={16} color={theme.colors.primary} />
            <Text style={styles.statValue}>{favoritesCount}</Text>
          </View>
          <Text style={styles.statLabel}>Sentiers</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <View style={styles.statIconRow}>
            <Ionicons name="map" size={16} color={theme.colors.primary} />
            <Text style={styles.statValue}>{totalDistance.toFixed(1)} km</Text>
          </View>
          <Text style={styles.statLabel}>Distance totale</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statColumn}>
          <View style={styles.statIconRow}>
            <Ionicons name="trending-up" size={16} color={theme.colors.primary} />
            <Text style={styles.statValue}>+{totalElevation} m</Text>
          </View>
          <Text style={styles.statLabel}>Dénivelé total</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteTrails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrailCard
            trail={item}
            onSelectTag={() => router.push('/(tabs)')}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader() ?? undefined}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Aucun sentier favori"
            description="Enregistre tes randonnées coups de cœur en appuyant sur le cœur pour les retrouver facilement hors-ligne."
            actionLabel="Explorer les sentiers"
            onAction={() => router.push('/(tabs)')}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.borderDark,
    opacity: 0.6,
  },
});