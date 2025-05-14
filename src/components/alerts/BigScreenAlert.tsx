import React from "react";
import Swal from "sweetalert2";


interface BigScreenAlertProps {
    imageUrl: string;
    title: string;
}

export default function BigScreenAlert({ imageUrl, title }: BigScreenAlertProps) {

  const handleClick = () => {
    console.log("clicked");
    Swal.fire({
      title: title,
      padding: "3em",
      margin: "10px",
      grow: "fullscreen",
      showConfirmButton: true,
      confirmButtonText: "Close",
      allowOutsideClick: true,
      allowEscapeKey: true,
      background: `#fff url(${imageUrl}) center center/cover no-repeat`,
      customClass: {
        confirmButton: 'bg-red-500 min-w-[200px] min-h-[50px] rounded-lg',
        actions: 'absolute bottom-0 right-0'
      },
    });
  };

    return (
        
            <button 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                onClick={handleClick}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                Help
            </button>
        
    );
}