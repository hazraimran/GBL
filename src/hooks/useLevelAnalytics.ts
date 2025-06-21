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

    // Start tracking when level begins
    const startTracking = async () => {
        try {
            const newAnalytics = LevelAnalyticsService.startLevelSession(levelId);
            setAnalytics(newAnalytics);
            setIsTracking(true);
            startTimeRef.current = Date.now();
            
            // Set initial AI helper status
            setAnalytics(prev => prev ? LevelAnalyticsService.setAIHelperStatus(prev, isAiHelperON) : null);
        } catch (error) {
            console.error('Failed to start analytics tracking:', error);
        }
    };

    // Stop tracking when level ends and save to database
    const stopTracking = async (finalData?: Partial<LevelAnalytics>) => {
        if (!analytics) return;

        try {
            await LevelAnalyticsService.completeLevelSession(analytics, finalData || {});
            setIsTracking(false);
            setAnalytics(null);
        } catch (error) {
            console.error('Failed to stop analytics tracking:', error);
        }
    };

    // Track reset
    const trackReset = () => {
        if (!analytics) return;
        setAnalytics(LevelAnalyticsService.trackReset(analytics));
    };

    // Track hint usage
    const trackHint = (hintTimeSec?: number) => {
        if (!analytics) return;
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
        setAnalytics(LevelAnalyticsService.trackInstructionSubmission(analytics, instructionCount));
    };

    // Track error
    const trackError = () => {
        if (!analytics) return;
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

    // Update AI helper status when it changes
    useEffect(() => {
        if (analytics && isTracking) {
            setAnalytics(LevelAnalyticsService.setAIHelperStatus(analytics, isAiHelperON));
        }
    }, [isAiHelperON, analytics, isTracking]);

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
        trackCoinsCollected
    };
}; 