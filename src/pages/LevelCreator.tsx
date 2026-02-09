import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LevelInfo } from '../types/level';
import { LevelCreatorService } from '../services/firestore/levelCreatorService';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Save, Play, AlertCircle, CheckCircle, Settings } from 'lucide-react';

// Import form components (we'll create these next)
import BasicInfoForm from '../components/levelCreator/BasicInfoForm';
import CommandsForm from '../components/levelCreator/CommandsForm';
import GeneratorForm from '../components/levelCreator/GeneratorForm';
import LearningOutcomesForm from '../components/levelCreator/LearningOutcomesForm';
import InstructionsForm from '../components/levelCreator/InstructionsForm';
import MetricsForm from '../components/levelCreator/MetricsForm';
import LevelPreview from '../components/levelCreator/LevelPreview';
import LevelsList from '../components/levelCreator/LevelsList';

const LevelCreator: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Level data state
  const [levelData, setLevelData] = useState<Partial<LevelInfo>>({
    id: 1,
    visible: true,
    title: '',
    description: '',
    learningOutcome: {
      concept: '',
      descr: '',
      why: '',
      how: ''
    },
    generatorFunction: '',
    outputFunction: '',
    commands: [],
    commandsToUse: [],
    commandsUsed: [],
    constructionSlots: [],
    expectedCommandCnt: 0,
    expectedExecuteCnt: 0,
    executeCnt: -1,
    commandCountAchievement: null,
    executeCountAchievement: null,
    isLocked: false,
    timeSpent: 0,
    timeAccessed: 0,
    openningInstruction: [],
    hints: []
  });

  // Load next available ID on mount
  useEffect(() => {
    const loadNextId = async () => {
      try {
        const nextId = await LevelCreatorService.getNextLevelId();
        setLevelData(prev => ({ ...prev, id: nextId }));
      } catch (error) {
        console.error('Error loading next ID:', error);
      }
    };
    loadNextId();
  }, []);

  // Validate level data whenever it changes
  useEffect(() => {
    const validation = LevelCreatorService.validateLevel(levelData);
    setValidationErrors(validation.errors);
    setIsValid(validation.valid);
  }, [levelData]);


  const handleSave = async () => {
    if (!isValid) {
      setActiveTab('basic');
      return;
    }

    setIsLoading(true);
    try {
      const levelId = levelData.id!;
      const levelExists = await LevelCreatorService.levelExists(levelId);
      
      if (levelExists) {
        // Update existing level
        await LevelCreatorService.updateLevel(levelId, levelData as LevelInfo);
        alert('Level updated successfully!');
      } else {
        // Create new level
        await LevelCreatorService.createLevel(levelData as LevelInfo);
        alert('Level created successfully!');
        // Reset form only when creating a new level
        const nextId = await LevelCreatorService.getNextLevelId();
        setLevelData(prev => ({ ...prev, id: nextId, title: '', description: '' }));
      }
    } catch (error) {
      console.error('Error saving level:', error);
      alert('Failed to save level. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = () => {
    if (!isValid) {
      setActiveTab('basic');
      return;
    }
    setShowPreview(true);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 text-gray-900 z-[9999]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Level Creator</h1>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/settings')}
              className="text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleTest}
              disabled={!isValid}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Test Level
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValid || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Level'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex h-full">
        {/* Left Side - Validation Errors */}
        <div className="w-1/3 p-4 border-r border-gray-200 overflow-y-auto bg-white">
          {validationErrors.length > 0 ? (
            <Alert className="border-red-300 bg-red-50 h-fit">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <div className="font-semibold mb-2 text-red-800">Please fix the following errors:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="text-center text-gray-600 mt-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">No validation errors</p>
              <p className="text-sm">All required fields are properly filled</p>
            </div>
          )}
        </div>

        {/* Right Side - Main Content */}
        <div className="w-2/3 p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-100 border border-gray-200">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="generators">Generators</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <BasicInfoForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="commands" className="mt-6">
            <CommandsForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <GeneratorForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <LearningOutcomesForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="instructions" className="mt-6">
            <InstructionsForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="metrics" className="mt-6">
            <MetricsForm
              levelData={levelData}
              onChange={setLevelData}
            />
          </TabsContent>

          <TabsContent value="manage" className="mt-6">
            <LevelsList
              onEdit={(level) => {
                setLevelData(level);
                setActiveTab('basic');
              }}
            />
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Level Preview Modal */}
      {showPreview && (
        <LevelPreview
          levelData={levelData as LevelInfo}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default LevelCreator;
