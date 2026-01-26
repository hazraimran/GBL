import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';

export class SettingsService {
  private static readonly COLLECTION_NAME = 'settings';
  private static readonly ECONOMY_DOCUMENT_NAME = 'economy';

  /**
   * Get economy setting from Firebase
   */
  static async getEconomySetting(): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.ECONOMY_DOCUMENT_NAME);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.enabled !== false; // Default to true if not set
      }
      return true; // Default to enabled if document doesn't exist
    } catch (error) {
      console.error('Error fetching economy setting:', error);
      throw new Error('Failed to fetch economy setting');
    }
  }

  /**
   * Update economy setting in Firebase
   */
  static async updateEconomySetting(enabled: boolean): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.ECONOMY_DOCUMENT_NAME);
      await setDoc(docRef, {
        enabled: enabled
      }, { merge: true });
    } catch (error) {
      console.error('Error updating economy setting:', error);
      throw new Error('Failed to update economy setting');
    }
  }
}

