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
    INVALID_MOVE: 'INVALID_MOVE',
    WORKER_BUSY: 'WORKER_BUSY',
    SLOT_OCCUPIED: 'SLOT_OCCUPIED',
    SLOT_EMPTY: 'SLOT_EMPTY',
    INPUT_EMPTY: 'INPUT_EMPTY',
    ADD_EMPTY: 'ADD_EMPTY',
    SUB_EMPTY: 'SUB_EMPTY',
    WORKER_NOT_CARRYING: 'WORKER_NOT_CARRYING',
    INVALID_OPERATION: 'INVALID_OPERATION',
} as const;


export const ErrorMessages = {
    [GameErrorCodes.INVALID_MOVE]: '无效的移动',
    [GameErrorCodes.WORKER_BUSY]: '工人正在忙碌',
    [GameErrorCodes.SLOT_OCCUPIED]: '该位置已被占用',
    [GameErrorCodes.SLOT_EMPTY]: 'Failed to pick up from an empty slot!',
    [GameErrorCodes.INPUT_EMPTY]: 'No stone in the input area!',
    [GameErrorCodes.ADD_EMPTY]: 'No stone in the add area!',
    [GameErrorCodes.SUB_EMPTY]: 'No stone in the sub area!',
    [GameErrorCodes.WORKER_NOT_CARRYING]: 'Worker is not carrying stone',
    [GameErrorCodes.INVALID_OPERATION]: '无效的操作',
} as const;