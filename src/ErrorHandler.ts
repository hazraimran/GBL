// services/ErrorHandler.ts
import { GameError } from './types/errors';

interface ErrorHandlerOptions {
    onError?: (error: GameError) => void;
}

export class ErrorHandler {
    private onError?: (error: GameError) => void;

    constructor(options?: ErrorHandlerOptions) {
        this.onError = options?.onError;
    }

    handle(error: Error): void {
        if (error instanceof GameError) {
            console.error(`[GameError] ${error.code}: ${error.message}`);
            this.onError?.(error);
        } else {
            console.error('[UnexpectedError]', error);
            this.onError?.(new GameError(
                '发生了意外错误',
                'UNEXPECTED_ERROR'
            ));
        }
    }
}