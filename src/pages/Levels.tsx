import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";
import { LevelInfo } from "../types/level";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { Volume2, VolumeOff } from "lucide-react";
import { RxReset } from "react-icons/rx";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip"
import OpeningDialog from "../components/OpeningDialog";

interface LevelCoordinate {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface LevelStatus {
    visited: boolean;
    current: boolean;
}

type LevelCoordinates = LevelCoordinate[];

const Levels: React.FC = () => {
    const { setShowFirstTimePickPrompt, setShowReadyPrompt, setShowOpenningInstruction, setOpenningInstruction, muted, setMuted,
        currentScene, navTo, setLevel, setLevelInfo, setShowInstructionPanel, setShowBottomPanel } = useContext(GameContext);
    const [levelsInfo, setLevelsInfo] = useState<LevelInfo[]>([]);
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const { getLevelsInfo, addAccessedTime } = useGameStorage();

    useEffect(() => {
        const levelsInfo = getLevelsInfo();
        setLevelStatus(helper(levelsInfo));
        setLevelsInfo(levelsInfo);
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

            navTo('GAME');
        }
    }

    const helper = (levels: LevelInfo[]): LevelStatus[] => {
        let current = false;
        const levelsStatus: LevelStatus[] = new Array(levels.length);
        for (let i = levels.length - 1; i >= 0; i--) {
            let status: LevelStatus = {
                visited: false,
                current: false
            };
            if (!levels[i].isLocked) {
                status.visited = true;
                if (!current) {
                    current = true;
                    status.current = true;
                    status.visited = false;
                }
            }
            levelsStatus[i] = status;
        }
        return levelsStatus;
    }

    const LEVEL_COORDINATES: LevelCoordinates = [
        {
            x: 620,
            y: 1180,
            w: 7,
            h: 5
        },
        {
            x: 700,
            y: 1050,
            w: 7,
            h: 5
        }, {
            x: 480,
            y: 820,
            w: 6,
            h: 4
        }, {
            x: 570,
            y: 740,
            w: 6,
            h: 4
        }, {
            x: 880,
            y: 770,
            w: 7,
            h: 5
        }, {
            x: 650,
            y: 650,
            w: 5,
            h: 3.5
        }, {
            x: 830,
            y: 590,
            w: 5,
            h: 4
        }, {
            x: 660,
            y: 460,
            w: 5,
            h: 4
        }, {
            x: 920,
            y: 440,
            w: 5,
            h: 4
        }, {
            x: 650,
            y: 395,
            w: 5,
            h: 3
        }, {
            x: 800,
            y: 375,
            w: 4,
            h: 3
        }, {
            x: 830,
            y: 235,
            w: 4,
            h: 3
        }, {
            x: 605,
            y: 305,
            w: 4,
            h: 3
        }, {
            x: 700,
            y: 215,
            w: 4,
            h: 3
        }, {
            x: 790,
            y: 150,
            w: 4,
            h: 3
        }, {
            x: 610,
            y: 170,
            w: 4,
            h: 3
        }, {
            x: 620,
            y: 100,
            w: 4,
            h: 3
        }, {
            x: 725,
            y: 100,
            w: 4,
            h: 3
        },
    ]

    return currentScene === 'LEVELS' && levelsInfo && (
        <>
            <TooltipProvider>
                <div className="select-none fixed inset-0 flex flex-row justify-center overflow-scroll" >
                    <img src="./map.webp" className="h-[160vh]" alt="" />
                    {LEVEL_COORDINATES.map((level, idx) => {
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>

                                    <button
                                        key={idx}
                                        className={`absolute bg-transparent border-black rounded-full`}
                                        style={{ left: `${level.x}px`, top: `${level.y}px`, width: `${level.w}rem`, height: `${level.h}rem` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickLevel(levelsInfo[idx]);
                                        }}
                                    >
                                        {
                                            levelStatus[idx]?.visited && <div className="-translate-x-3 -translate-y-1 p-2"><img src="./tick.png" /></div>
                                        }
                                        {
                                            levelStatus[idx]?.current && <div className="-translate-x-3 -translate-y-3"><img src="./circle.png" className="animate-breath duration-3000" /></div>
                                        }
                                    </button>
                                </TooltipTrigger>

                                <TooltipContent className="text-lg">
                                    {levelsInfo[idx] && <p>{idx + 1}{'. '}{levelsInfo[idx].title}</p>}
                                    {idx > levelsInfo.length - 1 && <p>Unrevealed</p>}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                    <button
                        className="fixed bottom-0 left-0 bg-custom-bg rounded-lg flex items-center justify-center"
                        onClick={() => {
                            navTo('LANDING');
                        }}
                    >
                        <RxReset className="w-[7rem] h-[4rem] text-yellow-600" />
                    </button>

                    <button
                        className="fixed bottom-0 left-[8rem] bg-custom-bg rounded-lg flex items-center justify-center"
                        onClick={() => {
                        }}
                    >
                        {muted ?
                            <VolumeOff onClick={() => setMuted(false)} className="w-[7rem] h-[4rem] text-yellow-600" /> :
                            <Volume2 onClick={() => setMuted(true)} className="w-[7rem] h-[4rem] text-yellow-600" />
                        }
                    </button>
                </div>
            </TooltipProvider>
            <OpeningDialog />

        </>
    );
}

export default Levels;