// utils/storage.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Generate a unique identifier combining device fingerprint and timestamp
export const generateUID = async (): Promise<string> => {
    // Base ID using timestamp and random number for uniqueness
    const baseId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    try {
        
        const fp = await FingerprintJS.load();
        // Get visitor identifier based on browser/device characteristics
        const result = await fp.get();

        return `${result.visitorId}-${baseId}`;
    } catch (error) {
        console.warn('Failed to generate fingerprint, using fallback ID');
        return baseId;
    }
};

// Retrieve existing UID from storage or create new one
export const getOrCreateUID = async (): Promise<string> => {
    const storedUID = localStorage.getItem('uid');
    if (storedUID) {
        return storedUID;
    }

    const newUID = await generateUID();
    localStorage.setItem('uid', newUID);
    return newUID;
};