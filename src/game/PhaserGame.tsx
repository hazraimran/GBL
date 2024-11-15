import { useEffect, useRef, useContext } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import BottomPanel from '../components/BottomPanel';
import GameContext from '../context/GameContext';
import { ErrorHandler } from '../ErrorHandler';
import { useToast } from "../hooks/use-toast"
import { LevelInfo } from '../types/level';
import { saveCommandsUsed } from '../utils/storage';
import EventManager from '../EventManager';
import { unlockNextLevel } from '../utils/storage';

const PhaserGame = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const mainSceneRef = useRef<MainScene | null>(null);
    const gameInstanceRef = useRef<Phaser.Game | null>(null);
    const { levelInfo, commandsUsed, setGameStatus, setShowPopup, setExecuting } = useContext(GameContext);
    const { toast } = useToast();

    const errorHandlerRef = useRef(new ErrorHandler({
        onError: (error) => {
            toast({
                title: "Error Occured",
                description: error.message,
                variant: error.level === 'ERROR' ? 'destructive' : 'default',
                duration: 3000,
            });
        }
    }));

    const parseConfig = (levelInfo: LevelInfo | null) => {
        if (!levelInfo) return {};

        const generatorFn = new Function('return ' + levelInfo.generatorFunction)();
        const validationFn = new Function('return ' + levelInfo.validationFunction)();
        const constructionSlots = levelInfo.constructionSlots
        const currentLevel = levelInfo.id;

        return {
            generatorFn,
            validationFn,
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

            // unlock next level
            unlockNextLevel(levelInfo.id);

        }
        EventManager.on('levelCompleted', levelCompleted);

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

    const handleDrag = (speed: number) => {
        console.log(speed + 0.5)
        mainSceneRef.current?.modifySpeed(speed + 0.5);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div
                ref={gameRef}
                className="flex-1 relative"
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