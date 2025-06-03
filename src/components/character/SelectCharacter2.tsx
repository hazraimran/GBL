import React, { useContext, useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import GameContext from '../../context/GameContext';




const SelectCharacter: React.FC  = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const { setCharacter } = useContext(GameContext);
    
    const handleCharacterSelect = (character: string) => {
        setSelectedCharacter(character);
    };

    const handleSelectCharacter = (character: string) => {
        localStorage.setItem('game:selectedCharacter', character);
        setCharacter(character);
    }


    return (
      <div className={`bg-cover bg-center bg-no-repeat h-full w-full`}>
        <Container className="flex flex-col justify-center items-center h-full">
            <div className='h-full flex flex-col justify-center items-center'>
                <Row className="flex flex-col sm:flex-row justify-center align-middle">
                    <Col md={5}>
                        <CharacterCard
                            name="Darius"
                            description="A skilled worker with exceptional strength and determination. Perfect for handling heavy stones and complex constructions."
                            isSelected={selectedCharacter === 'Darius'} 
                            onSelect={handleCharacterSelect}
                        />
                    </Col>
                    
                    <Col md={5}>
                        <CharacterCard
                            name="Isis"
                            description="A nimble and precise worker with enhanced agility. Specializes in quick movements and accurate placements."
                            isSelected={selectedCharacter === 'Isis'} 
                            onSelect={handleCharacterSelect}
                        />   
                    </Col>
                </Row>
                <div className="text-center mt-4">
                    <Button 
                        variant="secondary" 
                        size="lg"
                        disabled={!selectedCharacter}
                        onClick={() => selectedCharacter && handleSelectCharacter(selectedCharacter)}
                        >
                        Select an Architect
                    </Button>
                </div>
            </div>
        </Container>
        </div>
    );
};


const CharacterCard: React.FC<{ name: string; description: string; isSelected: boolean; onSelect: (character: string) => void; }> = ({ name, description, isSelected, onSelect }) => {
    return (
      <Card 
          className="character-card cursor-pointer rounded-lg flex flex-col justify-between items-center h-full bg-transparent"
          style={{
            border: 'none',
            borderRadius: '50px',
            backgroundImage: (isSelected ? 'linear-gradient(to top, rgba(0, 0, 255, 0.2), rgba(128, 0, 128, 01))' : 'none'),
          }}
          onClick={() => onSelect(name)}
      >
      <Card.Img 
          variant=""
          style={{
            opacity: isSelected ? 1 : 0.8,
            backgroundColor: 'transparent'
            
          }}
          className="w-auto h-72 hover:opacity-100 rounded-lg object-contain"
          src={`./playercard/${name}.png`} 
          alt={name}
          
      />
      <Card.Body
      
          className='flex flex-col justify-center items-center bg-black text-white'
          >
          <Card.Title className="">{name}</Card.Title>
          <Card.Text>
              {description}
          </Card.Text>
      </Card.Body>
  </Card>
    );
};

export default SelectCharacter;
