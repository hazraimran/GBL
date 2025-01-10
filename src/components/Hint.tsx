import GameContext from '../context/GameContext';

// src/types/index.ts
export type Level = {
    id: string;
    title: string;
    description: string;
    commands: string[];
    goal: string;
    input: number[];
    expectOutput: number[];
};

export type ModelConfig = {
    provider: 'anthropic' | 'openai';
    model: string;
    apiKey: string;
};

export type ModelOption = {
    id: string;
    name: string;
    provider: 'anthropic' | 'openai';
    model: string;
    maxTokens: number;
    description: string;
};

// src/config/modelOptions.ts
export const MODEL_OPTIONS: ModelOption[] = [
    {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        maxTokens: 1000,
        description: 'Latest Claude model, balanced performance'
    },
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        model: 'claude-3-opus-20240229',
        maxTokens: 1000,
        description: 'Most capable Claude model'
    },
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'openai',
        model: 'gpt-4',
        maxTokens: 1000,
        description: 'OpenAI GPT-4 model'
    },
];

// src/services/HintService.ts
import Anthropic from '@anthropic-ai/sdk';
// import type { ModelConfig } from '../types';

export class HintService {
    private anthropicClient: Anthropic;

    constructor(private config: ModelConfig) {
        this.anthropicClient = new Anthropic({
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async getHint(prompt: string, maxTokens: number = 1000): Promise<string> {
        const completion = await this.anthropicClient.messages.create({
            model: this.config.model,
            max_tokens: maxTokens,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });
        return completion.content[0].text;
    }
}

// src/utils/promptBuilder.ts
export function buildPrompt(
    code: string[],
    currentHintLevel: number,
    level: Level
): string {
    const commandDescriptions = {
        "INPUT": "Take a number from the input belt into your hands",
        "OUTPUT": "Put the number in your hands onto the output belt",
        "JUMP": "Jump to the specified label and continue execution",
        "COPYFROM": "Copy a number from a floor tile into your hands",
        "COPYTO": "Copy the number in your hands to a floor tile",
        "ADD": "Add the number from a floor tile to the number in your hands",
        "JUMP = 0": "Jump to the specified label if the number in your hands is 0",
        "SUB": "Subtract the number from a floor tile from the number in your hands"
    };

    return `You are helping a player solve a programming puzzle in a game similar to "Human Resource Machine". This is an educational programming game where players write assembly-style programs to solve puzzles.

Game Mechanics:
- The player acts as an office worker carrying one number at a time
- Numbers come from an INPUT conveyor belt
- Numbers must be delivered to an OUTPUT conveyor belt
- Memory slots (floor tiles) are numbered 0, 1, 2, etc.
- The program runs in a loop until all inputs are processed

Available Commands:
${Object.entries(commandDescriptions)
            .map(([cmd, desc]) => `- ${cmd}: ${desc}`)
            .join('\n')}

Current Level:
Title: ${level.title}
Description: ${level.description}
Goal: ${level.goal}
Sample Input: ${level.input.join(', ')}
Expected Output: ${level.expectOutput.join(', ')}

Player's Current Code:
${code.join('\n')}

Based on hint level (${currentHintLevel}/3), provide appropriate help:

${currentHintLevel === 1 ?
            `Level 1 - Gentle Guidance:
    - Give a high-level strategy hint
    - Point out what patterns they should notice
    - Don't reveal specific commands or solutions
    - Focus on the problem-solving approach`
            : currentHintLevel === 2 ?
                `Level 2 - Specific Suggestions:
    - Analyze their current code
    - Point out potential issues
    - Suggest which commands would be useful
    - Provide a partial example if necessary
    - Don't give the complete solution`
                :
                `Level 3 - Complete Solution:
    1. Explain the solution strategy
    2. Provide complete code marked with <code> tags
    3. Explain how the code works step by step
    Make sure to include any necessary labels for JUMP commands.`
        }

Remember:
- Each command operates on one number at a time
- The worker can only hold one number at a time
- The program should work for any valid input sequence
- Consider the sample input/output for testing`;
}

// src/components/SmartHintSystem.tsx
import React, { useState, useEffect, useContext } from 'react';
import { Coins, Lightbulb, ChevronRight, RotateCcw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface SmartHintSystemProps {
    level: Level;
    currentCode: string[];
    apiKeys: {
        anthropic?: string;
    };
    useHint?: boolean;
    onCodeSuggestion?: (code: string) => void;
}

import TypingDialog from './TypingDialog';

const SmartHintSystem: React.FC<SmartHintSystemProps> = ({
    level,
    currentCode,
    apiKeys,
    useHint = false,
    onCodeSuggestion
}) => {
    // Context
    const {
        showInfo,
        setShowInfo,
        showOpenningInstruction,
        setShowOpenningInstruction,
        coins,
        setCoins
    } = useContext(GameContext);

    // State
    const [hintService, setHintService] = useState<HintService | null>(null);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState<string>('');
    const [hintLevel, setHintLevel] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(useHint);

    // Hint descriptions
    const hintDescriptions = {
        1: "A gentle nudge in the right direction",
        2: "More specific guidance with code suggestions",
        3: "Complete solution with detailed explanation"
    };

    // Initialize hint service
    useEffect(() => {
        if (apiKeys.anthropic) {
            const service = new HintService({
                provider: 'anthropic',
                model: 'claude-3-sonnet-20240229',
                apiKey: apiKeys.anthropic
            });
            setHintService(service);
        }
    }, [apiKeys]);

    // Extract code suggestion from AI response
    const extractCodeSuggestion = (content: string): string | undefined => {
        const match = content.match(/<code>([\s\S]+?)<\/code>/);
        return match?.[1]?.trim();
    };

    // Get hint function
    const getHint = async () => {
        if (!hintService) {
            setError('Hint service not initialized');
            return;
        }

        if (coins <= 0) {
            setError('Not enough coins!');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const content = await hintService.getHint(
                buildPrompt(currentCode, hintLevel, level),
                1000
            );

            const suggestedCode = extractCodeSuggestion(content);
            const cleanHint = content.replace(/<code>[\s\S]+?<\/code>/g, '').trim();

            setHint(cleanHint);
            setCoins(coins - 1);
            // setCoins((prevCoins: number) => prevCoins - 1);

            if (suggestedCode && onCodeSuggestion && hintLevel === 3) {
                onCodeSuggestion(suggestedCode);
            }

            setHintLevel(prev => Math.min(prev + 1, 3));
        } catch (err) {
            console.error('Error getting hint:', err);
            setError(err instanceof Error ? err.message : 'Failed to get hint');
        } finally {
            setLoading(false);
        }
    };

    // Reset hints function
    const resetHints = () => {
        setHint('');
        setHintLevel(1);
        setError(null);
    };

    // Click handler for background
    const handleBackgroundClick = () => {
        if (!showOpenningInstruction) {
            setShowInfo(false);
            setShowHint(false);
        }
    };

    return (showInfo || showOpenningInstruction) && (
        <div
            className='relative h-[100vh] w-[100vw] top-0 bg-black bg-opacity-80 z-[100] flex flex-row justify-center items-center select-none'
            onClick={handleBackgroundClick}
        >
            {showOpenningInstruction ? (
                <TypingDialog />
            ) : (
                !showHint && (
                    <div className='w-[20rem] p-6 flex flex-col gap-16 justify-center items-center z-[102] text-3xl'>
                        <button
                            className='z-[102] w-full text-center rounded px-4 py-2 hover:scale-105 transition-all rotate-6'
                            onClick={() => {
                                setShowInfo(false);
                                setShowOpenningInstruction(true);
                            }}
                        >
                            Say Hello Again!
                            <div className='absolute top-[10px] -right-[10px] w-0 h-0 border-l-white border-l-[12px] border-t-8 border-t-transparent border-b-8 border-b-transparent'></div>
                        </button>
                        <button
                            className='z-[102] w-full text-center rounded px-4 py-2 hover:scale-105 transition-all -rotate-6'
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowHint(true);
                            }}
                        >
                            Buy a hint!
                            <div className='absolute top-[10px] -right-[10px] w-0 h-0 border-l-white border-l-[12px] border-t-8 border-t-transparent border-b-8 border-b-transparent'></div>
                        </button>
                    </div>
                )
            )}

            {showHint && (
                <Card className="w-full max-w-2xl z-[102]" onClick={(e) => e.stopPropagation()}>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb />

                                <span className="text-xl font-bold">
                                    Need some help? That'll cost ya!
                                </span>
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Coins className="h-5 w-5 text-yellow-400" />
                                <span className="font-bold">{coins} coins remaining</span>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* {!hint && ( */}
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <p className="font-medium mb-2">How hints work:</p>
                            <ul className="space-y-2 text-sm">
                                {Object.entries(hintDescriptions).map(([level, desc]) => (
                                    <li key={level} className="flex items-center gap-2">
                                        <span className="font-bold">Level {level}:</span>
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2 text-sm text-gray-600">Each hint costs 1 coin - spend them wisely!</p>
                        </div>
                        {/* )} */}

                        {hint && (
                            <Alert className={`max-h-[24rem] overflow-auto ${hintLevel > 2 ? "border-destructive" : ""}`}>
                                <AlertTitle>Hint Level {hintLevel - 1}</AlertTitle>
                                <AlertDescription className="mt-2 whitespace-pre-wrap">
                                    {hint}
                                </AlertDescription>
                            </Alert>
                        )}

                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-between gap-2">
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    getHint();
                                }}
                                disabled={loading || hintLevel > 3 || coins <= 0}
                                className="flex items-center gap-2"
                                variant={hintLevel > 2 ? "destructive" : "default"}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Generating hint...
                                    </>
                                ) : (
                                    <>
                                        {!hint ? 'Purchase Hint' : 'Tell me more!'}
                                        {/* <ChevronRight className="h-4 w-4" /> */}
                                    </>
                                )}
                            </Button>

                            {hint && (
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetHints();
                                    }}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!showOpenningInstruction && <img className='w-[20rem] z-[102]' src='/guide_speak1.webp' />}
        </div>
    );
};

export default SmartHintSystem;