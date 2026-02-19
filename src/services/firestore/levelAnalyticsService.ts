import { doc, collection, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { authService } from './authentication';

const USERS_COLLECTION = 'users';
const LEVEL_SESSIONS_SUBCOLLECTION = 'level_sessions';

export interface IdleTimeSpike {
    start_time: string; // ISO string
    end_time: string; // ISO string
    duration_sec: number;
}

export interface LevelAnalytics {
    player_id: string;
    level_id: number;
    start_time: string; // ISO string
    end_time?: string; // ISO string
    time_spent_sec: number;
    num_resets: number;
    hints_used: number;
    hint_time_sec: number;
    instructions_submitted: number;
    success_on_first_try: boolean;
    final_instruction_count: number;
    errors_encountered: number;
    level_skipped: boolean;
    khepri_help_needed: boolean; // AI assistant was used
    num_help_button_clicks: number;
    num_concept_button_clicks: number;
    coins_collected: number;
    ai_helper_enabled: boolean; // Was AI helper ON during this level
    day_session: string; // Date in YYYY-MM-DD format
    session_timestamp: string; // Full ISO timestamp for this session
    // New metrics
    attempt_count: number; // Number of times user ran code
    time_to_first_run_sec?: number; // Time from level start to first execution (seconds)
    time_to_solution_sec?: number; // Time from level start to completion (seconds)
    hint_tier_accessed: number[]; // Array of hint tiers accessed (0/1/2/3)
    idle_time_spikes: IdleTimeSpike[]; // Extended periods of no interaction (>30 seconds)
}

export class LevelAnalyticsService {
    private static levelSessionsRef(userId: string) {
        return collection(db, USERS_COLLECTION, userId, LEVEL_SESSIONS_SUBCOLLECTION);
    }

    // Start tracking a new level session (in-memory only)
    static startLevelSession(levelId: number): LevelAnalytics {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to track analytics');
        }

        const now = new Date();
        const daySession = now.toISOString().split('T')[0]; // YYYY-MM-DD format

        const analytics: LevelAnalytics = {
            player_id: currentUserId,
            level_id: levelId,
            start_time: now.toISOString(),
            time_spent_sec: 0,
            num_resets: 0,
            hints_used: 0,
            hint_time_sec: 0,
            instructions_submitted: 0,
            success_on_first_try: true,
            final_instruction_count: 0,
            errors_encountered: 0,
            level_skipped: false,
            khepri_help_needed: false,
            num_help_button_clicks: 0,
            num_concept_button_clicks: 0,
            coins_collected: 0,
            ai_helper_enabled: false,
            day_session: daySession,
            session_timestamp: now.toISOString(),
            attempt_count: 0,
            hint_tier_accessed: [],
            idle_time_spikes: []
        };

        return analytics;
    }

    // Update analytics during level play (in-memory only)
    static updateAnalytics(analytics: LevelAnalytics, updates: Partial<LevelAnalytics>): LevelAnalytics {
        return { ...analytics, ...updates };
    }

    // Complete level session and save as a new document in users/{userId}/level_sessions
    static async completeLevelSession(analytics: LevelAnalytics, finalData: Partial<LevelAnalytics>): Promise<void> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to complete analytics');
        }

        const endTime = new Date().toISOString();
        const startTime = new Date(analytics.start_time);
        const timeSpentSec = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);

        const completedAnalytics: LevelAnalytics = {
            ...analytics,
            ...finalData,
            end_time: endTime,
            time_spent_sec: timeSpentSec
        };

        try {
            const sessionsRef = this.levelSessionsRef(currentUserId);
            await addDoc(sessionsRef, completedAnalytics);

            // Update user document lastPlayed only (merge so we don't overwrite other fields)
            const userDocRef = doc(db, USERS_COLLECTION, currentUserId);
            await setDoc(userDocRef, { lastPlayed: new Date().toISOString() }, { merge: true });
        } catch (error) {
            console.error('Error saving level analytics to subcollection:', error);
            throw error;
        }
    }

    // Get analytics for a specific level (query level_sessions subcollection)
    static async getLevelAnalytics(levelId: number): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }

        const sessionsRef = this.levelSessionsRef(currentUserId);
        const q = query(sessionsRef, where('level_id', '==', levelId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data() as LevelAnalytics);
    }

    // Get all analytics for current user (all docs in level_sessions subcollection)
    static async getAllUserAnalytics(): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }

        const sessionsRef = this.levelSessionsRef(currentUserId);
        const snapshot = await getDocs(sessionsRef);
        return snapshot.docs.map(d => d.data() as LevelAnalytics);
    }

    // Get analytics for a specific day
    static async getDayAnalytics(daySession: string): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }
        const sessionsRef = this.levelSessionsRef(currentUserId);
        const q = query(sessionsRef, where('day_session', '==', daySession));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data() as LevelAnalytics);
    }

    // Get analytics for a specific level on a specific day
    static async getLevelDayAnalytics(levelId: number, daySession: string): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }
        const sessionsRef = this.levelSessionsRef(currentUserId);
        const q = query(
            sessionsRef,
            where('level_id', '==', levelId),
            where('day_session', '==', daySession)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => d.data() as LevelAnalytics);
    }

    // Helper methods for tracking specific events (in-memory only)
    static trackReset(analytics: LevelAnalytics): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            num_resets: analytics.num_resets + 1,
            success_on_first_try: false
        });
    }

    static trackHint(analytics: LevelAnalytics, hintTimeSec: number = 0): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            hints_used: analytics.hints_used + 1,
            hint_time_sec: analytics.hint_time_sec + hintTimeSec,
            khepri_help_needed: true
        });
    }

    static trackInstructionSubmission(analytics: LevelAnalytics, instructionCount: number): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            instructions_submitted: analytics.instructions_submitted + 1,
            final_instruction_count: instructionCount
        });
    }

    static trackError(analytics: LevelAnalytics): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            errors_encountered: analytics.errors_encountered + 1
        });
    }

    static trackHelpButtonClick(analytics: LevelAnalytics): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            num_help_button_clicks: analytics.num_help_button_clicks + 1
        });
    }

    static trackConceptButtonClick(analytics: LevelAnalytics): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            num_concept_button_clicks: analytics.num_concept_button_clicks + 1
        });
    }

    static trackCoinsCollected(analytics: LevelAnalytics, coins: number): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            coins_collected: analytics.coins_collected + coins
        });
    }

    static setAIHelperStatus(analytics: LevelAnalytics, enabled: boolean): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            ai_helper_enabled: enabled
        });
    }

    // Track attempt count (when user runs code)
    static trackAttempt(analytics: LevelAnalytics, timeToFirstRunSec?: number): LevelAnalytics {
        const updates: Partial<LevelAnalytics> = {
            attempt_count: analytics.attempt_count + 1
        };
        // Set time_to_first_run_sec only on first attempt if not already set
        if (analytics.attempt_count === 0 && timeToFirstRunSec !== undefined) {
            updates.time_to_first_run_sec = timeToFirstRunSec;
        }
        return this.updateAnalytics(analytics, updates);
    }

    // Track hint tier accessed (0/1/2/3)
    static trackHintTier(analytics: LevelAnalytics, tier: number): LevelAnalytics {
        const hintTiers = [...(analytics.hint_tier_accessed || [])];
        if (!hintTiers.includes(tier)) {
            hintTiers.push(tier);
        }
        return this.updateAnalytics(analytics, {
            hint_tier_accessed: hintTiers
        });
    }

    // Track idle time spike (>30 seconds of no interaction)
    static trackIdleTimeSpike(analytics: LevelAnalytics, startTime: string, endTime: string, durationSec: number): LevelAnalytics {
        const idleSpikes = [...(analytics.idle_time_spikes || [])];
        idleSpikes.push({
            start_time: startTime,
            end_time: endTime,
            duration_sec: durationSec
        });
        return this.updateAnalytics(analytics, {
            idle_time_spikes: idleSpikes
        });
    }

    // Set time to solution when level completes
    static setTimeToSolution(analytics: LevelAnalytics, timeToSolutionSec: number): LevelAnalytics {
        return this.updateAnalytics(analytics, {
            time_to_solution_sec: timeToSolutionSec
        });
    }
} 