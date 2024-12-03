// GameTimerManager.ts
import gameStorageService from "../services/storage/gameStorageService";

class GameTimerManager {
    private static instance: GameTimerManager;
    private startTime: number | null = null;
    private endTime: number | null = null;
    private timerId: number | null = null;
    private isRunning: boolean = false;
    private level: number | null = null;

    constructor() {
        if (GameTimerManager.instance) {
            return GameTimerManager.instance;
        }
        GameTimerManager.instance = this;
        // this.bindPageLeaveEvents();
    }

    public bindPageLeaveEvents(): void {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAndSave();
            } else {
                this.resume();
            }
        });

        window.addEventListener('beforeunload', () => {
            this.pauseAndSave();
        });
    }

    public setLevel(level: number): void {
        this.level = level;
        this.startTime = null;
        this.endTime = null;
        this.isRunning = false;
    }

    public start(): void {
        if (this.isRunning) return;
        console.log("timer started");
        this.startTime = this.startTime || Date.now();
        this.isRunning = true;
    }

    public pauseAndSave(): void {
        if (!this.isRunning) return;

        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.endTime = Date.now();
        this.isRunning = false;

        const duration = this.getDuration();
        console.log("timer paused and saved, duration:", duration);
        this.saveGameDuration(duration, this.level);
    }

    public resume(): void {
        if (this.endTime && this.startTime) {
            this.startTime = Date.now() - (this.endTime - this.startTime);
            this.endTime = null;
        }
        this.start();
    }

    public getDuration(): number {
        if (!this.startTime) return 0;
        const endTime = this.endTime || Date.now();
        return Math.floor((endTime - this.startTime) / 1000);
    }

    private async saveGameDuration(duration: number, level: number | null): Promise<void> {
        if (!level) return;
        gameStorageService.updateTimeSpent(level, duration);
    }
}

// Create and export singleton instance
const gameTimer = new GameTimerManager();
export default gameTimer;