// utils/progressService.ts
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { CommandWithArgType } from '../../types/game';
import { authService } from './authentication';

const USERS_COLLECTION = 'users';
const LEVEL_RECORDS_SUBCOLLECTION = 'level_records';

// Firestore string value limit is 1,048,487 bytes; use a safe limit with margin
const MAX_COMMANDSUSED_BYTES = 1_000_000;

/** Return byte length of a string (UTF-8). */
function byteLength(str: string): number {
    return new TextEncoder().encode(str).length;
}

/**
 * Ensure commandsUsed serialization fits within Firestore size limit.
 * If over limit, truncate to a prefix of the array that fits and return valid JSON string.
 */
function capCommandsUsedForFirestore(commandsUsed: CommandWithArgType[] | string): string {
    const str = Array.isArray(commandsUsed) ? JSON.stringify(commandsUsed) : commandsUsed;
    if (byteLength(str) <= MAX_COMMANDSUSED_BYTES) return str;
    let arr: CommandWithArgType[];
    try {
        arr = Array.isArray(commandsUsed) ? commandsUsed : (JSON.parse(commandsUsed) as CommandWithArgType[]);
    } catch {
        return '[]';
    }
    let n = arr.length;
    while (n > 0) {
        const truncated = JSON.stringify(arr.slice(0, n));
        if (byteLength(truncated) <= MAX_COMMANDSUSED_BYTES) return truncated;
        n = Math.floor(n * 0.9) || n - 1;
    }
    return '[]';
}

interface Record {
    id: number,
    commandsUsed: CommandWithArgType[],
    executeCnt: number,
    errorCnt: number,
    timeSpent: number,
}

export class UploadRecordService {
    private static levelRecordsRef(userId: string) {
        return collection(db, USERS_COLLECTION, userId, LEVEL_RECORDS_SUBCOLLECTION);
    }

    static async uploadRecord(record: Record | Record[], uid: string | null): Promise<void> {
        if (!uid) {
            throw new Error('User ID is required');
        }

        // Ensure the UID matches the authenticated user
        const currentUserId = authService.getCurrentUserId();
        if (currentUserId && uid !== currentUserId) {
            throw new Error('User ID mismatch: Cannot upload record for different user');
        }

        try {
            // Handle both single record and array of records
            const records = Array.isArray(record) ? record : [record];
            const recordsRef = this.levelRecordsRef(uid);
            const timestamp = new Date().toISOString();

            // Upload each record as a separate document in subcollection to avoid document size limits
            const uploadPromises = records.map(async (rec) => {
                const commandsUsedStr = capCommandsUsedForFirestore(rec.commandsUsed);

                return addDoc(recordsRef, {
                    level_id: rec.id,
                    commandsUsed: commandsUsedStr,
                    executeCnt: rec.executeCnt,
                    errorCnt: rec.errorCnt,
                    timeSpent: rec.timeSpent,
                    timestamp
                });
            });

            await Promise.all(uploadPromises);

            // Update user's lastPlayed timestamp (small update, won't cause size issues)
            const userDocRef = doc(db, USERS_COLLECTION, uid);
            await setDoc(userDocRef, { lastPlayed: timestamp }, { merge: true });
        } catch (error) {
            console.error('Error uploading record:', error);
            throw error;
        }
    }

    static async getRecords(uid: string | null): Promise<Record[]> {
        if (!uid) {
            throw new Error('User ID is required');
        }

        // Ensure the UID matches the authenticated user
        const currentUserId = authService.getCurrentUserId();
        if (currentUserId && uid !== currentUserId) {
            throw new Error('User ID mismatch: Cannot access records for different user');
        }

        try {
            // Query records from subcollection
            const recordsRef = this.levelRecordsRef(uid);
            const querySnapshot = await getDocs(recordsRef);

            if (querySnapshot.empty) {
                return [];
            }

            // Convert subcollection documents back to Record format
            return querySnapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    id: data.level_id,
                    commandsUsed: typeof data.commandsUsed === 'string' 
                        ? JSON.parse(data.commandsUsed) 
                        : data.commandsUsed,
                    executeCnt: data.executeCnt,
                    errorCnt: data.errorCnt,
                    timeSpent: data.timeSpent
                };
            });
        } catch (error) {
            console.error('Error getting records:', error);
            throw error;
        }
    }
}