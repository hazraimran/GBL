// services/storage/gameStorageService.ts
import CircularJSON from 'circular-json';
import { LevelInfo } from '../../types/level';
import { CommandWithArgType } from '../../types/game';
import { FingerprintService } from '../fingerPrint/fingerPrintService';
import { getLocalLevels } from '../firestore/levels';

interface LevelRecord {
    id: number;
    commandsUsed?: CommandWithArgType[];
    executeCnt?: number;
    timeSpent?: number;
}

interface UploadReport {
    id: number;
    commandsUsed: string;
    executeCnt: number;
    errorCnt: number;
    timeSpent: number;
}

// localStorage is typically 5–10MB per origin; leave margin for other keys
const MAX_LEVELS_STORAGE_BYTES = 4 * 1024 * 1024;

function byteLength(str: string): number {
    return new TextEncoder().encode(str).length;
}

class GameStorageService {
    private storagePrefix: string = 'game';
    private fingerprintService: FingerprintService;
    private defaultCoins: number = 5;

    constructor() {
        this.fingerprintService = FingerprintService.getInstance();
    }

    private getKey(key: string): string {
        return `${this.storagePrefix}:${key}`;
    }

    /**
     * Write levels to localStorage. On QuotaExceededError, retries with truncated
     * commandsUsed so we don't lose progress metadata (executeCnt, timeSpent, etc.).
     */
    private setLevelsToStorage(levels: LevelInfo[]): void {
        const trySet = (payload: LevelInfo[]) => {
            const json = CircularJSON.stringify(payload);
            localStorage.setItem(this.getKey('levels'), json);
        };
        try {
            trySet(levels);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'QuotaExceededError') {
                const truncated = levels.map((level) => ({
                    ...level,
                    commandsUsed: Array.isArray(level.commandsUsed)
                        ? level.commandsUsed.slice(0, 200)
                        : []
                }));
                try {
                    trySet(truncated);
                } catch (err2) {
                    if (err2 instanceof DOMException && err2.name === 'QuotaExceededError') {
                        const minimal = levels.map((level) => ({ ...level, commandsUsed: [] }));
                        trySet(minimal);
                    } else {
                        throw err2;
                    }
                }
            } else {
                throw err;
            }
        }
    }

    async getOrCreateUID(): Promise<string> {
        const storedUID = localStorage.getItem(this.getKey('uid'));
        if (storedUID) {
            return storedUID;
        }

        const newUID = await this.generateUID();
        localStorage.setItem(this.getKey('uid'), newUID);
        this.initializeCoins();
        return newUID;
    }

    private async generateUID(): Promise<string> {
        const baseId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        try {
            const visitorId = await this.fingerprintService.getVisitorId();
            return `${visitorId}-${baseId}`;
        } catch {
            return baseId;
        }
    }

    initializeCoins(): void {
        if (localStorage.getItem(this.getKey('coins')) === null) {
            localStorage.setItem(this.getKey('coins'), this.defaultCoins.toString());
        }
    }

    getCoins(): number {
        const coins = localStorage.getItem(this.getKey('coins'));
        if (coins === null) {
            this.initializeCoins();
            return this.defaultCoins;
        }
        return parseInt(coins, 10);
    }

    setCoins(amount: number): void {
        localStorage.setItem(this.getKey('coins'), amount.toString());
    }

    addCoins(amount: number): number {
        const currentCoins = this.getCoins();
        const newAmount = currentCoins + amount;
        this.setCoins(newAmount);
        return newAmount;
    }

    removeCoins(amount: number): number {
        const currentCoins = this.getCoins();
        const newAmount = Math.max(0, currentCoins - amount);
        this.setCoins(newAmount);
        return newAmount;
    }

    setIsFirstTime(isFirstTime: boolean): void {
        localStorage.setItem(this.getKey('isFirstTime'), isFirstTime.toString());
    }

    getAndUpdateIsFirstTime(): boolean {
        const value = localStorage.getItem(this.getKey('isFirstTime'));
        if (!value) {
            localStorage.setItem(this.getKey('isFirstTime'), 'true');
            return true;
        }
        if (JSON.parse(value)) {
            localStorage.setItem(this.getKey('isFirstTime'), 'false');
            return true;
        }
        return false;
    }

    getLevelsInfo(): LevelInfo[] {
        const levels = localStorage.getItem(this.getKey('levels'));
        if (!levels) {
            // If no levels in localStorage, return an empty array
            // The levels will be loaded from Firestore in the Levels component
            return [];
        }
        const parsedLevels = CircularJSON.parse(levels) as LevelInfo[];
        // Set default time limit of 300 seconds for all levels that don't have one
        return parsedLevels.map(level => ({
            ...level,
            timeLimitInSeconds: level.timeLimitInSeconds ?? 300
        }));
    }

    async initializeLevels(): Promise<void> {
        const defaultLevels = await getLocalLevels();
        if (defaultLevels) {
            // Ensure all levels have default time limit of 300 seconds
            const levelsWithDefaults = defaultLevels.map(level => ({
                ...level,
                timeLimitInSeconds: level.timeLimitInSeconds ?? 300
            }));
            this.setLevelsToStorage(levelsWithDefaults);
        }
    }

    setRecords(records: LevelRecord[]): void {
        const levels = this.getLevelsInfo();

        records.forEach(record => {
            const levelIndex = levels.findIndex(l => l.id === record.id);
            if (levelIndex !== -1) {
                const merged = {
                    ...levels[levelIndex],
                    ...record
                };
                // Cap commandsUsed from Firebase so merged payload doesn't blow localStorage quota
                if (merged.commandsUsed != null) {
                    const raw = typeof merged.commandsUsed === 'string'
                        ? merged.commandsUsed
                        : CircularJSON.stringify(merged.commandsUsed);
                    if (byteLength(raw) > MAX_LEVELS_STORAGE_BYTES / Math.max(1, levels.length)) {
                        try {
                            merged.commandsUsed = typeof merged.commandsUsed === 'string'
                                ? (JSON.parse(merged.commandsUsed) as CommandWithArgType[]).slice(0, 500)
                                : merged.commandsUsed.slice(0, 500);
                        } catch {
                            merged.commandsUsed = [];
                        }
                    } else if (typeof merged.commandsUsed === 'string') {
                        try {
                            merged.commandsUsed = JSON.parse(merged.commandsUsed) as CommandWithArgType[];
                        } catch {
                            merged.commandsUsed = [];
                        }
                    }
                }
                levels[levelIndex] = merged;
            }
        });

        this.setLevelsToStorage(levels);
    }

    getLevelInfo(levelId: number): LevelInfo {
        const levels = this.getLevelsInfo();
        const level = levels[levelId];
        // Ensure default time limit is applied
        if (level) {
            return {
                ...level,
                timeLimitInSeconds: level.timeLimitInSeconds ?? 300
            };
        }
        return level;
    }

    setLevelInfo(levelId: number, levelInfo: LevelInfo): void {
        const levels = this.getLevelsInfo();
        levels[levelId] = levelInfo;
        this.setLevelsToStorage(levels);
    }

    addAccessedTime(levelId: number): void {
        const levels = this.getLevelsInfo();
        levels[levelId].timeAccessed += 1;
        this.setLevelsToStorage(levels);
    }

    unlockNextLevel(currentLevel: number): void {
        const levels = this.getLevelsInfo();
        let nextLevel = currentLevel;
        while((nextLevel < (levels.length - 1)) && !levels[nextLevel].visible) {
            nextLevel++;
        }

        levels[nextLevel].isLocked = false;
        this.setLevelsToStorage(levels);
    }

    saveCommandsUsed(levelId: number, commandsUsed: CommandWithArgType[]): void {
        const levels = this.getLevelsInfo();
        levels[levelId - 1].commandsUsed = commandsUsed;
        this.setLevelsToStorage(levels);
    }

    updateTimeSpent(levelId: number, timeSpent: number): void {
        const levels = this.getLevelsInfo();
        levels[levelId - 1].timeSpent += timeSpent;
        this.setLevelsToStorage(levels);
    }

    extractUploadReport(errorCnt: number): UploadReport[] {
        const levels = this.getLevelsInfo();
        return levels.map((level: LevelInfo) => ({
            id: level.id,
            commandsUsed: CircularJSON.stringify(level.commandsUsed),
            executeCnt: level.executeCnt,
            errorCnt: errorCnt,
            timeSpent: level.timeSpent,
        }));
    }

    setMuteState(state: boolean): void {
        localStorage.setItem(this.getKey('muteState'), state.toString());
    }

    getMuteState(): boolean {
        return localStorage.getItem(this.getKey('muteState')) === 'true';
    }

    resetGameData(): boolean {
        try {
            const currentUID = localStorage.getItem(this.getKey('uid'));

            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix) && !key.endsWith('uid') && !key.endsWith('coins')) {
                    keysToRemove.push(key);
                }
            }

            // Add keys that start with 'game:' to be removed
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('game:')) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));

            if (currentUID) {
                localStorage.setItem(this.getKey('uid'), currentUID);
            }

            this.setCoins(this.defaultCoins);

            return true;
        } catch (error) {
            console.error('reset error:', error);
            return false;
        }
    }
}

const gameStorageService = new GameStorageService();
export default gameStorageService;