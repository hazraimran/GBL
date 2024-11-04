
// Represents the progress data for a single level
export interface LevelProgress {
    levelId: number;
    completed: boolean;
    bestScore?: number;
    completedAt?: string;
    commandsUsed?: number;
}

// Device information collected for analytics
export interface DeviceInfo {
    userAgent: string;
    language: string;
    screenResolution: string;
    timezone: string;
}

// Overall user progress including all levels and metadata
export interface UserProgress {
    uid: string;
    levels: Record<number, LevelProgress>;
    lastPlayed: string;
    deviceInfo?: DeviceInfo;
}

// Configuration for each game level
export interface LevelConfig {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isLocked: boolean;
    minCommandsRequired?: number;
    maxCommandsAllowed?: number;
}