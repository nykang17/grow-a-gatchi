import { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, get, update} from 'firebase/database';
import { database } from '../config/firebase';

const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
};

const getDaysDifference = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1 + 'T00:00:00Z');
  const date2 = new Date(dateStr2 + 'T00:00:00Z');
  return Math.round((date1. getTime() - date2.getTime()) / 86400000);
};

// Helper to calculate streak from history
const calculateStreaks = (historyData) => {
    if (!historyData) 
        return { currentStreak: 0, longestStreak: 0 };

    const dates = Object.keys(historyData).sort().reverse(); // Most recent first
    if (dates.length === 0) 
        return { currentStreak: 0, longestStreak: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = getDateKey(new Date());
    const yesterday = getDateKey(new Date(Date.now() - 86400000));

    // Check if current streak is active (watered today or yesterday)
    const lastWateredDate = dates[0];
    const isStreakActive = lastWateredDate === today || lastWateredDate === yesterday;

    for (let i = 1; i < dates. length; i++) {
        const diffDays = getDaysDifference(dates[i - 1], dates[i]);

        if (diffDays === 1) {
            tempStreak++;
        } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
        }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    // currentStreak = isStreakActive ? tempStreak : 0;

    // Recalculate current streak from most recent date backwards
    if (isStreakActive) {
        currentStreak = 1;
        for (let i = 1; i < dates. length; i++) {
            const diffDays = getDaysDifference(dates[i - 1], dates[i]);

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    return { currentStreak, longestStreak };
};

// Helper to calculate total waterings from history
const calculateTotalWaterings = (historyData) => {
    if (!historyData) return 0;

    return Object.values(historyData).reduce((total, entry) => {
        return total + (entry.count || 1);
    }, 0);
};

export function useWateringListener() {
    const [justWatered, setJustWatered] = useState(false);
    const [lastWateredAt, setLastWateredAt] = useState(null);
    const [timesWatered, setTimesWatered] = useState(0);
    const lastProcessedTimestamp = useRef(null);

    useEffect(() => {
        // Listen to watering events in the database (assumed path: 'watering_events/latest')
        const wateringRef = ref(database, 'watering/latest');

        const unsubscribe = onValue(wateringRef, async (snapshot) => {
            console.log('Watering event snapshot:', snapshot.val());
            const data = snapshot.val();
            if (data && data.timestamp) {
                // Check if this is a new watering event (within last 5 seconds)
                let timestamp = data.timestamp;
                const eventTime = new Date(timestamp).getTime();
                const now = Date.now();

                if (lastProcessedTimestamp.current === data.timestamp) {
                    return;
                }
                
                console.log('Event time:', eventTime, 'Now:', now, 'Difference:', now - eventTime);
                if (now - eventTime < 5000) {
                    lastProcessedTimestamp.current = data.timestamp;
                    setJustWatered(true);
                    setLastWateredAt(data.timestamp);

                    const statsRef = ref(database, 'watering/stats');
                    const allHistoryRef = ref(database, 'watering/history');

                    // Fetch current stats and history
                    const [statsSnapshot, allHistorySnapshot] = await Promise.all([
                        get(statsRef),
                        get(allHistoryRef)
                    ]);

                    const currentStats = statsSnapshot.val() || { timesWatered: 0, longestStreak: 0 };
                    const historyData = allHistorySnapshot.val() || {};
                    const totalWaterings = calculateTotalWaterings(historyData);
                    // const totalWaterings = Object.keys(historyData).length;

                    const { currentStreak, longestStreak } = calculateStreaks(historyData);

                    // Update stats in the database
                    await update(statsRef, {
                        timesWatered: totalWaterings,
                        currentStreak,
                        longestStreak: Math.max(longestStreak, currentStats.longestStreak || 0),
                    });

                    setTimesWatered(totalWaterings);

                    // Hide the "just got watered" message after 3 seconds
                    setTimeout(() => {
                        setJustWatered(false);
                    }, 3000);
                }
            }
        });

        // Load initial stats
        const loadInitialStats = async () => {
        const statsRef = ref(database, 'watering/stats');
        const snapshot = await get(statsRef);
        if (snapshot.exists()) {
            console.log('Initial stats loaded:', snapshot.val());
            setTimesWatered(snapshot.val().timesWatered);
        }
        };
        loadInitialStats();

        return () => unsubscribe();
    }, []);
    return { justWatered, lastWateredAt, timesWatered };
}