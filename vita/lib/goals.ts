export interface UserGoals {
    username: string;
    sleepHours: number;
    exerciseMinutes: number;
    calorieTarget: number;
    waterGlasses: number;
}

const GOALS_KEY = 'vita_user_goals';

export const DEFAULT_GOALS: UserGoals = {
    username: '',
    sleepHours: 8,
    exerciseMinutes: 30,
    calorieTarget: 2000,
    waterGlasses: 8,
};

export function saveGoals(goals: UserGoals): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    }
}

export function loadGoals(): UserGoals | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(GOALS_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as UserGoals;
    } catch {
        return null;
    }
}

export function hasCompletedOnboarding(): boolean {
    if (typeof window === 'undefined') return false;
    const goals = loadGoals();
    return goals !== null && goals.username.trim().length > 0;
}

export function clearGoals(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(GOALS_KEY);
    }
}
