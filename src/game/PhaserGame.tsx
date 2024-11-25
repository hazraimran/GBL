import { useEffect, useRef, useContext } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import BottomPanel from '../components/BottomPanel';
import GameContext from '../context/GameContext';
import { ErrorHandler } from '../ErrorHandler';
import { LevelInfo } from '../types/level';
import { saveCommandsUsed } from '../utils/storage';
import EventManager from '../EventManager';
import { unlockNextLevel } from '../utils/storage';

const PhaserGame = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const mainSceneRef = useRef<MainScene | null>(null);
    const gameInstanceRef = useRef<Phaser.Game | null>(null);
    const { setShowReadyPrompt, setShowFailurePrompt, setFailurePromptMessage, levelInfo, registerResetFn, resetFn,
        commandsUsed, setGameStatus, setShowPopup, setExecuting } = useContext(GameContext);

    const errorHandlerRef = useRef(new ErrorHandler({
        onError: (error) => {
            setShowFailurePrompt(true);
            setFailurePromptMessage(error.message);
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
        const levelCompleted = (data: {
            executeCnt: number;
            commandCnt: number;
        }) => {
            setGameStatus({
                executeCnt: data.executeCnt,
                commandCnt: data.commandCnt
            });
            setShowPopup(true);
            setExecuting(false);

            // unlock next level
            unlockNextLevel(levelInfo.id);
        }

        const levelFailed = (data: {
            message: string;
        }) => {
            console.log('Level failed:', data);
            setShowFailurePrompt(true);
            setFailurePromptMessage(data.message);
        }

        EventManager.on('levelCompleted', levelCompleted);
        EventManager.on('levelFailed', levelFailed);

        return () => {
            EventManager.remove('levelCompleted', levelCompleted);
        }
    }, []);

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
            console.log('Game scene ready:', mainSceneRef.current);
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

        if (levelInfo!.id === 1) {
            setShowReadyPrompt(false);
        }

        mainSceneRef.current.executeCommands(commandsUsed);
    };

    const handleExecuteOneStep = () => {
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        mainSceneRef.current.executeOneStep();
    };

    const handleReset = () => {
        setShowFailurePrompt(false);
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        setExecuting(false);
        mainSceneRef.current.reset();
        setExecuting(false);

        // Add reset logic here
        // You might want to restart the scene
        gameInstanceRef.current?.scene.start('MainScene');
    };

    useEffect(() => {
        registerResetFn(handleReset);
        // setResetFn(handleReset.bind(this));
        // console.log(handleReset);
    }, [])

    useEffect(() => {
        console.log(resetFn);
    }, [resetFn])

    const handleDrag = (speed: number) => {
        mainSceneRef.current?.modifySpeed(speed + 0.5);
    };

    return (
        <div className="fixed left-0 top-0 w-full h-full flex flex-col">
            <div
                ref={gameRef}
                className="fixed inset-0"
            />

            <BottomPanel
                onExecute={handleRunCode}
                onExecuteOneStep={handleExecuteOneStep}
                onReset={handleReset}
                onDrag={handleDrag}
            />
        </div>
    );
};

export default PhaserGame;