import React from "react";

interface InstructionProps {
    name: string;
}

const Instruction: React.FC<InstructionProps> = ({ name }) => {
    return (
        <div>
            <>{name}</>
        </div>
    )
}

export default Instruction;