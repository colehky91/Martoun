import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { IngredientCard } from '../components/IngredientCard';
import { fontFamily, theme } from '../constants/theme';
import { getScanById, type SavedScan } from '../utils/storage';

export default function ScanResultScreen() {
  const params = useLocalSearchParams<{ scanId?: string }>();
  const [scan, setScan] = useState<SavedScan | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const scoreColor = useMemo(() => {
    if (!scan) {
      return theme.colors.text;
    }
    if (scan.healthScore >= 75) {
      return theme.colors.good;
    }
    if (scan.healthScore <= 39) {
      return theme.colors.danger;
    }
    return theme.colors.neutral;
  }, [scan]);

  useEffect(() => {
    const hydrate = async () => {
      if (!params.scanId) {
        setLoading(false);
        return;
      }
      const found = await getScanById(params.scanId);
      setScan(found);
      setLoading(false);
    };
    hydrate();
  }, [params.scanId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  if (!scan) {
    return (
      <View style={styles.centered}>
        <Text style={styles.heading}>SCAN NOT FOUND</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/scanner')}
        >
          <Text style={styles.backButtonText}>BACK TO SCANNER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>SCAN RESULT</Text>

      <View style={styles.panel}>
        <Text style={styles.label}>PRODUCT</Text>
        <Text style={styles.productName}>{scan.productName.toUpperCase()}</Text>
        <Text style={[styles.score, { color: scoreColor }]}>HEALTH SCORE: {scan.healthScore}/100</Text>
      </View>

      <Text style={styles.sectionHeading}>SUMMARY</Text>
      <View style={styles.panel}>
        <Text style={styles.summary}>{scan.summary}</Text>
      </View>

      <Text style={styles.sectionHeading}>WARNINGS</Text>
      <View style={styles.panel}>
        {scan.warnings.length === 0 ? (
          <Text style={styles.noWarnings}>NO MAJOR WARNINGS FOUND.</Text>
        ) : (
          scan.warnings.map((warning, index) => (
            <Text key={`${warning}-${index}`} style={styles.warningText}>
              - {warning}
            </Text>
          ))
        )}
      </View>

      <Text style={styles.sectionHeading}>INGREDIENTS</Text>
      <View style={styles.ingredientsWrap}>
        {scan.ingredients.map((ingredient, index) => (
          <IngredientCard key={`${ingredient.name}-${index}`} ingredient={ingredient} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: 56,
    paddingBottom: theme.spacing.xl,
  },
  centered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  heading: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.title,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  sectionHeading: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.sectionTitle,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  panel: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  productName: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.sectionTitle,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  score: {
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  summary: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  noWarnings: {
    color: theme.colors.good,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  warningText: {
    color: theme.colors.danger,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  ingredientsWrap: {
    marginTop: theme.spacing.xs,
  },
  backButton: {
    marginTop: theme.spacing.md,
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButtonText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
});
