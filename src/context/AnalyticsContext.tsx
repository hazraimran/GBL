import React, { createContext, useContext, ReactNode } from 'react';
import { useLevelAnalytics } from '../hooks/useLevelAnalytics';

interface AnalyticsContextType {
    analytics: ReturnType<typeof useLevelAnalytics>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode; levelId: number }> = ({ children, levelId }) => {
    const analytics = useLevelAnalytics(levelId);

    return (
        <AnalyticsContext.Provider value={{ analytics }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (context === undefined) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }
    return context.analytics;
}; 