import { Worker, Stone, ConstructionSlot, generatorFn, outputFn, CommandWithArgType } from '../types/game';
import { ErrorMessages, GameErrorCodes } from '../types/errors';
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

        // Initialize basic state
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
        this.ans = [];

        // Setup random seed and generators
        this.RANDOM_SEED = Object.freeze(new Date().getTime());
        this.generator1 = new SeededRandom(this.RANDOM_SEED);
        this.generator2 = new SeededRandom(this.RANDOM_SEED);

        // Default configuration
        this.config = {
            stoneSize: { width: 70, height: 70 },
            workerConfig: { x: 300, y: 200 },
            constructionSlots: [],
            generatorFn: () => [1, 2, 3],
            outputFn: () => [],
            layout: {
                inputArea: {
                    x: 200, y: 230, spacing: 60
                },
                outputArea: {
                    x: 830, y: 230, spacing: 60
                },
                constructionArea: {
                    x: 300, y: 300, spacing: 60
                }
            },
            speed: 1.5,
            currentLevel: null
        };

    }
    
    preload(): void {
        // Load sprites and images

        const character = localStorage.getItem('game:selectedCharacter');
        this.load.spritesheet('worker', character === 'Darius'? './worker1.png' : './worker.png', {
            frameWidth: 132,
            frameHeight: 132
        });

        this.load.image('stone', './stone.jpg');
        this.load.image('stoneShadow', './shadow_stone.jpg');
        this.load.image('humanShadow', './shadow_human.jpg');

        this.load.on('loaderror', (file: any) => {
            console.error(`Failed to load: ${file.key}`);
        });
    }

    private resetGameState(): void {
        // Reset game state variables
        this.inputQueue = [];
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
        this.stopped = true;

        // Clean up game objects
        this.destroyWorker();
        this.destroyStones(this.inputStones);
        this.destroyStones(this.outputStones);
        this.destroyConstructionSlots();

        // Reset arrays
        this.inputStones = [];
        this.outputStones = [];
        this.constructionSlots = [];
    }

    private destroyWorker(): void {
        if (this.worker) {
            this.worker.sprite.destroy();
            this.worker.shadow.destroy();
            this.worker = null;
        }
    }

    private destroyStones(stones: Stone[]): void {
        stones.forEach(stone => {
            stone.sprite?.destroy();
            stone.shadow?.destroy();
            stone.text?.destroy();
        });
    }

    private destroyConstructionSlots(): void {
        this.constructionSlots.forEach(slot => {
            slot.rect?.destroy();
            if (slot.stone) {
                slot.stone.sprite?.destroy();
                slot.stone.shadow?.destroy();
                slot.stone.text?.destroy();
            }
        });
    }

    reset(): void {
        this.resetGameState();
    }

    init(data: { errorHandler: ErrorHandler, sceneConfig: PassedConfig }): void {
        // Initialize from passed configuration
        this.errorHandler = data.errorHandler;
        this.config.generatorFn = data.sceneConfig.generatorFn;
        this.config.outputFn = data.sceneConfig.outputFn;
        this.config.constructionSlots = data.sceneConfig.constructionSlots;
        this.config.currentLevel = data.sceneConfig.currentLevel;

        // Generate input sequence and expected output
        this.ans = this.config.outputFn(this.generator2.nextInt.bind(this.generator2));
        this.inputQueue = this.config.generatorFn(this.generator1.nextInt.bind(this.generator1));

        // Reset execution state
        this.outputQueue = [];
        this.cmdExcCnt = 0;
        this.curLine = 0;
        this.commandsToExecute = null;
        this.stopped = true;
    }

    create(): void {
        this.createAnimations();
        this.worker = this.createWorker();
        this.setupInputArea(this.config.layout.inputArea);
        this.setupConstructionArea();
        this.events.emit('sceneReady');
        this.worker.sprite.play('rest', true);
    }

    private createAnimations(): void {
        
        if (this.anims.exists('rest')) {
            // Animations already created, so exit early
            return;
        }

        // Worker animations
        const animations = [
            {
                key: 'rest',
                frames: this.anims.generateFrameNumbers('worker', { start: 0, end: 0 }),
                frameRate: 8,
                repeat: -1
            },
            {
                key: 'walk',
                frames: this.anims.generateFrameNumbers('worker', { start: 7, end: 12 }),
                frameRate: 8,
                repeat: -1
            },
            {
                key: 'pick',
                frames: this.anims.generateFrameNumbers('worker', { start: 14, end: 22 }),
                frameRate: 9,
                repeat: 0
            },
            {
                key: 'drop',
                frames: this.anims.generateFrameNumbers('worker', { start: 23, end: 30 }),
                frameRate: 9,
                repeat: 0
            },
            {
                key: 'holdWalk',
                frames: this.anims.generateFrameNumbers('worker', { start: 31, end: 35 }),
                frameRate: 8,
                repeat: -1
            }
        ];

        animations.forEach(anim => {
            this.anims.create(anim);
        });
    }

    private setupInputArea(config: { x: number; y: number; spacing: number }): void {
        for (let i = 0; i < this.inputQueue.length; i++) {
            const position = {
                x: config.x,
                y: config.y + (i * config.spacing)
            };

            const shadow = this.add.sprite(
                position.x + 10,
                position.y + 10,
                'stoneShadow'
            ).setScale(0.35).setDepth(1);

            const stone = this.add.sprite(
                position.x,
                position.y,
                'stone'
            ).setDepth(5);

            stone.setDisplaySize(
                this.config.stoneSize.width,
                this.config.stoneSize.height
            );

            const text = this.add.text(
                position.x,
                position.y - 8,
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
        this.config.constructionSlots.forEach((slotConfig, idx) => {
            const rect = this.add.rectangle(
                slotConfig.x + 65,
                slotConfig.y + 30,
                this.config.stoneSize.width - 5,
                this.config.stoneSize.height - 5,
            );

            let stone = null;
            if (slotConfig.value !== undefined) {
                stone = this.createStone(
                    slotConfig.x,
                    slotConfig.y,
                    slotConfig.value
                );
            }

            this.constructionSlots.push({ rect, stone });
        });
    }

    private createStone(x: number, y: number, value: number): Stone {
        const shadow = this.add.sprite(
            x + 10,
            y + 10,
            'stoneShadow'
        ).setScale(0.35).setDepth(1);

        const sprite = this.add.sprite(
            x,
            y,
            'stone'
        ).setDepth(5);

        sprite.setDisplaySize(
            this.config.stoneSize.width,
            this.config.stoneSize.height
        );

        const text = this.add.text(
            x,
            y - 8,
            value.toString(),
            {
                color: '#000000',
                fontSize: '18px'
            }
        ).setDepth(5).setOrigin(0.5);

        return { sprite, shadow, value, text };
    }

    private createWorker(): Worker {
        const { x, y } = this.config.workerConfig;
        const shadow = this.add.sprite(x + 6, y + 33, 'humanShadow').setScale(0.6).setDepth(1);
        const sprite = this.physics.add.sprite(x, y, 'worker', 0).setDepth(6);

        return { sprite, shadow };
    }

    modifySpeed(speed: number): void {
        this.config.speed = speed * 0.7;
    }

    private preProcessCommands(commands: CommandWithArgType[]): CommandWithArgType[] {
        const processedCommands = structuredClone(commands);

        // Resolve JUMP references
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

    stopExecution(): void {
        this.stopped = true;
    }

    resumeExecution(): void {
        this.stopped = false;
    }

    async executeCommands(commandsWithArg: CommandWithArgType[]): Promise<void> {
        this.commandsToExecute = commandsWithArg;
        const processedCommands = this.preProcessCommands(commandsWithArg);

        // Jump function for control flow
        let jumpCnt = 0;
        const jumpto = (line: number) => {
            this.curLine = line;
            jumpCnt++;
        };

        this.stopped = false;
        this.curLine = 0;

        // Command execution loop
        while (this.curLine < processedCommands.length && !this.stopped) {
            if (this.detectInfiniteLoop(jumpCnt)) return;

            const commandWithArg = processedCommands[this.curLine];
            this.curLine++;
            this.cmdExcCnt++;

            await this.executeCommand(commandWithArg, jumpto);
        }

        if (!this.stopped) {
            this.validateOutput();
        }
    }

    private async executeCommand(commandWithArg: CommandWithArgType, jumpto: (line: number) => void): Promise<void> {
        const { command, arg } = commandWithArg;

        // Command execution dispatch
        switch (command) {
            case 'INPUT':
                await this.handlePickupFromInput();
                break;
            case 'OUTPUT':
                await this.handleDropToOutput();
                break;
            case 'COPYFROM':
                await this.handleCopyFrom(arg as number);
                break;
            case 'COPYTO':
                await this.handleCopyTo(arg as number);
                break;
            case 'ADD':
                await this.handleAdd(arg as number);
                break;
            case 'SUB':
                await this.handleSub(arg as number);
                break;
            case 'JUMP':
                await this.handleJump(arg as number, jumpto);
                break;
            case 'JUMP = 0':
                await this.handleJumpZ(arg as number, jumpto);
                break;
            case 'JUMP < 0':
                await this.handleJumpN(arg as number, jumpto);
                break;
            case '':
                // No operation
                break;
        }
    }

    private detectInfiniteLoop(jumpCnt: number): boolean {
        const MAX_JUMP_COUNT = 50;
        if (jumpCnt > MAX_JUMP_COUNT) {
            EventManager.emit('levelFailed', {
                "message": "Infinite loop detected!"
            });
            return true;
        }
        return false;
    }

    private getSlotPosition(slotIndex: number): { x: number, y: number } {
        return {
            x: 390 + (slotIndex % 3) * 100,
            y: 380 + Math.floor(slotIndex / 3) * 100
        };
    }

    private async handleCopyFrom(arg: number): Promise<void> {
        const slotPos = this.getSlotPosition(arg);
        await this.tweenWorkerTo(slotPos.x, slotPos.y);

        // Discard current stone if any
        this.discardCarriedStone();

        await this.pickStoneFromSlot(arg);
    }

    private discardCarriedStone(): void {
        if (!this.worker?.stoneCarried) return;

        const stone = this.worker.stoneCarried;
        stone.sprite.destroy();
        stone.text?.destroy();
        stone.shadow?.destroy();
        this.worker.stoneCarried = undefined;
    }

    private async handleCopyTo(arg: number): Promise<void> {
        const slotPos = this.getSlotPosition(arg);
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        await this.copyStoneToSlot(arg);
    }

    private async handleAdd(arg: number): Promise<void> {
        const slotPos = this.getSlotPosition(arg);
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        await this.addStoneFromSlot(arg);
    }

    private async handleSub(arg: number): Promise<void> {
        const slotPos = this.getSlotPosition(arg);
        await this.tweenWorkerTo(slotPos.x, slotPos.y);
        await this.subStoneFromSlot(arg);
    }

    private async handleJump(arg: number, jumpto: (line: number) => void): Promise<void> {
        jumpto(arg);
    }

    private async handleJumpZ(arg: number, jumpto: (line: number) => void): Promise<void> {
        if (!this.worker?.stoneCarried) {
            this.emitErrorAndStop(GameErrorCodes.EMPTY_HAND_JUMP_ZERO);
            return;
        }

        if (this.worker.stoneCarried.value === 0) {
            jumpto(arg);
        }
    }

    private async handleJumpN(arg: number, jumpto: (line: number) => void): Promise<void> {
        if (!this.worker?.stoneCarried) {
            this.emitErrorAndStop(GameErrorCodes.EMPTY_HAND_JUMP_NEG);
            return;
        }

        if (this.worker.stoneCarried.value < 0) {
            jumpto(arg);
        }
    }

    private emitErrorAndStop(errorCode: GameErrorCodes): void {
        EventManager.emit('levelFailed', {
            "message": ErrorMessages[errorCode]
        });
        this.stopExecution();
    }

    private async dropStone(stone: Stone, faceLeft: boolean): Promise<void> {
        if (!this.worker) return;

        const adjust = { x: faceLeft ? 45 : -45, y: 55 };

        // Play drop animation
        this.worker.sprite.play('drop', true);

        // Create shadow for dropped stone
        const shadow = this.add.sprite(
            stone.sprite.x + 10,
            stone.sprite.y + 10,
            'stoneShadow'
        ).setScale(0.25).setDepth(1).setAlpha(0);

        stone.shadow = shadow;

        // Animate stone placement
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

        await this.delay(1000);
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async pickUpStone(stone: Stone, faceLeft: boolean, useCopy: boolean): Promise<void> {
        if (!this.worker) return;


        // Remove any existing carried stone
        this.discardCarriedStone();

        // Set proper depth for picked up stone
        stone.sprite.setDepth(7);
        stone.text?.setDepth(7);

        // Play pickup animation
        this.worker.sprite.play('pick', true);
        await this.delay(300);

        // Calculate position adjustment based on facing direction
        const adjust = { x: faceLeft ? 45 : -45, y: -55 };

        // Animate shadow fading
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

        // Animate stone movement to worker's hand
        await Promise.all([
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.sprite,
                    x: stone.sprite.x + adjust.x,
                    y: stone.sprite.y + adjust.y,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }),
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.text,
                    x: stone.text.x + adjust.x,
                    y: stone.text.y + adjust.y,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            })
        ]);

        // Set the new carried stone
        if (useCopy) {
            this.worker.stoneCarried = _.cloneDeep(stone);
        } else {
            this.worker.stoneCarried = stone;
        }
    }

    private async handlePickupFromInput(): Promise<void> {
        if (!this.worker) return;

        // Calculate position to move to
        const pickupPosition = {
            x: this.config.layout.inputArea.x + 60,
            y: this.config.layout.inputArea.y +
                (this.inputQueue.length - this.inputStones.length) *
                this.config.layout.inputArea.spacing
        };

        await this.tweenWorkerTo(pickupPosition.x, pickupPosition.y);

        // If no more stones, check output
        if (this.inputStones.length === 0) {
            this.validateOutput();
            return;
        }

        const stone = this.inputStones.shift() as Stone;
        await this.pickUpStone(stone, true, false);
    }

    private async performSlotOperation(
        slotIndex: number,
        operation: (slotValue: number, carriedValue: number) => number,
        emptySlotError: GameErrorCodes,
        emptyHandError: GameErrorCodes
    ): Promise<void> {
        if (!this.worker) return;

        const slotStone = this.constructionSlots[slotIndex];
        if (!slotStone.stone) {
            this.emitErrorAndStop(emptySlotError);
            return;
        }

        if (!this.worker.stoneCarried) {
            this.emitErrorAndStop(emptyHandError);
            return;
        }

        // Get values before any operations
        const originalSlotValue = slotStone.stone.value;
        const carriedValue = this.worker.stoneCarried.value;

        // 1. Animation: Put down carried stone next to slot
        const carriedStone = this.worker.stoneCarried;
        this.worker.sprite.play('drop', true);

        // Create a temporary stone visualization to place in the slot
        const stoneCopy = this.createStoneCopy(carriedStone);

        // Calculate target position in the slot
        const targetX = slotStone.rect.x - 65;
        const targetY = slotStone.rect.y - 30;

        // Hide original carried stone during animation
        this.hideStone(carriedStone);

        // Animate: Move the stone copy to the slot
        await this.animateStoneCopyToSlot(stoneCopy, targetX, targetY);

        // Calculate the result value based on the operation
        const resultValue = operation(originalSlotValue, carriedValue);

        // Pick up result stone animation
        this.worker.sprite.play('pick', true);
        await this.delay(300);

        // Create the result stone at the slot position
        const resultStone = this.createStoneWithValue(targetX, targetY, resultValue);

        // Clean up the temporary stone copy
        this.destroyStoneCopy(stoneCopy);

        // Animate: Fade out shadow and move to worker's hand
        this.fadeOutStoneShadow(resultStone.shadow);

        // Move stone to worker's hand
        const adjust = { x: -45, y: -55 };
        await this.animateStoneToHand(resultStone, targetX, targetY, adjust);

        // Clean up original carried stone
        this.destroyStoneCopy(carriedStone);

        // Set result as new carried stone
        this.worker.stoneCarried = resultStone;
    }

    private createStoneCopy(original: Stone): Stone {
        return {
            sprite: this.add.sprite(
                original.sprite.x,
                original.sprite.y,
                'stone'
            ).setDepth(7)
                .setDisplaySize(this.config.stoneSize.width, this.config.stoneSize.height),

            shadow: this.add.sprite(
                original.sprite.x + 10,
                original.sprite.y + 10,
                'stoneShadow'
            ).setScale(0.35).setDepth(1),

            value: original.value,

            text: this.add.text(
                original.sprite.x,
                original.sprite.y - 8,
                original.value.toString(),
                {
                    color: '#000000',
                    fontSize: '18px'
                }
            ).setDepth(7).setOrigin(0.5)
        };
    }

    private hideStone(stone: Stone): void {
        stone.sprite.setVisible(false);
        stone.text?.setVisible(false);
        stone.shadow?.setVisible(false);
    }

    private async animateStoneCopyToSlot(stone: Stone, targetX: number, targetY: number): Promise<void> {
        await Promise.all([
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
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.text,
                    x: targetX,
                    y: targetY - 8,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }),
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.shadow,
                    x: targetX + 10,
                    y: targetY + 10,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            })
        ]);
    }

    private createStoneWithValue(x: number, y: number, value: number): Stone {
        return {
            sprite: this.add.sprite(x, y, 'stone')
                .setDepth(7)
                .setDisplaySize(this.config.stoneSize.width, this.config.stoneSize.height),

            shadow: this.add.sprite(x + 10, y + 10, 'stoneShadow')
                .setScale(0.35)
                .setDepth(1),

            value: value,

            text: this.add.text(x, y - 8, value.toString(), {
                color: '#000000',
                fontSize: '18px'
            }).setDepth(7).setOrigin(0.5)
        };
    }

    private destroyStoneCopy(stone: Stone): void {
        stone.sprite.destroy();
        stone.text?.destroy();
        stone.shadow?.destroy();
    }

    private fadeOutStoneShadow(shadow?: Phaser.GameObjects.Sprite): void {
        if (!shadow) return;

        this.tweens.add({
            targets: shadow,
            alpha: 0,
            scale: 0.25,
            duration: 700,
            ease: 'Linear',
            onComplete: () => {
                shadow.destroy();
            }
        });
    }

    private async animateStoneToHand(
        stone: Stone,
        baseX: number,
        baseY: number,
        offset: { x: number, y: number }
    ): Promise<void> {
        await Promise.all([
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.sprite,
                    x: baseX + offset.x,
                    y: baseY + offset.y,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            }),
            new Promise<void>(resolve => {
                this.tweens.add({
                    targets: stone.text,
                    x: baseX + offset.x,
                    y: baseY + offset.y - 8,
                    duration: 700,
                    ease: 'Power2.easeInOut',
                    onComplete: () => resolve()
                });
            })
        ]);
    }

    private async addStoneFromSlot(slot: number): Promise<void> {
        await this.performSlotOperation(
            slot,
            (slotValue, carriedValue) => slotValue + carriedValue,
            GameErrorCodes.ADD_EMPTY,
            GameErrorCodes.EMPTY_HAND_ADD
        );
    }

    private async subStoneFromSlot(slot: number): Promise<void> {
        await this.performSlotOperation(
            slot,
            (slotValue, carriedValue) => carriedValue - slotValue,
            GameErrorCodes.SUB_EMPTY,
            GameErrorCodes.EMPTY_HAND_SUB
        );
    }

    private async pickStoneFromSlot(slot: number): Promise<void> {
        if (!this.worker) return;

        const slotStone = this.constructionSlots[slot];
        if (!slotStone.stone) {
            this.emitErrorAndStop(GameErrorCodes.COPYFROM_EMPTY);
            return;
        }

        // Remove any stone currently in hand
        this.discardCarriedStone();

        // Face the right direction
        this.worker.sprite.setFlipX(false);
        this.worker.sprite.play('pick', true);

        // Create a copy of the stone in the slot
        const originalStone = slotStone.stone;
        const stoneCopy = this.createStoneCopy(originalStone);

        // Pick up the stone
        await this.pickUpStone(stoneCopy, false, false);
        this.worker.stoneCarried = stoneCopy;
    }

    private async copyStoneToSlot(slot: number): Promise<void> {
        if (!this.worker || !this.scene) return;

        const carriedStone = this.worker.stoneCarried;
        if (!carriedStone) {
            this.emitErrorAndStop(GameErrorCodes.EMPTY_HAND_COPYTO);
            return;
        }

        const targetSlot = this.constructionSlots[slot];
        if (!targetSlot) {
            console.error(`Invalid slot index: ${slot}`);
            return;
        }

        // Play drop animation
        this.worker.sprite.play('drop', true);

        // Calculate target position
        const targetX = targetSlot.rect.x - 65;
        const targetY = targetSlot.rect.y - 30;

        // Create a copy of the carried stone
        const stoneCopy = this.createStoneCopy(carriedStone);

        // Hide original stone during animation
        this.hideStone(carriedStone);

        // Animate stone copy placement
        await this.animateStoneCopyToSlot(stoneCopy, targetX, targetY);

        // Clean up any existing stone in the slot
        if (targetSlot.stone) {
            this.destroyStoneCopy(targetSlot.stone);
        }

        // Set the copied stone in the slot
        targetSlot.stone = stoneCopy;

        // Lower depth to appear under worker
        stoneCopy.sprite.setDepth(5);
        stoneCopy.text?.setDepth(5);

        // Make original stone visible again
        carriedStone.sprite.setVisible(true);
        carriedStone.text?.setVisible(true);
        carriedStone.shadow?.setVisible(true);

        // Small delay to complete animation
        await this.delay(200);
    }

    private async handleDropToOutput(): Promise<void> {
        if (!this.worker) return;

        if (!this.worker.stoneCarried) {
            this.emitErrorAndStop(GameErrorCodes.EMPTY_HAND_OUTPUT);
            return;
        }

        // Move to output position
        const dropPosition = {
            x: this.config.layout.outputArea.x,
            y: this.config.layout.outputArea.y +
                this.outputQueue.length * this.config.layout.outputArea.spacing
        };

        await this.tweenWorkerTo(dropPosition.x, dropPosition.y);

        // Get stone from hand
        const stone = this.worker.stoneCarried;
        this.worker.stoneCarried = undefined;

        // Drop animation
        await this.dropStone(stone, false);

        // Update output state
        this.outputStones.unshift(stone);
        this.outputQueue.push(stone.value);
        this.preValidateOutput();
    }

    private async tweenWorkerTo(x: number, y: number): Promise<void> {
        return new Promise((resolve) => {
            if (!this.worker) return resolve();

            const dx = x - this.worker.sprite.x;
            this.worker.sprite.setFlipX(dx < 0);

            const distance = Phaser.Math.Distance.Between(
                this.worker.sprite.x,
                this.worker.sprite.y,
                x, y
            );

            const baseSpeed = 4;
            const duration = (distance * baseSpeed) / this.config.speed;

            // Set animation based on whether worker is carrying a stone
            if (this.worker.stoneCarried) {
                this.worker.sprite.play('holdWalk', true);

                // Also move the carried stone
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

            // Move worker
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

            // Move shadow
            this.tweens.add({
                targets: this.worker.shadow,
                x: x + 2,
                y: y + 33,
                duration,
                ease: 'Linear'
            });
        });
    }

    private preValidateOutput(): void {
        // Skip if output is not complete
        if (this.ans.length !== this.outputQueue.length) {
            return;
        }

        // Check if all values match
        const isCorrect = this.ans.every((val, idx) => val === this.outputQueue[idx]);

        if (isCorrect) {
            this.stopExecution();

            // Notify level completion with statistics
            EventManager.emit('levelCompleted', {
                executeCnt: this.cmdExcCnt,
                commandCnt: this.commandsToExecute ? this.commandsToExecute.length : 0
            });
        }
    }

    private async validateOutput(): Promise<void> {
        // Check if output length matches expected
        if (this.ans.length !== this.outputQueue.length) {
            if (this.ans.length < this.outputQueue.length) {
                EventManager.emit('levelFailed', {
                    "message": `Too much stones in the output area, expect ${this.ans.length} but got ${this.outputQueue.length}!`
                });
            } else {
                EventManager.emit('levelFailed', {
                    "message": `Not enough stones in the output area, expect ${this.ans.length} but got ${this.outputQueue.length}!`
                });
            }

            this.stopExecution();
            return;
        }

        // Check if all values match expected
        const isCorrect = this.ans.every((val, idx) => val === this.outputQueue[idx]);

        if (isCorrect) {
            this.stopExecution();
            EventManager.emit('levelCompleted', {
                executeCnt: this.cmdExcCnt,
                commandCnt: this.commandsToExecute ? this.commandsToExecute.length : 0
            });
        } else {
            this.stopExecution();
            EventManager.emit('levelFailed', {
                "message": "Output is incorrect"
            });
        }
    }
}