// utils/progressService.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { CommandWithArgType } from '../../types/game';
import { authService } from './authentication';

interface Record {
    id: number,
    commandsUsed: CommandWithArgType[],
    executeCnt: number,
    errorCnt: number,
    timeSpent: number,
}

export class UploadRecordService {
    static async uploadRecord(record: Record, uid: string | null): Promise<void> {
        if (!uid) {
            throw new Error('User ID is required');
        }

        // Ensure the UID matches the authenticated user
        const currentUserId = authService.getCurrentUserId();
        if (currentUserId && uid !== currentUserId) {
            throw new Error('User ID mismatch: Cannot upload record for different user');
        }

        try {
            const userDocRef = doc(db, 'users', uid);

            await setDoc(userDocRef, {
                records: record
            })
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
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return [];
            }

            const userData = userDoc.data();
            const records = userData.records || {};

            // 将对象格式转回数组格式
            return Object.values(records).map((record: unknown) => {
                const typedRecord = record as Record;
                return {
                    ...typedRecord,
                    commandsUsed: typeof typedRecord.commandsUsed === 'string' 
                        ? JSON.parse(typedRecord.commandsUsed) 
                        : typedRecord.commandsUsed
                };
            });
        } catch (error) {
            console.error('Error getting records:', error);
            throw error;
        }
    }
}