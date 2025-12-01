import { useState, useEffect } from 'react';
import { ref, onValue, get, update } from 'firebase/database';
import { database } from '../config/firebase';

// Helper to get date string in YYYY-MM-DD format
const getDateKey = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper to get the difference in days between two YYYY-MM-DD date strings
const getDaysDifference = (dateStr1, dateStr2) => {
  const date1 = new Date(dateStr1 + 'T00:00:00Z');
  const date2 = new Date(dateStr2 + 'T00:00:00Z');
  return Math.round((date1.getTime() - date2.getTime()) / 86400000);
};

// Helper to calculate streak from history
const calculateStreaks = (historyData) => {
  if (!historyData) return { currentStreak: 0, longestStreak: 0 };

  const dates = Object.keys(historyData). sort(). reverse(); // Most recent first
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = getDateKey(new Date());
  const yesterday = getDateKey(new Date(Date.now() - 86400000));

  // Check if current streak is active (watered today or yesterday)
  const lastWateredDate = dates[0];
  const isStreakActive = lastWateredDate === today || lastWateredDate === yesterday;

  // Calculate longest streak by checking consecutive days
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

  // Calculate current streak from most recent date backwards
  if (isStreakActive) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
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

export function useWateringStats() {
  const [stats, setStats] = useState({
    timesWatered: 0,
    longestStreak: 0,
    currentStreak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recalculateStats = async () => {
      const historyRef = ref(database, 'watering/history');
      const statsRef = ref(database, 'watering/stats');

      const historySnapshot = await get(historyRef);
      const historyData = historySnapshot.val() || {};

      const totalWaterings = Object.keys(historyData).length;
      const { currentStreak, longestStreak } = calculateStreaks(historyData);

      // Get existing stats to preserve longestStreak if it's higher
      const statsSnapshot = await get(statsRef);
      const existingStats = statsSnapshot.val() || { longestStreak: 0 };

      const newStats = {
        timesWatered: totalWaterings,
        currentStreak,
        longestStreak: Math.max(longestStreak, existingStats.longestStreak || 0),
      };

      // Update database with recalculated stats
      await update(statsRef, newStats);

      setStats(newStats);
      setLoading(false);
    };

    recalculateStats();

    // Also listen for real-time updates after initial calculation
    const statsRef = ref(database, 'watering/stats');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  return { stats, loading };
}