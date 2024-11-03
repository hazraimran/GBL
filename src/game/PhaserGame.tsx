// PhaserGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { MainScene } from './MainScene';
import { CommandType } from '../types/game';
import BottomPanel from '../components/BottomPanel';

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
            scene: MainScene,
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
            
        }
    }, [commands]);

    const handleRunCode = () => {
        const inputCommands: CommandType[] = [
            'INPUT',
            'OUTPUT'
        ];
        
        setCommands(inputCommands);

        if (!gameInstanceRef.current) {
            console.log('Game instance not found');
        }

        const mainScene = gameInstanceRef.current.scene.getScene('MainScene') as MainScene;
        if (mainScene) {
            // Execute commands here
            mainScene.executeCommands(commands);
        }
    };

    const handleExecuteOneStep = () => {
        const nextCommand = commands[0];
        if (nextCommand) {
            setCommands((prevCommands) => prevCommands.slice(1));
        }
    }

    const handleReset = () => {
        setCommands([]);
    }

    return (
        <div className="w-full h-full relative">
            <BottomPanel onExecute={handleRunCode} onExecuteOneStep={handleExecuteOneStep} onReset={handleReset}/>
            <div ref={gameRef} className="w-full h-full" />
        </div>
    );
};

export default PhaserGame;