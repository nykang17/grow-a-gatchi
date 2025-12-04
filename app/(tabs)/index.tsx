import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Sprite from '../../components/sprite';
import { useWateringListener } from '../../hooks/use-watering-listener';

const DRY_THRESHOLD = 120000; //2 * 60 * 1000; // 2 min
const WATERING_DISPLAY_DURATION = 3000; // 3 seconds
const DRAIN_DURATION = 120000; // 2 minutes in milliseconds


// Helper function to get relative time
const getRelativeTime = (timestamp: string, now: number): string => {
  const then = new Date(timestamp);
  const diffMs = now - then. getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

// Helper function to calculate water level (0-100%)
const getWaterLevel = (timestamp: string, now: number): number => {
  const then = new Date(timestamp);
  const diffMs = now - then.getTime();
  // Water level decreases to 0% over 2 minutes (can change accordingly)
  const level = Math.max(0, 100 - (diffMs / DRAIN_DURATION) * 100);
  return level;
};

export default function HomeScreen() {
  const { justWatered, lastWateredAt, timesWatered } = useWateringListener();
  const [currentTime, setCurrentTime] = useState(Date.now());

  // If watering just happened, temporarily force sprite = "watering"
  const [showWateringSprite, setShowWateringSprite] = useState(false);
  const [animatedWidth] = useState(new Animated.Value(0));

  // Need to refresh every 100ms for progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const waterLevel = lastWateredAt ?  getWaterLevel(lastWateredAt, currentTime) : 0;

  // Animate the progress bar width
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: waterLevel,
      duration: 150, // Smooth transition over 150ms
      useNativeDriver: false,
    }).start();
  }, [waterLevel]);

  // Detect dry state
  const isDry = lastWateredAt
    ? currentTime - new Date(lastWateredAt).getTime() > DRY_THRESHOLD
    : false;

  // --- Handle switching to watering sprite for a few seconds ---
  useEffect(() => { 
    if (justWatered) {
      setShowWateringSprite(true);          // start watering sprite
      const timer = setTimeout(() => {
        setShowWateringSprite(false);       // go back to normal after X seconds
      }, WATERING_DISPLAY_DURATION);

      return () => clearTimeout(timer);
    }
  }, [justWatered]);

  // Determine which sprite to show
  const spriteState = showWateringSprite
    ? "watering"
    : isDry
    ? "dry"
    : "idle";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Grow-a-Gatchi</Text>

      <Sprite state={spriteState} />

      {lastWateredAt && (
        <View style={styles.waterStatusContainer}>
          <View style={styles.waterStatusHeader}>
            <Text style={styles.waterStatusLabel}>Water Status</Text>
            <Text style={styles.waterStatusTime}>
              {getRelativeTime(lastWateredAt, currentTime)}
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${waterLevel}%`,
                  backgroundColor:
                    waterLevel > 50 ?  '#4CAF50' : waterLevel > 25 ? '#FFC107' : '#F44336',
                },
              ]}
            />
          </View>
          <Text style={styles.waterStatusHint}>
            {waterLevel > 50
              ? '🌱 Looking healthy!'
              : waterLevel > 25
              ? '🌿 Could use some water soon'
              : '🥀 Needs water! '}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  wateringAlert: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  wateringText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  lastWatered: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  waterStatusContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  waterStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  waterStatusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  waterStatusTime: {
    fontSize: 12,
    color: '#666',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  waterStatusHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
