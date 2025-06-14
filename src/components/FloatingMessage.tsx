// FloatingMessage.tsx
import React, {useState} from 'react';

interface FloatingMessageProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    animationDuration?: number;
    arrowOffset?: number;
    arrowDirection?: 'down' | 'right';
    hint?: boolean
    withCharacter?: boolean,
    setShowHint?: () => void,
    open?: boolean
}

const FloatingMessage: React.FC<FloatingMessageProps> = ({
    text,
    backgroundColor = '#b55440', // default red color
    textColor = 'black',
    animationDuration = 2,
    arrowOffset = 32, // default left-8 in pixels
    arrowDirection = 'down',
    hint = false,
    withCharacter = false,
    open = true,
    setShowHint,
    ...rest
}) => {

    const [visible, setVisible] = useState(open);

    const toggleVisible = () => {
        setVisible(!visible);
    }

    return (

        <div className="relative inline-block z-[100] cursor-pointer" {...rest} onClick={toggleVisible}>
            {/* Main message box */}
            <div
                className="px-6 py-3 rounded-lg shadow-lg animate-float"
                style={{
                    backgroundColor,
                    color: textColor,
                }}
            >
                <p className="text-lg font-medium">{visible ? text : 'View Hint'}</p>
                {hint && <div className="mt-4 cursor-pointer flex gap-4 items-center" onClick={setShowHint}>
                    Need more hints?<div className=' animate-float border-t-custom-green w-0 h-0 border-t-[12px] border-l-8 border-r-8 border-l-transparent border-r-transparent'></div>
                </div>}
            </div>

            {withCharacter}

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
                        }}
                    /> :
                    <div
                        className="absolute -right-4 top-4 animate-float"
                        style={{
                            borderTop: '12px solid transparent',
                            borderBottom: '12px solid transparent',
                            borderLeft: `16px solid ${backgroundColor}`,
                        }}
                    />
            }
        </div>
    );
};

export default FloatingMessage;