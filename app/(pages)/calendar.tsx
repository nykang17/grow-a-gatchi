import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

// PLACEHOLDER VALUES CHANGE LATER - WIP
// Format: { "2025-02-15": "watered", "2025-02-16": "missed", ... }
const wateringData = {
  "2025-02-10": "watered",
  "2025-02-12": "missed",
  "2025-02-14": "upcoming",
  "2025-02-16": "upcoming",
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const headerTint = '#111'; // force visible

  const year = new Date().getFullYear();

  // generate all months and days for the full year
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i));

  return (
    <>
      {/* Header override */}
      <Stack.Screen
        options={{
          title: '',
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

      <ThemedView style={styles.container} darkColor="white" lightColor="white">
        <ScrollView showsVerticalScrollIndicator={false}>
          {months.map((month, index) => {
            const monthName = month.toLocaleString('default', { month: 'long' });

            const firstDayOfMonth = new Date(year, index, 1);
            const daysInMonth = new Date(year, index + 1, 0).getDate();

            // weekday index of first day (0 = Sunday)
            const startingWeekday = firstDayOfMonth.getDay();

            // build days grid with empty placeholders for alignment
            const daysArray = [
              ...Array(startingWeekday).fill(null),
              ...Array.from({ length: daysInMonth }, (_, d) => d + 1),
            ];

            return (
              <View key={index} style={styles.monthContainer}>
                <ThemedText
                  type="subtitle"
                  style={styles.monthTitle}
                  lightColor="black"
                  darkColor="black"
                >
                  {monthName} {year}
                </ThemedText>

                <View style={styles.weekdaysRow}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <Text key={d} style={styles.weekday}>
                      {d}
                    </Text>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {daysArray.map((day, idx) => {
                    if (day === null) {
                      return <View key={idx} style={styles.dayCellEmpty} />;
                    }

                    const dateKey = `${year}-${String(index + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = wateringData[dateKey];

                    // Style day according to watering status
                    let dayStyle = styles.dayNumber;
                    if (status === 'watered') dayStyle = styles.dayWatered;
                    if (status === 'missed') dayStyle = styles.dayMissed;
                    if (status === 'upcoming') dayStyle = styles.dayUpcoming;

                    return (
                      <View key={idx} style={styles.dayCell}>
                        <Text style={dayStyle}>{day}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(241, 241, 241)',
    padding: 20,
  },

  monthContainer: {
    marginBottom: 30,
  },

  monthTitle: {
    fontSize: 26,
    fontFamily: Fonts.rounded,
    marginBottom: 12,
    textAlign: 'center',
    color: 'black',
  },

  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },

  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: `${100 / 7}%`,
    paddingVertical: 10,
    alignItems: 'center',
  },

  dayCellEmpty: {
    width: `${100 / 7}%`,
    paddingVertical: 10,
  },

  dayNumber: {
    fontSize: 16,
    color: 'black',
  },

  // GREEN for watered
  dayWatered: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    backgroundColor: 'rgba(76,175,80,0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // RED for missed
  dayMissed: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B71C1C',
    backgroundColor: 'rgba(244,67,54,0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  // BLUE for upcoming expected watering
  dayUpcoming: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D47A1',
    backgroundColor: 'rgba(33,150,243,0.35)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
