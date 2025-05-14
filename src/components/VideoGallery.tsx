import React , {useCallback, useContext, useEffect} from 'react';
import VideoScreenAlert from './alerts/VideoScreenAlert';
import { commandDescriptions } from '../data';
import GameContext from '../context/GameContext';

const VideoGallery = () => {
    const { levelInfo } = useContext(GameContext);

  
    const actions = levelInfo?.commands?? Object.keys(commandDescriptions);
    //Preload videos

    const preloadVideos = useCallback(() => {
      console.log("preloading videos");
        actions.forEach((action) => {
            const video = document.createElement('video');
            video.src = `/videos/${action}.mov`;
            // Need to trigger loading by starting to load the video
            video.load();
        });
    }, [actions]);

    useEffect(() => {
        preloadVideos();
    }, [preloadVideos]);

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
