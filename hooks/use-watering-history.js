import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

// Helper to get date string in YYYY-MM-DD format
const getDateKey = (date) => {
    return date.toISOString().split('T')[0];
};

export function useWateringHistory() {
    const [wateringData, setWateringData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const historyRef = ref(database, 'watering/history');

        const unsubscribe = onValue(historyRef, (snapshot) => {
            const data = snapshot.val() || {};
            const today = getDateKey(new Date());

            // Transform history data into calendar format
            const calendarData = {};

            // Mark all watered days
            Object.keys(data). forEach((dateKey) => {
                calendarData[dateKey] = 'watered';
            });

            // Mark missed days (past days without watering)
            // Check the last 30 days for missed waterings
            for (let i = 1; i <= 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateKey = getDateKey(date);

                if (!calendarData[dateKey]) {
                    calendarData[dateKey] = 'missed';
                }
            }

            // Mark all remaining days in the year as upcoming
            const currentYear = new Date(). getFullYear();
            const endOfYearKey = `${currentYear}-12-31`;

            let futureDate = new Date();
            futureDate. setDate(futureDate.getDate() + 1); // Start from tomorrow
            let futureDateKey = getDateKey(futureDate);

            while (futureDateKey <= endOfYearKey) {
                if (!calendarData[futureDateKey]) {
                    calendarData[futureDateKey] = 'upcoming';
                }
                futureDate.setDate(futureDate.getDate() + 1);
                futureDateKey = getDateKey(futureDate);
            }

            setWateringData(calendarData);
            setLoading(false);
        });

        return () => unsubscribe();
  }, []);

  return { wateringData, loading };
}