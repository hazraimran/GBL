// services/fingerprint/fingerprintService.ts
import FingerprintJS from 'fingerprintjs';

export class FingerprintService {
    private static instance: FingerprintService;
    private fp: any = null;

    private constructor() { }

    static getInstance(): FingerprintService {
        if (!FingerprintService.instance) {
            FingerprintService.instance = new FingerprintService();
        }
        return FingerprintService.instance;
    }

    async initialize(): Promise<void> {
        if (!this.fp) {
            this.fp = await FingerprintJS.load();
        }
    }

    async getVisitorId(): Promise<string> {
        await this.initialize();
        const result = await this.fp.get();
        return result.visitorId;
    }
}