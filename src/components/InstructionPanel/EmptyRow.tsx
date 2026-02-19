import React, { forwardRef } from 'react';
import { CommandWithArgType } from '../../types/game';
import { cn } from "@/lib/utils";

interface EmptyRowProps {
    commandsUsed: CommandWithArgType[];
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const EmptyRow = forwardRef<HTMLDivElement, EmptyRowProps>((props, ref) => {
    const { commandsUsed, onDrop } = props;

    return (
        <div>
            {commandsUsed.length === 0 ? (
                <div className="flex h-[6rem] items-center justify-center p-4 rounded-lg bg-secondary/40"
                    ref={ref}    
                    onDrop={(e) => onDrop(e)}
                    onDragOver={(e) => { 
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    onDragEnter={(e) => e.preventDefault()}
                >
                    <p className="text-gray-500">Drag and drop commands here</p>
                </div>
            ) : <div className={cn(
                "flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group relative",
                // isOver ? "bg-secondary/80 border-t-2 border-primary" : "bg-secondary/40",
                "hover:bg-secondary/60"
            )}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault() }}
            >
                <span className="min-w-8 h-8 flex items-center justify-center rounded-full text-primary font-medium">
                    {commandsUsed.length + 1}{'.'}
                </span>

                <span className='text-primary pl-2'>
                    {'  .......'}
                </span>
            </div>}

        </div>
    )
});

export default EmptyRow;