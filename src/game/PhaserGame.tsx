import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { CommandType } from '../types/game';
import BottomPanel from '../components/BottomPanel';

const PhaserGame = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const gameInstanceRef = useRef<Phaser.Game | null>(null);
    const mainSceneRef = useRef<MainScene | null>(null);
    
    useEffect(() => {
        if (!gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameRef.current,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            scene: MainScene,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                }
            }
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
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        const commands: CommandType[] = ['INPUT', 'OUTPUT'];
        mainSceneRef.current.executeCommands(commands);
    };

    const handleExecuteOneStep = () => {
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        // Add single step execution logic here
        const command: CommandType = 'INPUT';
        mainSceneRef.current.executeCommands([command]);
    };

    const handleReset = () => {
        if (!mainSceneRef.current) {
            console.warn('Main scene not initialized');
            return;
        }

        // Add reset logic here
        // You might want to restart the scene
        gameInstanceRef.current?.scene.restart('MainScene');
    };

    const handleDrag = (speed: number) => {
        console.log('Drag speed:', speed);
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