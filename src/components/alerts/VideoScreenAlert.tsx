import React from "react";
import Swal from "sweetalert2";


interface VideoScreenAlertProps {
    textHtml: string;
    actionText: string;
    title: string;
}

export default function VideoScreenAlert({textHtml, actionText, title }: VideoScreenAlertProps) {

  const handleClick = () => {
    Swal.fire({
      title:title,
      html: textHtml,
      padding: "3em",
      margin: "10px",
      // grow: "fullscreen",
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

    return (
        
            <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z" />
                </svg>
                {actionText}
            </button>
        
    );
}