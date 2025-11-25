import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

export function useWateringListener() {
    const [justWatered, setJustWatered] = useState(false);
    const [lastWateredAt, setLastWateredAt] = useState(null);
    const [timesWatered, setTimesWatered] = useState(0);

    useEffect(() => {
        // Listen to watering events in the database (assumed path: 'watering_events/latest')
        const wateringRef = ref(database, 'watering/latest');

        const unsubscribe = onValue(wateringRef, (snapshot) => {
            console.log('Watering event snapshot:', snapshot.val());
            const data = snapshot.val();
            if (data && data.timestamp) {
                // Check if this is a new watering event (within last 5 seconds)
                let timestamp = data.timestamp;
                // if (!timestamp.endsWith('Z') && !timestamp.includes('+')) {
                //     timestamp += 'Z';
                // }
                const eventTime = new Date(timestamp).getTime();
                const now = Date.now();
                
                console.log('Event time:', eventTime, 'Now:', now, 'Difference:', now - eventTime);
                if (now - eventTime < 5000) {
                    setJustWatered(true);
                    setLastWateredAt(data.timestamp);
                    setTimesWatered(prev => prev+1);
                    console.log(timesWatered);
                    
                    // Hide the "just got watered" message after 3 seconds
                    setTimeout(() => {
                        setJustWatered(false);
                    }, 3000);
                }
            }
        });

        return () => unsubscribe();
    }, []);
    return { justWatered, lastWateredAt, timesWatered };
}