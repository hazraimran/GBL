import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { LevelInfo } from '../../types/level';
import CircularJSON from 'circular-json';

export class LevelCreatorService {
  private static readonly COLLECTION_NAME = 'settings';
  private static readonly DOCUMENT_NAME = 'levels';

  /**
   * Get all levels from Firebase
   */
  static async getAllLevels(): Promise<LevelInfo[]> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_NAME);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const levels = docSnap.data().levels || [];
        // Set default time limit of 300 seconds for all levels that don't have one
        return levels.map((level: LevelInfo) => ({
          ...level,
          timeLimitInSeconds: level.timeLimitInSeconds ?? 300
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw new Error('Failed to fetch levels');
    }
  }

  /**
   * Check if a level with the given ID exists
   */
  static async levelExists(levelId: number): Promise<boolean> {
    try {
      const allLevels = await this.getAllLevels();
      return allLevels.some(level => level.id === levelId);
    } catch (error) {
      console.error('Error checking if level exists:', error);
      return false;
    }
  }

  /**
   * Create a new level
   */
  static async createLevel(levelData: LevelInfo): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_NAME);
      const docSnap = await getDoc(docRef);
      
      let updatedLevels: LevelInfo[];
      
      if (docSnap.exists()) {
        // Update existing document by adding new level to array
        const existingLevels = docSnap.data().levels || [];
        updatedLevels = [...existingLevels, levelData];
        await setDoc(docRef, { levels: updatedLevels });
      } else {
        // Create new document with single level
        updatedLevels = [levelData];
        await setDoc(docRef, {
          levels: updatedLevels
        });
      }
      
      // Update localStorage to keep it in sync with Firebase
      this.updateLocalStorageLevels(updatedLevels);
    } catch (error) {
      console.error('Error creating level:', error);
      throw new Error('Failed to create level');
    }
  }

  /**
   * Update an existing level
   */
  static async updateLevel(levelId: number, levelData: LevelInfo): Promise<void> {
    try {
      const allLevels = await this.getAllLevels();
      const updatedLevels = allLevels.map(level => 
        level.id === levelId ? levelData : level
      );
      
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_NAME);
      await setDoc(docRef, { levels: updatedLevels });
      
      // Update localStorage to keep it in sync with Firebase
      this.updateLocalStorageLevels(updatedLevels);
    } catch (error) {
      console.error('Error updating level:', error);
      throw new Error('Failed to update level');
    }
  }

  /**
   * Update localStorage with the latest levels from Firebase
   */
  private static updateLocalStorageLevels(levels: LevelInfo[]): void {
    try {
      localStorage.setItem('game:levels', CircularJSON.stringify(levels));
      // Reset TTL to allow immediate use of updated levels
      // The TTL will be set again when levels are loaded next time
      localStorage.setItem('game:levelsttl', '0');
    } catch (error) {
      console.error('Error updating localStorage levels:', error);
      // Don't throw - localStorage update failure shouldn't break the update
    }
  }

  /**
   * Delete a level
   */
  static async deleteLevel(levelId: number): Promise<void> {
    try {
      const allLevels = await this.getAllLevels();
      const levelToDelete = allLevels.find(level => level.id === levelId);
      
      if (!levelToDelete) {
        throw new Error('Level not found');
      }

      const updatedLevels = allLevels.filter(level => level.id !== levelId);
      
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_NAME);
      await setDoc(docRef, { levels: updatedLevels });
      
      // Update localStorage to keep it in sync with Firebase
      this.updateLocalStorageLevels(updatedLevels);
    } catch (error) {
      console.error('Error deleting level:', error);
      throw new Error('Failed to delete level');
    }
  }

  /**
   * Validate level configuration
   */
  static validateLevel(levelData: Partial<LevelInfo>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!levelData.id || levelData.id <= 0) {
      errors.push('Level ID must be a positive number');
    }

    if (!levelData.title || levelData.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!levelData.description || levelData.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!levelData.commands || levelData.commands.length === 0) {
      errors.push('At least one command must be available');
    }

    if (!levelData.generatorFunction || levelData.generatorFunction.trim() === '') {
      errors.push('Generator function is required');
    }

    if (!levelData.outputFunction || levelData.outputFunction.trim() === '') {
      errors.push('Output function is required');
    }

    if (!levelData.learningOutcome?.concept || levelData.learningOutcome.concept.trim() === '') {
      errors.push('Learning concept is required');
    }

    if (!levelData.learningOutcome?.descr || levelData.learningOutcome.descr.trim() === '') {
      errors.push('Learning description is required');
    }

    if (!levelData.learningOutcome?.why || levelData.learningOutcome.why.trim() === '') {
      errors.push('Learning "why" is required');
    }

    if (!levelData.learningOutcome?.how || levelData.learningOutcome.how.trim() === '') {
      errors.push('Learning "how" is required');
    }

    if (levelData.expectedCommandCnt !== undefined && levelData.expectedCommandCnt <= 0) {
      errors.push('Expected command count must be positive');
    }

    if (levelData.expectedExecuteCnt !== undefined && levelData.expectedExecuteCnt <= 0) {
      errors.push('Expected execute count must be positive');
    }

    // Generator and output function validation removed - functions are validated at runtime

    // Validate construction slots
    if (levelData.constructionSlots) {
      for (let i = 0; i < levelData.constructionSlots.length; i++) {
        const slot = levelData.constructionSlots[i];
        if (typeof slot.x !== 'number' || typeof slot.y !== 'number') {
          errors.push(`Construction slot ${i + 1} must have valid x, y coordinates`);
        }
        if (slot.x < 0 || slot.y < 0) {
          errors.push(`Construction slot ${i + 1} coordinates must be positive`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if level ID is unique
   */
  static async isLevelIdUnique(levelId: number, excludeId?: number): Promise<boolean> {
    try {
      const allLevels = await this.getAllLevels();
      return !allLevels.some(level => level.id === levelId && level.id !== excludeId);
    } catch (error) {
      console.error('Error checking level ID uniqueness:', error);
      return false;
    }
  }

  /**
   * Get next available level ID
   */
  static async getNextLevelId(): Promise<number> {
    try {
      const allLevels = await this.getAllLevels();
      if (allLevels.length === 0) return 1;
      
      const maxId = Math.max(...allLevels.map(level => level.id));
      return maxId + 1;
    } catch (error) {
      console.error('Error getting next level ID:', error);
      return 1;
    }
  }
}
