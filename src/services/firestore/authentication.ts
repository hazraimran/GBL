import { getAuth, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

export const authService = {
    async signUp(email: string, password: string): Promise<UserCredential> {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : 'Unknown error');
        }
    }
};