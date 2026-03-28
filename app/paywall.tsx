import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Purchases from 'react-native-purchases';

import { PaywallCard } from '../components/PaywallCard';
import { fontFamily, theme } from '../constants/theme';
import { isPremiumUser, setPremiumStatus } from '../utils/storage';

type PlanKey = 'monthly' | 'yearly';

export default function PaywallScreen() {
  const params = useLocalSearchParams<{ scanId?: string }>();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanId = useMemo(() => (typeof params.scanId === 'string' ? params.scanId : ''), [params.scanId]);

  useEffect(() => {
    const checkPremium = async () => {
      const premium = await isPremiumUser();
      if (premium) {
        if (scanId) {
          router.replace({ pathname: '/scan-result', params: { scanId } });
          return;
        }
        router.replace('/(tabs)/scanner');
      }
    };

    void checkPremium();
  }, [router, scanId]);

  const continueToResult = useCallback(() => {
    if (scanId) {
      router.replace({ pathname: '/scan-result', params: { scanId } });
      return;
    }
    router.replace('/(tabs)/scanner');
  }, [router, scanId]);

  const purchase = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (!current || !current.availablePackages.length) {
        throw new Error('No subscription plans available from RevenueCat.');
      }

      const targetType =
        selectedPlan === 'yearly' ? Purchases.PACKAGE_TYPE.ANNUAL : Purchases.PACKAGE_TYPE.MONTHLY;
      const targetPackage =
        current.availablePackages.find((pkg) => pkg.packageType === targetType) ?? current.availablePackages[0];

      await Purchases.purchasePackage(targetPackage);
      await setPremiumStatus(true);
      continueToResult();
    } catch (purchaseError) {
      const message =
        purchaseError instanceof Error ? purchaseError.message : 'Purchase failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [continueToResult, selectedPlan]);

  const restore = useCallback(async () => {
    setError(null);
    setIsRestoring(true);

    try {
      const customerInfo = await Purchases.restorePurchases();
      const hasEntitlement = Object.keys(customerInfo.entitlements.active).length > 0;
      if (!hasEntitlement) {
        throw new Error('No active subscription found to restore.');
      }
      await setPremiumStatus(true);
      continueToResult();
    } catch (restoreError) {
      const message =
        restoreError instanceof Error ? restoreError.message : 'Restore failed. Please try again.';
      setError(message);
    } finally {
      setIsRestoring(false);
    }
  }, [continueToResult]);

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>UNLOCK PREMIUM</Text>
      <Text style={styles.subheading}>YOU HAVE REACHED YOUR FREE SCAN LIMIT.</Text>

      <PaywallCard
        title="$3.99 / MONTH"
        price="Billed monthly"
        selected={selectedPlan === 'monthly'}
        onPress={() => setSelectedPlan('monthly')}
      />
      <PaywallCard
        title="$29.99 / YEAR"
        price="Best value"
        selected={selectedPlan === 'yearly'}
        onPress={() => setSelectedPlan('yearly')}
      />

      {error ? <Text style={styles.error}>{error.toUpperCase()}</Text> : null}

      <Pressable
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={purchase}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.text} />
        ) : (
          <Text style={styles.buttonText}>START SUBSCRIPTION</Text>
        )}
      </Pressable>

      <Pressable
        style={[styles.button, isRestoring && styles.buttonDisabled]}
        onPress={restore}
        disabled={isRestoring}
      >
        {isRestoring ? (
          <ActivityIndicator color={theme.colors.text} />
        ) : (
          <Text style={styles.buttonText}>RESTORE PURCHASES</Text>
        )}
      </Pressable>

      <Pressable style={styles.linkButton} onPress={continueToResult}>
        <Text style={styles.linkText}>NOT NOW</Text>
      </Pressable>
      <Text style={styles.caption}>NO FREE TRIAL.</Text>
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
    fontFamily: fontFamily,
    fontSize: theme.typography.title,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
    marginBottom: theme.spacing.lg,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
  },
  button: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  linkButton: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  caption: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
