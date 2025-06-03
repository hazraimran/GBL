import React, { useContext, useState } from "react";
import GameContext from "../context/GameContext";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { ChevronRight } from "lucide-react";
import Login from "../components/login/login";
import Carousel from "../components/Carrousel";

interface AnimatedStartProps {
    navTo: (scene: string) => void;
    setPlayBGM: (play: boolean) => void;
}

const AnimatedStart: React.FC<AnimatedStartProps> = ({ navTo, setPlayBGM }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        setIsAnimating(true);
        setPlayBGM(true);
        setTimeout(() => {
            navTo('LEVELS');
        }, 500);
    };

    return (
        <div
            className={`py-4 px-2 text-xl  backdrop-blur-md rounded-lg cursor-pointer w-32  duration-1000 hover:bg-slate-700 hover:text-white `}
            onClick={handleClick}
        >
            <span className="relative block text-center">
                <span className={` duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                    Start
                </span>
                <ChevronRight
                    className={`w-8 h-8 absolute -translate-y-[2.25rem] left-0 transition-transform duration-500 ${isAnimating ? 'translate-x-0' : '-translate-x-2'}`}
                />
            </span>
        </div>
    );
};

const Landing: React.FC = () => {
    const { currentScene, navTo, setPlayBGM } = useContext(GameContext);
    useGameStorage();

    const carrouselImages = [
        'guide_speak1.webp',
        'icon2.png',
        'Darius.png',
        'Isis.png'
    ]

    return currentScene === 'LANDING' && (
        <>
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen `}
                style={{
                    backgroundImage: `url('/landing_bg.webp')`,
                    transition: 'filter 500ms ease-out'
                }}
            >
            </div>
            <div className="absolute top-0 right-0 left-0 m-auto bottom-0 grid grid-cols-2 gap-8 w-full mx-auto ">
                

                <div className="flex flex-col justify-center items-center backdrop-blur-sm">

                        <Carousel images={carrouselImages.map(image => `/intro/${image}`)} />
                        <Login />   
                        <AnimatedStart navTo={() => navTo("LEVELS")} setPlayBGM={setPlayBGM} />

                </div>
                <div className="flex flex-col justify-center items-center">

                    <div>
                        
                        <img src="/Ancient-architect-logo.png" alt="Ancient Architect" className=" max-w-[60%]" />
                    </div>
                    <div className="mt-4">
                     
                    </div>
                    
            
                </div>
                
            </div>
            </>
    );
}

export default Landing;