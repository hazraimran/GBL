import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";
import { LevelInfo } from "../types/level";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { RxReset } from "react-icons/rx";

interface LevelCoordinate {
    x: number;
    y: number;
}

type LevelCoordinates = LevelCoordinate[];

const Levels: React.FC = () => {
    const { setShowFirstTimePickPrompt, setShowReadyPrompt, setShowOpenningInstruction, setOpenningInstruction,
        currentScene, setCurrentScene, setLevel, setLevelInfo, setShowInstructionPanel, setShowBottomPanel } = useContext(GameContext);
    const [levelsInfo, setLevelsInfo] = useState<LevelInfo[]>([]);
    const { getLevelsInfo, addAccessedTime } = useGameStorage();

    useEffect(() => {
        setLevelsInfo(getLevelsInfo());
    }, [currentScene]);

    const handleClickLevel = (level: LevelInfo) => {
        if (!level.isLocked) {
            setLevel?.(level.id);

            addAccessedTime(level.id - 1);
            setLevelInfo(level);

            // TODO: add condtional rendering
            setOpenningInstruction(level.openningInstruction);
            setShowOpenningInstruction(false);
            setShowInstructionPanel(true);
            if (level.timeAccessed === 0) {
                setShowOpenningInstruction(true);
                setShowInstructionPanel(false);
            }

            setShowBottomPanel(false);
            setShowFirstTimePickPrompt(false);

            if (level.id === 1) {
                setShowReadyPrompt(true);
                setShowFirstTimePickPrompt(true);
            }

            setCurrentScene('GAME');
        }
    }

    const LEVEL_COORDINATES: LevelCoordinates = [
        {
            x: 0,
            y: 0,
        }
    ]

    return currentScene === 'LEVELS' && (

        <div className="select-none fixed inset-0 flex flex-row justify-center overflow-scroll" >
            <img src="./map.webp" className="h-[160vh]" alt="" onClick={() => handleClickLevel(levelsInfo[5])} />
            {LEVEL_COORDINATES.map((level, idx) => {
                return (
                    <div key={idx} className="absolute " style={{ left: `${level.x}px`, top: `${level.y}px` }}>
                        <button
                            className={`fixed w-16 h-16 rounded bg-transparent`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClickLevel(levelsInfo[idx]);
                            }}
                        >
                        </button>
                    </div>
                )
            })}
            <button
                className="fixed bottom-0 left-0 bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={() => {
                    setCurrentScene('LANDING');
                }}
            >
                <RxReset className="w-[7rem] h-[4rem] text-yellow-600" />
            </button>
        </div>
    );
}

export default Levels;