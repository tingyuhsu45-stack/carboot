'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserGoals, DEFAULT_GOALS, loadGoals, saveGoals } from '@/lib/goals';

interface GoalsContextType {
    goals: UserGoals;
    setGoals: (goals: UserGoals) => void;
    isLoaded: boolean;
}

const GoalsContext = createContext<GoalsContextType>({
    goals: DEFAULT_GOALS,
    setGoals: () => { },
    isLoaded: false,
});

export function GoalsProvider({ children }: { children: React.ReactNode }) {
    const [goals, setGoalsState] = useState<UserGoals>(() => {
        const stored = loadGoals();
        return stored || DEFAULT_GOALS;
    });
    const [isLoaded] = useState(true);

    const setGoals = useCallback((newGoals: UserGoals) => {
        setGoalsState(newGoals);
        saveGoals(newGoals);
    }, []);

    return (
        <GoalsContext.Provider value={{ goals, setGoals, isLoaded }}>
            {children}
        </GoalsContext.Provider>
    );
}

export function useGoals() {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
}
