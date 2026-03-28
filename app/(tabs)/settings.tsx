import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Purchases from 'react-native-purchases';

import { fontFamily, theme } from '../../constants/theme';
import { clearSession, getSession, isPremiumUser, setPremiumStatus } from '../../utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [premium, setPremium] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadState = useCallback(async () => {
    const [session, premiumStatus] = await Promise.all([getSession(), isPremiumUser()]);
    setEmail(session?.email ?? 'unknown');
    setPremium(premiumStatus);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadState();
    }, [loadState]),
  );

  const handleRestore = useCallback(async () => {
    setBusy(true);
    try {
      const info = await Purchases.restorePurchases();
      const hasEntitlement = Object.keys(info.entitlements.active).length > 0;
      await setPremiumStatus(hasEntitlement);
      setPremium(hasEntitlement);
      Alert.alert('RESTORE COMPLETE', hasEntitlement ? 'PREMIUM IS ACTIVE.' : 'NO ACTIVE SUBSCRIPTION FOUND.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to restore purchases.';
      Alert.alert('RESTORE FAILED', message);
    } finally {
      setBusy(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setBusy(true);
    try {
      await clearSession();
      try {
        await Purchases.logOut();
      } catch {
        // Ignore RevenueCat logout failures for local-only auth flow.
      }
      router.replace('/auth');
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>SETTINGS</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ACCOUNT</Text>
        <Text style={styles.value}>{email.toUpperCase()}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>SUBSCRIPTION STATUS</Text>
        <Text style={[styles.value, { color: premium ? theme.colors.accent : theme.colors.text }]}>
          {premium ? 'PREMIUM' : 'FREE'}
        </Text>
      </View>

      <Pressable style={styles.button} onPress={handleRestore} disabled={busy}>
        <Text style={styles.buttonText}>{busy ? 'WORKING...' : 'RESTORE PURCHASES'}</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout} disabled={busy}>
        <Text style={[styles.buttonText, styles.logoutText]}>{busy ? 'WORKING...' : 'LOG OUT'}</Text>
      </Pressable>
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
  card: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    gap: 8,
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
  },
  value: {
    color: theme.colors.text,
    fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  button: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  logoutButton: {
    borderColor: theme.colors.danger,
  },
  buttonText: {
    color: theme.colors.text,
    fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  logoutText: {
    color: theme.colors.danger,
  },
});
