import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";
import { LevelInfo } from "../types/level";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { LogOut, OctagonAlert } from "lucide-react";
import { authService } from "../services/firestore/authentication";

import ResetGamePopup from "../components/ResetGamePopup";
import SkillsButton from "../components/buttons/skillsButton";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip"
import OpeningDialog from "../components/OpeningDialog";
import SilentButton from "../components/buttons/SilentButton";
import ConceptButton from "../components/buttons/ConceptButton";
import HelperActionButton from "../components/buttons/HelperActionButton";
import SurveyButton from "../components/buttons/SurveyButton";
import AlertButton from "../components/buttons/AlertButton";
import FirstTimeSurveyModal from "../components/modals/FirstTimeSurveyModal";

interface LevelCoordinate {
    x: number;
    y: number;
    size: number;
}

interface LevelStatus {
    visited: boolean;
    current: boolean;
    visible: boolean;
}

type LevelCoordinates = LevelCoordinate[];

const Levels: React.FC = () => {
    const { setShowFirstTimePickPrompt, setShowReadyPrompt, setShowOpenningInstruction, setOpenningInstruction, muted,
        currentScene, navTo, setLevel, setLevelInfo, setShowInstructionPanel, setShowBottomPanel, setPlayBGM, character, setCharacter } = useContext(GameContext);
    const [levelsInfo, setLevelsInfo] = useState<LevelInfo[]>([]);
    const [levelStatus, setLevelStatus] = useState<LevelStatus[]>([]);
    const [showFirstTimeSurvey, setShowFirstTimeSurvey] = useState(false);
    const { getLevelsInfo, addAccessedTime } = useGameStorage();
    const [showResetPopup, setShowResetPopup] = useState(false);
    
    useEffect(() => {
        const initLevels = async () => {
            const levels = await getLevelsInfo();
            if (levels && levels.length > 0) {
                setLevelStatus(helper(levels));
                setLevelsInfo(levels);
            }
        };
        
        initLevels();
    }, [currentScene]);

    useEffect(() => {
        setPlayBGM(!muted)
    }, [muted]);

    useEffect(() => {
        const selectedCharacter = localStorage.getItem('game:selectedCharacter');
        if (selectedCharacter) {
            setCharacter(selectedCharacter);
        }
    }, [character]);

    // Check for first-time survey on component mount
    useEffect(() => {
        if (currentScene === 'LEVELS') {
            const currentUserId = authService.getCurrentUserId();
            if (currentUserId) {
                const hasCompletedFirstTimeSurvey = localStorage.getItem(`firstTimeSurvey_${currentUserId}`);
                if (!hasCompletedFirstTimeSurvey) {
                    setShowFirstTimeSurvey(true);
                }
            }
        }
    }, [currentScene]);

    const handleFirstTimeSurveyClose = () => {
        // Mark that the user has completed the first-time survey
        const currentUserId = authService.getCurrentUserId();
        if (currentUserId) {
            localStorage.setItem(`firstTimeSurvey_${currentUserId}`, 'completed');
        }
        setShowFirstTimeSurvey(false);
    };

    const handleClickLevel = (level: LevelInfo) => {
        if (!level.isLocked && level.visible) {
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
            const status: LevelStatus = {
                visited: false,
                current: false,
                visible: levels[i].visible
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
            x: 46.5,
            y: 146,
            size: 6
        },
        {
            x: 52,
            y: 132,
            size: 6
        },
        {
            x: 36.79,
            y: 102,
            size: 5
        },
        {
            x: 42.5,
            y: 92.5,
            size: 5
        },
        {
            x: 64,
            y: 97,
            size: 6
        },
        {
            x: 47.5,
            y: 81,
            size: 4.5
        },
        {
            x: 60,
            y: 75,
            size: 5
        },
        {
            x: 66.5,
            y: 57,
            size: 5
        },
        {
            x: 48.5,
            y: 60,
            size: 5
        },
        {
            x: 47.5,
            y: 50,
            size: 4
        },
        {
            x: 58,
            y: 48,
            size: 4
        },
        {
            x: 59,
            y: 32,
            size: 4
        },
        {
            x: 44,
            y: 39,
            size: 4
        },
        {
            x: 50.5,
            y: 28,
            size: 4
        },
        {
            x: 56.5,
            y: 21,
            size: 4
        },
        {
            x: 44,
            y: 23,
            size: 4
        },
        {
            x: 45,
            y: 13.86,
            size: 4
        },
        {
            x: 43,
            y: 13.86,
            size: 4
        },
    ]

    return currentScene === 'LEVELS' && levelsInfo.length > 0 && (
        <>
            <TooltipProvider>
                <div className="select-none fixed inset-0 flex flex-row justify-center overflow-scroll" >
                    <img src="./map.webp" className="h-[160vh]" alt="" />
                    { LEVEL_COORDINATES.map((level, idx) => {
                        if (!levelsInfo[idx]) return null;
                        return (
                            <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                    <button
                                        key={idx}
                                        className={`absolute bg-transparent border-black rounded-full -translate-x-1/2 -translate-y-1/2`}
                                        style={{ left: `${level.x}vw`, top: `${level.y}vh`, width: `${level.size}rem`, height: `${level.size}rem` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClickLevel(levelsInfo[idx]);
                                        }}
                                    >
                                        {
                                            levelStatus[idx]?.visible && levelStatus[idx]?.visited && <img src="./tick.png" alt="completed" />
                                        }
                                        {!levelStatus[idx]?.visible && <img className="w-full h-full" src="./Ancient-architect-logo.png" alt="locked" />}
                                        {
                                            levelStatus[idx]?.current && <img src={`./playercard/${character}.png`} className="animate-breath duration-3000" alt="current" />
                                        }
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-lg max-w-[300px]">
                                    {levelsInfo[idx] && levelsInfo[idx].visible && (
                                        <>
                                            <p>{idx + 1}{'. '}{levelsInfo[idx].title}</p>
                                            <p><span className="font-bold">CS Concept:</span>{levelsInfo[idx].learningOutcome.concept}</p>
                                            {idx > levelsInfo.length - 1 && <p>Unrevealed</p>}

                                            <ConceptButton title="View More">
                                                <div className="flex flex-col gap-2 text-white text-lg">
                                                    <p><span className="font-bold">Why It Matters: </span>{levelsInfo[idx].learningOutcome.why}</p>
                                                    <p><span className="font-bold">How This level teaches it: </span>{levelsInfo[idx].learningOutcome.how}</p>
                                                </div>
                                            </ConceptButton>
                                        </>
                                    )}
                                    {!levelStatus[idx]?.visible && <img className="w-full h-full" src="./Ancient-architect-logo.png" alt="locked" />}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}

                    <AlertButton onClick={() => {
                        authService.signOut();
                        navTo('LANDING');
                    }} 
                    title="Logout" 
                    Icon={LogOut} 
                    colorIcon="yellow-600" 
                    position="bottom-0 left-0" />

                    <AlertButton onClick={() => {
                        setShowResetPopup(true);
                    }} 
                    title="Reset Game" 
                    Icon={OctagonAlert} 
                    colorIcon="red-600" 
                    position="bottom-0 right-0" />

                    <SilentButton />                
                    <SkillsButton/>
                    <HelperActionButton/>
                    <SurveyButton/>
                </div>
            </TooltipProvider>
            <OpeningDialog />
            
            <FirstTimeSurveyModal 
                isOpen={showFirstTimeSurvey} 
                onClose={handleFirstTimeSurveyClose} 
            />
            
            {showResetPopup && <ResetGamePopup setShowResetPopup={setShowResetPopup} />}
        </>
    );
}

export default Levels;