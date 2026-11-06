import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <View style={styles.container}>
        <Ionicons name="compass-outline" size={64} color={theme.colors.textMuted} />
        <Text style={styles.title}>Sentier introuvable !</Text>
        <Text style={styles.description}>
          Cette route n’existe pas dans TrailMap.
        </Text>
        <Link href="/" asChild>
          <Pressable style={styles.linkButton}>
            <Text style={styles.linkText}>Retourner à l’accueil</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.radius.full,
  },
  linkText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
