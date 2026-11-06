import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrailDifficulty } from '../types/trail';
import { theme } from '../constants/theme';

interface Props {
  difficulty: TrailDifficulty;
  size?: 'small' | 'medium';
}

export const DifficultyBadge: React.FC<Props> = ({ difficulty, size = 'small' }) => {
  const getStyle = () => {
    switch (difficulty) {
      case 'Facile':
        return theme.colors.difficulty.facile;
      case 'Modéré':
        return theme.colors.difficulty.modere;
      case 'Difficile':
        return theme.colors.difficulty.difficile;
      case 'Expert':
        return theme.colors.difficulty.expert;
    }
  };

  const styleConfig = getStyle();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: styleConfig.bg,
          borderColor: styleConfig.border,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: styleConfig.text }]} />
      <Text
        style={[
          styles.text,
          {
            color: styleConfig.text,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {difficulty}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
