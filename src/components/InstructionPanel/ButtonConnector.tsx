import React, { useRef, useEffect, RefObject } from 'react';

interface Position {
    x: number;
    y: number;
}

interface ConnectorProps {
    startRef: RefObject<HTMLElement>;
    endRef: RefObject<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
}

const ButtonConnector: React.FC<ConnectorProps> = ({
    startRef,
    endRef,
    className = "",
    style = {}
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();

    const getRefRightCenter = (ref: RefObject<HTMLElement>): Position | null => {
        const element = ref.current;
        if (!element) return null;

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
        const controlX = Math.max(startX, endX) + 100;
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
        const arrowLength = 12;
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

        const startPos = getRefRightCenter(startRef);
        const endPos = getRefRightCenter(endRef);

        if (startPos && endPos) {
            drawCurvedLine(ctx, startPos.x, startPos.y, endPos.x, endPos.y);
        }

        animationFrameRef.current = requestAnimationFrame(drawCanvas);
    };

    useEffect(() => {
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
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 ${className}`}
            style={{ ...style, pointerEvents: 'none' }}
        />
    );
};

export default ButtonConnector;