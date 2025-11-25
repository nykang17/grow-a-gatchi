import { View, Text, StyleSheet } from 'react-native';
import { useWateringListener } from '../../hooks/use-watering-listener';

export default function HomeScreen() {
  const { justWatered, lastWateredAt } = useWateringListener();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 Grow Garden</Text>
      
      {justWatered && (
        <View style={styles.wateringAlert}>
          <Text style={styles.wateringText}>💧 Just got watered!</Text>
        </View>
      )}
      
      {/* {lastWateredAt && (
        <Text style={styles.lastWatered}>
          Last watered: {new Date(lastWateredAt).toLocaleString()}
        </Text>
      )} */}
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
  // lastWatered: {
  //   fontSize: 16,
  //   color: '#666',
  //   marginTop: 10,
  // },
});