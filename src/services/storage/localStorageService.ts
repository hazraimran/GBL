import { StorageItem } from './types';

export class LocalStorageService {
    private prefix: string;

    constructor(prefix: string = 'app') {
        this.prefix = prefix;
    }

    private getKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    set<T>(key: string, value: T, expirationHours?: number): void {
        const item: StorageItem<T> = {
            value,
            timestamp: Date.now(),
        };

        localStorage.setItem(this.getKey(key), JSON.stringify(item));
    }

    get<T>(key: string, defaultValue?: T): T | null {
        const data = localStorage.getItem(this.getKey(key));

        if (!data) return defaultValue || null;

        try {
            const item: StorageItem<T> = JSON.parse(data);
            return item.value;
        } catch {
            return defaultValue || null;
        }
    }

    remove(key: string): void {
        localStorage.removeItem(this.getKey(key));
    }

    clear(): void {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}