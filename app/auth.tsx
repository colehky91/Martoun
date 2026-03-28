import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import Purchases from 'react-native-purchases';

import { fontFamily, theme } from '../constants/theme';
import { getUser, saveUser, setSession } from '../utils/storage';

export default function AuthScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('EMAIL AND PASSWORD ARE REQUIRED.');
      return;
    }

    if (normalizedPassword.length < 6) {
      setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      if (isSignupMode) {
        await saveUser({ email: normalizedEmail, password: normalizedPassword });
      } else {
        const existing = await getUser(normalizedEmail);
        if (!existing || existing.password !== normalizedPassword) {
          throw new Error('INVALID EMAIL OR PASSWORD.');
        }
      }

      await setSession({ email: normalizedEmail });
      try {
        await Purchases.logIn(normalizedEmail);
      } catch {
        // RevenueCat identity is optional in Expo Go / when key is missing.
      }
      router.replace('/(tabs)/scanner');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'AUTHENTICATION FAILED.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>AUTH</Text>
        <Text style={styles.modeLabel}>{isSignupMode ? 'SIGN UP' : 'LOG IN'}</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="EMAIL"
          placeholderTextColor={theme.colors.textMuted}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry
          placeholder="PASSWORD"
          placeholderTextColor={theme.colors.textMuted}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={onSubmit}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'PROCESSING...' : isSignupMode ? 'CREATE ACCOUNT' : 'LOG IN'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setIsSignupMode((prev) => !prev)}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            {isSignupMode ? 'HAVE AN ACCOUNT? LOG IN' : 'NEED AN ACCOUNT? SIGN UP'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.title,
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  modeLabel: {
    color: theme.colors.accent,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  input: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.text,
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  primaryButton: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.xs,
  },
  primaryButtonText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  secondaryButton: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.text,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    marginTop: theme.spacing.sm,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.caption,
    letterSpacing: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
