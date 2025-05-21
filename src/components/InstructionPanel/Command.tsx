import React, {forwardRef } from 'react';
import { CommandWithArgType } from '../../types/game';
import CircularJSON from 'circular-json';

interface DraggableItemProps {
    idx?: number
    value: CommandWithArgType;
    shaking: boolean;
}

const Command = forwardRef<HTMLDivElement, DraggableItemProps>((props, ref) => {
    const { idx, value, shaking } = props;
    const [dragging, setDragging] = React.useState(false);
    const [isShaking, setIsShaking] = React.useState(shaking);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        // Stop event propagation to prevent parent elements from becoming draggable
        e.stopPropagation();
        
        if (idx !== undefined) {
            e.dataTransfer.setData('idx', idx.toString());
        }
        e.dataTransfer.setData('command', value.command);
        if (value.arg) {
            e.dataTransfer.setData('arg', CircularJSON.stringify(value.arg));
        }

        setDragging(true);

        if (isShaking) {
            setIsShaking(false);
        }
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        // Stop event propagation
        e.stopPropagation();
        setDragging(false);
    }

    return value.command === "" ? (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`z-[100] px-2 py-1 w-8 h-8 bg-primary/5 hover:bg-primary/10 transition-colors text-black rounded-md ${isShaking && 'animate-wiggle'}
            cursor-pointer ${dragging ? 'opacity-50' : ''}`}
        >
        </div>
    ) : (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`flex flex-row justify-center items-center z-[100] px-2 py-1  hover:bg-primary/5 transition-colors text-black rounded-md ${isShaking && 'animate-wiggle'}
             space-x-2 cursor-pointer ${dragging ? 'opacity-50' : ''}`}
        >
            <span className='pt-[0.2rem]'>{value.command}</span>
            {(typeof value.arg === 'number') && <span className=' text-center text-orange-500 text-xl bg-amber-200 rounded w-6 h-6 '>{value.arg + 1}</span>}
        </div>
    )

});

Command.displayName = 'Command';

export default Command;
