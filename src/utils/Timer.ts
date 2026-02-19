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

    private log(_operation: string, _details?: Record<string, unknown>): void {
        // No-op: debugging logs removed
    }

    public setLevel(level: number): void {
        this.log('setLevel', { level, prevLevel: this.level });
        this.level = level;
        this.startTime = null;
        this.endTime = null;
        this.isRunning = false;
    }

    public start(): void {
        if (this.isRunning) {
            this.log('start (SKIPPED - already running)', {
                currentStartTime: this.startTime ? new Date(this.startTime).toISOString() : null
            });
            return;
        }
        const now = Date.now();
        const prevStartTime = this.startTime;
        this.startTime = this.startTime || now;
        this.isRunning = true;
        this.log('start', { 
            startTime: new Date(this.startTime).toISOString(),
            prevStartTime: prevStartTime ? new Date(prevStartTime).toISOString() : null,
            wasNull: !prevStartTime,
            now: new Date(now).toISOString(),
            startTimeMs: this.startTime,
            nowMs: now,
            diffMs: this.startTime - now
        });
    }

    public pause(): void {
        if (!this.isRunning) {
            this.log('pause (SKIPPED - not running)');
            return;
        }
        const now = Date.now();
        this.endTime = now;
        this.isRunning = false;
        const duration = this.getDuration();
        this.log('pause', { 
            endTime: new Date(now).toISOString(),
            duration
        });
    }

    public pauseAndSave(): void {
        if (!this.isRunning) {
            this.log('pauseAndSave (SKIPPED - not running)');
            return;
        }

        if (this.timerId) {
            clearInterval(this.timerId);
        }
        const now = Date.now();
        this.endTime = now;
        this.isRunning = false;

        const duration = this.getDuration();
        const level = this.level;
        this.log('pauseAndSave', { duration });
        // Defer the heavy localStorage write so scene transitions (e.g. "Go To Map") aren't blocked
        setTimeout(() => this.saveGameDuration(duration, level), 0);
    }

    public resume(): void {
        const now = Date.now();
        if (this.endTime && this.startTime) {
            // Adjust start time to account for paused duration
            const pausedDuration = now - this.endTime;
            const oldStartTime = this.startTime;
            this.startTime = this.startTime + pausedDuration;
            this.endTime = null;
            this.log('resume', {
                pausedDurationMs: pausedDuration,
                oldStartTime: new Date(oldStartTime).toISOString(),
                newStartTime: new Date(this.startTime).toISOString()
            });
        } else {
            this.log('resume (no endTime/startTime)', {
                hasEndTime: !!this.endTime,
                hasStartTime: !!this.startTime
            });
        }
        this.isRunning = true;
    }

    public getDuration(): number {
        if (!this.startTime) {
            return 0;
        }
        const now = Date.now();
        const endTime = this.endTime || now;
        const duration = Math.floor((endTime - this.startTime) / 1000);
        
        // Note: Removed frequent logging here since getDuration() is called every frame
        // Logging is handled in useTimeCap hook which syncs periodically
        
        return duration;
    }

    public getState(): { startTime: number | null; isRunning: boolean; level: number | null } {
        return {
            startTime: this.startTime,
            isRunning: this.isRunning,
            level: this.level
        };
    }

    public reset(): void {
        const now = Date.now();
        const endTime = this.endTime || now;
        const duration = this.startTime ? Math.floor((endTime - this.startTime) / 1000) : 0;
        const prevState = {
            startTime: this.startTime ? new Date(this.startTime).toISOString() : null,
            endTime: this.endTime ? new Date(this.endTime).toISOString() : null,
            isRunning: this.isRunning,
            duration,
            startTimeMs: this.startTime,
            endTimeMs: this.endTime,
            nowMs: now
        };
        this.startTime = null;
        this.endTime = null;
        this.isRunning = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.log('reset', { prevState });
    }

    private async saveGameDuration(duration: number, level: number | null): Promise<void> {
        if (!level) return;
        gameStorageService.updateTimeSpent(level, duration);
    }
}

// Create and export singleton instance
const gameTimer = new GameTimerManager();
export default gameTimer;