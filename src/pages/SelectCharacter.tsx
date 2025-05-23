import React, { useState, useContext } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
// import './SelectCharacter.css';
import GameContext from '../context/GameContext';

const SelectCharacter: React.FC = () => {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const { navTo, currentScene } = useContext(GameContext);

    const handleCharacterSelect = (character: string) => {
        setSelectedCharacter(character);
    };

    const handleContinue = () => {
        if (selectedCharacter) {
            // Navigate to game with selected character
            localStorage.setItem('selectedCharacter', selectedCharacter);
            navTo('LEVELS');
        }
    };

    if (currentScene !== 'SELECTCHARACTER') {
        return null;
    }

    return (
      <div
      className={`bg-cover bg-center bg-no-repeat h-screen `}
      style={{
          backgroundImage: `url('/landing_bg.webp')`,
          transition: 'filter 5000ms ease-out'
      }}
  >
        <Container className="h-full select-character-container  flex flex-col justify-center items-center">
            <h1 className="text-center mb-4 text-white relative">
                <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 border-t-2 border-l-2 border-yellow-600"></span>
                <span className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 border-t-2 border-r-2 border-yellow-600"></span>
                <span className="absolute left-1/2 -translate-x-1/2 -top-4 w-12 h-4 border-t-2 border-l-2 border-r-2 border-yellow-600 rounded-t-lg"></span>
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-12 h-4 border-b-2 border-l-2 border-r-2 border-yellow-600 rounded-b-lg"></span>
                Select Your Character
            </h1>
            <Container>
            <Row className="justify-content-center">
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
            </Container>
            <div className="text-center mt-4">
                <Button 
                    variant="primary" 
                    size="lg"
                    disabled={!selectedCharacter}
                    onClick={handleContinue}
                >
                    Continue
                </Button>
            </div>
        </Container>
        </div>
    );
};


const CharacterCard: React.FC<{ name: string; description: string; isSelected: boolean; onSelect: (character: string) => void; }> = ({ name, description, isSelected, onSelect }) => {
    return (
      <Card 
          className={`character-card cursor-pointer`}
          style={{
            border: 'none',
            backgroundColor: 'transparent'
          }}
          onClick={() => onSelect(name)}
      >
      <Card.Img 
          variant=""
          style={{
            backgroundImage: isSelected ? 'linear-gradient(to bottom, rgba(0, 0, 255, 0.5), rgba(128, 0, 128, 1))' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))',
          }}
          className="h-[500px] w-auto"
          src={`./playercard/${name}.png`} 
          alt={name}
          
      />
      <Card.Body style={{backgroundColor: 'black',color: 'white'}}>
          <Card.Title className="">{name}</Card.Title>
          <Card.Text>
              {description}
          </Card.Text>
      </Card.Body>
  </Card>
    );
};

export default SelectCharacter;
