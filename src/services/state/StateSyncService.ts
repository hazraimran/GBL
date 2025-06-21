import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import gameStorageService from '../storage/gameStorageService';
import { authService } from '../firestore/authentication';

export class StateSyncService {
    static async syncWithFirebase(): Promise<void> {
        const userId = authService.getCurrentUserId();
        if (!userId) {
            console.warn('No authenticated user found. Skipping state sync.');
            return;
        }

        try {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const firebaseData = userDoc.data();
                
                if (firebaseData.records) {
                    gameStorageService.setRecords(firebaseData.records);
                }
                
                // You can add more fields to sync here, e.g., coins
                if (typeof firebaseData.coins === 'number') {
                    gameStorageService.setCoins(firebaseData.coins);
                }
            } else {
                // No user document found in Firebase. Local state will be used.
            }
        } catch (error) {
            console.error('Error syncing state with Firebase:', error);
        }
    }
} 