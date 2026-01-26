import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../api/firebase';

export const useEconomySetting = () => {
    const [economyEnabled, setEconomyEnabled] = useState<boolean>(true); // Default to enabled
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const docRef = doc(db, 'settings', 'economy');

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                try {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        // Check if economy field exists, default to true if not
                        setEconomyEnabled(data.enabled !== false);
                    } else {
                        // Document doesn't exist, default to enabled
                        setEconomyEnabled(true);
                    }
                    setError(null);
                } catch (err) {
                    setError(err as Error);
                    // On error, default to enabled
                    setEconomyEnabled(true);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                console.error('Error fetching economy setting:', err);
                setError(err as Error);
                setEconomyEnabled(true); // Default to enabled on error
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { economyEnabled, loading, error };
};

