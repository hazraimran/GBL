import React, { useContext, useEffect } from 'react';
import GameScene from './pages/GameScene';
import Landing from './pages/Landing';
import GameProvider from './context/GameProvider';
import Levels from './pages/Levels';
import { Toaster } from "./components/ui/toaster"
import JumpConnector from './components/InstructionPanel/JumpConnector';
import ButtonScene from './components/ButtonScene';
import GameContext from './context/GameContext';
import AudioPlayer from './components/AudioPlayer';

function App() {
  const Modal: React.FC = () => {
    const { showModal } = useContext(GameContext);

    return <div
      className={`fixed inset-0 z-[1000] h-[100vh] w-[100vw] transition-opacity duration-500 ease-linear ${showModal ? 'backdrop-blur-sm' : ''}`}
      style={{
        opacity: showModal ? 1 : 0,
        pointerEvents: showModal ? 'auto' : 'none',
      }}
    />
  }

  useEffect(() => {
    const preventZoom = (event: { ctrlKey: any; metaKey: any; preventDefault: () => void; }) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    const preventKeyZoom = (event: { ctrlKey: any; metaKey: any; key: string; preventDefault: () => void; }) => {
      event.preventDefault();
    };

    window.addEventListener('wheel', preventZoom, { passive: false });
    window.addEventListener('keydown', preventKeyZoom);

    return () => {
      window.removeEventListener('wheel', preventZoom);
      window.removeEventListener('keydown', preventKeyZoom);
    };
  }, []);

  return (
    <GameProvider>
      <AudioPlayer />
      <div className='h-[100vh] w-[100vw] relative'>
        <Toaster />
        <Landing />
        <GameScene />
        <Levels />
        <JumpConnector />
        <ButtonScene />
      </div>
      <Modal />
    </GameProvider >
  )
}

export default App
