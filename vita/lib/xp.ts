import { ActivityType } from '@/components/TimelineNode';

// ===== XP Category System =====
export type XPCategory = 'health' | 'wisdom' | 'spirit' | 'stamina';

/** Maps each activity type to its primary XP category */
export const ACTIVITY_TO_CATEGORY: Record<ActivityType, XPCategory> = {
    exercise: 'health',
    food: 'health',
    metric: 'health',
    work: 'wisdom',
    sleep: 'spirit',
};

/** Maps quest types to their XP category */
export const QUEST_TO_CATEGORY: Record<string, XPCategory> = {
    puzzle: 'wisdom',
    guitar: 'wisdom',
    webdesign: 'wisdom',
    duolingo: 'wisdom',
    yoga: 'spirit',
    meditation: 'spirit',
};

// ===== XP Rates =====
export const XP_RATES: Record<ActivityType, number> = {
    exercise: 20,
    work: 10,
    sleep: 5,
    food: 5,
    metric: 5,
};

const FLAT_XP_TYPES: ActivityType[] = ['food', 'metric'];

/**
 * Calculate XP awarded for an activity based on its type and duration.
 */
export function calculateXP(type: ActivityType, durationSeconds?: number): number {
    if (FLAT_XP_TYPES.includes(type)) {
        return XP_RATES[type];
    }
    if (!durationSeconds || durationSeconds <= 0) {
        return 5;
    }
    const hours = durationSeconds / 3600;
    return Math.max(5, Math.round(XP_RATES[type] * hours));
}

/**
 * Calculate XP for a 5-min daily quest completion.
 */
export function calculateQuestXP(questType: string): number {
    const isSpirit = ['yoga', 'meditation'].includes(questType);
    return isSpirit ? 12 : 10; // slight boost for spirit tasks
}

/**
 * Get the XP category for a given activity or quest type.
 */
export function getXPCategory(type: string): XPCategory {
    if (type in ACTIVITY_TO_CATEGORY) {
        return ACTIVITY_TO_CATEGORY[type as ActivityType];
    }
    if (type in QUEST_TO_CATEGORY) {
        return QUEST_TO_CATEGORY[type];
    }
    return 'wisdom'; // default
}

// ===== Level System =====
export function getLevelFromXP(totalXP: number): {
    level: number;
    currentXP: number;
    xpForNextLevel: number;
    progress: number;
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

// ===== Stat Level (per-category levels) =====
export function getStatLevel(statXP: number): {
    level: number;
    progress: number;
} {
    const level = Math.floor(statXP / 80) + 1; // 80 XP per stat level
    const progress = (statXP % 80) / 80;
    return { level, progress };
}

// ===== Category Display Config =====
export const CATEGORY_CONFIG: Record<XPCategory, {
    label: string;
    icon: string;
    color: string;
    colorDark: string;
}> = {
    health: { label: 'Health', icon: '❤️', color: 'bg-red-400', colorDark: 'text-red-500' },
    wisdom: { label: 'Wisdom', icon: '📖', color: 'bg-vita-blue', colorDark: 'text-vita-blue' },
    spirit: { label: 'Spirit', icon: '✨', color: 'bg-vita-rest', colorDark: 'text-vita-rest' },
    stamina: { label: 'Stamina', icon: '⚡', color: 'bg-vita-orange', colorDark: 'text-vita-orange' },
};
