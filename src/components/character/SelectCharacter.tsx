import React, { useState, useEffect } from 'react';
import SelectCharacter2 from './SelectCharacter2';

const OpeningDialog = () => {


    const [showSelectCharacter, setShowSelectCharacter] = useState(false);

    useEffect(() => {
        setShowSelectCharacter(true);
    }, []);


    useEffect(() => {

      const character = localStorage.getItem('game:selectedCharacter');
      if (character) {
        setShowSelectCharacter(false);
      }
    }, [showSelectCharacter]);


    const handleSelectCharacter = (character: string) => {
        localStorage.setItem('game:selectedCharacter', character);
        setShowSelectCharacter(false);
    }


    if (!showSelectCharacter) {
        return null;
    }
  
    return (
      <>
        <div
            className={`fixed z-[1000] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl`}
            style={{
                opacity: 1,
                pointerEvents: 'auto',
                top: '25vh',
                left: '20vw',
                width: '60vw',
                height: '50vh',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
      

            <SelectCharacter2 handleSelectCharacter={handleSelectCharacter} />
    
        
        </div>
      </>
    );
}


export default OpeningDialog;