import { Worker, Stone, ConstructionSlot, StoneType, CommandType } from '../types/game';

// 新增的类型定义
interface LevelConfig {
    generateInputs: () => number[];
    validateOutput: (output: number[]) => boolean;
    slots: SlotConfig[];
}

interface SlotConfig {
    x: number;
    y: number;
}

interface InputSlot {
    rect: Phaser.GameObjects.Rectangle;
    stone?: Stone;
    value?: number;
}

interface OutputSlot {
    rect: Phaser.GameObjects.Rectangle;
    stone?: Stone;
    expectedValue?: StoneType;
    value?: number;
}

export class MainScene extends Phaser.Scene {
    private workers: Worker[] = [];
    private stones: Stone[] = [];
    private constructionSlots: ConstructionSlot[] = [];
    private inputSlots: InputSlot[] = [];
    private outputSlots: OutputSlot[] = [];
    private currentLevel: number;
    private commandQueue: CommandType[];
    private levelConfig: LevelConfig | null = null;

    constructor() {
        super({ key: 'MainScene' });
        this.currentLevel = 1;
        this.commandQueue = [];
    }

    preload(): void {
        this.load.setBaseURL('/assets/');
        this.load.image('worker', '/OIP.jpeg');
        this.load.image('stone-small', '/stone.png');
        this.load.image('stone-medium', 'stone.png');
        this.load.image('stone-large', 'stone.png');
    }

    create(): void {
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0)');

        // 加载默认关卡配置
        this.loadLevelConfig({
            generateInputs: () => [1, 2, 3],
            validateOutput: (output) => output.every((val, idx) => val === idx + 1),
            slots: [
                { x: 300, y: 200 },
                { x: 300, y: 300 },
                { x: 300, y: 400 }
            ]
        });

        this.setupInputArea();
        this.setupOutputArea();
        this.setupConstructionArea();
        this.setupStonePileArea();
        this.setupWorkers();
        this.setupLevel(this.currentLevel);
    }

    private setupInputArea(): void {
        // Create input slots on the left side
        for (let i = 0; i < 3; i++) {
            const rect = this.add.rectangle(
                100,
                150 + (i * 60),
                50,
                50,
                0x00ff00,
                0.3
            );
            rect.setStrokeStyle(2, 0x00ff00);

            const slot: InputSlot = { rect };
            this.inputSlots.push(slot);
        }

        // Add "INPUT" text
        this.add.text(70, 100, 'INPUT', {
            fontSize: '16px',
            color: '#00ff00'
        });
    }

    private setupOutputArea(): void {
        const width = this.game.config.width as number;

        // Create output slots on the right side
        for (let i = 0; i < 3; i++) {
            const rect = this.add.rectangle(
                width - 100,
                150 + (i * 60),
                50,
                50,
                0xff0000,
                0.3
            );
            rect.setStrokeStyle(2, 0xff0000);

            const slot: OutputSlot = { rect };
            this.outputSlots.push(slot);
        }

        // Add "OUTPUT" text
        this.add.text(width - 130, 100, 'OUTPUT', {
            fontSize: '16px',
            color: '#ff0000'
        });
    }

    private setupConstructionArea(): void {
        const width = this.game.config.width as number;
        const height = this.game.config.height as number;

        for (let i = 0; i < 3; i++) {
            const slot: ConstructionSlot = {
                rect: this.add.rectangle(
                    width / 2 + (i * 60),
                    height - 100,
                    50,
                    50,
                    0x666666,
                    0.5
                ),
                isOccupied: false
            };
            this.constructionSlots.push(slot);
        }
    }

    private setupStonePileArea(): void {
        const stoneTypes: StoneType[] = ['small', 'medium', 'large'];
        stoneTypes.forEach((type, index) => {
            const stone: Stone = {
                sprite: this.add.sprite(100, 300 + (index * 60), `stone-${type}`),
                type: type
            };
            stone.sprite.setInteractive();
            this.stones.push(stone);
        });
    }

    private setupWorkers(): void {
        const worker: Worker = {
            sprite: this.add.sprite(200, 300, 'worker'),
            isCarrying: false
        };
        worker.sprite.setInteractive();
        this.workers.push(worker);
    }

    private setupLevel(level: number): void {
        if (this.levelConfig) {
            const inputValues = this.levelConfig.generateInputs();

            inputValues.forEach((value, index) => {
                const stone: Stone = {
                    sprite: this.add.sprite(
                        this.inputSlots[index].rect.x,
                        this.inputSlots[index].rect.y,
                        `stone-small`
                    ),
                    type: 'small',
                    value: value
                };
                this.inputSlots[index].stone = stone;
                this.inputSlots[index].value = value;

                // 在石头上显示数值
                this.add.text(
                    stone.sprite.x - 5,
                    stone.sprite.y - 8,
                    value.toString(),
                    { fontSize: '16px', color: '#ffffff' }
                ).setOrigin(0.5);
            });
        }
    }

    public executeCommands(commands: CommandType[]): void {
        this.commandQueue = [...commands];
        this.processNextCommand();
    }

    private processNextCommand(): void {
        if (this.commandQueue.length === 0) return;

        const command = this.commandQueue.shift();
        if (command) this.executeCommand(command);
    }

    private executeCommand(command: CommandType): void {
        const worker = this.workers[0];

        switch (command) {
            case 'INPUT':
                this.handlePickupFromInput(worker);
                break;
            case 'OUTPUT':
                this.handleDropToOutput(worker);
                break;
            case 'COPYFROM':
                this.handlePickup(worker);
                break;
            case 'COPYTO':
                this.handleDrop(worker);
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

        setTimeout(() => this.processNextCommand(), 500);
    }

    private handlePickupFromInput(worker: Worker): void {
        if (!worker.isCarrying) {
            const inputSlot = this.inputSlots.find(slot => slot.stone);
            if (inputSlot && inputSlot.stone) {
                worker.isCarrying = true;
                worker.currentStone = inputSlot.stone.type;
                worker.carryingValue = inputSlot.value;
                inputSlot.stone.sprite.setVisible(false);
                inputSlot.stone = undefined;
                inputSlot.value = undefined;

                this.tweenWorkerTo(worker, inputSlot.rect.x + 60, inputSlot.rect.y);
            }
        }
    }

    private handleDropToOutput(worker: Worker): void {
        if (worker.isCarrying) {
            const outputSlot = this.outputSlots.find(slot => !slot.stone);
            if (outputSlot) {
                this.tweenWorkerTo(worker, outputSlot.rect.x - 60, outputSlot.rect.y, () => {
                    const stone: Stone = {
                        sprite: this.add.sprite(
                            outputSlot.rect.x,
                            outputSlot.rect.y,
                            `stone-${worker.currentStone}`
                        ),
                        type: worker.currentStone!,
                        value: worker.carryingValue
                    };

                    outputSlot.stone = stone;
                    outputSlot.value = worker.carryingValue;

                    this.add.text(
                        stone.sprite.x - 5,
                        stone.sprite.y - 8,
                        stone.value?.toString() || '',
                        { fontSize: '16px', color: '#ffffff' }
                    ).setOrigin(0.5);

                    worker.isCarrying = false;
                    worker.currentStone = undefined;
                    worker.carryingValue = undefined;

                    this.checkOutput();
                });
            }
        }
    }

    private handlePickup(worker: Worker): void {
        if (!worker.isCarrying) {
            const nearbyStone = this.findNearbyStone(worker);
            if (nearbyStone) {
                worker.isCarrying = true;
                worker.currentStone = nearbyStone.type;
                worker.carryingValue = nearbyStone.value;
                nearbyStone.sprite.setVisible(false);
            }
        }
    }

    private handleDrop(worker: Worker): void {
        if (worker.isCarrying) {
            const validSlot = this.findValidConstructionSlot(worker);
            if (validSlot) {
                validSlot.isOccupied = true;

                // Create new stone in the slot
                const stone: Stone = {
                    sprite: this.add.sprite(
                        validSlot.rect.x,
                        validSlot.rect.y,
                        `stone-${worker.currentStone}`
                    ),
                    type: worker.currentStone!,
                    value: worker.carryingValue
                };

                // Display the value
                if (worker.carryingValue !== undefined) {
                    this.add.text(
                        stone.sprite.x - 5,
                        stone.sprite.y - 8,
                        worker.carryingValue.toString(),
                        { fontSize: '16px', color: '#ffffff' }
                    ).setOrigin(0.5);
                }

                worker.isCarrying = false;
                worker.currentStone = undefined;
                worker.carryingValue = undefined;
            }
        }
    }

    private findNearbyStone(worker: Worker): Stone | undefined {
        return this.stones.find(stone =>
            Phaser.Math.Distance.Between(
                worker.sprite.x,
                worker.sprite.y,
                stone.sprite.x,
                stone.sprite.y
            ) < 50
        );
    }

    private findValidConstructionSlot(worker: Worker): ConstructionSlot | undefined {
        return this.constructionSlots.find(slot =>
            !slot.isOccupied &&
            Phaser.Math.Distance.Between(
                worker.sprite.x,
                worker.sprite.y,
                slot.rect.x,
                slot.rect.y
            ) < 50
        );
    }

    private tweenWorkerTo(worker: Worker, x: number, y: number, onComplete?: () => void): void {
        this.tweens.add({
            targets: worker.sprite,
            x: x,
            y: y,
            duration: 500,
            ease: 'Power2',
            onComplete: onComplete
        });
    }

    private checkOutput(): void {
        if (!this.levelConfig) return;

        const outputValues = this.outputSlots
            .map(slot => slot.value)
            .filter((value): value is number => value !== undefined);

        const isCorrect = this.levelConfig.validateOutput(outputValues);

        if (isCorrect) {
            console.log('Level completed!');
            // You can add level completion logic here
        }
    }

    public loadLevelConfig(config: LevelConfig): void {
        this.levelConfig = config;
        this.clearCurrentLevel();
        this.setupLevel(this.currentLevel);

        // 设置构造槽
        config.slots.forEach((slotConfig, index) => {
            if (index < this.constructionSlots.length) {
                const slot = this.constructionSlots[index];
                slot.rect.setPosition(slotConfig.x, slotConfig.y);
            }
        });
    }

    private clearCurrentLevel(): void {
        // 清除所有石头
        this.stones.forEach(stone => stone.sprite.destroy());
        this.stones = [];

        // 清除输入槽中的石头
        this.inputSlots.forEach(slot => {
            if (slot.stone) {
                slot.stone.sprite.destroy();
                slot.stone = undefined;
                slot.value = undefined;
            }
        });

        // 清除输出槽中的石头
        this.outputSlots.forEach(slot => {
            if (slot.stone) {
                slot.stone.sprite.destroy();
                slot.stone = undefined;
                slot.value = undefined;
            }
        });
    }
}