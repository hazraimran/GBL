import GameScene from './scenes/GameScene';
import Menu from './scenes/Menu';
import { useState } from 'react';
import GameProvider from './context/GameProvider';

function App() {

  return (
    <GameProvider>
      <div className='h-[100vh] w-[100vw] relative'>
        <Menu />
        <GameScene />
      </div>
    </GameProvider >
  )
}

export default App
