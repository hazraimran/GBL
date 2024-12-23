// utils/progressService.ts
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
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

        // 将 commandsUsed 转换为可以存储的格式
        const processedRecord = {
            ...record,
            // 将数组转换为字符串或对象格式
            commandsUsed: JSON.stringify(record.commandsUsed)
        };

        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            console.log('userDoc:', userDoc);

            // if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    records: record
                })
            // } else {
            //     const userData = userDoc.data();
            //     const existingRecords = userData.records || {};

            //     await updateDoc(userDocRef, {
            //         [`records.${record.id}`]: processedRecord, // 使用点符号更新特定记录
            //         lastUpdatedAt: new Date().toISOString()
            //     });
            // }
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