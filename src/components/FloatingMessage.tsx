// FloatingMessage.tsx
import React from 'react';

interface FloatingMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    animationDuration?: number;
    arrowOffset?: number;
    arrowDirection?: 'down' | 'right';
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({
    text,
    backgroundColor = '#b55440', // default red color
    textColor = 'black',
    animationDuration = 2,
    arrowOffset = 32, // default left-8 in pixels
    arrowDirection = 'down',
    ...rest
}) => {
    return (
        <div className="relative inline-block z-[100]" {...rest}>
            {/* Main message box */}
            <div
                className="px-6 py-3 rounded-lg shadow-lg animate-float"
                style={{
                    backgroundColor,
                    color: textColor,
                    // animation: `float ${animationDuration}s ease-in-out infinite`
                }}
            >
                <p className="text-lg font-medium">{text}</p>
            </div>

            {/* Arrow */}
            {
                arrowDirection === 'down' ?
                    <div
                        className="absolute -bottom-4 w-0 h-0 animate-float"
                        style={{
                            left: `${arrowOffset}px`,
                            borderLeft: '12px solid transparent',
                            borderRight: '12px solid transparent',
                            borderTop: `16px solid ${backgroundColor}`,
                            // transform: 'rotate(-45deg)',
                            // animation: `float ${animationDuration}s ease-in-out infinite`
                        }}
                    /> :
                    <div
                        className="absolute -right-4 top-0 w-0 h-0 animate-float"
                        style={{
                            top: `${arrowOffset}px`,
                            borderTop: '12px solid transparent',
                            borderBottom: '12px solid transparent',
                            borderLeft: `16px solid ${backgroundColor}`,
                            // transform: 'rotate(-45deg)',
                            // animation: `float ${animationDuration}s ease-in-out infinite`
                        }}
                    />
            }
        </div>
    );
};

export default FloatingMessage;