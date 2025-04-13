import { useContext, useState } from "react";
import GameContext from "../context/GameContext";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { ChevronRight } from "lucide-react";

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
            className={`absolute top-2/3 -translate-y-full left-1/2 -translate-x-1/2 pl-4 pr-2 pt-6 pb-4 text-2xl filter backdrop-blur-md rounded-lg cursor-pointer ${isAnimating ? 'w-16' : 'w-32'} transition-[width] duration-500`}
            onClick={handleClick}
        >
            <span className="relative block text-center">
                <span className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
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


    return currentScene === 'LANDING' && (
        <>
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen animate-bg-zoom-loop`}
                style={{
                    backgroundImage: `url('/landing_bg.webp')`,
                    transition: 'filter 500ms ease-out'
                }}
            >
            </div>
            <div className="absolute top-1/3 -translate-y-full left-1/2 -translate-x-1/2 px-[2rem] pt-[2rem] text-7xl text-yellow-600 filter backdrop-blur-lg rounded-lg ">
                Ancient Architect
            </div>
            <AnimatedStart navTo={navTo} setPlayBGM={setPlayBGM} />
        </>
    );
}

export default Landing;