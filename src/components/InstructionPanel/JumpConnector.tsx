import React, { useContext, useRef, useEffect } from 'react';
import GameContext from '../../context/GameContext';

interface Connection {
    start: HTMLElement;
    end: HTMLElement;
}

const JumpConnector: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    const { connection: connections, currentScene } = useContext(GameContext);

    const getElementRightCenter = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.right,
            y: rect.top + rect.height / 2
        };
    };

    

    const drawCurvedLine = (
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        endX: number,
        endY: number
    ) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        const midY = (startY + endY) / 2;
        const controlX = Math.max(startX, endX) + 50;
        const controlY = midY;

        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();

        const t = 0.95;
        const angle = Math.atan2(
            endY - (Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY),
            endX - (Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX)
        );

        drawArrow(ctx, endX, endY, angle);
    };

    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        angle: number
    ) => {
        const arrowLength = 8;
        const arrowWidth = Math.PI / 6;

        ctx.beginPath();
        ctx.moveTo(
            x - arrowLength * Math.cos(angle - arrowWidth),
            y - arrowLength * Math.sin(angle - arrowWidth)
        );
        ctx.lineTo(x, y);
        ctx.lineTo(
            x - arrowLength * Math.cos(angle + arrowWidth),
            y - arrowLength * Math.sin(angle + arrowWidth)
        );
        ctx.closePath();
        ctx.fill();
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2563eb';
        ctx.fillStyle = '#2563eb';
        ctx.lineWidth = 2;

        connections.forEach(connection => {
            const startPos = getElementRightCenter(connection.start);
            const endPos = getElementRightCenter(connection.end);
            drawCurvedLine(ctx, startPos.x, startPos.y, endPos.x, endPos.y);
        });

        animationFrameRef.current = requestAnimationFrame(drawCanvas);
    };

    useEffect(() => {
        console.log('connection changed', connections)
        drawCanvas();

        const handleResize = () => {
            drawCanvas();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [connections]);

    return currentScene === 'GAME' &&
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-[100vw] h-[100vh] pointer-events-none`}
            style={{ zIndex: 0 }}
        />
};

export default JumpConnector;