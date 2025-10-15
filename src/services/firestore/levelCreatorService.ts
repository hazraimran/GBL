import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../api/firebase';
import { LevelInfo } from '../../types/level';

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
        return docSnap.data().levels || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw new Error('Failed to fetch levels');
    }
  }

  /**
   * Create a new level
   */
  static async createLevel(levelData: LevelInfo): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, this.DOCUMENT_NAME);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Update existing document by adding new level to array
        await updateDoc(docRef, {
          levels: arrayUnion(levelData)
        });
      } else {
        // Create new document with single level
        await setDoc(docRef, {
          levels: [levelData]
        });
      }
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
    } catch (error) {
      console.error('Error updating level:', error);
      throw new Error('Failed to update level');
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

    // Validate generator functions
    if (levelData.generatorFunction) {
      try {
        const inputFn = new Function('generatorFn', levelData.generatorFunction);
        // Test with a mock generator function
        const mockGenerator = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const result = inputFn(mockGenerator);
        if (!Array.isArray(result)) {
          errors.push('Generator function must return an array');
        }
      } catch (error) {
        errors.push('Generator function is not valid JavaScript');
      }
    }

    if (levelData.outputFunction) {
      try {
        const outputFn = new Function('generatorFn', levelData.outputFunction);
        // Test with a mock generator function
        const mockGenerator = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const result = outputFn(mockGenerator);
        if (!Array.isArray(result)) {
          errors.push('Output function must return an array');
        }
      } catch (error) {
        errors.push('Output function is not valid JavaScript');
      }
    }

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
