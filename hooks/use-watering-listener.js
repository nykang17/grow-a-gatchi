import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

export function useWateringListener() {
    const [justWatered, setJustWatered] = useState(false);
    const [lastWateredAt, setLastWateredAt] = useState(null);

    useEffect(() => {
        // Listen to watering events in the database (assumed path: 'watering_events/latest')
        const wateringRef = ref(database, 'watering_events/latest');

        const unsubscribe = onValue(wateringRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.timestamp) {
                // Check if this is a new watering event (within last 5 seconds)
                const eventTime = new Date(data.timestamp).getTime();
                const now = Date.now();
                
                if (now - eventTime < 5000) {
                setJustWatered(true);
                setLastWateredAt(data.timestamp);
                
                // Hide the "just got watered" message after 3 seconds
                setTimeout(() => {
                    setJustWatered(false);
                }, 3000);
                }
            }
        });

        return () => unsubscribe();
    }, []);
    return { justWatered, lastWateredAt };
}