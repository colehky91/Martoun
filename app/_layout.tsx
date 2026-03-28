import { Slot, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import {
  getSession,
  isPremiumUser,
  setPremiumStatus,
} from '../utils/storage';
import { theme } from '../constants/theme';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const existingSession = await getSession();
        const rcKey = process.env.EXPO_PUBLIC_RC_KEY;
        if (rcKey) {
          Purchases.configure({ apiKey: rcKey, appUserID: existingSession?.email });
          const customerInfo = await Purchases.getCustomerInfo();
          const isActive = Object.values(customerInfo.entitlements.active).length > 0;
          if (isActive !== (await isPremiumUser())) {
            await setPremiumStatus(isActive);
          }
        }
      } catch (error) {
        console.warn('bootstrap_failed', error);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    const syncAndRoute = async () => {
      const session = await getSession();
      const inTabs = segments[0] === '(tabs)';
      const inAuth = segments[0] === 'auth';
      const inRoot = pathname === '/';

      if (!session && (inTabs || (!inAuth && !inRoot))) {
        router.replace('/auth');
        return;
      }

      if (session && (inAuth || inRoot)) {
        router.replace('/(tabs)/scanner');
      }
    };

    void syncAndRoute();
  }, [loading, pathname, segments, router]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingScreen}>
          <ActivityIndicator color={theme.colors.accent} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Slot />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
