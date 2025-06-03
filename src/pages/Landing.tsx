import React, { useContext, useState, useEffect } from "react";
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
    const [isLoading, setIsLoading] = useState(true);
    useGameStorage();

    const checkLoginStatus = () => {
        const isLoggedIn = localStorage.getItem('game:isLoggedIn') === 'true';
        if (isLoggedIn) {
          navTo('LEVELS');
        }
      };

    useEffect(() => {
        checkLoginStatus();
        setIsLoading(false);
    }, []);

    const carrouselImages = [
        {image: 'intro/guide_speak1.webp'},
        {image: 'intro/icon2.png'},
        {image: 'intro/Darius.png'},
        {image: 'intro/Isis.png'}
    ]

    const tutorialImages = [
        {image: 'intro/workingArea.png', title: 'Working Area', description: 'The working area is the area where you will build your city.'},
        {image: 'intro/tutorial.png', title: 'Tutorial', description: 'The tutorial is the tutorial of the game.'},
        {image: 'intro/DragandDrop.png', title: 'Drag and Drop', description: 'The drag and drop is the drag and drop of the game.'},
    ]


    const characters = [
        {image: 'playercard/Isis.png', name: 'Isis', description: 'Isis is your in-game worker. Isis is a skilled worker with enhanced agility. Specializes in quick movements and accurate placements.'},
        {image: 'playercard/Darius.png', name: 'Darius', description: 'Darius is your in-game worker. Darius is a skilled worker with exceptional strength and determination. Perfect for handling heavy stones and complex constructions.'},
        {image: 'guide_speak1.webp', name: 'Khepri', description: 'Khepri is your in-game logic mentor. He offers adaptive support through contextual feedback, structured hints, and reflection prompts — all framed to promote computational thinking and strategic improvement.'},
    ]

    return currentScene === 'LANDING' && !isLoading && (
        <>
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen relative`}
                style={{
                    backgroundImage: `url('/landing_bg.webp')`,
                    transition: 'filter 500ms ease-out'
                }}
            >
            
                <div className="absolute top-0 right-0 left-0 m-auto bottom-0 grid md:grid-cols-2 gap-8 w-full mx-auto ">
                    

                    <div className="hidden md:flex flex-col justify-center items-center backdrop-blur-sm top-0 left-0 right-0 bottom-0">
                        <img src="/Ancient-architect-logo.png" alt="Ancient Architect" className=" max-w-[60%]" />
                        
                    </div>
                    <div className="flex flex-col justify-center items-center">  
                        <Carousel options={carrouselImages} />
                        <Login />   
                        {/* <AnimatedStart navTo={() => navTo("LEVELS")} setPlayBGM={setPlayBGM} />   */}
                        
                    </div>
                    
                </div>
            </div>
            {/* This can be a component but just long html now */}
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen relative `}
                style={{
                    background: 'linear-gradient(to bottom, rgb(85 62 63), #ffffff)',
                    transition: 'filter 500ms ease-out'
                }}
            >
                     <div className="flex flex-col justify-center items-center text-white pt-10">
                            <h1 className="text-4xl font-bold">How To Play</h1>
                            <p className="text-xl">Drag and drop Commands</p>
                    </div>
                <div className="absolute top-0 right-0 left-0 m-auto bottom-0 grid md:grid-cols-2 gap-8 w-full mx-auto ">
                    
                    <div className="flex flex-col justify-center items-center">  
            
                        <div className="flex flex-col justify-center items-center">
                            <video 
                                className="w-full max-w-[90%] rounded-lg shadow-lg" 
                                controls
                                autoPlay
                                muted
                                src="/videos/INTRO2.mov"
                            >
                            </video>
                        </div>
                        
                    </div>

                    <div className="hidden md:flex flex-col justify-center items-center ">
                    <div className="flex flex-col justify-center items-center">
                            <video 
                                className="w-full max-w-[90%] rounded-lg shadow-lg" 
                                controls
                                muted
                                loop
                                src="/videos/INTRO.mov"
                            >
                            </video>
                        </div>
                        
                        
                    </div>
                    
                </div>
            </div>

            {/* Thirs page */}

            <div
                className={`bg-cover bg-center bg-no-repeat h-screen relative `}
                style={{
                    background: 'linear-gradient(to bottom, #ffffff, #54b2c9)',
                    transition: 'filter 500ms ease-out'
                }}
            >
            
                <div className="absolute top-0 right-0 left-0 m-auto bottom-0  w-full mx-auto ">
                    

                    <div className="flex flex-col justify-center items-center backdrop-blur-sm">
                        <div className="flex flex-col justify-center items-center">
                                <h1 className="text-4xl font-bold">Meet The Team</h1>
                                <p className="text-xl">Ancient Architects characters</p>
                        </div>
                    </div>
                    

                    <div className="flex flex-row justify-center gap-5 items-center h-[80%]">
                    {characters.map((character, index) => (
                        <div className="flex h-[80%] flex-col justify-center items-center w-[20%] border-2 border-gray-300 rounded-lg shadow-lg"  key={index}>

                            <img src={`${character.image}`} alt="Ancient Architect" className="w-[400px] h-[400px] object-fit " />
                            <p className="text-6xl font-bold text-center mt-4">{character.name}</p>
                            <p className="h-[20%] text-center pt-20 text-gray-700 italic w-[80%]">{character.description}</p>
                        </div>
                    ))}
                    </div>
                    
                </div>
            </div>

            {/* Fourth page */}

            <div
                className={`bg-contain bg-center  h-screen relative `}
                style={{
                    backgroundImage: `url('/landing_bg_2.png')`,
                    transition: 'filter 500ms ease-out'
                }}
            >
            <div className="relative h-screen  backdrop-blur-sm">
                <div className="flex flex-col justify-center items-center text-white pt-10">
                                <h1 className="text-4xl font-bold">Working Area</h1>
                                <p className="text-xl">Rock the blocks</p>
                        </div>
                    <div className="relative p-20 h-[90%]">
                    <Carousel height="80%" options={tutorialImages} />   
                    </div>

                </div>
            </div>
        </>
    );
}

export default Landing;