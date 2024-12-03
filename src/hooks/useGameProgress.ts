// hooks/useGameProgress.ts
import { useState, useEffect } from 'react';
import { LevelProgress, UserProgress } from '../types/user';
import CircularJSON from 'circular-json';
import { useGameStorage } from './useStorage/useGameStorage';

export const useGameProgress = () => {
    // Track loading state and progress data
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { uid } = useGameStorage();

    useEffect(() => {
        const initializeProgress = async () => {
            try {
                setIsLoading(true);
                // const uid = await getOrCreateUID();
                const storedProgress = localStorage.getItem('game_progress');

                if (storedProgress) {
                    const parsedProgress = JSON.parse(storedProgress);
                    // Update UID if stored one doesn't match current
                    if (parsedProgress.uid !== uid) {
                        parsedProgress.uid = uid;
                        localStorage.setItem('game_progress', CircularJSON.stringify(parsedProgress));
                    }
                    setProgress(parsedProgress);
                } else {
                    // Create new progress object with device info
                    const newProgress = {
                        uid,
                        levels: {},
                        lastPlayed: new Date().toISOString(),
                        deviceInfo: {
                            userAgent: window.navigator.userAgent,
                            language: window.navigator.language,
                            screenResolution: `${window.screen.width}x${window.screen.height}`,
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        }
                    };
                    localStorage.setItem('game_progress', CircularJSON.stringify(newProgress));
                    setProgress(newProgress);
                }
            } catch (error) {
                console.error('Failed to initialize progress:', error);
                // Fallback to basic progress object if initialization fails
                const fallbackProgress = {
                    uid: Date.now().toString(36),
                    levels: {},
                    lastPlayed: new Date().toISOString()
                };
                setProgress(fallbackProgress);
            } finally {
                setIsLoading(false);
            }
        };

        initializeProgress();
    }, []);

    // Save level progress both locally and to server
    const saveLevelProgress = async (levelId: number, levelData: Partial<LevelProgress>) => {
        if (!progress) return;

        // Create updated progress object
        const updatedProgress = {
            ...progress,
            lastPlayed: new Date().toISOString(),
            levels: {
                ...progress.levels,
                [levelId]: {
                    ...progress.levels[levelId],
                    ...levelData,
                    levelId,
                    completedAt: new Date().toISOString()
                }
            }
        };

        try {
            // Save to localStorage first
            localStorage.setItem('game_progress', CircularJSON.stringify(updatedProgress));
            setProgress(updatedProgress);

            // Sync with server
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: progress.uid,
                    levelId,
                    deviceInfo: progress.deviceInfo,
                    ...levelData
                }),
                // Add retry configuration for resilience
                retry: 3,
                retryDelay: 1000,
            });

            if (!response.ok) {
                throw new Error('Failed to sync progress');
            }
        } catch (error) {
            console.error('Failed to save progress:', error);
            // Could add offline queue or retry mechanism here
        }
    };

    // Return loading state if still initializing
    if (isLoading) {
        return { isLoading, progress: null, saveLevelProgress: () => Promise.resolve() };
    }

    return {
        isLoading,
        progress,
        saveLevelProgress
    };
};
