import { useState, useEffect, useContext } from 'react';
import GameStorageService from '../../services/storage/gameStorageService';
import { LevelInfo } from '../../types/level';
import { CommandWithArgType } from '../../types/game';
import GameContext from '../../context/GameContext';
import { authService } from '../../services/firestore/authentication';
import { StateSyncService } from '../../services/state/StateSyncService';

export const useGameStorage = () => {
    const [gameStorage] = useState(GameStorageService);
    const [uid, setUid] = useState<string | null>(null);
    const [coins, setCoins] = useState<number>(0);
    const {setMuted} = useContext(GameContext);

    useEffect(() => {
        const initUID = async () => {
            const authUserId = authService.getCurrentUserId();
            
            if (authUserId) {
                setUid(authUserId);
                await StateSyncService.syncWithFirebase();
            } else {
                const id = await gameStorage.getOrCreateUID();
                setUid(id);
            }
            
            updateCoinsState();
        };
        
        initUID();
        
        const unsubscribe = authService.onAuthStateChanged(async (user) => {
            if (user) {
                setUid(user.uid);
                await StateSyncService.syncWithFirebase();
            } else {
                const id = await gameStorage.getOrCreateUID();
                setUid(id);
            }
        });
        
        return () => unsubscribe();
    }, [gameStorage]);

    // Initialize mute state
    useEffect(() => {
        const muteState = gameStorage.getMuteState();
        setMuted(muteState);
    }, []);

    // Helper function to update coins state
    const updateCoinsState = () => {
        setCoins(gameStorage.getCoins());
    };

    return {
        uid,
        // Coins-related methods
        coins, // Current coins amount state
        getCoins: () => {
            const currentCoins = gameStorage.getCoins();
            setCoins(currentCoins);
            return currentCoins;
        },
        setCoins: (amount: number) => {
            gameStorage.setCoins(amount);
            setCoins(amount);
            return amount;
        },
        setMuteState: (state: boolean) => {
            gameStorage.setMuteState(state);
            setMuted(state);
        },
        getMuteState: () => {
            return gameStorage.getMuteState();
        },
        addCoins: (amount: number) => {
            const newAmount = gameStorage.addCoins(amount);
            setCoins(newAmount);
            return newAmount;
        },
        removeCoins: (amount: number) => {
            const newAmount = gameStorage.removeCoins(amount);
            setCoins(newAmount);
            return newAmount;
        },
        // Original methods
        getLevelsInfo: async () => {
            const levels = gameStorage.getLevelsInfo();
            if (levels.length === 0) {
                // Try to load from Firestore
                await gameStorage.initializeLevels();
                return gameStorage.getLevelsInfo();
            }
            return levels;
        },
        getLevelInfo: (levelId: number) => gameStorage.getLevelInfo(levelId),
        setLevelInfo: (levelId: number, info: LevelInfo) =>
            gameStorage.setLevelInfo(levelId, info),
        addAccessedTime(levelId: number): void {
            gameStorage.addAccessedTime(levelId);
        },
        unlockNextLevel: (currentLevel: number) =>
            gameStorage.unlockNextLevel(currentLevel),
        saveCommandsUsed: (levelId: number, commands: CommandWithArgType[]) =>
            gameStorage.saveCommandsUsed(levelId, commands),
        updateTimeSpent: (levelId: number, timeSpent: number) =>
            gameStorage.updateTimeSpent(levelId, timeSpent),
        extractUploadReport: (errorCnt: number) =>
            gameStorage.extractUploadReport(errorCnt),
        getAndUpdateIsFirstTime: () => gameStorage.getAndUpdateIsFirstTime(),
        resetGameData: () => {
            const result = gameStorage.resetGameData();
            // Update coins state after resetting game data
            updateCoinsState();
            return result;
        },
    };
};