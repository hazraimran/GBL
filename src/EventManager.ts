// services/EventManager.ts
type EventCallback = (data?: any) => void;

class EventManager {
    private static instance: EventManager;
    private listeners: Map<string, EventCallback[]> = new Map();

    private constructor() { }

    static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }
        return EventManager.instance;
    }

    on(event: string, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    emit(event: string, data?: any) {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    remove(event: string, callback: EventCallback) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}

export default EventManager.getInstance();