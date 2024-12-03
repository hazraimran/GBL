import { db } from '../../api/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from './types';

export const usersCollection = collection(db, 'users');

export const userService = {
    async getUser(id: string): Promise<User | null> {
        const docRef = doc(usersCollection, id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as User : null;
    },

    async getAllUsers(): Promise<User[]> {
        const querySnapshot = await getDocs(usersCollection);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    },

    async createUser(user: Omit<User, 'id'>): Promise<string> {
        const docRef = await addDoc(usersCollection, user);
        return docRef.id;
    },

    async updateUser(id: string, data: Partial<User>): Promise<void> {
        const docRef = doc(usersCollection, id);
        await updateDoc(docRef, data);
    },

    async deleteUser(id: string): Promise<void> {
        const docRef = doc(usersCollection, id);
        await deleteDoc(docRef);
    }
};
