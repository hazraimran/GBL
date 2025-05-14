import React , {useContext} from 'react';
import VideoScreenAlert from './alerts/VideoScreenAlert';
import { commandDescriptions } from '../data';
import GameContext from '../context/GameContext';

const VideoGallery = () => {
    const { levelInfo } = useContext(GameContext);

    
    const actions = levelInfo?.commands?? Object.keys(commandDescriptions);
  
    return (
        <div className="flex flex-col items-center gap-4 p-4">
           <h2 className='text-3xl font-bold text-yellow-600'>Your Skills</h2>
            <div className="grid grid-cols-3 gap-4">
                {actions.map((action) => (
                    <VideoScreenAlert 
                        key={action}
                        title={action}
                        textHtml={`
                          <p>${commandDescriptions[action as keyof typeof commandDescriptions]}</p>
                          <video src="/videos/${action}.mov" autoplay loop muted playsinline></video>
                        `}
                        actionText={action}
                    />
                ))}
            </div>

        </div>
    );
};

export default VideoGallery;
