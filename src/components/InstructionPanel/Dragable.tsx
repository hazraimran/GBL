import React, { useState } from 'react';

interface Position {
    x: number;
    y: number;
}

function DraggableElement() {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        console.log(e.clientX, e.clientY, 'start drag');
        e.dataTransfer.setData("text/plain", `${e.clientX - position.x},${e.clientY - position.y}`);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary for onDrop to fire
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const offset = e.dataTransfer.getData("text").split(",");
        const x = e.clientX - parseInt(offset[0], 10);
        const y = e.clientY - parseInt(offset[1], 10);
        setPosition({ x, y });
        console.log(e.clientX, e.clientY, 'drop');
        console.log(x, y, 'drop');
    };

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop} // Drop target
        >
            <div
                draggable="true"
                onDragStart={handleDragStart}
                style={{
                    width: 100,
                    height: 100,
                    backgroundColor: "skyblue",
                    position: "absolute",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: "move",
                }}
            >
                Drag me!
            </div>
        </div>
    );
}

export default DraggableElement;
