import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../api/firebase";

export const authService = {
    async signUp(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    },
    async signIn(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error: unknown) {  
            throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    },
    async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    },
    getCurrentUser(): User | null {
        return auth.currentUser;
    },
    getCurrentUserId(): string | null {
        return auth.currentUser?.uid || null;
    },
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }
};  