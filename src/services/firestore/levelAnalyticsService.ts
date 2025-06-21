import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { authService } from './authentication';

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
}

export class LevelAnalyticsService {
    private static collectionName = 'users';

    // Ensure user document exists
    private static async ensureUserDocument(userId: string): Promise<void> {
        try {
            const userDocRef = doc(db, this.collectionName, userId);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                // User document exists, no action needed
            } else {
                // Create new user document with level_analytics field
                await setDoc(userDocRef, {
                    level_analytics: {}
                });
            }
        } catch (error) {
            console.error('Error ensuring user document:', error);
        }
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
            session_timestamp: now.toISOString()
        };

        return analytics;
    }

    // Update analytics during level play (in-memory only)
    static updateAnalytics(analytics: LevelAnalytics, updates: Partial<LevelAnalytics>): LevelAnalytics {
        return { ...analytics, ...updates };
    }

    // Complete level session and save to user profile as array
    static async completeLevelSession(analytics: LevelAnalytics, finalData: Partial<LevelAnalytics>): Promise<void> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to complete analytics');
        }

        const endTime = new Date().toISOString();
        const startTime = new Date(analytics.start_time);
        const timeSpentSec = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);

        const completedAnalytics = {
            ...analytics,
            ...finalData,
            end_time: endTime,
            time_spent_sec: timeSpentSec
        };

        // Save to user profile as array (preserve existing level analytics)
        const userDocRef = doc(db, this.collectionName, currentUserId);
                
        try {
            // Ensure user document exists
            await this.ensureUserDocument(currentUserId);
            
            // Get the existing user data to preserve other level analytics
            const docSnap = await getDoc(userDocRef);
            let existingLevelAnalytics: Record<number, LevelAnalytics[]> = {};
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                existingLevelAnalytics = userData.level_analytics || {};
            }

            // Add the new session to the existing level analytics
            const currentLevelSessions = existingLevelAnalytics[analytics.level_id] || [];
            const updatedLevelSessions = [...currentLevelSessions, completedAnalytics];

            // Create the complete level analytics object
            const completeLevelAnalytics = {
                ...existingLevelAnalytics,
                [analytics.level_id]: updatedLevelSessions
            };

            // Update with all level analytics preserved
            await updateDoc(userDocRef, {
                level_analytics: completeLevelAnalytics,
                lastPlayed: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving level analytics to user profile:', error);
            throw error;
        }
    }

    // Get analytics for a specific level from user profile (returns array of sessions)
    static async getLevelAnalytics(levelId: number): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }

        const userDocRef = doc(db, this.collectionName, currentUserId);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
            return [];
        }

        const userData = docSnap.data();
        const levelAnalytics = userData.level_analytics?.[levelId];
        
        return Array.isArray(levelAnalytics) ? levelAnalytics : [];
    }

    // Get all analytics for current user from user profile (returns array of all sessions)
    static async getAllUserAnalytics(): Promise<LevelAnalytics[]> {
        const currentUserId = authService.getCurrentUserId();
        if (!currentUserId) {
            throw new Error('User must be authenticated to get analytics');
        }

        const userDocRef = doc(db, this.collectionName, currentUserId);
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
            return [];
        }

        const userData = docSnap.data();
        const levelAnalytics = userData.level_analytics || {};
        
        // Flatten all level sessions into a single array
        const allSessions: LevelAnalytics[] = [];
        Object.values(levelAnalytics).forEach((levelSessions: unknown) => {
            if (Array.isArray(levelSessions)) {
                allSessions.push(...(levelSessions as LevelAnalytics[]));
            }
        });
        
        return allSessions;
    }

    // Get analytics for a specific day
    static async getDayAnalytics(daySession: string): Promise<LevelAnalytics[]> {
        const allAnalytics = await this.getAllUserAnalytics();
        return allAnalytics.filter(session => session.day_session === daySession);
    }

    // Get analytics for a specific level on a specific day
    static async getLevelDayAnalytics(levelId: number, daySession: string): Promise<LevelAnalytics[]> {
        const levelAnalytics = await this.getLevelAnalytics(levelId);
        return levelAnalytics.filter(session => session.day_session === daySession);
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
} 