import { ActivityType } from '@/components/TimelineNode';

/**
 * XP awarded per hour for each activity type.
 * Non-duration activities (food, metric) use a flat rate.
 */
export const XP_RATES: Record<ActivityType, number> = {
    exercise: 20,
    work: 10,
    sleep: 5,
    food: 5,   // flat
    metric: 5, // flat
};

/** Activity types that don't use duration for XP calculation */
const FLAT_XP_TYPES: ActivityType[] = ['food', 'metric'];

/**
 * Calculate XP awarded for an activity based on its type and duration.
 * Duration-based activities earn XP proportional to time spent (minimum 5 XP).
 * Non-duration activities (food, metric) always earn a flat amount.
 */
export function calculateXP(type: ActivityType, durationSeconds?: number): number {
    if (FLAT_XP_TYPES.includes(type)) {
        return XP_RATES[type];
    }

    if (!durationSeconds || durationSeconds <= 0) {
        return 5; // minimum XP
    }

    const hours = durationSeconds / 3600;
    return Math.max(5, Math.round(XP_RATES[type] * hours));
}

/**
 * Level thresholds: Level N requires N * 100 cumulative XP.
 * Level 1: 0–99 XP, Level 2: 100–199 XP, Level 3: 200–299 XP, etc.
 */
export function getLevelFromXP(totalXP: number): {
    level: number;
    currentXP: number;
    xpForNextLevel: number;
    progress: number; // 0–1 fraction
} {
    const level = Math.floor(totalXP / 100) + 1;
    const xpIntoLevel = totalXP % 100;
    const xpForNextLevel = 100;

    return {
        level,
        currentXP: xpIntoLevel,
        xpForNextLevel,
        progress: xpIntoLevel / xpForNextLevel,
    };
}
