// hooks/useGame / useGameStorage.ts
import { useState, useEffect } from 'react';
import GameStorageService from '../../services/storage/gameStorageService';
import { LevelInfo } from '../../types/level';
import { CommandWithArgType } from '../../types/game';

export const useGameStorage = () => {
    const [gameStorage] = useState(GameStorageService);
    const [uid, setUid] = useState<string | null>(null);

    useEffect(() => {
        const initUID = async () => {
            const id = await gameStorage.getOrCreateUID();
            setUid(id);
        };
        initUID();
    }, [gameStorage]);

    return {
        uid,
        getLevelsInfo: () => gameStorage.getLevelsInfo(),
        getLevelInfo: (levelId: number) => gameStorage.getLevelInfo(levelId),
        setLevelInfo: (levelId: number, info: LevelInfo) =>
            gameStorage.setLevelInfo(levelId, info),
        unlockNextLevel: (currentLevel: number) =>
            gameStorage.unlockNextLevel(currentLevel),
        saveCommandsUsed: (levelId: number, commands: CommandWithArgType[]) =>
            gameStorage.saveCommandsUsed(levelId, commands),
        updateTimeSpent: (levelId: number, timeSpent: number) =>
            gameStorage.updateTimeSpent(levelId, timeSpent),
    };
};