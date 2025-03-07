// services/storage/gameStorageService.ts
import CircularJSON from 'circular-json';
import { LevelInfo } from '../../types/level';
import { CommandWithArgType } from '../../types/game';
import levelsInfo from '../../assets/levels.json';
import { FingerprintService } from '../fingerPrint/fingerPrintService';

class GameStorageService {
    private storagePrefix: string = 'game';
    private fingerprintService: FingerprintService;

    constructor() {
        this.fingerprintService = FingerprintService.getInstance();
    }

    private getKey(key: string): string {
        return `${this.storagePrefix}:${key}`;
    }

    async getOrCreateUID(): Promise<string> {
        const storedUID = localStorage.getItem(this.getKey('uid'));
        if (storedUID) {
            return storedUID;
        }

        const newUID = await this.generateUID();
        localStorage.setItem(this.getKey('uid'), newUID);
        this.createLevelInfoFromTemplate();
        return newUID;
    }

    private async generateUID(): Promise<string> {
        const baseId = Date.now().toString(36) + Math.random().toString(36).substring(2);

        try {
            const visitorId = await this.fingerprintService.getVisitorId();
            return `${visitorId}-${baseId}`;
        } catch (error) {
            console.warn('Failed to generate fingerprint, using fallback ID');
            return baseId;
        }
    }

    createLevelInfoFromTemplate(): void {
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levelsInfo));
        this.setIsFirstTime(true);
    }

    setIsFirstTime(isFirstTime: boolean): void {
        localStorage.setItem(this.getKey('isFirstTime'), isFirstTime.toString());
    }

    getAndUpdateIsFirstTime(): boolean {
        console.log("getAndUpdateIsFirstTime");
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

    getLevelsInfo(): any {
        let levels = localStorage.getItem(this.getKey('levels'));
        if (!levels) {
            this.createLevelInfoFromTemplate();
            return levelsInfo;
        }
        return CircularJSON.parse(levels);
    }

    getLevelInfo(levelId: number): LevelInfo {
        const levels = this.getLevelsInfo();
        return levels[levelId];
    }

    setLevelInfo(levelId: number, levelInfo: LevelInfo): void {
        const levels = this.getLevelsInfo();
        levels[levelId] = levelInfo;
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
    }

    addAccessedTime(levelId: number): void {
        const levels = this.getLevelsInfo();
        levels[levelId].timeAccessed += 1;
        console.log('timeAccessed', levels[levelId].timeAccessed);
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
        console.log('levels', levels);
    }

    unlockNextLevel(currentLevel: number): void {
        const levels = this.getLevelsInfo();
        const nextLevel = currentLevel;
        levels[nextLevel].isLocked = false;
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
    }

    saveCommandsUsed(levelId: number, commandsUsed: CommandWithArgType[]): void {
        const levels = this.getLevelsInfo();
        levels[levelId - 1].commandsUsed = commandsUsed;
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
    }

    updateTimeSpent(levelId: number, timeSpent: number): void {
        const levels = this.getLevelsInfo();
        console.log('timeSpent', timeSpent);
        levels[levelId - 1].timeSpent += timeSpent;
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
    }

    extractUploadReport(errorCnt: number): any {
        const levels = this.getLevelsInfo();
        const report = levels.map((level: LevelInfo) => {
            console.log('commandsUsed', CircularJSON.stringify(level.commandsUsed));
            return {
                id: level.id,
                commandsUsed: CircularJSON.stringify(level.commandsUsed),
                executeCnt: level.executeCnt,
                errorCnt: errorCnt,
                timeSpent: level.timeSpent,
            };
        });
        return report;
    }

    resetGameData(): boolean {
        try {
            const currentUID = localStorage.getItem(this.getKey('uid'));

            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storagePrefix) && !key.endsWith('uid')) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach(key => localStorage.removeItem(key));

            this.createLevelInfoFromTemplate();

            if (currentUID) {
                localStorage.setItem(this.getKey('uid'), currentUID);
            }

            return true;
        } catch (error) {
            console.error('reset error:', error);
            return false;
        }
    }
}

const gameStorageService = new GameStorageService();
export default gameStorageService;