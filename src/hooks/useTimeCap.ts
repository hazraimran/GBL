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
    const animationFrameRef = useRef<number | null>(null);
    const hasExpiredRef = useRef(false);
    const lastSyncRef = useRef<number>(0); // Last synced elapsed time from timer
    const lastSyncTimeRef = useRef<number>(0); // When we last synced

    useEffect(() => {
        // Reset state when level changes
        setTimeExpired(false);
        hasExpiredRef.current = false;

        // Only set up timer if level has a time limit
        if (!levelInfo?.timeLimitInSeconds) {
            setElapsedTime(0);
            lastSyncRef.current = 0;
            lastSyncTimeRef.current = Date.now();
            return;
        }

        // Cancel any existing animation frame
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Initialize sync with actual timer value (don't assume it's 0)
        const initialElapsed = gameTimer.getDuration();
        const timerState = gameTimer.getState();
        const now = Date.now();
        lastSyncRef.current = initialElapsed;
        lastSyncTimeRef.current = now;
        setElapsedTime(initialElapsed);

        // Use requestAnimationFrame for smooth updates that aren't throttled
        // Sync with actual timer every second, but update display every frame
        const SYNC_INTERVAL_MS = 1000; // Sync with actual timer every second
        
        const updateElapsed = () => {
            const now = Date.now();
            const timeSinceLastSync = now - lastSyncTimeRef.current;
            const actualElapsed = gameTimer.getDuration();
            const timerState = gameTimer.getState();
            
            // If timer just started (wasn't running before, now is), sync immediately
            const shouldSyncNow = timeSinceLastSync >= SYNC_INTERVAL_MS || 
                                  (timerState.isRunning && lastSyncRef.current === 0 && actualElapsed > 0);
            
            if (shouldSyncNow) {
                const prevSync = lastSyncRef.current;
                const delta = actualElapsed - prevSync;
                
                if (delta < 0 || (prevSync === 0 && actualElapsed > 0)) {
                    // Timer was reset or just started
                    lastSyncRef.current = actualElapsed;
                    lastSyncTimeRef.current = now;
                    setElapsedTime(actualElapsed);
                } else {
                    // Normal sync: update our reference point
                    lastSyncRef.current = actualElapsed;
                    lastSyncTimeRef.current = now;
                    setElapsedTime(actualElapsed);
                }
                
                // Check if time limit has been exceeded
                if (actualElapsed >= levelInfo.timeLimitInSeconds && !hasExpiredRef.current) {
                    hasExpiredRef.current = true;
                    setTimeExpired(true);
                }
            } else {
                // Between syncs: calculate elapsed from last sync point for smooth display
                // Use fractional seconds for smoother updates (but still display as integer)
                const elapsedSinceSync = timeSinceLastSync / 1000;
                const displayElapsed = Math.floor(lastSyncRef.current + elapsedSinceSync);
                setElapsedTime(displayElapsed);
            }
            
            // Schedule next frame
            animationFrameRef.current = requestAnimationFrame(updateElapsed);
        };
        
        animationFrameRef.current = requestAnimationFrame(updateElapsed);

        // Cleanup animation frame on unmount or level change
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
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
        lastSyncRef.current = 0;
        lastSyncTimeRef.current = Date.now();
        hasExpiredRef.current = false;
    };

    return {
        timeExpired,
        elapsedTime,
        resetTimer
    };
};

