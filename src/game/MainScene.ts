import { Worker, Stone, ConstructionSlot, StoneType, CommandType } from '../types/game';

interface InputSlot {
    rect: Phaser.GameObjects.Rectangle;
    stone?: Stone;
}

interface OutputSlot {
    rect: Phaser.GameObjects.Rectangle;
    stone?: Stone;
    expectedValue?: StoneType;
}

export class MainScene extends Phaser.Scene {
    private workers: Worker[] = [];
    private stones: Stone[] = [];
    private constructionSlots: ConstructionSlot[] = [];
    private inputSlots: InputSlot[] = [];
    private outputSlots: OutputSlot[] = [];
    private currentLevel: number;
    private commandQueue: CommandType[];

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
        this.setupInputArea();
        this.setupOutputArea();
        this.setupConstructionArea();
        this.setupStonePileArea();
        this.setupWorkers();
        this.setupLevel(this.currentLevel);
    }

    private setupInputArea(): void {
        const width = this.game.config.width as number;

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
        // Example level setup
        const inputData: StoneType[] = ['small', 'medium', 'large'];

        // Setup input slots with initial stones
        inputData.forEach((stoneType, index) => {
            const stone: Stone = {
                sprite: this.add.sprite(
                    this.inputSlots[index].rect.x,
                    this.inputSlots[index].rect.y,
                    `stone-${stoneType}`
                ),
                type: stoneType
            };
            this.inputSlots[index].stone = stone;
        });

        // Setup expected output
        this.outputSlots.forEach((slot, index) => {
            slot.expectedValue = inputData[index];
        });
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
            // Find the first input slot with a stone
            const inputSlot = this.inputSlots.find(slot => slot.stone);
            if (inputSlot && inputSlot.stone) {
                worker.isCarrying = true;
                worker.currentStone = inputSlot.stone.type;
                inputSlot.stone.sprite.setVisible(false);
                inputSlot.stone = undefined;

                // Move worker to input position
                this.tweenWorkerTo(worker, inputSlot.rect.x + 60, inputSlot.rect.y);
            }
        }
    }

    private handleDropToOutput(worker: Worker): void {
        if (worker.isCarrying) {
            // Find the first empty output slot
            const outputSlot = this.outputSlots.find(slot => !slot.stone);
            if (outputSlot) {
                // Move worker to output position
                this.tweenWorkerTo(worker, outputSlot.rect.x - 60, outputSlot.rect.y, () => {
                    // Create new stone in output slot
                    const stone: Stone = {
                        sprite: this.add.sprite(
                            outputSlot.rect.x,
                            outputSlot.rect.y,
                            `stone-${worker.currentStone}`
                        ),
                        type: worker.currentStone!
                    };
                    outputSlot.stone = stone;
                    worker.isCarrying = false;
                    worker.currentStone = undefined;

                    // Check if the output matches the expected value
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
                nearbyStone.sprite.setVisible(false);
            }
        }
    }

    private handleDrop(worker: Worker): void {
        if (worker.isCarrying) {
            const validSlot = this.findValidConstructionSlot(worker);
            if (validSlot) {
                validSlot.isOccupied = true;
                worker.isCarrying = false;
                worker.currentStone = undefined;
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
        const isCorrect = this.outputSlots.every(slot =>
            !slot.expectedValue ||
            (slot.stone && slot.stone.type === slot.expectedValue)
        );

        if (isCorrect) {
            console.log('Level completed!');
            // You can add level completion logic here
        }
    }
}