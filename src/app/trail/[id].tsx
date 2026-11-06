import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Share,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TRAILS_DATA } from '../../data/trails';
import { theme } from '../../constants/theme';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { ElevationChart } from '../../components/ElevationChart';
import { WeatherCard } from '../../components/WeatherCard';
import { useFavorites } from '../../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function TrailDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const trail = TRAILS_DATA.find((item) => item.id === id);

  if (!trail) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={54} color={theme.colors.danger} />
        <Text style={styles.notFoundTitle}>Sentier introuvable</Text>
        <Text style={styles.notFoundText}>
          Ce sentier n’existe pas ou a été déplacé.
        </Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour aux sentiers</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorite(trail.id);

  const handleShare = async () => {
    try {
      await Share.share({
        title: trail.title,
        message: `Découvre la randonnée "${trail.title}" (${trail.distanceKm} km, +${trail.elevationGainM}m D+) sur TrailMap !`,
      });
    } catch (err) {
      console.error('Erreur partage:', err);
    }
  };

  const handleOpenMaps = () => {
    const { latitude, longitude } = trail.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d’ouvrir l’application de cartographie.');
    });
  };

  const handleDownloadOffline = () => {
    Alert.alert(
      'Topo enregistré',
      `Le tracé de "${trail.title}" ainsi que sa carte ont été sauvegardés en cache local pour consultation hors-ligne.`
    );
  };

  const handleStartTrail = () => {
    Alert.alert(
      'Bonne randonnée ! 🥾',
      `Guidage GPS activé pour "${trail.title}". Pense à vérifier la météo et à emporter suffisamment d’eau.`
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: trail.title,
          headerRight: () => (
            <View style={styles.headerRightRow}>
              <Pressable
                onPress={handleShare}
                hitSlop={8}
                style={styles.headerIconBtn}
                accessibilityLabel="Partager le sentier"
              >
                <Ionicons name="share-outline" size={22} color={theme.colors.text} />
              </Pressable>
              <Pressable
                onPress={() => toggleFavorite(trail.id)}
                hitSlop={8}
                style={styles.headerIconBtn}
                accessibilityLabel={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Ionicons
                  name={favorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={favorite ? theme.colors.danger : theme.colors.text}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <View style={styles.wrapper}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: 80 + Math.max(insets.bottom, 16) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image source={{ uri: trail.imageUrl }} style={styles.heroImage} resizeMode="cover" />
            <View style={styles.heroBadges}>
              <DifficultyBadge difficulty={trail.difficulty} size="medium" />
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{trail.trailType}</Text>
              </View>
            </View>
          </View>

          {/* Title & Region */}
          <View style={styles.mainInfoSection}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={theme.colors.primary} />
              <Text style={styles.locationText}>{trail.location} • {trail.region}</Text>
            </View>

            <Text style={styles.title}>{trail.title}</Text>
            <Text style={styles.subtitle}>{trail.subtitle}</Text>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <View style={styles.starsBox}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.ratingScore}>{trail.rating}</Text>
              </View>
              <Text style={styles.reviewsCount}>Basé sur {trail.reviewsCount} avis de randonneurs</Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBanner}>
            <View style={styles.metricCard}>
              <Ionicons name="map-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.metricVal}>{trail.distanceKm} km</Text>
              <Text style={styles.metricDesc}>Distance</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCard}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.metricVal}>{trail.duration}</Text>
              <Text style={styles.metricDesc}>Durée est.</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCard}>
              <Ionicons name="trending-up" size={20} color={theme.colors.primary} />
              <Text style={styles.metricVal}>+{trail.elevationGainM}m</Text>
              <Text style={styles.metricDesc}>Dénivelé D+</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCard}>
              <Ionicons name="flag-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.metricVal}>{trail.elevationMaxM}m</Text>
              <Text style={styles.metricDesc}>Altitude max</Text>
            </View>
          </View>

          {/* Weather Widget */}
          <WeatherCard weather={trail.weather} />

          {/* Elevation Profile Chart */}
          <ElevationChart
            profile={trail.elevationProfile}
            elevationGainM={trail.elevationGainM}
            elevationMaxM={trail.elevationMaxM}
          />

          {/* Highlights */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="sparkles" size={18} color={theme.colors.accent} />
              <Text style={styles.sectionTitle}>Points forts du parcours</Text>
            </View>
            <View style={styles.highlightsList}>
              {trail.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightRow}>
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={12} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description & Topo */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Description & Topo-Guide</Text>
            </View>
            <Text style={styles.descriptionText}>{trail.description}</Text>

            {/* Author */}
            <View style={styles.authorRow}>
              <View style={styles.authorAvatar}>
                <Ionicons name="person" size={16} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.authorName}>{trail.author.name}</Text>
                <Text style={styles.authorRole}>{trail.author.role}</Text>
              </View>
            </View>
          </View>

          {/* Recommended Gear */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Équipement conseillé</Text>
            </View>
            <View style={styles.gearList}>
              {trail.gearRecommendations.map((gear, index) => (
                <View key={index} style={styles.gearItem}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.primary} />
                  <Text style={styles.gearText}>{gear}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* GPS Coordinates & Map Launcher */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="navigate-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Coordonnées GPS du départ</Text>
            </View>
            <Text style={styles.coordsText}>
              Latitude : {trail.coordinates.latitude.toFixed(4)}° N | Longitude : {trail.coordinates.longitude.toFixed(4)}° E
            </Text>
            <Pressable
              style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
              onPress={handleOpenMaps}
            >
              <Ionicons name="navigate" size={18} color={theme.colors.white} />
              <Text style={styles.mapButtonText}>Itinéraire vers le point de départ</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Floating Bottom Action Bar */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable
            style={({ pressed }) => [styles.secondaryActionBtn, pressed && styles.actionBtnPressed]}
            onPress={handleDownloadOffline}
          >
            <Ionicons name="download-outline" size={20} color={theme.colors.text} />
            <Text style={styles.secondaryActionText}>Hors-ligne</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.actionBtnPressed]}
            onPress={handleStartTrail}
          >
            <Ionicons name="footsteps" size={20} color={theme.colors.white} />
            <Text style={styles.primaryActionText}>Démarrer la rando</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 110,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 4,
  },
  heroContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: theme.colors.surfaceSubtle,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
  },
  typeBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  mainInfoSection: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#b45309',
  },
  reviewsCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  metricsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 4,
  },
  metricDesc: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  highlightsList: {
    gap: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  highlightText: {
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 18,
  },
  descriptionText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceSubtle,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  authorRole: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  gearList: {
    gap: 8,
  },
  gearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gearText: {
    fontSize: 13,
    color: theme.colors.text,
  },
  coordsText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    gap: 8,
  },
  mapButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  mapButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
    gap: 8,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.full,
  },
  backButtonText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});