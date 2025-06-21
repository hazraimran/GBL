import React,{ useEffect, useRef, useContext } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import BottomPanel from '../components/BottomPanel';
import GameContext from '../context/GameContext';
import { ErrorHandler } from '../ErrorHandler';
import { LevelInfo } from '../types/level';
import EventManager from '../EventManager';
import { useGameStorage } from '../hooks/useStorage/useGameStorage';
import { UploadRecordService } from '../services/firestore/uploadRecordService';
import VictorySoundPlayer from './VictorySoundPlayer';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import { AnalyticsProvider, useAnalytics } from '../context/AnalyticsContext';

const PhaserGameContent = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const mainSceneRef = useRef<MainScene | null>(null);
    const gameInstanceRef = useRef<Phaser.Game | null>(null);
    const { setShowReadyPrompt, setShowFailurePrompt, setFailurePromptMessage, levelInfo, registerResetFn,
        commandsUsed, setGameStatus, setShowPopup, setExecuting, setErrorCnt, errorCnt } = useContext(GameContext);
    const { extractUploadReport, saveCommandsUsed, unlockNextLevel, uid } = useGameStorage();
    
    // Get analytics from context
    const analytics = useAnalytics();

    const errorHandlerRef = useRef(new ErrorHandler({
        onError: (error) => {
            setShowFailurePrompt(true);
            setFailurePromptMessage(error.message);
            // Track error in analytics
            analytics.trackError();
        }
    }));

    const parseConfig = (levelInfo: LevelInfo | null) => {
        if (!levelInfo) return {};

        const generatorFn = new Function('return ' + levelInfo.generatorFunction)();
        const outputFn = new Function('return ' + levelInfo.outputFunction)();
        const constructionSlots = levelInfo.constructionSlots
        const currentLevel = levelInfo.id;

        return {
            generatorFn,
            outputFn,
            constructionSlots,
            currentLevel
        };
    }

    useEffect(() => {
        setErrorCnt(0);

        const levelCompleted = (data: {
            executeCnt: number;
            commandCnt: number;
        }) => {
            VictorySoundPlayer.play();
            setGameStatus({
                executeCnt: data.executeCnt,
                commandCnt: data.commandCnt
            });
            setShowPopup(true);

            const report = extractUploadReport(errorCnt);
            UploadRecordService.uploadRecord(report, uid);

            // Track level completion in analytics with 1 coin collected
            analytics.stopTracking({
                final_instruction_count: data.commandCnt,
                success_on_first_try: errorCnt === 0,
                coins_collected: 1
            });

            // unlock next level
            unlockNextLevel(levelInfo.id);
        }

        const levelFailed = (data: {
            message: string;
        }) => {
            setErrorCnt(errorCnt + 1);
            setShowFailurePrompt(true);
            setFailurePromptMessage(data.message);
            
            // Track level failure in analytics
            analytics.trackError();
        }

        EventManager.on('levelCompleted', levelCompleted);
        EventManager.on('levelFailed', levelFailed);
        setExecuting(false);

        return () => {
            EventManager.remove('levelCompleted', levelCompleted);
            EventManager.remove('levelFailed', levelFailed);
        }
    }, [uid, analytics]);

    useEffect(() => {
        if (!gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            callbacks: {
                preBoot: (game) => {
                    game.scene.add('MainScene', MainScene, true, {
                        errorHandler: errorHandlerRef.current,
                        sceneConfig: parseConfig(levelInfo),
                    });
                }
            },
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            },

        };

        // Create new game instance
        const game = new Phaser.Game(config);
        gameInstanceRef.current = game;

        // Store reference to main scene
        game.events.once('ready', () => {
            mainSceneRef.current = game.scene.getScene('MainScene') as MainScene;
        });

        // Cleanup
        return () => {
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
                gameInstanceRef.current = null;
                mainSceneRef.current = null;
            }
        };
    }, []);

    const handleRunCode = () => {
        saveCommandsUsed(levelInfo!.id, commandsUsed);
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }
        setExecuting(true);

        // Track instruction submission in analytics
        analytics.trackInstructionSubmission(commandsUsed.length);

        if (levelInfo!.id === 1) {
            setShowReadyPrompt(false);
        }

        mainSceneRef.current.executeCommands(commandsUsed);
    };


    const handleReset = () => {
        setShowFailurePrompt(false);
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        // Track reset in analytics
        analytics.trackReset();

        setExecuting(false);
        mainSceneRef.current.reset();

        gameInstanceRef.current?.scene.start('MainScene');
    };

    useEffect(() => {
        registerResetFn(handleReset);
    }, [])

    // Start analytics tracking when level loads
    useEffect(() => {
        if (levelInfo?.id) {
            analytics.startTracking();
        }
    }, [levelInfo?.id, analytics]);

    const handleDrag = (speed: number) => {
        mainSceneRef.current?.modifySpeed(speed + 0.5);
    };

    return (
        <div className="fixed left-0 top-0 w-full h-full flex flex-col">
            <div
                ref={gameRef}
                className="fixed inset-0"
            />
            <InstructionPanel />
            <BottomPanel
                onExecute={handleRunCode}
                onReset={handleReset}
                onDrag={handleDrag}
            />
        </div>
    );
};

const PhaserGame = () => {
    const { levelInfo } = useContext(GameContext);
    
    return (
        <AnalyticsProvider levelId={levelInfo?.id || 1}>
            <PhaserGameContent />
        </AnalyticsProvider>
    );
};

export default PhaserGame;