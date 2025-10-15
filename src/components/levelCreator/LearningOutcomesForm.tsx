import React from 'react';
import { LevelInfo } from '../../types/level';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface LearningOutcomesFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const LearningOutcomesForm: React.FC<LearningOutcomesFormProps> = ({ levelData, onChange }) => {
  const handleLearningOutcomeChange = (field: keyof LevelInfo['learningOutcome'], value: string) => {
    const currentLearningOutcome = levelData.learningOutcome || {
      concept: '',
      descr: '',
      why: '',
      how: ''
    };
    
    onChange({
      ...levelData,
      learningOutcome: {
        ...currentLearningOutcome,
        [field]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Outcomes</CardTitle>
        <CardDescription>
          Define the educational concepts and learning objectives for this level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Concept */}
        <div className="space-y-2">
          <Label htmlFor="concept">Concept</Label>
          <Input
            id="concept"
            value={levelData.learningOutcome?.concept || ''}
            onChange={(e) => handleLearningOutcomeChange('concept', e.target.value)}
            placeholder="e.g., Loops, Conditionals, Variables"
            className="text-lg"
          />
          <div className="text-sm text-gray-400">
            {levelData.learningOutcome?.concept?.length || 0} characters
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="descr">Description</Label>
          <Textarea
            id="descr"
            value={levelData.learningOutcome?.descr || ''}
            onChange={(e) => handleLearningOutcomeChange('descr', e.target.value)}
            placeholder="Brief description of the concept being taught"
            rows={3}
            className="resize-none"
          />
          <div className="text-sm text-gray-400">
            {levelData.learningOutcome?.descr?.length || 0} characters
          </div>
        </div>

        {/* Why It Matters */}
        <div className="space-y-2">
          <Label htmlFor="why">Why It Matters</Label>
          <Textarea
            id="why"
            value={levelData.learningOutcome?.why || ''}
            onChange={(e) => handleLearningOutcomeChange('why', e.target.value)}
            placeholder="Explain why this concept is important in programming and problem-solving"
            rows={4}
            className="resize-none"
          />
          <div className="text-sm text-gray-400">
            {levelData.learningOutcome?.why?.length || 0} characters
          </div>
        </div>

        {/* How This Level Teaches It */}
        <div className="space-y-2">
          <Label htmlFor="how">How This Level Teaches It</Label>
          <Textarea
            id="how"
            value={levelData.learningOutcome?.how || ''}
            onChange={(e) => handleLearningOutcomeChange('how', e.target.value)}
            placeholder="Describe how this specific level helps students learn the concept"
            rows={4}
            className="resize-none"
          />
          <div className="text-sm text-gray-400">
            {levelData.learningOutcome?.how?.length || 0} characters
          </div>
        </div>

        {/* Guidelines */}
        <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Writing Guidelines:</h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• <strong>Concept:</strong> Keep it concise and specific (1-3 words)</li>
            <li>• <strong>Description:</strong> Brief overview of what the concept is</li>
            <li>• <strong>Why It Matters:</strong> Explain the real-world importance and applications</li>
            <li>• <strong>How This Level Teaches It:</strong> Be specific about the learning mechanics in this level</li>
            <li>• Use clear, student-friendly language</li>
            <li>• Focus on practical applications and problem-solving</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningOutcomesForm;
