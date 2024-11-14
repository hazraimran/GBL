// types/errors.ts
export class GameError extends Error {
    constructor(
        message: string,
        public code: string,
        public level: 'ERROR' | 'WARNING' = 'ERROR'
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
    WORKER_NOT_CARRYING: 'WORKER_NOT_CARRYING',
    INVALID_OPERATION: 'INVALID_OPERATION',
} as const;


export const ErrorMessages = {
    [GameErrorCodes.INVALID_MOVE]: '无效的移动',
    [GameErrorCodes.WORKER_BUSY]: '工人正在忙碌',
    [GameErrorCodes.SLOT_OCCUPIED]: '该位置已被占用',
    [GameErrorCodes.SLOT_EMPTY]: '该位置没有石头',
    [GameErrorCodes.WORKER_NOT_CARRYING]: '工人没有携带石头',
    [GameErrorCodes.INVALID_OPERATION]: '无效的操作',
} as const;