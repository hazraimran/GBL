import { Worker, Stone, ConstructionSlot, generatorFn, validationFn, CommandWithArgType } from '../types/game';
import { GameError, GameErrorCodes } from '../types/errors';
import { ErrorHandler } from '../ErrorHandler';
import EventManager from '../EventManager';

interface PassedConfig {
    generatorFn: generatorFn;
    validationFn: validationFn;
    constructionSlots: number;
    currentLevel: number;
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
            x_origin: number;
            y_origin: number;
        };
        outputArea: {
            x: number;
            y: number;
            spacing: number;
            x_origin: number;
            y_origin: number;
        };
        constructionArea: {
            x: number;
            y: number;
            spacing: number;
        };
    };
    speed: number;
    currentLevel: number | null;
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
    private cmdExcCnt: number;
    private curLine: number;
    private commandsToExecute: CommandWithArgType[] | null = null;
    private stopped: boolean = true;

    private clickPromiseResolve: ((value: number) => void) | null = null;
    private gameButtons: Phaser.GameObjects.Rectangle[] = [];

    constructor() {
        super({ key: 'MainScene' });
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;

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
                    spacing: 60,
                    x_origin: 100,
                    y_origin: 600
                },
                outputArea: {
                    x: 700,
                    y: 150,
                    spacing: 60,
                    x_origin: 700,
                    y_origin: 600
                },
                constructionArea: {
                    x: 300,
                    y: 300,
                    spacing: 60
                }
            },
            speed: 1,
            currentLevel: null
        };
    }

    init(data: { errorHandler: ErrorHandler, sceneConfig: PassedConfig }): void {
        this.errorHandler = data.errorHandler;
        this.config.generatorFn = data.sceneConfig.generatorFn;
        this.config.validationFn = data.sceneConfig.validationFn;
        this.config.constructionSlots = data.sceneConfig.constructionSlots;
        this.config.currentLevel = data.sceneConfig.currentLevel;
        console.log('Initializing MainScene with config:', this.config.constructionSlots);
    }

    reset(): void {
        this.scene.restart();
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
    }

    create(): void {
        this.worker = this.createWorker();
        this.setupInputArea(this.config.layout.inputArea, this.config.generatorFn);
        this.setupConstructionArea();
        this.setupOutputArea(this.config.layout.outputArea);
        this.events.emit('sceneReady');
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

    private setupConstructionArea(): void {
        for (let i = 0; i < this.config.constructionSlots; i++) {
            const initialPos = { x: 300, y: 300 };
            const spacing = 60;

            const slot: ConstructionSlot = {
                rect: this.add.rectangle(
                    initialPos.x + ((i % 3) * spacing),
                    initialPos.y + (Math.floor(i / 3) * spacing),
                    this.config.stoneSize.width + 10,
                    this.config.stoneSize.height + 10,
                    0x666666,
                    0.8
                ),
                isOccupied: false
            };

            slot.rect.setStrokeStyle(4, 0x000000);

            this.constructionSlots.push(slot);
        }
    }

    private createWorker(): Worker {
        const { x, y, width, height } = this.config.workerConfig;
        const workerRect = this.add.rectangle(x, y, width, height, 0x0000ff);
        workerRect.setStrokeStyle(2, 0x333333);

        return {
            sprite: workerRect,
        };
    }

    modifySpeed(speed: number): void {
        this.config.speed = speed;
    }

    // 创建游戏按钮
    private createGameButton = (x: number, y: number, value: number): Phaser.GameObjects.Rectangle => {
        const button = this.add.rectangle(x, y, 60, 60, 0x4ade80);  // 使用绿色作为按钮颜色
        button.setInteractive({ useHandCursor: true });

        // 添加悬停效果
        button.on('pointerover', () => {
            button.setScale(1.1);
            button.setFillStyle(0x34d399);  // 悬停时颜色变深
        });

        button.on('pointerout', () => {
            button.setScale(1);
            button.setFillStyle(0x4ade80);
        });

        // 点击效果和处理
        button.on('pointerdown', () => {
            button.setScale(0.9);
            button.setFillStyle(0x059669);
        });

        button.on('pointerup', () => {
            button.setScale(1);
            button.setFillStyle(0x4ade80);
            if (this.clickPromiseResolve) {
                this.clickPromiseResolve(value);
                this.clickPromiseResolve = null;
                this.hideGameButtons(); // 隐藏所有按钮
            }
        });

        return button;
    }

    // 显示所有按钮
    private showGameButtons = (positions: { x: number, y: number, value: number }[]): void => {
        this.hideGameButtons(); // 先清除现有按钮

        positions.forEach(pos => {
            const button = this.createGameButton(pos.x, pos.y, pos.value);
            // 添加按钮上的文本
            const text = this.add.text(pos.x, pos.y, pos.value.toString(), {
                color: '#000000',
                fontSize: '24px'
            }).setOrigin(0.5);

            this.gameButtons.push(button);
        });
    }

    // 隐藏所有按钮
    private hideGameButtons = (): void => {
        this.gameButtons.forEach(button => button.destroy());
        this.gameButtons = [];
    }

    // 等待用户点击的异步函数
    waitForButtonClick = async (buttonPositions: { x: number, y: number, value: number }[]): Promise<number> => {
        return new Promise((resolve) => {
            this.clickPromiseResolve = resolve;
            this.showGameButtons(buttonPositions);
        });
    }

    // pickSlot = async (): Promise<void> => {

    //     if (!this.scene.isActive('MainScene')) {
    //         await new Promise<void>(resolve => {
    //             this.events.once('sceneReady', resolve);
    //         });
    //     }
        
    //     try {
    //         // 定义按钮位置和对应的值
    //         const positions = [
    //             { x: 200, y: 300, value: 1 },
    //             { x: 300, y: 300, value: 2 },
    //             { x: 400, y: 300, value: 3 }
    //         ];
    //         console.log(this.waitForButtonClick)

    //         const selectedValue = await this.waitForButtonClick(positions);
    //         console.log('User selected:', selectedValue);
    //         // 这里可以处理用户的选择

    //     } catch (error) {
    //         console.error('Error in pickSlot:', error);
    //     }
    // }

    private preProcessCommands(commands: CommandWithArgType[]): void {
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            if (command.command === 'JUMP' || command.command === 'JUMPZ' || command.command === 'JUMPN') {
                const ext = command.arg as CommandWithArgType;
                const pos = commands.indexOf(ext);
                command.arg = pos;
            }
        }
    }

    private setCommandsToExecute(commands: CommandWithArgType[]): void {
        this.commandsToExecute = commands;
    }

    stopExecution(): void {
        this.stopped = true;
    }

    resumeExecution(): void {
        this.stopped = false;
    }

    async executeCommands(commandsWithArg: CommandWithArgType[]): Promise<void> {
        this.setCommandsToExecute(commandsWithArg);
        this.preProcessCommands(commandsWithArg);
        console.log('Executing commands:', commandsWithArg);
        const jumpto = (line: number) => {
            this.curLine = line;
        }
        this.stopped = false;

        while (this.curLine < commandsWithArg.length && !this.stopped) {
            const commandWithArg = commandsWithArg[this.curLine];
            console.log(commandWithArg)
            this.curLine++;
            this.cmdExcCnt++;
            switch (commandWithArg.command) {
                case 'INPUT':
                    await this.handlePickupFromInput();
                    break;
                case 'OUTPUT':
                    await this.handleDropToOutput();
                    break;
                case 'COPYFROM':
                    await this.handleCopyFrom(commandWithArg.arg as number);
                    break;
                case 'COPYTO':
                    await this.handleCopyTo(commandWithArg.arg as number);
                    break;
                case 'ADD':
                    await this.handleAdd(commandWithArg.arg as number);
                    break;
                case 'SUB':
                    await this.handleSub(commandWithArg.arg as number);
                    break;
                case 'JUMP':
                    await this.handleJump(commandWithArg.arg as number, jumpto);
                    break;
                case 'JUMPZ':
                    break;
                case 'JUMPN':
                    break;
                case '':
                    break;
            }
        }
        this.validateOutput();
    }

    async executeOneStep(): Promise<void> {
        console.log('Executing one step');
    }

    private async handleCopyFrom(arg: number): Promise<void> {
        console.log('Copying from', arg);
    }

    private async handleCopyTo(arg: number): Promise<void> {
        console.log('Copying to', arg);
    }

    private async handleAdd(arg: number): Promise<void> {
        console.log('Adding', arg);
    }

    private async handleSub(arg: number): Promise<void> {
        console.log('Subtracting', arg);
    }

    private async handleJump(arg: number, jumpto: (line: number) => void): Promise<void> {
        console.log('Jumping', arg);
        jumpto(arg);
    }

    private removeStoneOnHand(): Stone | undefined {
        if (!this.worker) return;
        // Remove stone on hand animation

        const stone = this.worker.stoneCarried;

        // Reset worker state
        this.worker.stoneCarried = undefined;
        return stone;
    }

    private pickUpStone(stone: Stone): void {
        if (!this.worker) return;

        if (this.worker.stoneCarried) {
            this.removeStoneOnHand();
        }

        // Pick up stone animation

        this.worker.stoneCarried = stone;
    }

    private async handlePickupFromInput(): Promise<void> {
        console.log('Picking up stone from input area');
        if (!this.worker) return;

        await this.tweenWorkerTo(this.config.layout.inputArea.x + 60, this.config.layout.inputArea.y);
        try {
            if (!(this.inputStones.length > 0)) {
                throw new GameError('No stones in input area', GameErrorCodes.INVALID_MOVE);
            }

            const stone = this.inputStones.shift() as Stone;
            this.pickUpStone(stone);
            console.log(this.worker?.stoneCarried);
        } catch (error: any) {
            if (error instanceof GameError) {
                this.errorHandler.handle(error);
            } else {
                this.errorHandler.handle(new GameError(
                    'Unexpected Error Happened',
                    GameErrorCodes.INVALID_OPERATION
                ));
            }
        }
    }

    private async handleDropToOutput(): Promise<void> {
        console.log('Dropping stone to output area', this.worker, this.worker?.stoneCarried);
        if (!this.worker) return;
        try {
            if (!this.worker.stoneCarried) {
                throw new GameError('No stone carried by worker', GameErrorCodes.INVALID_MOVE);
            }
            await this.tweenWorkerTo(this.config.layout.outputArea.x - 60, this.config.layout.outputArea.y);

            // Drop stone animation

            const stone = this.removeStoneOnHand();
            this.handleStoneToOutput(stone as Stone);
            this.outputQueue.push(stone?.value as number);
            this.validateOutput();

        } catch (error: any) {
            if (error instanceof GameError) {
                this.errorHandler.handle(error);
            } else {
                this.errorHandler.handle(new GameError(
                    'Unexpected Error Happened',
                    GameErrorCodes.INVALID_OPERATION
                ));
            }
        }
    }

    private handleStoneToOutput(stone: Stone): void {
        stone.sprite.x = this.config.layout.outputArea.x;
        stone.sprite.y = this.config.layout.outputArea.y;

        this.tweenStoneTo(stone, this.config.layout.outputArea.x_origin, this.config.layout.outputArea.y_origin).then(() => {
            stone.sprite.destroy();
        });
    }

    private async tweenWorkerTo(x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
            if (!this.worker) return;

            const distance = Phaser.Math.Distance.Between(
                this.worker.sprite.x,
                this.worker.sprite.y,
                x,
                y
            );

            const baseSpeed = 4;
            const duration = (distance * baseSpeed) / this.config.speed;

            this.tweens.add({
                targets: this.worker.sprite,
                x: x,
                y: y,
                duration: duration,
                ease: 'Power2',
                onComplete: () => resolve()
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
        });
    }

    private async tweenStoneTo(stone: Stone, x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
            if (!stone) return;

            const distance = Phaser.Math.Distance.Between(
                stone.sprite.x,
                stone.sprite.y,
                x,
                y
            );

            const baseSpeed = 6;
            const duration = (distance * baseSpeed) / this.config.speed;

            this.tweens.add({
                targets: stone.sprite,
                x: x,
                y: y,
                duration: duration,
                ease: 'Power2',
                onComplete: () => resolve()
            });
        });
    }

    private validateOutput(): void {
        console.log(this.outputQueue);
        console.log(this.config.validationFn)
        const isCorrect = this.config.validationFn(this.outputQueue);

        if (isCorrect) {
            console.log('Output is correct');
            this.stopped = true;
            // show popup
            EventManager.emit('levelCompleted', {
                executeCnt: this.cmdExcCnt,
                commandCnt: this.commandsToExecute ? this.commandsToExecute.length : 0
            });

        } else {
            console.log('Output is incorrect');
            // show popup
        }
        console.log('stopped', this.stopped)
    }
}