import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, theme } from '../constants/theme';
import type { IngredientAnalysis } from '../utils/storage';

type IngredientCardProps = {
  ingredient: IngredientAnalysis;
};

const ratingColors: Record<IngredientAnalysis['rating'], string> = {
  good: theme.colors.good,
  neutral: theme.colors.neutral,
  bad: theme.colors.danger,
};

export function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.name}>{ingredient.name.toUpperCase()}</Text>
        <Text style={[styles.rating, { color: ratingColors[ingredient.rating] }]}>
          {ingredient.rating.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.reason}>{ingredient.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  name: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    flex: 1,
    letterSpacing: 1,
  },
  rating: {
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
  },
  reason: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    lineHeight: 17,
  },
});
