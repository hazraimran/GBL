import React , {useContext, useEffect, useState} from 'react';
import SelectCharacter2 from './SelectCharacter2';
import GameContext from '../../context/GameContext';

const OpeningDialog = () => {
    const { character } = useContext(GameContext);
    const [showSelectCharacter, setShowSelectCharacter] = useState(true);

  
    useEffect(() => {
      if(character) {
        setShowSelectCharacter(false);
      }
    }, [character]);


    if (!showSelectCharacter) {
        return null;
    }
    return (
      <>
        <div
            className={`fixed sm:h-full sm:w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl`}
            style={{
                opacity: 1,
                pointerEvents: 'auto',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
      

            <SelectCharacter2/>
    
        
        </div>
      </>
    );
}


export default OpeningDialog;