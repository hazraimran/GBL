import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";

const ButtonScene: React.FC = () => {
    const { levelInfo, currentScene, readyToPickSlot, setReadyToPickSlot, setSlotPicked } = useContext(GameContext);
    const initPos = { x: 320, y: 290 };

    return <div className="w-full h-full"
    >
        {
            readyToPickSlot && currentScene === 'GAME' && Array(levelInfo.constructionSlots.length).fill(0).map((_, idx) => {
                return <div key={idx}
                    className="fixed"
                    style={{
                        left: `${initPos.x + (idx % 3) * 100}px`,
                        top: `${initPos.y + Math.floor(idx / 3) * 100}px`
                    }}>

                    <button
                        className={`fixed border-8 border-lime-600 w-[80px] h-[80px] animate-breath scale-110
                    bg-transparent rounded-md text-black`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSlotPicked(idx);
                            setReadyToPickSlot(false);
                        }}
                    >
                    </button>

                    <div
                        className="absolute left-1/2 -translate-x-1/2 -translate-y-[50px] text-3xl font-bold animate-breath"
                    >
                        {idx + 1}
                    </div>

                </div>

            })
        }
    </div>
}

export default ButtonScene;