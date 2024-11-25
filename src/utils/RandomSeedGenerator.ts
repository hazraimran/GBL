class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (1664525 * this.seed + 1013904223) % Math.pow(2, 32);
        return this.seed / Math.pow(2, 32);
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1) + min);
    }

    generateSequence(length: number, min: number, max: number): number[] {
        const sequence: number[] = [];
        for (let i = 0; i < length; i++) {
            sequence.push(this.nextInt(min, max));
        }
        return sequence;
    }
}

export default SeededRandom;
