// types/errors.ts
export class GameError extends Error {
    constructor(
        public code: string,
        // public level: 'ERROR' | 'WARNING' = 'ERROR'
        message?: string,
    ) {
        super(message);
        this.name = 'GameError';
    }
}

export const GameErrorCodes = {
    EMPTY_HAND_OUTPUT: 'EMPTY_HAND_OUTPUT',
    COPYFROM_EMPTY: 'COPYFROM_EMPTY',
    EMPTY_HAND_COPYTO: 'EMPTY_HAND_COPYTO',
    EMPTY_HAND_ADD: 'EMPTY_HAND_ADD',
    EMPTY_HAND_SUB: 'EMPTY_HAND_SUB',
    EMPTY_HAND_JUMP_ZERO: 'EMPTY_HAND_JUMP_ZERO',
    EMPTY_HAND_JUMP_NEG: 'EMPTY_HAND_JUMP_NEG',
    ADD_EMPTY: 'ADD_EMPTY',
    SUB_EMPTY: 'SUB_EMPTY',
} as const;


export const ErrorMessages = {
    [GameErrorCodes.EMPTY_HAND_OUTPUT]: 'Empty Value! You can not OUTPUT with empty hands!',
    [GameErrorCodes.COPYFROM_EMPTY]: 'Empty Value! You can not COPYFROM from an empty slot! Try move something to the slot first!',
    [GameErrorCodes.EMPTY_HAND_COPYTO]: 'Empty Value! You can not COPYTO with empty hands!',
    [GameErrorCodes.EMPTY_HAND_ADD]: 'Empty Value! You can not ADD with empty hands!',
    [GameErrorCodes.EMPTY_HAND_SUB]: 'Empty Value! You can not SUB with empty hands!',
    [GameErrorCodes.EMPTY_HAND_JUMP_ZERO]: 'Empty Value! You can not JUMP IF ZERO with empty hands!',
    [GameErrorCodes.EMPTY_HAND_JUMP_NEG]: 'Empty Value! You can not JUMP IF NEGATIVE with empty hands!',
    [GameErrorCodes.ADD_EMPTY]: 'Empty Value! You can not ADD to an empty slot! Try move something to the slot first!',
    [GameErrorCodes.SUB_EMPTY]: 'Empty Value! You can not SUB from an empty slot! Try move something to the slot first!',

} as const;