// victorySound.ts

export interface PlayVictorySoundOptions {
    soundUrl?: string;
}

export class VictorySoundPlayer {
    private static audioElement: HTMLAudioElement | null = null;
    private static isInitialized = false;

    private static initialize(soundUrl: string) {
        if (!this.isInitialized) {
            this.audioElement = new Audio(soundUrl);
            this.audioElement.preload = 'auto';
            this.isInitialized = true;
        }
    }

    static play(options: PlayVictorySoundOptions = {}): Promise<void> {
        const { soundUrl = '/victory.mp3' } = options;

        this.initialize(soundUrl);

        if (this.audioElement) {
            this.audioElement.currentTime = 0;
            return this.audioElement.play().catch((error: Error) => {
                console.error('播放音效失败:', error);
                throw error;
            });
        }
        return Promise.reject(new Error('Audio element not initialized'));
    }
}

export const playVictorySound = VictorySoundPlayer.play.bind(VictorySoundPlayer);

export default VictorySoundPlayer;