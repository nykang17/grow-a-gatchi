import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sprite from '../../components/sprite';
import { useWateringListener } from '../../hooks/use-watering-listener';

const DRY_THRESHOLD = 10000;//2 * 24 * 60 * 60 * 1000; // 2 days
const WATERING_DISPLAY_DURATION = 3000; // 3 seconds

export default function HomeScreen() {
  const { justWatered, lastWateredAt, timesWatered } = useWateringListener();

  // If watering just happened, temporarily force sprite = "watering"
  const [showWateringSprite, setShowWateringSprite] = useState(false);

  // Detect dry state (not currently working)
  const isDry =
    lastWateredAt &&
    Date.now() - lastWateredAt > DRY_THRESHOLD;

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
      <Text style={styles.title}>🌱 Grow Garden</Text>

      <Sprite state={spriteState} />

      {justWatered && (
        <View style={styles.wateringAlert}>
          <Text style={styles.wateringText}>💧 Just got watered!</Text>
        </View>
      )}

      {lastWateredAt && (
        <Text style={styles.lastWatered}>
          Last watered: {new Date(lastWateredAt).toLocaleString()}
        </Text>
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
});
