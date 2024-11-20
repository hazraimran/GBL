import React, { useState, forwardRef } from 'react';
import { cn } from "@/lib/utils";
import { CommandWithArgType, CommandType } from '../../types/game';
import Command from './Command';
import { Button } from '../ui/button';
import { Eraser } from 'lucide-react';
import CircularJSON from 'circular-json';

interface CommandRowProps {
    command: CommandWithArgType;
    idx: number;
    insert: (command: CommandWithArgType, from: number | null, to: number) => void;
    onDelete?: (idx: number) => void;  // Add new prop for delete handling
}

const CommandRow = forwardRef<HTMLDivElement, CommandRowProps>((props, ref) => {
    const { command, idx, insert, onDelete } = props;
    const [isOver, setIsOver] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        let obj: CommandWithArgType = {
            command: e.dataTransfer.getData('command') as CommandType,
        }

        if (e.dataTransfer.getData('arg') !== '') {
            obj.arg = CircularJSON.parse(e.dataTransfer.getData('arg'));
        }

        let from = null;

        if (e.dataTransfer.getData('idx') !== '') {
            from = parseInt(e.dataTransfer.getData('idx'));
        }
        insert(obj, from, idx);
        setIsOver(false);
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete(idx);
        }
    }

    return (
        <div
            className={cn(
                "flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 group relative",
                // isOver ? "bg-secondary/80 border-t-2 border-primary" : "bg-secondary/40",
                "hover:bg-secondary/60"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <span className="min-w-8 h-8 flex items-center justify-center rounded-full text-primary font-medium">
                {idx + 1}{'.'}
            </span>
            <Command idx={idx} value={command} ref={ref} shaking={false} />

            {
                command && command.command !== "" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto hover:bg-destructive/20 hover:text-destructive"
                        onClick={handleDelete}
                    >
                        x
                        {/* <Eraser className="h-4 w-4 text-red-500" /> */}
                    </Button>
                )
            }


        </div>
    )
});

export default CommandRow;