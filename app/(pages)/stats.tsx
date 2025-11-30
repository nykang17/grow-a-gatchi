import { StyleSheet, View, Pressable } from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function StatsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const headerTint = colorScheme === 'dark' ? '#fff' : '#111';

  // PLACEHOLDER VALUES CHANGE LATER - WIP
  const stats = {
    timesWatered: 12,
    longestStreak: 5,
    currentStreak: 2,
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            marginBottom: 20,
            textAlign: 'center',
          }}
          darkColor='black'
          lightColor='black'
        >
          🌿 Stats
        </ThemedText>

        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.statLabel}>
            Times Watered
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.timesWatered}
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.statLabel}>
            Longest Watering Streak
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.longestStreak} days
          </ThemedText>
        </View>

        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.statLabel}>
            Current Watering Streak
          </ThemedText>
          <ThemedText type="title" style={styles.statValue}>
            {stats.currentStreak} days
          </ThemedText>
        </View>
      </ThemedView>

      <Stack.Screen
        options={{
          title: 'Stats',
          headerTintColor: headerTint,
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={{ paddingHorizontal: 18, paddingVertical: 6 }}
            >
              <ThemedText
                type="title"
                style={{
                  fontFamily: Fonts.rounded,
                  textAlign: 'center',
                }}
                darkColor='black'
                lightColor='black'
              >
                ←
              </ThemedText>
            </Pressable>
          ),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(241, 241, 241)', // lighter green
  },
  card: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(83, 175, 86, 0.88)', // lighter green
  },
  statLabel: {
    fontSize: 18,
    marginBottom: 6,
    opacity: 0.7,
    color: 'black'
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
