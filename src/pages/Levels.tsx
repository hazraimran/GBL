import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";
import { getLevelsInfo } from "../utils/storage";
import { LevelInfo } from "../types/level";
import { RxReset } from "react-icons/rx";

const Levels: React.FC = () => {
    const { currentScene, setCurrentScene, setLevel, setLevelInfo } = useContext(GameContext);
    const [levelsInfo, setLevelsInfo] = useState<LevelInfo[]>([]);

    useEffect(() => {
        setLevelsInfo(getLevelsInfo());
    }, [currentScene]);

    const handleClickLevel = (level: LevelInfo) => {
        if (!level.isLocked) {
            setLevel?.(level.id);

            setLevelInfo(level);
            setCurrentScene('GAME');
        }
    }

    return currentScene === 'LEVELS' && (
        <div className="fixed inset-0 bg-gray-100 flex flex-col p-8">
            <button
                className="fixed bottom-0 left-0 bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={() => {
                    setCurrentScene('LANDING');
                }}
            >
                <RxReset className="w-[7rem] h-[4rem] text-custom-bg-text" />
            </button>
            <div className="max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Level</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelsInfo.map((level) => (
                        <div
                            key={level.id}
                            className={`
                                bg-white rounded-lg shadow-md p-6 cursor-pointer 
                                transform transition-all duration-200
                                ${level.isLocked
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:scale-105 hover:shadow-lg'
                                }
                            `}
                            onClick={() => {
                                handleClickLevel(level)
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Level {level.id}
                                </h2>
                                {level.isLocked && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                            </div>

                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                {level.title}
                            </h3>

                            <p className="text-gray-600 text-sm mb-4">
                                {level.description}
                            </p>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Levels;