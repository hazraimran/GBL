// utils/storage.ts
import FingerprintJS from 'fingerprintjs';
import levelsInfo from '../assets/levels.json';
import { LevelInfo } from '../types/level';
import { CommandWithArgType } from '../types/game';
import CircularJSON from 'circular-json';

// Generate a unique identifier combining device fingerprint and timestamp
export const generateUID = async (): Promise<string> => {
    // Base ID using timestamp and random number for uniqueness
    const baseId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    try {
        const fp = await FingerprintJS.load();
        // Get visitor identifier based on browser/device characteristics
        const result = await fp.get();

        return `${result.visitorId}-${baseId}`;
    } catch (error) {
        console.warn('Failed to generate fingerprint, using fallback ID');
        return baseId;
    }
};

// Retrieve existing UID from storage or create new one
export const getOrCreateUID = async (): Promise<string> => {
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
        console.log('Returning stored UID:', storedUID);
        console.log('Levels', getLevelsInfo());
        return storedUID;
    }

    // if is the first time the user is playing, generate a new UID
    const newUID = await generateUID();
    localStorage.setItem('uid', newUID);
    createLevelInfoFromTemplate();
    return newUID;
};

export const createLevelInfoFromTemplate = () => {
    localStorage.setItem('levels', CircularJSON.stringify(levelsInfo));
}

export const getLevelsInfo = () => {
    let levels = localStorage.getItem('levels');
    if (!levels) {
        createLevelInfoFromTemplate();
        return levelsInfo;
    } else {
        return CircularJSON.parse(levels);
    }
}

export const getLevelInfo = (levelId: number) => {
    let levels = localStorage.getItem('levels');
    if (!levels) {
        createLevelInfoFromTemplate();
        return levelsInfo[levelId];
    } else {
        const levelInfo = CircularJSON.parse(levels);
        return levelInfo[levelId];
    }
}

export const setLevelInfo = (levelId: number, levelInfo: LevelInfo) => {
    let levels = localStorage.getItem('levels');
    if (!levels) {
        createLevelInfoFromTemplate();
        levels = localStorage.getItem('levels');
    }

    const levelsInfo = CircularJSON.parse(levels as string);
    levelsInfo[levelId] = levelInfo;
    localStorage.setItem('levels', CircularJSON.stringify(levelsInfo));
}

export const unlockNextLevel = (currentLevel: number) => {
    // since currentLevel is 0-based, the next level is currentLevel
    const nextLevel = currentLevel;
    let levels = localStorage.getItem('levels');
    if (!levels) {
        createLevelInfoFromTemplate();
        levels = localStorage.getItem('levels');
    }

    const levelsInfo = CircularJSON.parse(levels as string);
    levelsInfo[nextLevel].isLocked = false;
    console.log('next level', levelsInfo[nextLevel]);
    localStorage.setItem('levels', CircularJSON.stringify(levelsInfo));
}

export const saveCommandsUsed = (levelId: number, commandsUsed: CommandWithArgType[]) => {
    let levels = localStorage.getItem('levels');
    if (!levels) {
        createLevelInfoFromTemplate();
        levels = localStorage.getItem('levels');
    }

    const levelsInfo = CircularJSON.parse(levels as string);
    levelsInfo[levelId - 1].commandsUsed = commandsUsed;
    localStorage.setItem('levels', CircularJSON.stringify(levelsInfo));
    console.log('levels stored', levelsInfo)
}