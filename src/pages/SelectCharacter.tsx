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
                    variant="secondary" 
                    size="lg"
                    disabled={!selectedCharacter}
                    onClick={handleContinue}
                >
                    Select an Architect
                </Button>
            </div>
        </Container>
        </div>
    );
};


const CharacterCard: React.FC<{ name: string; description: string; isSelected: boolean; onSelect: (character: string) => void; }> = ({ name, description, isSelected, onSelect }) => {
    return (
      <Card 
          className="character-card cursor-pointer rounded-lg"
          style={{
            border: 'none',
            backgroundColor: 'transparent'
          }}
          onClick={() => onSelect(name)}
      >
      <Card.Img 
          variant=""
          style={{
            opacity: isSelected ? 1 : 0.8,
            backgroundImage: isSelected ? 'linear-gradient(to top, rgba(0, 0, 255, 0.2), rgba(128, 0, 128, 0.5))' : 'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))',
          }}
          className="h-[400px] w-auto hover:opacity-100 rounded-lg"
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
