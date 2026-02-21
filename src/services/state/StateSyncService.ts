import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../api/firebase';
import gameStorageService from '../storage/gameStorageService';
import { authService } from '../firestore/authentication';
import { getLocalLevels } from '../firestore/levels';

const USERS_COLLECTION = 'users';
const LEVEL_RECORDS_SUBCOLLECTION = 'level_records';

let lastSyncedUserId: string | null = null;

export class StateSyncService {
    static async syncWithFirebase(): Promise<void> {
        const userId = authService.getCurrentUserId();
        if (!userId) {
            lastSyncedUserId = null;
            return;
        }
        if (userId === lastSyncedUserId) {
            return;
        }
        lastSyncedUserId = userId;

        try {
            const userDocRef = doc(db, USERS_COLLECTION, userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const firebaseData = userDoc.data();
                //set levels info
                await getLocalLevels();
                
                // Try to read records from subcollection first (new format)
                try {
                    const recordsRef = collection(db, USERS_COLLECTION, userId, LEVEL_RECORDS_SUBCOLLECTION);
                    const recordsSnapshot = await getDocs(recordsRef);
                    
                    if (!recordsSnapshot.empty) {
                        // Convert subcollection documents to array format expected by setRecords
                        const recordsArray = recordsSnapshot.docs.map((docSnap) => {
                            const data = docSnap.data();
                            return {
                                id: data.level_id,
                                commandsUsed: typeof data.commandsUsed === 'string' 
                                    ? data.commandsUsed 
                                    : JSON.stringify(data.commandsUsed),
                                executeCnt: data.executeCnt,
                                errorCnt: data.errorCnt,
                                timeSpent: data.timeSpent
                            };
                        });
                        gameStorageService.setRecords(recordsArray);
                    }
                } catch (subcollectionError) {
                    // Fallback to old format if subcollection doesn't exist or fails
                    if (firebaseData.records) {
                        // Old format: records is an object, convert to array
                        const oldRecords = firebaseData.records;
                        const recordsArray = Array.isArray(oldRecords) 
                            ? oldRecords 
                            : Object.values(oldRecords);
                        if (recordsArray.length > 0) {
                            gameStorageService.setRecords(recordsArray);
                        }
                    }
                }
                
                // You can add more fields to sync here, e.g., coins
                if (typeof firebaseData.coins === 'number') {
                    gameStorageService.setCoins(firebaseData.coins);
                }

            } else {
                // No user document found in Firebase. Local state will be used.
            }
        } catch (error) {
            lastSyncedUserId = null;
            console.error('Error syncing state with Firebase:', error);
        }
    }
} 