import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fontFamily, theme } from '../../constants/theme';
import { getScanHistory, type SavedScan } from '../../utils/storage';

export default function HistoryScreen() {
  const [scans, setScans] = useState<SavedScan[]>([]);
  const router = useRouter();

  const loadScans = useCallback(async () => {
    const history = await getScanHistory();
    setScans(history);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadScans();
    }, [loadScans]),
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>SCAN HISTORY</Text>
      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>NO SCANS SAVED YET.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: '/scan-result',
                params: { scanId: item.id },
              })
            }
          >
            <View style={styles.rowLeft}>
              <Text style={styles.product}>{item.productName.toUpperCase()}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <Text style={styles.score}>{item.healthScore}/100</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: 52,
  },
  heading: {
    color: theme.colors.text,
    fontFamily,
    fontSize: theme.typography.title,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  list: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  product: {
    color: theme.colors.text,
    fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  date: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontFamily,
    fontSize: theme.typography.caption,
  },
  score: {
    color: theme.colors.accent,
    fontFamily,
    fontSize: theme.typography.body,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontFamily,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.sm,
  },
});
