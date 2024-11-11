import { Worker, Stone, ConstructionSlot, generatorFn, validationFn, CommandType } from '../types/game';
import { GameError, GameErrorCodes } from '../types/errors';
import { ErrorHandler } from '../ErrorHandler';

interface PassedConfig {
    generatorFn: generatorFn;
    validationFn: validationFn;
    constructionSlots: number;
}

interface GameSceneConfig {
    constructionSlots: number;
    generatorFn: generatorFn;
    validationFn: validationFn;
    slots: { x: number; y: number }[];
    stoneSize: {
        width: number;
        height: number;
    };
    workerConfig: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    layout: {
        inputArea: {
            x: number;
            y: number;
            spacing: number;
        };
        outputArea: {
            x: number;
            y: number;
            spacing: number;
        };
        constructionArea: {
            x: number;
            y: number;
            spacing: number;
        };
    };
    speed: number;
}

export class MainScene extends Phaser.Scene {
    private worker: Worker | null = null;
    private inputStones: Stone[] = [];
    private constructionSlots: ConstructionSlot[] = [];
    private config: GameSceneConfig;
    private inputQueue: number[];
    private outputQueue: number[];
    private RANDOM_SEED: number;
    private errorHandler!: ErrorHandler;

    constructor() {
        super({ key: 'MainScene' });
        this.inputQueue = [];
        this.outputQueue = [];

        const date = new Date();
        this.RANDOM_SEED = Object.freeze(date.getTime());

        this.config = {
            stoneSize: {
                width: 40,
                height: 40
            },
            workerConfig: {
                x: 200,
                y: 300,
                width: 30,
                height: 30
            },
            constructionSlots: 3,
            generatorFn: () => [1, 2, 3],
            validationFn: (output: number[]) => output.every((val, idx) => val === idx + 1),
            slots: [
                { x: 300, y: 200 },
                { x: 300, y: 300 },
                { x: 300, y: 400 }
            ],
            layout: {
                inputArea: {
                    x: 100,
                    y: 150,
                    spacing: 60
                },
                outputArea: {
                    x: 700,
                    y: 150,
                    spacing: 60
                },
                constructionArea: {
                    x: 300,
                    y: 300,
                    spacing: 60
                }
            },
            speed: 1
        };
    }

    init(data: { errorHandler: ErrorHandler, sceneConfig: PassedConfig }): void {
        this.errorHandler = data.errorHandler;
        this.config.generatorFn = data.sceneConfig.generatorFn;
        this.config.validationFn = data.sceneConfig.validationFn;
        this.config.constructionSlots = data.sceneConfig.constructionSlots;
    }


    create(): void {
        this.worker = this.createWorker();
        this.setupInputArea(this.config.layout.inputArea, this.config.generatorFn);
        this.setupConstructionArea(this.config.layout.constructionArea);
        this.setupOutputArea(this.config.layout.outputArea);
    }

    modifySpeed(speed: number): void {
        this.config.speed = speed;
    }

    executeCommands(commands: CommandType[]): void {
        let cmdExcCnt = 0;
        let curLine = 0;

        while (curLine < commands.length) {
            const command = commands[curLine];
            switch (command) {
                case 'INPUT':
                    this.handlePickupFromInput();
                    break;
                case 'OUTPUT':
                    this.handleDropToOutput();
                    break;
                case 'COPYFROM':
                    break;
                case 'COPYTO':
                    break;
                case 'ADD':
                    break;
                case 'SUB':
                    break;
                case 'BUMPUP':
                    break;
                case 'BUMPDOWN':
                    break;
                case 'JUMP':

                    break;
                case 'JUMPZ':
                    break;
                case 'JUMPN':
                    break;
                case 'LABEL':
                    break;
            }
        }
    }

    private createStone(x: number, y: number, value?: number): Stone {
        const { width, height } = this.config.stoneSize;
        const stoneRect = this.add.rectangle(x, y, width, height, 0x00ff00);
        stoneRect.setStrokeStyle(2, 0x333333);
        stoneRect.setInteractive();

        const stone: Stone = {
            sprite: stoneRect,
            value: value
        };

        if (value !== undefined) {
            this.add.text(x, y, value.toString(), {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
        }

        return stone;
    }

    private createWorker(): Worker {
        const { x, y, width, height } = this.config.workerConfig;
        const workerRect = this.add.rectangle(x, y, width, height, 0x0000ff);
        workerRect.setStrokeStyle(2, 0x333333);

        return {
            sprite: workerRect,
        };
    }

    private setupInputArea(config: { x: number; y: number; spacing: number }, generatorFn: generatorFn): void {
        this.inputQueue = generatorFn(this.RANDOM_SEED);
        for (let i = 0; i < this.inputQueue.length; i++) {
            const rect = this.add.rectangle(
                config.x,
                config.y + (i * config.spacing),
                this.config.stoneSize.width,
                this.config.stoneSize.height,
                0x00ff00,
                0.3
            );
            rect.setStrokeStyle(2, 0x00ff00);

            this.inputStones.push({
                sprite: rect,
                value: this.inputQueue[i]
            });
        }

        this.add.text(config.x - 30, config.y - 50, 'INPUT', {
            fontSize: '16px',
            color: '#00ff00'
        });
    }

    private setupOutputArea(config: { x: number; y: number; spacing: number }): void {
        const width = this.game.config.width as number;
        const finalX = config.x > width ? width - 100 : config.x;

        this.add.text(finalX - 30, config.y - 50, 'OUTPUT', {
            fontSize: '16px',
            color: '#ff0000'
        });
    }

    private setupConstructionArea(config: { x: number; y: number; spacing: number }): void {
        for (let i = 0; i < this.config.constructionSlots; i++) {
            const slot: ConstructionSlot = {
                rect: this.add.rectangle(
                    config.x + (i * config.spacing),
                    config.y,
                    this.config.stoneSize.width + 10,
                    this.config.stoneSize.height + 10,
                    0x666666,
                    0.5
                ),
                isOccupied: false
            };
            slot.rect.setStrokeStyle(2, 0x666666);
            this.constructionSlots.push(slot);
        }
    }

    private removeStoneOnHand() {
        if (!this.worker) return;
        // Remove stone on hand animation

        // Reset worker state
        this.worker.stoneCarried = undefined;
    }

    private pickUpStone(stone: Stone): void {
        if (!this.worker) return;

        if (this.worker.stoneCarried) {
            this.removeStoneOnHand();
        }

        // Pick up stone animation

        this.worker.stoneCarried = stone;

    }

    private handlePickupFromInput(): void {
        if (!this.worker) return;

        this.tweenWorkerTo(this.config.layout.inputArea.x + 60, this.config.layout.inputArea.y, () => {
            try {
                if (!(this.inputStones.length > 0)) {
                    throw new GameError('No stones in input area', GameErrorCodes.INVALID_MOVE);
                }

                const stone = this.inputStones.shift() as Stone;
                this.pickUpStone(stone);
            } catch (error: any) {
                if (error instanceof GameError) {
                    this.errorHandler.handle(error);
                } else {
                    this.errorHandler.handle(new GameError(
                        '发生了意外错误',
                        GameErrorCodes.INVALID_OPERATION
                    ));
                }
            }
        });
    }

    private handleDropToOutput(): void {
        if (!this.worker) return;
        if (!this.worker.stoneCarried) return;
        try {
            if (!this.worker.stoneCarried) {
                throw new GameError('No stone carried by worker', GameErrorCodes.INVALID_MOVE);
            }
            this.tweenWorkerTo(this.config.layout.outputArea.x - 60, this.config.layout.outputArea.y, () => {

            });
        } catch (error: any) {
            if (error instanceof GameError) {
                this.errorHandler.handle(error);
            } else {
                this.errorHandler.handle(new GameError(
                    '发生了意外错误',
                    GameErrorCodes.INVALID_OPERATION
                ));
            }
        }
    }

    private handlePickupFrom(from: number): void {
        // get location

        // goto location

        // pickup stone

    }

    private handleDropTo(to: number): void {

    }

    private tweenWorkerTo(x: number, y: number, onComplete?: () => void): void {
        if (!this.worker) return;

        const distance = Phaser.Math.Distance.Between(
            this.worker.sprite.x,
            this.worker.sprite.y,
            x,
            y
        );

        // 设定基础速度（像素/毫秒）
        const baseSpeed = 0.2 * this.config.speed;

        const duration = distance * baseSpeed;

        this.tweens.add({
            targets: this.worker.sprite,
            x: x,
            y: y,
            duration: duration,
            ease: 'Power2',
            onComplete: onComplete
        });

        if (this.worker.stoneCarried) {
            this.tweens.add({
                targets: this.worker.stoneCarried.sprite,
                x: x,
                y: y,
                duration: duration,
                ease: 'Power2'
            });
        }
    }

    private checkOutput(): void {
        const isCorrect = this.config.validationFn(this.outputQueue);

        if (isCorrect) {
            console.log('Level completed!');
            // You can add level completion logic here
        } else {
            console.log('Output is incorrect');
            // You can add incorrect output logic here
        }
    }
}