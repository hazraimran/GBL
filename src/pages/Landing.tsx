import { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";

const Landing: React.FC = () => {
    const { currentScene, setCurrentScene } = useContext(GameContext);
    const [showPickCharacter, setshowPickCharacter] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    useGameStorage();
    
    const handleClickCharacter = (id: number) => {
        setshowPickCharacter(false);
        setShowModal(false);
        setCurrentScene('LEVELS');
    }

    const handleDeleteCharacter = (id: number) => {

    }

    return currentScene === 'LANDING' && (
        <>
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen animate-bg-zoom-loop ${showModal ? 'blur-sm' : ''}`}
                style={{
                    backgroundImage: `url('/landing_bg.png')`,
                    transition: 'filter 500ms ease-out'
                }}
                onClick={() => {
                    setShowModal(true);
                    setTimeout(() => {
                        setshowPickCharacter(true);
                    }, 500);
                }}
            >
            </div>

            {showPickCharacter && (
                <div className='fixed inset-0 flex items-center justify-center'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='bg-white/90 p-3 rounded-lg shadow-lg relative'>
                            <div className='absolute w-4 h-4 bg-white/90 rotate-45 -bottom-2 left-1/2 transform -translate-x-1/2'></div>
                            <p className='text-gray-700 font-medium'>Yes, please select your employee ID.</p>
                        </div>

                        <div className='flex gap-6 items-center justify-center'>
                            {[1, 2, 3].map((id) => (
                                <div key={id} className='relative group'>
                                    <div
                                        className='absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 z-10'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCharacter(id);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>

                                    <div
                                        className='bg-white/90 p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105'
                                        onClick={() => handleClickCharacter(id)}
                                    >
                                        <div className='w-32 h-40 flex flex-col'>
                                            <div className='bg-orange-100 flex-1 rounded-md mb-2'>
                                                <img
                                                    src={`/character-${id}.png`}
                                                    // alt={`Employee ${id}`}
                                                    className='w-full h-full object-contain'
                                                />
                                            </div>
                                            <div className='text-center'>
                                                <p className='text-blue-600 font-semibold'>Foreman {id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>

    );
}

export default Landing;