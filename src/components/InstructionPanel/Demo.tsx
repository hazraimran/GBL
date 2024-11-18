import React, { useRef, useState, useEffect } from 'react';
import ButtonConnector from './ButtonConnector';

const FullscreenDemo = () => {
    const button1Ref = useRef<HTMLButtonElement>(null);
    const button2Ref = useRef<HTMLButtonElement>(null);
    const [button1Pos, setButton1Pos] = useState({ x: 100, y: 100 });
    const [button2Pos, setButton2Pos] = useState({ x: 100, y: 300 });
    const [draggedButton, setDraggedButton] = useState<'button1' | 'button2' | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseDown = (
        e: React.MouseEvent,
        button: 'button1' | 'button2',
        currentPos: { x: number; y: number }
    ) => {
        e.preventDefault();
        setDraggedButton(button);
        setDragStart({
            x: e.clientX - currentPos.x,
            y: e.clientY - currentPos.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggedButton && dragStart) {
            const newX = Math.max(0, Math.min(e.clientX - dragStart.x, windowSize.width - 100));
            const newY = Math.max(0, Math.min(e.clientY - dragStart.y, windowSize.height - 40));

            if (draggedButton === 'button1') {
                setButton1Pos({ x: newX, y: newY });
            } else {
                setButton2Pos({ x: newX, y: newY });
            }
        }
    };

    const handleMouseUp = () => {
        setDraggedButton(null);
        setDragStart(null);
    };

    return (
        <div
            className="fixed inset-0 bg-gray-50"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <ButtonConnector
                startRef={button1Ref}
                endRef={button2Ref}
                className="absolute inset-0"
            />

            <button
                ref={button1Ref}
                style={{
                    position: 'absolute',
                    left: `${button1Pos.x}px`,
                    top: `${button1Pos.y}px`,
                    cursor: draggedButton === 'button1' ? 'grabbing' : 'grab',
                    zIndex: 10,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'button1', button1Pos)}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded select-none shadow-lg"
            >
                Button 1
            </button>

            <button
                ref={button2Ref}
                style={{
                    position: 'absolute',
                    left: `${button2Pos.x}px`,
                    top: `${button2Pos.y}px`,
                    cursor: draggedButton === 'button2' ? 'grabbing' : 'grab',
                    zIndex: 10,
                }}
                onMouseDown={(e) => handleMouseDown(e, 'button2', button2Pos)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded select-none shadow-lg"
            >
                Button 2
            </button>
        </div>
    );
};

export default FullscreenDemo;