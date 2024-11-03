import GameScene from './pages/GameScene';
import Menu from './pages/Menu';
import GameProvider from './context/GameProvider';

function App() {

  return (
    <GameProvider>
      <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
        <Menu />
        <GameScene />
      </div>
    </GameProvider >
  )
}

export default App
