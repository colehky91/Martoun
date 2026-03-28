import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { fontFamily, theme } from '../constants/theme';
import { getSession } from '../utils/storage';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      const session = await getSession();
      if (session) {
        router.replace('/(tabs)/scanner');
      }
    };

    void bootstrap();
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.block}>
        <Text style={styles.title}>HEALTHRECEIPT</Text>
        <Text style={styles.tagline}>KNOW WHAT YOU'RE EATING</Text>
      </View>
      <Pressable style={styles.cta} onPress={() => router.push('/auth')}>
        <Text style={styles.ctaText}>SIGN UP</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  block: {
    marginTop: 120,
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: 34,
    letterSpacing: 1,
  },
  tagline: {
    color: theme.colors.accent,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cta: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: 48,
  },
  ctaText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
