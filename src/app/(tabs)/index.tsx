import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
  Keyboard,
} from 'react-native';
import { TRAILS_DATA } from '../../data/trails';
import { TrailCard } from '../../components/TrailCard';
import { EmptyState } from '../../components/EmptyState';
import { TrailDifficulty } from '../../types/trail';
import { theme } from '../../constants/theme';
import { filterTrails, normalizeSearchText } from '../../utils/search';
import { Ionicons } from '@expo/vector-icons';

interface DifficultyOption {
  label: 'Tous' | TrailDifficulty;
  colorDot?: string;
  activeBg?: string;
  activeText?: string;
  activeBorder?: string;
}

const DIFFICULTIES: DifficultyOption[] = [
  { label: 'Tous' },
  {
    label: 'Facile',
    colorDot: theme.colors.difficulty.facile.text,
    activeBg: theme.colors.difficulty.facile.bg,
    activeText: theme.colors.difficulty.facile.text,
    activeBorder: theme.colors.difficulty.facile.border,
  },
  {
    label: 'Modéré',
    colorDot: theme.colors.difficulty.modere.text,
    activeBg: theme.colors.difficulty.modere.bg,
    activeText: theme.colors.difficulty.modere.text,
    activeBorder: theme.colors.difficulty.modere.border,
  },
  {
    label: 'Difficile',
    colorDot: theme.colors.difficulty.difficile.text,
    activeBg: theme.colors.difficulty.difficile.bg,
    activeText: theme.colors.difficulty.difficile.text,
    activeBorder: theme.colors.difficulty.difficile.border,
  },
  {
    label: 'Expert',
    colorDot: theme.colors.difficulty.expert.text,
    activeBg: theme.colors.difficulty.expert.bg,
    activeText: theme.colors.difficulty.expert.text,
    activeBorder: theme.colors.difficulty.expert.border,
  },
];

interface CategoryOption {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CATEGORIES: CategoryOption[] = [
  { label: 'Tous', icon: 'sparkles-outline' },
  { label: 'Lacs', icon: 'water-outline' },
  { label: 'Panoramas', icon: 'eye-outline' },
  { label: 'Cascades', icon: 'rainy-outline' },
  { label: 'Sommets', icon: 'triangle-outline' },
  { label: 'Baignade', icon: 'boat-outline' },
  { label: 'Volcans', icon: 'flame-outline' },
  { label: 'Forêt', icon: 'leaf-outline' },
  { label: 'Mer', icon: 'sunny-outline' },
];

const POPULAR_SEARCHES = ['Mont-Blanc', 'Calanques', 'Gavarnie', 'GR20', 'Volcans', 'Cascades'];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Tous' | TrailDifficulty>('Tous');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Filtrage robuste insensible à la casse, aux accents et aux séparateurs
  const filteredTrails = useMemo(() => {
    return filterTrails(TRAILS_DATA, {
      searchQuery,
      difficulty: selectedDifficulty,
      category: selectedCategory,
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedDifficulty !== 'Tous' ||
    selectedCategory !== 'Tous';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('Tous');
    setSelectedCategory('Tous');
    Keyboard.dismiss();
  };

  const handleToggleDifficulty = (difficulty: 'Tous' | TrailDifficulty) => {
    setSelectedDifficulty((prev) => (prev === difficulty ? 'Tous' : difficulty));
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? 'Tous' : category));
  };

  const handleSelectTagFromCard = (tag: string) => {
    const matchingCat = CATEGORIES.find(
      (c) => normalizeSearchText(c.label) === normalizeSearchText(tag)
    );
    if (matchingCat && matchingCat.label !== 'Tous') {
      setSelectedCategory(matchingCat.label);
    } else {
      setSearchQuery(tag);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Intro Header */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingTextContainer}>
          <Text style={styles.greetingTitle}>Prêt pour l’aventure ?</Text>
          <Text style={styles.greetingSubtitle}>
            Découvre les plus beaux sentiers et massifs sauvages
          </Text>
        </View>
        <View style={styles.compassBadge}>
          <Ionicons name="compass" size={26} color={theme.colors.primary} />
        </View>
      </View>

      {/* Search Input Bar (Forme & interaction soignée) */}
      <View
        style={[
          styles.searchBar,
          isSearchFocused && styles.searchBarFocused,
          searchQuery.length > 0 && styles.searchBarWithText,
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isSearchFocused ? theme.colors.primary : theme.colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef as any}
          style={styles.searchInput}
          placeholder="Rechercher un sentier, massif, ville..."
          placeholderTextColor={theme.colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          accessibilityLabel="Champ de recherche de sentiers"
        />

        {/* Compteur de résultats compact dans la barre */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.inlineMatchBadge}>
            <Text style={styles.inlineMatchText}>
              {filteredTrails.length}
            </Text>
          </View>
        )}

        {/* Bouton d'effacement rapide */}
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
            hitSlop={10}
            style={styles.clearSearchBtn}
            accessibilityRole="button"
            accessibilityLabel="Effacer la saisie de recherche"
          >
            <Ionicons name="close-circle" size={19} color={theme.colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* Suggestions rapides si la recherche est vide */}
      {!hasActiveFilters && (
        <View style={styles.suggestionsRow}>
          <Text style={styles.suggestionsLabel}>Idées :</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {POPULAR_SEARCHES.map((term) => (
              <Pressable
                key={term}
                style={({ pressed }) => [
                  styles.suggestionChip,
                  pressed && styles.suggestionChipPressed,
                ]}
                onPress={() => setSearchQuery(term)}
                hitSlop={4}
              >
                <Text style={styles.suggestionText}>{term}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Filter by Difficulty */}
      <View style={styles.filterSection}>
        <View style={styles.filterSectionHeader}>
          <Ionicons name="speedometer-outline" size={15} color={theme.colors.text} />
          <Text style={styles.filterTitle}>Niveau de difficulté</Text>
          {selectedDifficulty !== 'Tous' && (
            <Pressable
              onPress={() => setSelectedDifficulty('Tous')}
              hitSlop={6}
              style={styles.resetFilterSmallBtn}
            >
              <Text style={styles.resetFilterSmallText}>Effacer</Text>
            </Pressable>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {DIFFICULTIES.map((item) => {
            const isSelected = selectedDifficulty === item.label;
            const isTous = item.label === 'Tous';

            const activeStyle = isSelected
              ? isTous
                ? styles.chipActiveTous
                : {
                    backgroundColor: item.activeBg || theme.colors.primaryLight,
                    borderColor: item.activeBorder || theme.colors.primary,
                  }
              : null;

            const activeTextStyle = isSelected
              ? isTous
                ? styles.chipTextActiveTous
                : {
                    color: item.activeText || theme.colors.primaryDark,
                    fontWeight: '700' as const,
                  }
              : null;

            return (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.chip,
                  activeStyle,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => handleToggleDifficulty(item.label)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                {item.colorDot && (
                  <View style={[styles.chipDot, { backgroundColor: item.colorDot }]} />
                )}
                <Text style={[styles.chipText, activeTextStyle]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter by Category/Tags */}
      <View style={styles.filterSection}>
        <View style={styles.filterSectionHeader}>
          <Ionicons name="pricetags-outline" size={15} color={theme.colors.text} />
          <Text style={styles.filterTitle}>Catégorie & Thème</Text>
          {selectedCategory !== 'Tous' && (
            <Pressable
              onPress={() => setSelectedCategory('Tous')}
              hitSlop={6}
              style={styles.resetFilterSmallBtn}
            >
              <Text style={styles.resetFilterSmallText}>Effacer</Text>
            </Pressable>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <Pressable
                key={cat.label}
                style={({ pressed }) => [
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => handleToggleCategory(cat.label)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Ionicons
                  name={cat.icon}
                  size={14}
                  color={isSelected ? theme.colors.primaryDark : theme.colors.textMuted}
                  style={styles.categoryIcon}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Filters Pill Bar (Feedback visuel transparent) */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersBar}>
          <Text style={styles.activeFiltersLabel}>Filtres actifs :</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersScroll}
          >
            {searchQuery.trim().length > 0 && (
              <Pressable
                style={styles.activeFilterPill}
                onPress={() => setSearchQuery('')}
                hitSlop={4}
              >
                <Ionicons name="search" size={12} color={theme.colors.primaryDark} />
                <Text style={styles.activeFilterPillText}>« {searchQuery.trim()} »</Text>
                <Ionicons name="close" size={13} color={theme.colors.primaryDark} />
              </Pressable>
            )}

            {selectedDifficulty !== 'Tous' && (
              <Pressable
                style={styles.activeFilterPill}
                onPress={() => setSelectedDifficulty('Tous')}
                hitSlop={4}
              >
                <Ionicons name="speedometer" size={12} color={theme.colors.primaryDark} />
                <Text style={styles.activeFilterPillText}>{selectedDifficulty}</Text>
                <Ionicons name="close" size={13} color={theme.colors.primaryDark} />
              </Pressable>
            )}

            {selectedCategory !== 'Tous' && (
              <Pressable
                style={styles.activeFilterPill}
                onPress={() => setSelectedCategory('Tous')}
                hitSlop={4}
              >
                <Ionicons name="pricetag" size={12} color={theme.colors.primaryDark} />
                <Text style={styles.activeFilterPillText}>{selectedCategory}</Text>
                <Ionicons name="close" size={13} color={theme.colors.primaryDark} />
              </Pressable>
            )}

            <Pressable
              style={styles.clearAllBtn}
              onPress={resetAllFilters}
              hitSlop={6}
            >
              <Text style={styles.clearAllBtnText}>Tout effacer</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* Results Header Count */}
      <View style={styles.resultsCountRow}>
        <Text style={styles.resultsCountText}>
          {filteredTrails.length}{' '}
          {filteredTrails.length > 1
            ? 'sentiers disponibles'
            : filteredTrails.length === 1
            ? 'sentier disponible'
            : 'sentier trouvé'}
        </Text>
        {hasActiveFilters && (
          <Pressable onPress={resetAllFilters} hitSlop={8}>
            <Text style={styles.resetText}>Réinitialiser</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTrails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrailCard trail={item} onSelectTag={handleSelectTagFromCard} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          <EmptyState
            icon="compass-outline"
            title="Aucun sentier trouvé"
            description={
              searchQuery.trim().length > 0
                ? `Aucun itinéraire ne correspond à « ${searchQuery.trim()} »${
                    selectedDifficulty !== 'Tous'
                      ? ` avec le niveau ${selectedDifficulty}`
                      : ''
                  }${
                    selectedCategory !== 'Tous'
                      ? ` dans le thème ${selectedCategory}`
                      : ''
                  }. Essaie avec d'autres mots-clés ou assouplis tes filtres.`
                : 'Aucun itinéraire ne correspond à cette combinaison de filtres. Essaie de modifier la difficulté ou le thème.'
            }
            actionLabel={
              searchQuery.trim().length > 0
                ? 'Effacer la recherche'
                : 'Réinitialiser les filtres'
            }
            onAction={
              searchQuery.trim().length > 0
                ? () => setSearchQuery('')
                : resetAllFilters
            }
            secondaryActionLabel={
              searchQuery.trim().length > 0 &&
              (selectedDifficulty !== 'Tous' || selectedCategory !== 'Tous')
                ? 'Tout réinitialiser'
                : undefined
            }
            onSecondaryAction={resetAllFilters}
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: theme.spacing.xs,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  greetingTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  greetingTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
    lineHeight: 17,
  },
  compassBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginBottom: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchBarFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  searchBarWithText: {
    borderColor: theme.colors.borderDark,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: theme.colors.text,
    paddingVertical: 0,
    paddingHorizontal: 2,
    fontWeight: '500',
    textAlignVertical: 'center',
  },
  inlineMatchBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  clearSearchBtn: {
    padding: 4,
  },
  suggestionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  suggestionsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginRight: 8,
  },
  suggestionsScroll: {
    gap: 6,
    paddingRight: 12,
  },
  suggestionChip: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  suggestionChipPressed: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  filterSection: {
    marginBottom: 14,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  resetFilterSmallBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  resetFilterSmallText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  chipsScroll: {
    gap: 8,
    paddingRight: 16,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  chipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  chipActiveTous: {
    backgroundColor: theme.colors.text,
    borderColor: theme.colors.text,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  chipTextActiveTous: {
    color: theme.colors.white,
    fontWeight: '700',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 5,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primaryDark,
  },
  categoryIcon: {
    marginRight: 2,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  categoryChipTextActive: {
    color: theme.colors.primaryDark,
    fontWeight: '700',
  },
  activeFiltersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
    gap: 8,
  },
  activeFiltersLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  activeFiltersScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 8,
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: '#86efac',
    gap: 5,
  },
  activeFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accent,
    textDecorationLine: 'underline',
  },
  resultsCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  resultsCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.accent,
  },
});