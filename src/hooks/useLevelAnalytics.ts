import { useState, useEffect, useRef, useContext } from 'react';
import { LevelAnalyticsService } from '../services/firestore/levelAnalyticsService';
import GameContext from '../context/GameContext';
import { LevelAnalytics } from '../services/firestore/levelAnalyticsService';

export const useLevelAnalytics = (levelId: number) => {
    const [analytics, setAnalytics] = useState<LevelAnalytics | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const { isAiHelperON } = useContext(GameContext);
    const startTimeRef = useRef<number>(0);
    const hintStartTimeRef = useRef<number>(0);
    const lastInteractionTimeRef = useRef<number>(0);
    const idleStartTimeRef = useRef<number | null>(null);
    const idleCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const analyticsRef = useRef<LevelAnalytics | null>(null);
    const isTrackingRef = useRef<boolean>(false);

    // Keep refs in sync with state
    useEffect(() => {
        analyticsRef.current = analytics;
    }, [analytics]);

    useEffect(() => {
        isTrackingRef.current = isTracking;
    }, [isTracking]);

    // Track user interaction (for idle time detection)
    const recordInteraction = () => {
        const now = Date.now();
        lastInteractionTimeRef.current = now;
        
        // If we were in an idle period, record it as a spike
        if (idleStartTimeRef.current !== null && analyticsRef.current) {
            const idleDurationSec = Math.floor((now - idleStartTimeRef.current) / 1000);
            if (idleDurationSec >= 30) {
                const startTime = new Date(idleStartTimeRef.current).toISOString();
                const endTime = new Date(now).toISOString();
                setAnalytics(prev => prev ? LevelAnalyticsService.trackIdleTimeSpike(prev, startTime, endTime, idleDurationSec) : null);
            }
            idleStartTimeRef.current = null;
        }
    };

    // Start tracking when level begins
    const startTracking = async () => {
        try {
            const newAnalytics = LevelAnalyticsService.startLevelSession(levelId);
            setAnalytics(newAnalytics);
            setIsTracking(true);
            startTimeRef.current = Date.now();
            lastInteractionTimeRef.current = Date.now();
            
            // Set initial AI helper status
            setAnalytics(prev => prev ? LevelAnalyticsService.setAIHelperStatus(prev, isAiHelperON) : null);
            
            // Set up idle time detection
            // Check every 5 seconds for idle periods
            idleCheckIntervalRef.current = setInterval(() => {
                if (!analyticsRef.current || !isTrackingRef.current) return;
                
                const now = Date.now();
                const timeSinceLastInteraction = now - lastInteractionTimeRef.current;
                
                // If >30 seconds of inactivity and not already tracking an idle period
                if (timeSinceLastInteraction >= 30000 && idleStartTimeRef.current === null) {
                    idleStartTimeRef.current = lastInteractionTimeRef.current;
                }
            }, 5000);
            
            // Listen for user interactions
            const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
            interactionEvents.forEach(event => {
                window.addEventListener(event, recordInteraction, { passive: true });
            });
        } catch (error) {
            console.error('Failed to start analytics tracking:', error);
        }
    };

    // Stop tracking when level ends and save to database
    const stopTracking = async (finalData?: Partial<LevelAnalytics>) => {
        if (!analytics) return;

        try {
            // Check for any final idle period
            if (idleStartTimeRef.current !== null) {
                const now = Date.now();
                const idleDurationSec = Math.floor((now - idleStartTimeRef.current) / 1000);
                if (idleDurationSec >= 30) {
                    const startTime = new Date(idleStartTimeRef.current).toISOString();
                    const endTime = new Date(now).toISOString();
                    setAnalytics(prev => prev ? LevelAnalyticsService.trackIdleTimeSpike(prev, startTime, endTime, idleDurationSec) : null);
                }
            }
            
            // Clean up idle detection
            if (idleCheckIntervalRef.current) {
                clearInterval(idleCheckIntervalRef.current);
                idleCheckIntervalRef.current = null;
            }
            
            const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
            interactionEvents.forEach(event => {
                window.removeEventListener(event, recordInteraction);
            });
            
            await LevelAnalyticsService.completeLevelSession(analytics, finalData || {});
            setIsTracking(false);
            setAnalytics(null);
            idleStartTimeRef.current = null;
            lastInteractionTimeRef.current = 0;
        } catch (error) {
            console.error('Failed to stop analytics tracking:', error);
        }
    };

    // Track reset
    const trackReset = () => {
        if (!analytics) return;
        recordInteraction(); // Reset counts as interaction
        setAnalytics(LevelAnalyticsService.trackReset(analytics));
    };

    // Track hint usage
    const trackHint = (hintTimeSec?: number) => {
        if (!analytics) return;
        recordInteraction(); // Hint access counts as interaction
        setAnalytics(LevelAnalyticsService.trackHint(analytics, hintTimeSec));
    };

    // Start hint timer
    const startHintTimer = () => {
        hintStartTimeRef.current = Date.now();
    };

    // End hint timer and track
    const endHintTimer = () => {
        if (hintStartTimeRef.current > 0 && analytics) {
            const hintTimeSec = Math.floor((Date.now() - hintStartTimeRef.current) / 1000);
            setAnalytics(LevelAnalyticsService.trackHint(analytics, hintTimeSec));
            hintStartTimeRef.current = 0;
        }
    };

    // Track instruction submission
    const trackInstructionSubmission = (instructionCount: number) => {
        if (!analytics) return;
        recordInteraction(); // Code submission counts as interaction
        setAnalytics(LevelAnalyticsService.trackInstructionSubmission(analytics, instructionCount));
    };

    // Track error
    const trackError = () => {
        if (!analytics) return;
        recordInteraction(); // Error response counts as interaction
        setAnalytics(LevelAnalyticsService.trackError(analytics));
    };

    // Track help button click
    const trackHelpButtonClick = () => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackHelpButtonClick(analytics));
    };

    // Track concept button click
    const trackConceptButtonClick = () => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackConceptButtonClick(analytics));
    };

    // Track coins collected
    const trackCoinsCollected = (coins: number) => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackCoinsCollected(analytics, coins));
    };

    // Track attempt (code execution)
    const trackAttempt = (timeToFirstRunSec?: number) => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackAttempt(analytics, timeToFirstRunSec));
    };

    // Track hint tier accessed
    const trackHintTier = (tier: number) => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackHintTier(analytics, tier));
    };

    // Track idle time spike
    const trackIdleTimeSpike = (startTime: string, endTime: string, durationSec: number) => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackIdleTimeSpike(analytics, startTime, endTime, durationSec));
    };

    // Set time to solution
    const setTimeToSolution = (timeToSolutionSec: number) => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.setTimeToSolution(analytics, timeToSolutionSec));
    };

    // Update AI helper status when it changes
    useEffect(() => {
        if (analytics && isTracking) {
            setAnalytics(LevelAnalyticsService.setAIHelperStatus(analytics, isAiHelperON));
        }
    }, [isAiHelperON, analytics, isTracking]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (idleCheckIntervalRef.current) {
                clearInterval(idleCheckIntervalRef.current);
            }
            const interactionEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
            interactionEvents.forEach(event => {
                window.removeEventListener(event, recordInteraction);
            });
        };
    }, []);

    return {
        analytics,
        isTracking,
        startTracking,
        stopTracking,
        trackReset,
        trackHint,
        startHintTimer,
        endHintTimer,
        trackInstructionSubmission,
        trackError,
        trackHelpButtonClick,
        trackConceptButtonClick,
        trackCoinsCollected,
        trackAttempt,
        trackHintTier,
        trackIdleTimeSpike,
        setTimeToSolution
    };
}; 