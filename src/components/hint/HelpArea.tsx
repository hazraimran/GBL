import React, {useState} from "react";

type HelpAreaProps = {
    children: React.ReactNode;
    Trigger: React.ElementType;
    className?: string;
};

const HelpArea = ({children, Trigger, className}: HelpAreaProps) => {
    
  const [showInfo, setShowInfo] = useState(false);
    const handleBackgroundClick = () => {
        
          setShowInfo(!showInfo);
    };
    
    return (
      <div >
        <div onClick={handleBackgroundClick}>
          <Trigger />
        </div>
        
        {showInfo && <div
          className={`${className} fixed flex flex-row justify-evenly gap-2 items-center select-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl `}
          style={{
              opacity: 1,
              pointerEvents: 'auto',
              width: '60vw',
            height: '50vh',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        
        <div className='w-[30rem] p-6 grow-1 flex flex-col gap-16 justify-center items-center z-[102] text-3xl'>
          {children}
        </div>

        {/* Dismiss text at the bottom of the modal */}
        <div onClick={handleBackgroundClick} className="absolute bottom-3 left-0 right-0 text-center text-white text-2xl opacity-70">
            Click here to dismiss
        </div>

        <img className='w-[20rem] z-[102]' src='/guide_read.webp' />
      </div>}
    </div>
    );
};

export default HelpArea;