import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { fontFamily, theme } from '../../constants/theme';

type TabLabelProps = {
  focused: boolean;
  label: string;
};

function TabLabel({ focused, label }: TabLabelProps) {
  return <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'SCAN',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="SCAN" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'HISTORY',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="HISTORY" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarLabel: ({ focused }) => <TabLabel focused={focused} label="SETTINGS" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background,
    borderTopWidth: theme.borders.medium,
    borderTopColor: theme.colors.border,
    height: 72,
    borderRadius: 0,
  },
  tabItem: {
    borderRightWidth: theme.borders.thin,
    borderRightColor: theme.colors.border,
    marginVertical: 0,
    paddingVertical: 8,
  },
  tabLabel: {
    fontFamily,
    color: theme.colors.text,
    fontSize: 11,
    letterSpacing: 1,
  },
  tabLabelActive: {
    color: theme.colors.accent,
  },
});
