import React, { useCallback } from "react";
import { VolumeOff, Volume2 } from "lucide-react";
import { useGameStorage } from "../../hooks/useStorage/useGameStorage";
import AlertButton from "./AlertButton";

const SilentButton = () => {

    const { setMuteState, getMuteState } = useGameStorage();
    const muted = getMuteState();

    const handleToggleMute = useCallback(() => {
      setMuteState(!muted);
    }, [muted]);

    return (

        <AlertButton 
            onClick={handleToggleMute} 
            title="Toggle Mute" 
            Icon={muted ? VolumeOff : Volume2} 
            colorIcon="yellow-600" 
            position="bottom-0 left-[8rem]" 
        />
      
    )
}

export default SilentButton;