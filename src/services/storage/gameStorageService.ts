// services/storage/gameStorageService.ts
import CircularJSON from 'circular-json';
import { LevelInfo } from '../../types/level';
import { CommandWithArgType } from '../../types/game';
import levelsInfo from '../../assets/levels.json';
import { FingerprintService } from '../fingerPrint/fingerPrintService';

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

    async getOrCreateUID(): Promise<string> {
        const storedUID = localStorage.getItem(this.getKey('uid'));
        if (storedUID) {
            return storedUID;
        }

        const newUID = await this.generateUID();
        localStorage.setItem(this.getKey('uid'), newUID);
        this.createLevelInfoFromTemplate();
        this.initializeCoins();
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
        const newAmount = Math.max(0, currentCoins - amount); // 确保coins不会小于0
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

    getLevelsInfo(): any {
        let levels = localStorage.getItem(this.getKey('levels'));
        if (!levels) {
            this.createLevelInfoFromTemplate();
            return levelsInfo;
        }
        return CircularJSON.parse(levels);
    }

    setRecords(records: any[]): void {
        const levels = this.getLevelsInfo();
        
        records.forEach(record => {
            const levelIndex = levels.findIndex(l => l.id === record.id);
            if (levelIndex !== -1) {
                levels[levelIndex] = {
                    ...levels[levelIndex],
                    ...record
                };
            }
        });

        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
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
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
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
        levels[levelId - 1].timeSpent += timeSpent;
        localStorage.setItem(this.getKey('levels'), CircularJSON.stringify(levels));
    }

    extractUploadReport(errorCnt: number): any {
        const levels = this.getLevelsInfo();
        const report = levels.map((level: LevelInfo) => {
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

            keysToRemove.forEach(key => localStorage.removeItem(key));

            this.createLevelInfoFromTemplate();

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