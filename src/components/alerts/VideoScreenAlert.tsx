import React from "react";
import Swal from "sweetalert2";
import { HelpCircle, Play } from "lucide-react";


interface VideoScreenAlertProps {
    textHtml: string;
    actionText: string;
    title: string;
    icon?: string;
}

export default function VideoScreenAlert({textHtml, actionText, title, icon }: VideoScreenAlertProps) {

  const handleClick = () => {
    const videoElement = document.createElement('video');
    videoElement.src = `/videos/${actionText}.mov`;

    videoElement.onloadeddata = () => {
      Swal.fire({
        title: title,
        html: textHtml,
        padding: "3em", 
        width: "80vw",
        showConfirmButton: true,
        confirmButtonText: "Close",
        customClass: {
          confirmButton: 'bg-red-500 min-w-[200px] min-h-[50px] rounded-lg',
          actions: 'absolute top-0 right-0'
        },
        animation: false,
      });
    };

    videoElement.onerror = () => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to load video',
        icon: 'error'
      });
    };
  };

    return (
        
            <button 
                  className="w-fit flex items-center px-4 gap-2 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleClick}
            >
              <span className="flex items-center">
                {icon === 'help' ? <HelpCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </span>
              <span className="whitespace-nowrap">{actionText}</span>
            </button>
        
    );
}