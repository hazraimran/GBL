import React from "react";
import { TooltipTrigger } from "../ui/tooltip"
import { TooltipContent } from "../ui/tooltip"
import { Tooltip } from "../ui/tooltip"
import { TooltipProvider } from "../ui/tooltip";
import { LucideIcon } from "lucide-react";


interface AlertButtonProps {
    onClick: () => void;
    title: string;
    Icon: LucideIcon;
    colorIcon: string;
    position: string;
}

const AlertButton = ({ onClick, title, Icon, colorIcon, position }: AlertButtonProps) => {

return (
  <div className={`fixed ${position} bg-custom-bg rounded-lg flex items-center justify-center`}> 
  <TooltipProvider>
      <Tooltip>
          <TooltipTrigger>
          <button
              onClick={onClick}
          >
              <Icon className={`w-[7rem] h-[4rem] text-${colorIcon}`} />
          </button>
          </TooltipTrigger>
          <TooltipContent className="text-lg" side="bottom">
                  <p>{title}</p>
          </TooltipContent>
          </Tooltip>
  </TooltipProvider>
  </div>
)
}

export default AlertButton;