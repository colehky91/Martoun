import AsyncStorage from '@react-native-async-storage/async-storage';

export type IngredientRating = 'good' | 'neutral' | 'bad';

export type IngredientAnalysis = {
  name: string;
  rating: IngredientRating;
  reason: string;
};

export type SavedScan = {
  id: string;
  createdAt: string;
  imageUri?: string;
  productName: string;
  healthScore: number;
  ingredients: IngredientAnalysis[];
  warnings: string[];
  summary: string;
};

export type AuthSession = {
  email: string;
};

type StoredUser = {
  email: string;
  password: string;
};

const KEYS = {
  session: '@healthreceipt/session',
  users: '@healthreceipt/users',
  scans: '@healthreceipt/scans',
  scanCount: '@healthreceipt/scanCount',
  premium: '@healthreceipt/premium',
} as const;

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(KEYS.session);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
}

export async function setSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(KEYS.session, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.session);
}

async function getUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(KEYS.users);
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

export async function saveUser(user: StoredUser): Promise<void> {
  const users = await getUsers();
  const existingIndex = users.findIndex((item) => item.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
}

export async function getUser(email: string): Promise<StoredUser | null> {
  const users = await getUsers();
  return users.find((item) => item.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getScanHistory(): Promise<SavedScan[]> {
  const raw = await AsyncStorage.getItem(KEYS.scans);
  const scans = raw ? (JSON.parse(raw) as SavedScan[]) : [];
  return scans.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function saveScanResult(
  scan: Omit<SavedScan, 'id' | 'createdAt'> & Partial<Pick<SavedScan, 'id' | 'createdAt'>>,
): Promise<SavedScan> {
  const scans = await getScanHistory();
  const saved: SavedScan = {
    id: scan.id ?? `${Date.now()}`,
    createdAt: scan.createdAt ?? new Date().toISOString(),
    imageUri: scan.imageUri,
    productName: scan.productName,
    healthScore: scan.healthScore,
    ingredients: scan.ingredients,
    warnings: scan.warnings,
    summary: scan.summary,
  };
  scans.unshift(saved);
  await AsyncStorage.setItem(KEYS.scans, JSON.stringify(scans));
  return saved;
}

export async function getScanById(scanId: string): Promise<SavedScan | null> {
  const scans = await getScanHistory();
  return scans.find((scan) => scan.id === scanId) ?? null;
}

export async function getScanCount(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.scanCount);
  const numeric = raw ? Number(raw) : 0;
  return Number.isFinite(numeric) ? numeric : 0;
}

export async function incrementScanCount(): Promise<number> {
  const current = await getScanCount();
  const next = current + 1;
  await AsyncStorage.setItem(KEYS.scanCount, String(next));
  return next;
}

export async function isPremiumUser(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(KEYS.premium);
  return raw === 'true';
}

export async function setPremiumStatus(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.premium, String(value));
}

export async function shouldShowPaywall(nextScanCount: number, isPremium: boolean): Promise<boolean> {
  return !isPremium && nextScanCount >= 7;
}
