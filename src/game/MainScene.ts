import { Worker, Stone, ConstructionSlot, generatorFn, outputFn, CommandWithArgType } from '../types/game';
import { ErrorMessages, GameError, GameErrorCodes } from '../types/errors';
import { ErrorHandler } from '../ErrorHandler';
import EventManager from '../EventManager';
import { ConstructtionSlotConfig } from '../types/level';
import SeededRandom from '../utils/RandomSeedGenerator';
import _ from "lodash";

interface PassedConfig {
    generatorFn: generatorFn;
    outputFn: outputFn;
    constructionSlots: ConstructtionSlotConfig[];
    currentLevel: number;
}

interface GameSceneConfig {
    constructionSlots: ConstructtionSlotConfig[];
    generatorFn: generatorFn;
    outputFn: outputFn;
    stoneSize: {
        width: number;
        height: number;
    };
    workerConfig: {
        x: number;
        y: number;
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
    private outputStones: Stone[] = [];
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
    private generator1: SeededRandom;
    private generator2: SeededRandom;
    private ans: number[];

    constructor() {
        super({ key: 'MainScene' });
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;

        const date = new Date();
        this.RANDOM_SEED = Object.freeze(date.getTime());
        this.generator1 = new SeededRandom(this.RANDOM_SEED);
        this.generator2 = new SeededRandom(this.RANDOM_SEED);
        this.ans = [];

        this.config = {
            stoneSize: {
                width: 70,
                height: 70
            },
            workerConfig: {
                x: 300,
                y: 200
            },
            constructionSlots: [],
            generatorFn: () => [1, 2, 3],
            outputFn: () => [],
            layout: {
                inputArea: {
                    x: 150,
                    y: 200,
                    spacing: 60,
                    x_origin: 100,
                    y_origin: 600
                },
                outputArea: {
                    x: 740,
                    y: 200,
                    spacing: 60,
                    x_origin: 800,
                    y_origin: 700
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

    preload(): void {
        this.load.spritesheet('worker', './worker.png', {
            frameWidth: 132,
            frameHeight: 132
        });

        this.load.image('character', 'src/assets/animation/character/character.jpg');
        this.load.image('stone', './stone.jpg');
        this.load.image('stoneShadow', './shadow_stone.jpg');
        this.load.image('humanShadow', './shadow_human.jpg');

        this.load.on('loaderror', (file: any) => {
            console.error(`Failed to load: ${file.key}`);
        });
    }

    private resetGameState(): void {
        console.log('Resetting game state');
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
        this.stopped = true;

        if (this.worker) {
            this.worker.sprite.destroy();
            this.worker.shadow.destroy();
            this.worker = null;
        }

        this.inputStones.forEach(stone => {
            if (stone.sprite) {
                stone.sprite.destroy();
            }
            if (stone.shadow) {
                stone.shadow.destroy();
            }
            if (stone.text) {
                stone.text.destroy();
            }
        });
        this.inputStones = [];

        this.outputStones.forEach(stone => {
            if (stone.sprite) {
                stone.sprite.destroy();
            }
            if (stone.shadow) {
                stone.shadow.destroy();
            }
            if (stone.text) {
                stone.text.destroy();
            }
        });
        this.outputStones = [];

        this.constructionSlots.forEach(slot => {
            if (slot.rect) {
                slot.rect.destroy();
            }
            if (slot.stone?.sprite) {
                (slot.stone.sprite as any).destroy();
            }
            if (slot.stone?.shadow) {
                slot.stone.shadow.destroy();
            }
            if (slot.stone?.text) {
                slot.stone.text.destroy();
            }
        });
        this.constructionSlots = [];
    }

    reset(): void {
        this.resetGameState();
        // this.scene.restart();
    }

    init(data: { errorHandler: ErrorHandler, sceneConfig: PassedConfig }): void {
        this.errorHandler = data.errorHandler;
        this.config.generatorFn = data.sceneConfig.generatorFn;
        this.config.outputFn = data.sceneConfig.outputFn;
        this.config.constructionSlots = data.sceneConfig.constructionSlots;
        this.config.currentLevel = data.sceneConfig.currentLevel;
        this.ans = this.config.outputFn(this.generator2.nextInt.bind(this.generator2));
        this.inputQueue = this.config.generatorFn(this.generator1.nextInt.bind(this.generator1));

        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
        this.stopped = true;
    }

    create(): void {
        this.worker = this.createWorker();
        this.setupInputArea(this.config.layout.inputArea);
        this.setupConstructionArea();
        this.events.emit('sceneReady');
        this.worker.sprite.play('rest', true);
    }

    private setupInputArea(config: { x: number; y: number; spacing: number }): void {
        for (let i = 0; i < this.inputQueue.length; i++) {

            const shadow = this.add.sprite(
                config.x + 10,
                config.y + (i * config.spacing) + 10,
                'stoneShadow'
            ).setScale(0.35).setDepth(1);

            const stone = this.add.sprite(
                config.x,
                config.y + (i * config.spacing),
                'stone'
            ).setDepth(5);

            stone.setDisplaySize(
                this.config.stoneSize.width,
                this.config.stoneSize.height
            );

            const text = this.add.text(
                config.x,
                config.y + (i * config.spacing) - 8,
                this.inputQueue[i].toString(),
                {
                    fontSize: '18px',
                    color: '#000000'
                }
            ).setDepth(5).setOrigin(0.5);

            this.inputStones.push({
                sprite: stone,
                shadow: shadow,
                text: text,
                value: this.inputQueue[i]
            });
        }

    }

    private setupConstructionArea(): void {
        this.config.constructionSlots.forEach((slot, idx) => {
            const rect = this.add.rectangle(
                slot.x + 65,
                slot.y + 30,
                this.config.stoneSize.width - 5,
                this.config.stoneSize.height - 5,
            );
            let stone = null;

            if (slot.value !== undefined) {
                const shadow = this.add.sprite(
                    slot.x + 10,
                    slot.y + 10,
                    'stoneShadow'
                ).setScale(0.35).setDepth(1);

                const stoneSprite = this.add.sprite(
                    slot.x,
                    slot.y,
                    'stone'
                ).setDepth(5);

                stoneSprite.setDisplaySize(
                    this.config.stoneSize.width,
                    this.config.stoneSize.height
                );

                const text = this.add.text(
                    slot.x,
                    slot.y - 8,
                    slot.value.toString(),
                    {
                        color: '#000000',
                        fontSize: '18px'
                    }
                ).setDepth(5).setOrigin(0.5);

                stone = {
                    sprite: stoneSprite,
                    shadow,
                    value: slot.value,
                    text
                }
            }

            this.constructionSlots.push({
                rect,
                stone,
            });
        })
    }

    private createWorker(): Worker {
        const { x, y } = this.config.workerConfig;

        this.anims.create({
            key: 'rest',
            frames: this.anims.generateFrameNumbers('worker', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1,
        })

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('worker', { start: 8, end: 13 }),
            frameRate: 8,
            repeat: -1
        })

        this.anims.create({
            key: 'pick',
            frames: this.anims.generateFrameNumbers('worker', { start: 14, end: 21 }),
            frameRate: 9,
            repeat: 0,
        })

        this.anims.create({
            key: 'drop',
            frames: this.anims.generateFrameNumbers('worker', { start: 22, end: 29 }),
            frameRate: 9,
            repeat: 0,
        })

        this.anims.create({
            key: 'holdWalk',
            frames: this.anims.generateFrameNumbers('worker', { start: 30, end: 34 }),
            frameRate: 8,
            repeat: -1,
        })

        const shadow = this.add.sprite(x + 6, y + 33, 'humanShadow').setScale(0.6).setDepth(1);
        const sprite = this.physics.add.sprite(x, y, 'worker', 0).setDepth(6);

        return {
            sprite: sprite,
            shadow: shadow,
        };
    }

    modifySpeed(speed: number): void {
        this.config.speed = speed;
    }

    private preProcessCommands(commands: CommandWithArgType[]): CommandWithArgType[] {
        let processedCommands = structuredClone(commands);
        for (let i = 0; i < commands.length; i++) {
            const command = commands[i];
            if (command.command === 'JUMP' || command.command === 'JUMP = 0' || command.command === 'JUMP < 0') {
                const ext = command.arg as CommandWithArgType;
                const pos = commands.indexOf(ext);
                processedCommands[i].arg = pos;
            }
        }
        return processedCommands;
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
        const processedCommands = this.preProcessCommands(commandsWithArg);
        console.log('Executing commands:', commandsWithArg);
        const jumpto = (line: number) => {
            this.curLine = line;
            jumpCnt++;
        }
        this.stopped = false;
        let jumpCnt = 0;

        while (this.curLine < processedCommands.length && !this.stopped) {
            if (this.detectInfiniteLoop(jumpCnt)) return;
            const commandWithArg = processedCommands[this.curLine];
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
                case 'JUMP = 0':
                    await this.handleJumpZ(commandWithArg.arg as number, jumpto);
                    break;
                case 'JUMP < 0':
                    await this.handleJumpN(commandWithArg.arg as number, jumpto);
                    break;
                case '':
                    break;
            }
        }

        if (!this.stopped) {
            this.validateOutput();
        }
    }

    private detectInfiniteLoop(jumpCnt: number) {
        if (jumpCnt > 50) {
            EventManager.emit('levelFailed', {
                "message": "Infinite loop detected!"
            });
            return true;
        }
        return false;

    }

    private async handleCopyFrom(arg: number): Promise<void> {

        const slotPos = {
            x: 300 + arg % 3 * 100 + 20,
            y: 300 + Math.floor(arg / 3) * 100 + 30
        }

        await this.tweenWorkerTo(slotPos.x, slotPos.y);

        const stone = this.removeStoneOnHand();
        stone?.sprite.destroy();
        stone?.text?.destroy();

        await this.pickStoneFromSlot(arg);
    }

    private async handleCopyTo(arg: number): Promise<void> {
        const slotPos = {
            x: 300 + arg % 3 * 60 + 30,
            y: 300 + Math.floor(arg / 3) * 60
        }
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        await this.putStoneToSlot(arg)
    }

    private async handleAdd(arg: number): Promise<void> {
        const slotPos = {
            x: 300 + arg % 3 * 100,
            y: 300 + Math.floor(arg / 3) * 100 - 60
        }
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        this.addStoneFromSlot(arg);
    }

    private async handleSub(arg: number): Promise<void> {
        const slotPos = {
            x: 300 + arg % 3 * 100,
            y: 300 + Math.floor(arg / 3) * 100 - 60
        }
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        this.subStoneFromSlot(arg);
    }

    private async handleJump(arg: number, jumpto: (line: number) => void): Promise<void> {
        jumpto(arg);
    }

    private async handleJumpZ(arg: number, jumpto: (line: number) => void): Promise<void> {
        if (!this.worker?.stoneCarried) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_JUMP_ZERO]
            });
            this.stopExecution();
            return;
        }

        if (this.worker.stoneCarried.value === 0) {
            jumpto(arg);
        }
    }

    private async handleJumpN(arg: number, jumpto: (line: number) => void): Promise<void> {

        if (!this.worker?.stoneCarried) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_JUMP_NEG]
            });
            this.stopExecution();
            return;
        }

        if (this.worker.stoneCarried.value < 0) {
            jumpto(arg);
        }
    }

    private removeStoneOnHand(): Stone | undefined {
        if (!this.worker) return;
        // Remove stone on hand animation

        const stone = this.worker.stoneCarried;

        // Reset worker state
        this.worker.stoneCarried = undefined;
        return stone;
    }

    private async dropStone(stone: Stone, faceLeft: boolean): Promise<void> {
        if (!this.worker) return;

        const adjust = { x: faceLeft ? 45 : -45, y: 55 }

        // Drop stone animation
        this.worker.sprite.play('drop', true);

        const shadow = this.add.sprite(
            stone.sprite.x + 10,
            stone.sprite.y + 10,
            'stoneShadow'
        ).setScale(0.25).setDepth(1).setAlpha(0);

        stone.shadow = shadow;
        this.tweens.add({
            targets: shadow,
            x: this.config.layout.outputArea.x + 70,
            y: stone.sprite.y + adjust.y + 10,
            alpha: 1,
            scale: 0.35,
            duration: 700,
            ease: 'Power2.easeInOut',
        });

        this.tweens.add({
            targets: stone.sprite,
            x: this.config.layout.outputArea.x + 60,
            y: stone.sprite.y + adjust.y,
            duration: 700,
            ease: 'Power2.easeInOut',
        });

        this.tweens.add({
            targets: stone.text,
            x: this.config.layout.outputArea.x + 60,
            y: stone.text.y + adjust.y,
            duration: 700,
            ease: 'Power2.easeInOut',
        });

        await new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    }

    private async pickUpStone(stone: Stone, faceLeft: boolean, useCopy: boolean): Promise<void> {
        if (!this.worker) return;

        stone.sprite.setDepth(7);
        stone.text?.setDepth(7);

        // Pick up stone animation
        this.worker.sprite.play('pick', true);

        await new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 300);
        });

        const adjust = { x: faceLeft ? 45 : -45, y: -55 }

        if (stone.shadow) {
            this.tweens.add({
                targets: stone.shadow,
                x: stone.shadow.x + adjust.x,
                alpha: 0,
                scale: 0.25,
                duration: 700,
                ease: 'Linear',
                onComplete: () => {
                    stone.shadow?.destroy();
                }
            });
        }

        this.tweens.add({
            targets: stone.sprite,
            x: stone.sprite.x + adjust.x,
            y: stone.sprite.y + adjust.y,
            duration: 700,
            ease: 'Power2.easeInOut',
            onComplete: () => {
            }
        });

        this.tweens.add({
            targets: stone.text,
            x: stone.text.x + adjust.x,
            y: stone.text.y + adjust.y,
            duration: 700,
            ease: 'Power2.easeInOut',
            onComplete: () => {
            }
        });

        if (this.worker.stoneCarried) {
            const stone = this.removeStoneOnHand();
            stone?.sprite.destroy();
            stone?.shadow?.destroy();
            stone?.text?.destroy();
        }

        await new Promise((resolve) => {
            setTimeout(() => resolve(undefined), 700);
        });

        if (useCopy) {
            this.worker.stoneCarried = _.cloneDeep(stone);
        } else {
            this.worker.stoneCarried = stone;
        }
    }

    private async handlePickupFromInput(): Promise<void> {
        if (!this.worker) return;
        await this.tweenWorkerTo(this.config.layout.inputArea.x + 60,
            this.config.layout.inputArea.y + (this.inputQueue.length - this.inputStones.length) * this.config.layout.inputArea.spacing);
        if (this.inputStones.length === 0) {
            this.validateOutput();
            return;
        }
        const stone = this.inputStones.shift() as Stone;


        await this.pickUpStone(stone, true, false);
    }

    private addStoneFromSlot(slot: number) {
        if (!this.worker) return;

        const slotStone = this.constructionSlots[slot];
        if (!slotStone.stone) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.ADD_EMPTY]
            });
            this.stopExecution();
            return;
        }

        if (!this.worker.stoneCarried) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_ADD]
            });
            this.stopExecution();
            return;
        }

        this.addStone(slotStone.stone as Stone);
    }

    private subStoneFromSlot(slot: number) {
        if (!this.worker) return;

        const slotStone = this.constructionSlots[slot];
        if (!slotStone.stone) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.SUB_EMPTY]
            });
            this.stopExecution();
            return;
        }

        if (!this.worker.stoneCarried) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_SUB]
            });
            this.stopExecution();
            return;
        }

        this.subStone(slotStone.stone as Stone);
    }

    private addStone(stone: Stone) {
        if (!this.worker || !this.worker.stoneCarried) return;
        // animation
        let newValue = (this.worker.stoneCarried.value ?? 0) + stone.value;
        this.worker.stoneCarried.text.setText(newValue.toString());
        this.worker.stoneCarried.value = newValue;
    }

    private subStone(stone: Stone) {
        if (!this.worker || !this.worker.stoneCarried) return;
        let newValue = (this.worker.stoneCarried.value ?? 0) - stone.value;
        this.worker.stoneCarried.text.setText(newValue.toString());
        this.worker.stoneCarried.value = newValue;
    }

    private async pickStoneFromSlot(slot: number) {
        if (!this.worker) return;

        const slotStone = this.constructionSlots[slot];
        if (!slotStone.stone) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.COPYFROM_EMPTY]
            });
            this.stopExecution();
            return;
        }

        if (this.worker.stoneCarried) {
            const stone = this.removeStoneOnHand();
            stone?.sprite.destroy();
            stone?.text?.destroy();
        }

        this.worker.sprite.setFlipX(false)

        this.worker.sprite.play('pick', true);

        const originalStone = slotStone.stone;

        const stoneCopy: Stone = {
            sprite: this.add.sprite(
                originalStone.sprite.x,
                originalStone.sprite.y,
                'stone'
            ).setDepth(5),
            shadow: this.add.sprite(
                originalStone.sprite.x + 10,
                originalStone.sprite.y + 10,
                'stoneShadow'
            ).setScale(0.35).setDepth(1),
            value: originalStone.value,
            text: this.add.text(
                originalStone.sprite.x,
                originalStone.sprite.y - 8,
                originalStone.value.toString(),
                {
                    color: '#000000',
                    fontSize: '18px'
                }
            ).setDepth(5).setOrigin(0.5)
        };

        stoneCopy.sprite.setDisplaySize(
            originalStone.sprite.displayWidth,
            originalStone.sprite.displayHeight
        );

        if (originalStone.sprite.originX !== undefined) {
            stoneCopy.sprite.setOrigin(originalStone.sprite.originX, originalStone.sprite.originY);
        } else {
            stoneCopy.sprite.setOrigin(0.5, 0.5); // 默认居中
        }

        await this.pickUpStone(stoneCopy, false, false);

        this.worker.stoneCarried = stoneCopy;
    }

    // private async putStoneToSlot(slot: number) {
    //     if (!this.worker) return;

    //     const stone = this.worker.stoneCarried;

    //     stone?.sprite.setDepth(5);
    //     stone?.text?.setDepth(5);

    //     if (!stone) {
    //         EventManager.emit('levelFailed', {
    //             "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_COPYTO]
    //         });
    //         this.stopExecution();
    //         return;
    //     }

    //     const shadow = this.add.sprite(
    //         stone.sprite?.x ?? 0 + 10,
    //         stone.sprite?.y ?? 0 + 10,
    //         'stoneShadow'
    //     ).setScale(0.35).setDepth(1);
    //     stone.shadow = shadow;

    //     // Drop stone animation
    //     this.worker.sprite.play('drop', true);

    //     await new Promise((resolve) => {
    //         setTimeout(() => resolve(), 1000);
    //     });

    //     if (this.constructionSlots[slot].stone) {
    //         this.constructionSlots[slot].stone.sprite.destroy();
    //         this.constructionSlots[slot].stone.text.destroy();
    //     }

    //     const stone_copy = this.add.sprite(
    //         this.constructionSlots[slot].rect.x,
    //         this.constructionSlots[slot].rect.y,
    //         'stone'
    //     ).setDepth(5);

    //     stone_copy.setDisplaySize(
    //         this.config.stoneSize.width,
    //         this.config.stoneSize.height
    //     );

    //     this.constructionSlots[slot].stone = {
    //         sprite: stone_copy,
    //         shadow: shadow,
    //         value: stone.value,
    //         text: this.add.text(
    //             this.constructionSlots[slot].rect.x - 10,
    //             this.constructionSlots[slot].rect.y - 10,
    //             stone.value.toString(),
    //             {
    //                 fontSize: '18px',
    //                 color: '#000000'
    //             }
    //         ).setDepth(5).setOrigin(0.5)
    //     };
    // }

    private async putStoneToSlot(slot: number): Promise<void> {
        if (!this.worker) {
            return;
        }

        const stone = this.worker.stoneCarried;
        const stoneCopy = _.cloneDeep(stone);

        if (!stone) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_COPYTO]
            });
            this.stopExecution();
            return;
        }

        const targetSlot = this.constructionSlots[slot];
        if (!targetSlot) {
            console.error(`Invalid slot index: ${slot}`);
            return;
        }

        // 1. 播放工人放置动画
        this.worker.sprite.play('drop', true);

        // 3. 计算目标位置（槽位中心）
        const targetX = targetSlot.rect.x - 65;
        const targetY = targetSlot.rect.y - 30;

        const shadow = this.add.sprite(
            stone.sprite.x + 10,
            stone.sprite.y + 10,
            'stoneShadow'
        ).setScale(0.25).setDepth(1).setAlpha(0);

        stone.shadow = shadow;

        this.tweens.add({
            targets: shadow,
            x: this.config.layout.outputArea.x + 70,
            y: stone.sprite.y + 55 + 10,
            alpha: 1,
            scale: 0.35,
            duration: 700,
            ease: 'Power2.easeInOut',
        });

        // 4. 执行放置动画（石头移动到槽位）
        await Promise.all([
            
            // 石头移动
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.sprite,
                    x: targetX,
                    y: targetY,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }),

            // 文字同步移动
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.text,
                    x: targetX,
                    y: targetY - 8, // 文字微调
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }),

            // 阴影移动（如果存在）
            stone.shadow ? new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.shadow,
                    x: targetX + 10,
                    y: targetY + 10,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }) : Promise.resolve()
        ]);

        // 5. 清理槽位上原有的石头（如果有）
        if (targetSlot.stone) {
            targetSlot.stone.sprite.destroy();
            targetSlot.stone.text?.destroy();
            targetSlot.stone.shadow?.destroy();
        }

        // 2. 调整石头层级（从搬运时的7恢复为正常值）
        stone.sprite.setDepth(5);      // 普通石头层级
        stone.text?.setDepth(5);       // 文字略高于石头
        stone.shadow?.setDepth(1);     // 阴影在底层

        // 6. 将石头绑定到槽位
        targetSlot.stone = {
            sprite: stone.sprite,
            shadow: stone.shadow,
            text: stone.text,
            value: stone.value
        };

        // 7. 清空工人手中的石头
        this.worker.stoneCarried = undefined;

        await new Promise(resolve => setTimeout(resolve, 200));
    }

    private async handleDropToOutput(): Promise<void> {
        if (!this.worker) return;
        if (!this.worker.stoneCarried) {
            EventManager.emit('levelFailed', {
                "message": ErrorMessages[GameErrorCodes.EMPTY_HAND_OUTPUT]
            });
            this.stopExecution();
            return;
        }
        await this.tweenWorkerTo(this.config.layout.outputArea.x,
            this.config.layout.outputArea.y + this.outputQueue.length * this.config.layout.outputArea.spacing);

        const stone = this.removeStoneOnHand() as Stone;
        await this.dropStone(stone, false);

        this.outputStones.unshift(stone);
        this.outputQueue.push(stone?.value as number);
        this.preValidateOutput();
    }

    private async tweenWorkerTo(x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
            if (!this.worker) return;

            const dx = x - this.worker.sprite.x;

            this.worker.sprite.setFlipX(dx < 0);

            const distance = Phaser.Math.Distance.Between(
                this.worker.sprite.x,
                this.worker.sprite.y,
                x, y
            );

            const baseSpeed = 4;
            const duration = (distance * baseSpeed) / this.config.speed;

            // adjust frame rate based on distance, not working for now
            const frameRate = Math.max(8, Math.min(16, distance / duration * 4));
            this.worker.sprite.anims.timeScale = frameRate / 8;

            this.tweens.add({
                targets: this.worker.sprite,
                x, y,
                duration,
                ease: 'Linear',
                onComplete: () => {
                    this.worker?.sprite.stop();
                    resolve();
                }
            });

            this.tweens.add({
                targets: this.worker.shadow,
                x: x + 2, y: y + 33,
                duration,
                ease: 'Linear'
            });

            console.log('Stone carried:', this.worker.stoneCarried);
            if (this.worker.stoneCarried) {

                this.worker.sprite.play('holdWalk', true);

                this.tweens.add({
                    targets: [
                        this.worker.stoneCarried.sprite,
                        this.worker.stoneCarried.text
                    ],
                    x: x + this.worker.stoneCarried.sprite.x - this.worker.sprite.x,
                    y: y + this.worker.stoneCarried.sprite.y - this.worker.sprite.y,
                    duration,
                    ease: 'Linear'
                });
            } else {
                this.worker.sprite.play('walk', true);
            }
        });
    }

    private async tweenStoneTo(stone: Stone, x: number, y: number, baseSpeed: number = 2, ease: string = 'Linear'): Promise<void> {
        return new Promise((resolve) => {
            if (!stone) return;

            const distance = Phaser.Math.Distance.Between(
                stone.sprite.x,
                stone.sprite.y,
                x,
                y
            );

            // const baseSpeed = 2;
            const duration = (distance * baseSpeed) / this.config.speed;

            let tweensCompleted = 0;
            const onComplete = () => {
                tweensCompleted++;
                if (tweensCompleted === 2) {
                    resolve();
                }
            };

            this.tweens.add({
                targets: stone.sprite,
                x: x,
                y: y,
                duration: duration,
                ease: ease,
                onComplete: onComplete
            });

            this.tweens.add({
                targets: stone.text,
                x: x,
                y: y,
                duration: duration,
                ease: ease,
                onComplete: onComplete
            });
        });
    }

    private async preValidateOutput(): Promise<void> {
        if (this.ans.length !== this.outputQueue.length) {
            return;
        }

        let isCorrect = true;

        for (let i = 0; i < this.ans.length; i++) {
            if (this.ans[i] !== this.outputQueue[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            this.stopExecution();
            await this.gameDoneAnimation();
            // show popup
            EventManager.emit('levelCompleted', {
                executeCnt: this.cmdExcCnt,
                commandCnt: this.commandsToExecute ? this.commandsToExecute.length : 0
            });
        }
    }

    private async gameDoneAnimation(): Promise<void> {
        // let tasks = [];
        // for (let i = 0; i < this.outputStones.length; i++) {
        //     let stone = this.outputStones[i];
        //     tasks.push(this.tweenStoneTo(stone, this.config.layout.outputArea.x_origin, this.config.layout.outputArea.y_origin, 8, 'linear').then(() => {
        //         stone.sprite.destroy();
        //         stone.text.destroy();
        //     }))
        // }
        // await Promise.all(tasks);
    }

    private async validateOutput(): Promise<void> {
        if (this.ans.length !== this.outputQueue.length) {
            if (this.ans.length < this.outputQueue.length) {
                EventManager.emit('levelFailed', {
                    "message": "Too much stones in the output area, expect " + this.ans.length + " but got " + this.outputQueue.length + "!"
                });
            } else {
                EventManager.emit('levelFailed', {
                    "message": "Not enough stones in the output area, expect " + this.ans.length + " but got " + this.outputQueue.length + "!"
                });
            }

            this.stopExecution();
            return;
        }

        let isCorrect = true;
        for (let i = 0; i < this.ans.length; i++) {
            if (this.ans[i] !== this.outputQueue[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            this.stopExecution();
            await this.gameDoneAnimation();
            // show popup
            EventManager.emit('levelCompleted', {
                executeCnt: this.cmdExcCnt,
                commandCnt: this.commandsToExecute ? this.commandsToExecute.length : 0
            });
        } else {
            this.stopExecution();
            EventManager.emit('levelFailed', {
                "message": "Output is incorrect"
            })
        }
    }
}