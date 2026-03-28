import { CameraView, type CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScanButton } from '../../components/ScanButton';
import { fontFamily, theme } from '../../constants/theme';
import { analyzeIngredientsImage } from '../../utils/claude';
import {
  getScanHistory,
  incrementScanCount,
  isPremiumUser,
  saveScanResult,
  shouldShowPaywall,
  type SavedScan,
} from '../../utils/storage';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [recentScans, setRecentScans] = useState<SavedScan[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);
  const router = useRouter();

  const hasPermission = useMemo(() => permission?.granted, [permission]);

  const loadRecentScans = useCallback(async () => {
    const scans = await getScanHistory();
    setRecentScans(scans.slice(0, 6));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentScans();
    }, [loadRecentScans]),
  );

  const startScan = useCallback(async () => {
    if (!cameraRef.current || isScanning) {
      return;
    }

    try {
      setIsScanning(true);
      const picture: CameraCapturedPicture = await cameraRef.current.takePictureAsync({
        quality: 0.65,
        base64: true,
      });

      if (!picture.base64) {
        throw new Error('Image capture failed. Please try again.');
      }

      const nextScanCount = await incrementScanCount();
      const premium = await isPremiumUser();
      const paywallRequired = await shouldShowPaywall(nextScanCount, premium);

      const result = await analyzeIngredientsImage(picture.base64);
      const saved = await saveScanResult({
        ...result,
        imageUri: picture.uri,
      });

      if (paywallRequired) {
        router.push({
          pathname: '/paywall',
          params: { scanId: saved.id },
        });
        return;
      }

      router.push({
        pathname: '/scan-result',
        params: { scanId: saved.id },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Scan failed. Please try again.';
      alert(message);
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, router]);

  const renderRecent = ({ item }: { item: SavedScan }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.historyRow}
      onPress={() =>
        router.push({
          pathname: '/scan-result',
          params: { scanId: item.id },
        })
      }
    >
      <View>
        <Text style={styles.historyTitle}>{item.productName.toUpperCase()}</Text>
        <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.historyScore}>{item.healthScore}/100</Text>
    </TouchableOpacity>
  );

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.screen}>
        <Text style={styles.heading}>CAMERA ACCESS NEEDED</Text>
        <Text style={styles.body}>HealthReceipt needs camera access to scan ingredient labels.</Text>
        <TouchableOpacity activeOpacity={0.85} style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionButtonText}>ALLOW CAMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>SCANNER</Text>
      <View style={styles.cameraFrame}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      </View>
      <ScanButton label={isScanning ? 'SCANNING...' : 'SCAN INGREDIENT LABEL'} onPress={startScan} disabled={isScanning} />
      <Text style={styles.sectionHeading}>RECENT SCANS</Text>
      <FlatList
        data={recentScans}
        keyExtractor={(item) => item.id}
        renderItem={renderRecent}
        ListEmptyComponent={<Text style={styles.emptyText}>NO SCANS YET.</Text>}
        contentContainerStyle={styles.historyListContent}
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
  centered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.title,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  body: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  cameraFrame: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    height: 260,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  camera: {
    flex: 1,
  },
  actionButton: {
    borderWidth: theme.borders.medium,
    borderColor: theme.colors.text,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  sectionHeading: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.sectionTitle,
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
  },
  historyListContent: {
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  historyRow: {
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.text,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  historyTitle: {
    color: theme.colors.text,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  historyDate: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: 12,
    marginTop: 4,
  },
  historyScore: {
    color: theme.colors.accent,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    letterSpacing: 1,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontFamily: fontFamily,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.sm,
  },
});
