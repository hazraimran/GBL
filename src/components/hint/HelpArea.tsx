import React, {useState} from "react";

type HelpAreaProps = {
    children: React.ReactNode;
    Trigger: React.ElementType;
    disableClose?: boolean;
};

const HelpArea = ({children, Trigger, disableClose}: HelpAreaProps) => {
    
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
          className={`flex flex-row justify-center gap-20 items-center select-none fixed z-[1000] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl`}
          style={{
              opacity: 1,
              pointerEvents: 'auto',
              top: '25vh',
              left: '20vw',
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