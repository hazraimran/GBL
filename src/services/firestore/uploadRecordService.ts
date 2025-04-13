// utils/progressService.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { CommandWithArgType } from '../../types/game';

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

        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                return [];
            }

            const userData = userDoc.data();
            const records = userData.records || {};

            // 将对象格式转回数组格式
            return Object.values(records).map(record => ({
                ...record,
                commandsUsed: JSON.parse(record.commandsUsed)
            }));
        } catch (error) {
            console.error('Error getting records:', error);
            throw error;
        }
    }
}