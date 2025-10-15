import React from 'react';
import { LevelInfo } from '../../types/level';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface InstructionsFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const InstructionsForm: React.FC<InstructionsFormProps> = ({ levelData, onChange }) => {
  const handleOpeningInstructionChange = (index: number, value: string) => {
    const currentInstructions = levelData.openningInstruction || [];
    const updatedInstructions = currentInstructions.map((instruction, i) => 
      i === index ? value : instruction
    );
    
    onChange({
      ...levelData,
      openningInstruction: updatedInstructions
    });
  };

  const handleAddOpeningInstruction = () => {
    const currentInstructions = levelData.openningInstruction || [];
    onChange({
      ...levelData,
      openningInstruction: [...currentInstructions, '']
    });
  };

  const handleRemoveOpeningInstruction = (index: number) => {
    const currentInstructions = levelData.openningInstruction || [];
    const updatedInstructions = currentInstructions.filter((_, i) => i !== index);
    
    onChange({
      ...levelData,
      openningInstruction: updatedInstructions
    });
  };

  const handleHintChange = (index: number, value: string) => {
    const currentHints = levelData.hints || [];
    const updatedHints = currentHints.map((hint, i) => 
      i === index ? value : hint
    );
    
    onChange({
      ...levelData,
      hints: updatedHints
    });
  };

  const handleAddHint = () => {
    const currentHints = levelData.hints || [];
    onChange({
      ...levelData,
      hints: [...currentHints, '']
    });
  };

  const handleRemoveHint = (index: number) => {
    const currentHints = levelData.hints || [];
    const updatedHints = currentHints.filter((_, i) => i !== index);
    
    onChange({
      ...levelData,
      hints: updatedHints
    });
  };

  return (
    <div className="space-y-6">
      {/* Opening Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Opening Instructions</CardTitle>
          <CardDescription>
            Messages that appear when the level starts. These guide the player through the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(levelData.openningInstruction || []).map((instruction, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-gray-700 rounded text-xs text-gray-300 mt-2">
                {index + 1}
              </div>
              <div className="flex-1">
                <Textarea
                  value={instruction}
                  onChange={(e) => handleOpeningInstructionChange(index, e.target.value)}
                  placeholder={`Instruction ${index + 1}...`}
                  rows={2}
                  className="resize-none"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveOpeningInstruction(index)}
                className="mt-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button
            onClick={handleAddOpeningInstruction}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Opening Instruction
          </Button>
          
          <div className="text-sm text-gray-400">
            <p><strong>Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Keep instructions clear and concise</li>
              <li>Use a friendly, encouraging tone</li>
              <li>Explain the goal and any new concepts</li>
              <li>Consider the player's current skill level</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Hints */}
      <Card>
        <CardHeader>
          <CardTitle>Hints</CardTitle>
          <CardDescription>
            Helpful hints that players can access when they're stuck
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(levelData.hints || []).map((hint, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-700 rounded text-xs text-blue-200 mt-2">
                ?
              </div>
              <div className="flex-1">
                <Textarea
                  value={hint}
                  onChange={(e) => handleHintChange(index, e.target.value)}
                  placeholder={`Hint ${index + 1}...`}
                  rows={2}
                  className="resize-none"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveHint(index)}
                className="mt-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <Button
            onClick={handleAddHint}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hint
          </Button>
          
          <div className="text-sm text-gray-400">
            <p><strong>Hint Guidelines:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Start with general hints and get more specific</li>
              <li>Don't give away the solution directly</li>
              <li>Guide players to think about the problem differently</li>
              <li>Consider common mistakes players might make</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructionsForm;
