import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";

const ButtonScene: React.FC = () => {
    const { levelInfo, currentScene, readyToPickSlot, setReadyToPickSlot, setSlotPicked } = useContext(GameContext);
    const initPos = { x: 265, y: 265 };

    return <div className="w-full h-full"
        onClick={() => {
            setSlotPicked(undefined);
            setReadyToPickSlot(false);
        }}
    >
        {
            readyToPickSlot && currentScene === 'GAME' && Array(levelInfo.constructionSlots).fill(0).map((_, idx) => {
                return <button
                    key={idx}
                    style={{
                        left: `${initPos.x + (idx % 3) * 90}px`,
                        top: `${initPos.y + Math.floor(idx / 3) * 90}px`
                    }}
                    className={`fixed border-8 border-white w-[70px] h-[70px] animate-breath scale-110
                    bg-transparent rounded-md text-black`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSlotPicked(idx);
                        setReadyToPickSlot(false);
                    }}
                >
                    {idx + 1}
                </button>
            })
        }
    </div>
}

export default ButtonScene;