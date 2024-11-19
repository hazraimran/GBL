import React, { useEffect, forwardRef } from 'react';
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

    const handleDragEnd = () => {
        setDragging(false);
    }

    return value.command === "" ? (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`px-2 py-1 w-8 h-8 bg-primary/20 hover:bg-primary/30 transition-colors text-black rounded-md ${isShaking && 'animate-wiggle'}
            hover:cursor-pointer ${dragging ? 'opacity-50' : ''}`}
        >
        </div>
    ) : (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`px-2 py-1 bg-primary/20 hover:bg-primary/30 transition-colors text-black rounded-md ${isShaking && 'animate-wiggle'}
             space-x-2 hover:cursor - pointer ${dragging ? 'opacity-50' : ''}`}
        >
            <span>{value.command}</span>
            {(typeof value.arg === 'number') && <span>{value.arg + 1}</span>}
        </div>
    )

});

Command.displayName = 'Command';

export default Command;
