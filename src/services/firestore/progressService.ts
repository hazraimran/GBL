// utils/progressService.ts
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { UserProgress, LevelProgress } from '../../types/user';

// Service class for handling Firestore operations
export class ProgressService {
    // Save or update user progress
    static async saveProgress(progress: UserProgress): Promise<void> {
        try {
            const userDocRef = doc(db, 'users', progress.uid);
            await setDoc(userDocRef, progress, { merge: true });
        } catch (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    }

    // Save specific level progress
    static async saveLevelProgress(
        uid: string,
        levelId: number,
        levelData: Partial<LevelProgress>
    ): Promise<void> {
        try {
            const userDocRef = doc(db, 'users', uid);
            await updateDoc(userDocRef, {
                [`levels.${levelId}`]: levelData,
                lastPlayed: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving level progress:', error);
            throw error;
        }
    }

    // Get user progress
    static async getProgress(uid: string): Promise<UserProgress | null> {
        try {
            const userDocRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                return docSnap.data() as UserProgress;
            }
            return null;
        } catch (error) {
            console.error('Error getting progress:', error);
            throw error;
        }
    }
}