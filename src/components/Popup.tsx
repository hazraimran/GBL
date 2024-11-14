import React, { useContext, useEffect } from 'react';
import GameContext from '../context/GameContext';
import { HelpCircle } from 'lucide-react';

const Popup: React.FC = () => {
    const { gameStatus, levelInfo, setCommandsUsed, showPopup, setShowPopup, setCurrentScene } = useContext(GameContext);
    const getStatusColor = (current: number, target: number) => {
        return current <= target ? 'bg-lime-300' : 'bg-amber-600';
    };
    useEffect(() => {
        console.log(levelInfo, levelInfo.title, levelInfo.expectedCommandCnt, levelInfo.expectedExecuteCnt);
    }, []);

    return showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[40rem]">
                <h2 className="text-xl font-semibold mb-4">{levelInfo?.title ?? ''}</h2>
                {/* Size Challenge */}
                <div className="relative">
                    <div className="flex items-start">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Size Challenge</h2>
                            <p className="text-base mb-2">
                                Use {levelInfo?.expectedCommandCnt} or fewer commands.
                            </p>
                            <p className="text-red-600 ml-4">
                                - Your current solution uses {gameStatus.commandCnt} commands.
                            </p>
                            {/* <p className="text-gray-700 ml-4">
                                    Your best used {sizeChallenge.best} commands.
                                </p> */}
                        </div>
                        <div className="flex items-start gap-1">
                            <div className={`w-8 h-8 flex items-center justify-center text-black ${getStatusColor(gameStatus.commandCnt, levelInfo?.expectedCommandCnt)}`}>
                                {levelInfo?.expectedCommandCnt}
                            </div>
                            <div className={`w-8 h-8 flex items-center justify-center text-white ${getStatusColor(gameStatus.commandCnt, levelInfo?.expectedCommandCnt)}`}>
                                {gameStatus.commandCnt}
                            </div>
                        </div>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Speed Challenge */}
                <div className="relative mt-4">
                    <div className="flex items-start">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">Speed Challenge</h2>
                            <p className="text-base mb-2">
                                Complete in {levelInfo?.expectedExecuteCnt} or fewer steps.
                            </p>
                            <p className="text-red-600 ml-4">
                                - Your solution completes in {gameStatus.executeCnt} steps, on average.
                            </p>
                            {/* <p className="text-gray-700 ml-4">
                                    Your best completed in {speedChallenge.best} steps, on average.
                                </p> */}
                        </div>
                        <div className="flex items-start gap-1">
                            <div className={`w-8 h-8 flex items-center justify-center text-black ${getStatusColor(gameStatus.executeCnt, levelInfo?.expectedExecuteCnt)}`}>
                                {levelInfo?.expectedExecuteCnt}
                            </div>
                            <div className={`w-8 h-8 flex items-center justify-center text-white ${getStatusColor(gameStatus.executeCnt, levelInfo?.expectedExecuteCnt)}`}>
                                {gameStatus.executeCnt}
                            </div>
                        </div>
                        <button className="ml-2 text-gray-400 hover:text-gray-600">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowPopup(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            setCurrentScene('LEVELS');
                            setCommandsUsed([]);
                            setShowPopup(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Go To Map!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
