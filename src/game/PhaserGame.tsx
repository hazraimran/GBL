// PhaserGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { CommandType } from '../types/game';

const PhaserGame: React.FC = () => {
    const gameRef = useRef<HTMLDivElement>(null);
    const [commands, setCommands] = useState<CommandType[]>([]);
    const gameInstanceRef = useRef<Phaser.Game | null>(null);

    useEffect(() => {
        if (!gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            parent: gameRef.current,
            scene: MainScene, // Pass the scene class directly, not in an array
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false,
                },
            },
        };

        // Create the game instance
        const game = new Phaser.Game(config);
        gameInstanceRef.current = game;

        // Wait for the next frame to ensure the scene is loaded
        requestAnimationFrame(() => {
            console.log('All scenes:', game.scene.getScenes());
            const mainScene = game.scene.getScene('MainScene') as MainScene;
            console.log('MainScene:', mainScene);
        });

        return () => {
            if (gameInstanceRef.current) {
                gameInstanceRef.current.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (commands.length > 0 && gameInstanceRef.current) {
            const mainScene = gameInstanceRef.current.scene.getScene('MainScene') as MainScene;
            if (mainScene) {
                // Execute commands here
                mainScene.executeCommands(commands);
                // console.log('Executing commands:', commands);
            }
        }
    }, [commands]);

    const handleRunCode = () => {
        const inputCommands: CommandType[] = [
            'INPUT',
            'OUTPUT'
        ];
        setCommands(inputCommands);
    };

    return (
        <div className="w-full h-full relative">
            <button
                onClick={handleRunCode}
                className="absolute mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Execute
            </button>
            <div ref={gameRef} className="w-full h-full"></div>
        </div>
    );
};

export default PhaserGame;