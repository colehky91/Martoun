import { Pressable, StyleSheet, Text } from 'react-native';

import { fontFamily, theme } from '../constants/theme';

type ScanButtonProps = {
  label: string;
  disabled?: boolean;
  onPress: () => void;
};

export function ScanButton({ label, disabled, onPress }: ScanButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  buttonPressed: {
    backgroundColor: theme.colors.card,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
});
