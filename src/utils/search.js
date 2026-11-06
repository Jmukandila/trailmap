"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSearchText = normalizeSearchText;
exports.cleanPunctuation = cleanPunctuation;
exports.filterTrails = filterTrails;
/**
 * Normalise une chaîne de texte pour la recherche :
 * - Décompose les accents (Unicode NFD) et supprime les diacritiques (ex: "é" -> "e", "ô" -> "o")
 * - Met en minuscules
 * - Harmonise les apostrophes courbées ou inversées (’ et ` -> ')
 * - Remplace les tirets et underscores par des espaces
 * - Supprime les espaces superflus
 */
function normalizeSearchText(text) {
    if (!text)
        return '';
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/[-_]/g, ' ')
        .trim();
}
/**
 * Supprime la ponctuation et les espaces pour tester les variantes
 * sans séparateurs (ex: "den vau" ou "denvau" matchera "d’En-Vau")
 */
function cleanPunctuation(text) {
    return normalizeSearchText(text).replace(/['’`\s\-.,/()!?:;]/g, '');
}
/**
 * Filtre les sentiers avec recherche insensible à la casse, aux accents,
 * à la ponctuation et supportant la recherche multi-mots.
 */
function filterTrails(trails, options) {
    const { searchQuery, difficulty, category } = options;
    const rawQuery = searchQuery.trim();
    const normalizedQuery = normalizeSearchText(rawQuery);
    const cleanQuery = cleanPunctuation(rawQuery);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    return trails.filter((trail) => {
        // 1. Filtrage par difficulté
        if (difficulty !== 'Tous' && trail.difficulty !== difficulty) {
            return false;
        }
        // 2. Filtrage par catégorie / tag
        if (category !== 'Tous') {
            const normalizedCategory = normalizeSearchText(category);
            const matchesCategory = trail.tags.some((tag) => normalizeSearchText(tag) === normalizedCategory);
            if (!matchesCategory) {
                return false;
            }
        }
        // 3. Filtrage par texte de recherche
        if (queryTokens.length === 0) {
            return true;
        }
        // Construction d'un corpus complet pour le sentier
        const corpusParts = [
            trail.title,
            trail.subtitle,
            trail.location,
            trail.region,
            trail.difficulty,
            trail.trailType,
            trail.author.name,
            ...trail.tags,
            ...trail.highlights,
            trail.description,
        ];
        const normalizedCorpus = normalizeSearchText(corpusParts.join(' '));
        const cleanCorpus = cleanPunctuation(corpusParts.join(' '));
        // Match global sans ponctuation si au moins 2 lettres
        if (cleanQuery.length >= 2 && cleanCorpus.includes(cleanQuery)) {
            return true;
        }
        // Chaque mot saisi doit correspondre à au moins un élément du sentier
        const allTokensMatch = queryTokens.every((token) => {
            const cleanToken = cleanPunctuation(token);
            return (normalizedCorpus.includes(token) ||
                (cleanToken.length >= 2 && cleanCorpus.includes(cleanToken)));
        });
        return allTokensMatch;
    });
}
