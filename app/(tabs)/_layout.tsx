import { Tabs, router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  // fallback text colors to ensure visibility regardless of theme
  const buttonTextColor = colorScheme === 'light' ? '#ffffff' : '#111111';
  const headerBg = colorScheme === 'light' ? '#111111' : '#ffffff';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerShown: true,
          // make header background & tint explicit so header items remain visible
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: buttonTextColor,
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/(pages)/calendar')}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { opacity: 0.7 },
                ]}>
                <Text style={[styles.headerButtonText, { color: buttonTextColor }]}>
                  Calendar
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/(pages)/stats')}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { opacity: 0.7 },
                ]}>
                <Text style={[styles.headerButtonText, { color: buttonTextColor }]}>
                  Stats
                </Text>
              </Pressable>
            </View>
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  pressable: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
