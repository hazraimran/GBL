import React, { useContext, useEffect, useMemo, useRef } from 'react';
import GameContext from '../context/GameContext';
import { HelpCircle, ChevronRight, Check, X, Coins } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGameStorage } from '../hooks/useStorage/useGameStorage';
import { useEconomySetting } from '../hooks/useFirestore/useEconomySetting';
import gameTimer from '../utils/Timer';

const Popup = () => {
    const { gameStatus, levelInfo, setCommandsUsed, showPopup, setShowPopup, navTo, resetFn } = useContext(GameContext);
    const { addCoins } = useGameStorage();
    const { economyEnabled } = useEconomySetting();
    
    
    const getStatusColor = (current, target) => {
        return current <= target ? 'bg-lime-200' : 'bg-red-400';
    };

    const getTextColor = (current, target) => {
        return current <= target ? 'text-green-600' : 'text-red-700';
    };

    const isSuccessful = (current, target) => current <= target;

    useEffect(() => {
        if (isSuccessful(gameStatus.commandCnt, levelInfo?.expectedCommandCnt) && economyEnabled) {
            addCoins(1);
        }
    }, [gameStatus.commandCnt, levelInfo?.expectedCommandCnt, economyEnabled])

    return showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-[#f4d03f] rounded-xl shadow-xl p-8 w-full max-w-2xl border-4 border-[#8B4513]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
                }}>
                <h1 className="text-4xl font-bold text-[#8B4513] mb-6 text-center font-['Comic Sans MS']">{levelInfo?.title ?? 'Supply Chamber'}</h1>

                {/* Size Challenge */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-3xl font-bold text-[#8B4513] font-['Comic Sans MS']">Size Challenge</h2>
                        {isSuccessful(gameStatus.commandCnt, levelInfo?.expectedCommandCnt) ? (
                            <Check className="w-6 h-6 text-green-600" />
                        ) : (
                            <X className="w-6 h-6 text-red-600" />
                        )}
                    </div>
                    <div className="flex items-center justify-between bg-[#f5e6d3] rounded-lg p-4 border-2 border-[#8B4513]">
                        <div>
                            <p className="text-xl text-[#8B4513] mb-2">Use {levelInfo?.expectedCommandCnt} or fewer commands</p>
                            <p className={getTextColor(gameStatus.commandCnt, levelInfo?.expectedCommandCnt)}>
                                Your current solution uses {gameStatus.commandCnt} commands
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${getStatusColor(gameStatus.commandCnt, levelInfo?.expectedCommandCnt)}`}>
                                {gameStatus.commandCnt}
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-7 h-7 text-[#8B4513] bg-[#f5e5d3ff]" />
                                    </TooltipTrigger>
                                    <TooltipContent className="text-lg">
                                        <p>Try to use fewer commands to optimize your solution</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                {/* Speed Challenge */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-3xl font-bold text-[#8B4513] font-['Comic Sans MS']">Speed Challenge</h2>
                        {isSuccessful(gameStatus.executeCnt, levelInfo?.expectedExecuteCnt) ? (
                            <Check className="w-6 h-6 text-green-600" />
                        ) : (
                            <X className="w-6 h-6 text-red-600" />
                        )}
                    </div>
                    <div className="flex items-center justify-between bg-[#f5e6d3] rounded-lg p-4 border-2 border-[#8B4513]">
                        <div>
                            <p className="text-xl text-[#8B4513] mb-2">Complete in {levelInfo?.expectedExecuteCnt} or fewer steps</p>
                            <p className={getTextColor(gameStatus.executeCnt, levelInfo?.expectedExecuteCnt)}>
                                Your solution completes in {gameStatus.executeCnt} steps
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${getStatusColor(gameStatus.executeCnt, levelInfo?.expectedExecuteCnt)}`}>
                                {gameStatus.executeCnt}
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <HelpCircle className="w-7 h-7 text-[#8B4513] bg-[#f5e5d3ff]" />
                                    </TooltipTrigger>
                                    <TooltipContent className="text-lg">
                                        <p>Try to complete the level in fewer steps for better efficiency</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
                {economyEnabled && (
                    <div className="flex items-center justify-center font-bold gap-2 mb-3">
                        <Coins className="h-10 w-10 text-blue-400" />
                        <p className="text-xl text-[#8B4513] mb-2">You have won 1 coin</p>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => {
                            setShowPopup(false);
                            resetFn();
                        }}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-['Comic Sans MS'] text-lg"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => {
                            gameTimer.pauseAndSave();
                            setCommandsUsed([]);
                            setShowPopup(false);
                            window.location.reload();
                        }}
                        className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-['Comic Sans MS'] text-lg flex items-center gap-2"
                    >
                        Go To Map
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;