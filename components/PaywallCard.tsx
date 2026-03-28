import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamily, theme } from '../constants/theme';

type PaywallCardProps = {
  title: string;
  price: string;
  selected: boolean;
  onPress: () => void;
};

export function PaywallCard({ title, price, selected, onPress }: PaywallCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: selected ? theme.colors.accent : theme.colors.text,
          backgroundColor: selected ? theme.colors.card : theme.colors.background,
        },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: selected ? theme.colors.accent : theme.colors.text }]}>
          {title.toUpperCase()}
        </Text>
        <Text style={styles.price}>{price.toUpperCase()}</Text>
      </View>
      <Text
        style={[
          styles.badge,
          {
            color: selected ? theme.colors.accent : theme.colors.textMuted,
            borderColor: selected ? theme.colors.accent : theme.colors.textMuted,
          },
        ]}
      >
        {selected ? 'SELECTED' : 'CHOOSE'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: theme.borders.medium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: fontFamily,
    fontSize: theme.typography.sectionTitle,
    letterSpacing: 1,
  },
  price: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  badge: {
    borderWidth: theme.borders.thin,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
  },
});
