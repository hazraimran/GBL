import React, { useCallback } from "react";
import { VolumeOff, Volume2 } from "lucide-react";
import { useGameStorage } from "../../hooks/useStorage/useGameStorage";

const SilentButton = () => {

    const { setMuteState, getMuteState } = useGameStorage();
    const muted = getMuteState();

    const handleToggleMute = useCallback(() => {
      setMuteState(!muted);
    }, [muted]);

    return (
      <div className="fixed bottom-0 left-[8rem] bg-custom-bg rounded-lg">
          <button
              className="flex items-center justify-center"
              onClick={handleToggleMute}
          >
              {muted ?
                  <VolumeOff className="w-[7rem] h-[4rem] text-yellow-600" /> :
                  <Volume2 className="w-[7rem] h-[4rem] text-yellow-600" />
              }
          </button>
      </div>
    )
}

export default SilentButton;