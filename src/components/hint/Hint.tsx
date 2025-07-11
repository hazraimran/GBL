import React, { useState, useEffect, useContext } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import GameContext from '../../context/GameContext';
import { commandDescriptions } from '../../data';
import { LevelInfo } from '../../types/level';

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
import { Coins, Lightbulb, ChevronLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useGameStorage } from "../../hooks/useStorage/useGameStorage";

interface SmartHintSystemProps {
    level: LevelInfo;
    currentCode: string[];
    apiKeys: {
        anthropic?: string;
    };
    useHint?: boolean;
    onCodeSuggestion?: (code: string) => void;
}

import TypingDialog from '../TypingDialog';

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
        isAiHelperON,
    } = useContext(GameContext);

    // Analytics tracking
    let analytics;
    try {
        analytics = useAnalytics();
    } catch {
        // Analytics not available (e.g., outside of AnalyticsProvider)
        analytics = null;
    }

    // State
    const [hintService, setHintService] = useState<HintService | null>(null);
    const [loading, setLoading] = useState(false);
    const [hint, setHint] = useState<string>('');
    const [hintLevel, setHintLevel] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(useHint);
    const { coins, getCoins, addCoins, removeCoins } = useGameStorage();

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


    const getHint = () => {
        // Start hint timer for analytics
        if (analytics) {
            analytics.startHintTimer();
        }
        
        if (level.hints && level.hints.length > 0) {
            setHint(level.hints[hintLevel - 1]);
            setHintLevel(prev => prev + 1);
            removeCoins(1);
            
            // Track hint usage in analytics
            if (analytics) {
                analytics.endHintTimer();
            }
        } else {
            setHint('No hints available');
            setHintLevel(3);
        }
    }

    // Reset hints function
    const resetHints = () => {
        setHint('');
        setHintLevel(1);
        setError(null);
    };

    const earnCoins = () => {
        setHint("You can earn 1 coin by completing a level. You can revisit previous levels to earn more coins.")
        
    }

    // Click handler for background
    const handleBackgroundClick = () => {
        if (!showOpenningInstruction) {
            setShowInfo(false);
            setShowHint(false);
        }
    };

    return (showInfo || (showOpenningInstruction && isAiHelperON)) && (
        <div
            className={`flex  h-3/4 md:h-full p-4 top-0 left-0 right-0 bottom-0 m-auto flex-row justify-center items-center select-none fixed z-[1000] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl`}
            style={{
                opacity: 1,
                pointerEvents: 'auto',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={handleBackgroundClick}
        >
            {showOpenningInstruction ? (
                <TypingDialog />
            ) : (
                !showHint && (
                    <>
                        <div className='w-[20rem] p-6 flex flex-col gap-16 justify-center items-center z-[102] text-3xl'>
                            <button
                                className='z-[102] w-full text-center rounded px-4 py-2 bg-white hover:scale-105 transition-all rotate-6'
                                onClick={() => {
                                    setShowInfo(false);
                                    setShowOpenningInstruction(true);
                                }}
                            >
                                Say Hello Again!
                                <div className='absolute top-[10px] -right-[10px] w-0 h-0 border-l-white border-l-[12px] border-t-8 border-t-transparent border-b-8 border-b-transparent'></div>
                            </button>
                            <button
                                className='z-[102] w-full text-center rounded px-4 py-2 bg-white hover:scale-105 transition-all -rotate-6'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHint(true);
                                }}
                            >
                                Buy a hint!
                                <div className='absolute top-[10px] -right-[10px] w-0 h-0 border-l-white border-l-[12px] border-t-8 border-t-transparent border-b-8 border-b-transparent'></div>
                            </button>
                        </div>
                    </>
                )
            )}

            {showHint && (
                <Card className=" h-2/3  z-[102]" onClick={(e) => e.stopPropagation()}>
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

                    <CardContent className='flex flex-col justify-end gap-4'>
                        {!hint && (
                            <>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p className="font-medium mb-2 text-lg">How hints work:</p>
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

                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p className="font-medium mb-2 text-lg">How to earn Coins:</p>
                                    {/* <ul className="space-y-2 text-sm">
                                    </ul> */}
                                    <p className="mt-2 text-sm text-gray-600">Click & Read the Below Resource would give you 1 coin</p>
                                </div>
                            </>
                        )}

                        {hint && (
                            <Alert className={`max-h-[17rem] overflow-auto ${hintLevel > 2 ? "border-destructive" : ""}`}>
                                <AlertTitle>{(hintLevel - 1 ?"Hint Level" : "Get more Coins")} {hintLevel - 1}</AlertTitle>
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

                        <div className="flex justify-between gap-2 flex-row-reverse">
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
                                        {!hint ? 'Purchase Hint' : 'Tell me more! (-1 coin)'}
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
                                    <ChevronLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            )}
                            {!hint && (
                                <Button
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        earnCoins();
                                    }}
                                    disabled={loading}
                                    className="flex items-center gap-2"
                                >
                                    <Coins className="h-5 w-5 text-yellow-400" />

                                    Earn Coins!
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {!showOpenningInstruction && <img className='w-[20rem] z-[102]' src='/guide_speak1.webp' />}
                  {/* Dismiss text at the bottom of the modal */}
                <div className="absolute bottom-3 left-0 right-0 text-center text-white text-xs opacity-70">
                    Click anywhere on modal to dismiss
                </div>
        </div>
    );
};

export default SmartHintSystem;