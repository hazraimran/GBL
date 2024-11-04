import React, { useContext } from "react";
import GameContext from "../context/GameContext";

interface LevelData {
    id: number;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isLocked: boolean;
    bestScore?: number;
}

const levelsList: LevelData[] = [
    {
        id: 1,
        title: "Mail Room",
        description: "Sort incoming numbers from the IN-BOX to the OUT-BOX.",
        difficulty: 'Easy',
        isLocked: false,
        bestScore: 6
    },
    {
        id: 2,
        title: "Busy Mail Room",
        description: "Handle multiple incoming items efficiently.",
        difficulty: 'Easy',
        isLocked: false
    },
    {
        id: 3,
        title: "Copy Floor",
        description: "Learn to use the COPYFROM command.",
        difficulty: 'Medium',
        isLocked: true
    },
    {
        id: 4,
        title: "Scrambler Handler",
        description: "Process and reorganize data.",
        difficulty: 'Hard',
        isLocked: true
    }
];

const Levels: React.FC = () => {
    const { currentScene, setCurrentScene, setCurrentLevel } = useContext(GameContext);

    const handleClickLevel = (level: LevelData) => {
        if (!level.isLocked) {
            setCurrentLevel?.(level.id);
            setCurrentScene('GAME');
        }
    }

    const getDifficultyColor = (difficulty: LevelData['difficulty']) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Hard':
                return 'bg-red-100 text-red-800';
        }
    }

    return currentScene === 'LEVELS' && (
        <div className="fixed inset-0 bg-gray-100 flex flex-col p-8">
            <div className="max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Level</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {levelsList.map((level) => (
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
                            onClick={() => handleClickLevel(level)}
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

                            <div className="flex justify-between items-center">
                                <span
                                    className={`
                                        px-2 py-1 rounded text-sm font-medium
                                        ${getDifficultyColor(level.difficulty)}
                                    `}
                                >
                                    {level.difficulty}
                                </span>

                                {level.bestScore && (
                                    <div className="flex items-center space-x-1 text-yellow-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <span className="font-medium">{level.bestScore}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Levels;