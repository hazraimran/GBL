import { useState, useEffect, useRef } from 'react';
import { LevelInfo } from '../types/level';
import gameTimer from '../utils/Timer';

interface UseTimeCapReturn {
    timeExpired: boolean;
    elapsedTime: number;
    resetTimer: () => void;
}

export const useTimeCap = (levelInfo: LevelInfo | null): UseTimeCapReturn => {
    const [timeExpired, setTimeExpired] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const hasExpiredRef = useRef(false);

    useEffect(() => {
        // Reset state when level changes
        setTimeExpired(false);
        setElapsedTime(0);
        hasExpiredRef.current = false;

        // Only set up timer if level has a time limit
        if (!levelInfo?.timeLimitInSeconds) {
            return;
        }

        // Check elapsed time every second
        intervalRef.current = window.setInterval(() => {
            const elapsed = gameTimer.getDuration();
            setElapsedTime(elapsed);

            // Check if time limit has been exceeded
            if (elapsed >= levelInfo.timeLimitInSeconds && !hasExpiredRef.current) {
                hasExpiredRef.current = true;
                setTimeExpired(true);
            }
        }, 1000);

        // Cleanup interval on unmount or level change
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [levelInfo?.id, levelInfo?.timeLimitInSeconds]);

    const resetTimer = () => {
        // Reset the timer completely
        gameTimer.reset();
        gameTimer.setLevel(levelInfo?.id || 1);
        gameTimer.start();
        setTimeExpired(false);
        setElapsedTime(0);
        hasExpiredRef.current = false;
    };

    return {
        timeExpired,
        elapsedTime,
        resetTimer
    };
};

