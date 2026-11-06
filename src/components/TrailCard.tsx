import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Trail } from '../types/trail';
import { theme } from '../constants/theme';
import { DifficultyBadge } from './DifficultyBadge';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  trail: Trail;
  onSelectTag?: (tag: string) => void;
}

export const TrailCard: React.FC<Props> = ({ trail, onSelectTag }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(trail.id);

  const handleCardPress = () => {
    router.push({
      pathname: '/trail/[id]',
      params: { id: trail.id },
    });
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(trail.id);
  };

  const handleTagPress = (tag: string, e: any) => {
    e.stopPropagation();
    if (onSelectTag) {
      onSelectTag(tag);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Pressable
        style={({ pressed }) => [styles.cardInner, pressed && styles.cardPressed]}
        onPress={handleCardPress}
        accessibilityRole="button"
        accessibilityLabel={`Sentier ${trail.title}, difficulté ${trail.difficulty}, distance ${trail.distanceKm} kilomètres`}
      >
        {/* Cover Image & Badges */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: trail.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Top Badges Row */}
          <View style={styles.topBadgesRow}>
            <DifficultyBadge difficulty={trail.difficulty} />
            <Pressable
              style={({ pressed }) => [
                styles.favoriteButton,
                favorite && styles.favoriteButtonActive,
                pressed && styles.favoriteButtonPressed,
              ]}
              onPress={handleFavoritePress}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={20}
                color={favorite ? theme.colors.danger : theme.colors.text}
              />
            </Pressable>
          </View>

          {/* Trail Type Pill */}
          <View style={styles.trailTypeBadge}>
            <Ionicons
              name={
                trail.trailType === 'Boucle'
                  ? 'repeat-outline'
                  : trail.trailType === 'Aller-retour'
                  ? 'swap-horizontal-outline'
                  : 'arrow-forward-outline'
              }
              size={12}
              color={theme.colors.white}
              style={styles.trailTypeIcon}
            />
            <Text style={styles.trailTypeText}>{trail.trailType}</Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.body}>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={13} color={theme.colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {trail.location} • {trail.region}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {trail.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {trail.subtitle}
          </Text>

          {/* Metrics Grid */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Ionicons name="map-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.metricValue}>{trail.distanceKm}</Text>
              <Text style={styles.metricUnit}>km</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
              <Text style={styles.metricValue}>{trail.duration}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Ionicons name="trending-up" size={14} color={theme.colors.textMuted} />
              <Text style={styles.metricValue}>+{trail.elevationGainM}</Text>
              <Text style={styles.metricUnit}>m</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Ionicons name="star" size={13} color="#f59e0b" />
              <Text style={styles.metricValue}>{trail.rating}</Text>
              <Text style={styles.reviewsCount}>({trail.reviewsCount})</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {trail.tags.slice(0, 4).map((tag) => (
              <Pressable
                key={tag}
                style={({ pressed }) => [
                  styles.tag,
                  pressed && onSelectTag && styles.tagPressed,
                ]}
                onPress={(e) => handleTagPress(tag, e)}
                disabled={!onSelectTag}
                hitSlop={4}
              >
                <Text style={styles.tagText}>#{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
    // Cross-platform shadow
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardInner: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    width: '100%',
    height: 190,
    position: 'relative',
    backgroundColor: theme.colors.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadgesRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButtonActive: {
    backgroundColor: '#ffffff',
  },
  favoriteButtonPressed: {
    transform: [{ scale: 0.9 }],
  },
  trailTypeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trailTypeIcon: {
    marginRight: 4,
  },
  trailTypeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    padding: theme.spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radius.md,
    paddingVertical: 9,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.text,
  },
  metricUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  metricDivider: {
    width: 1,
    height: 14,
    backgroundColor: theme.colors.borderDark,
    opacity: 0.6,
  },
  reviewsCount: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  tagPressed: {
    opacity: 0.7,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
});
