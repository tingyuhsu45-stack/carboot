/**
 * Game Stats Engine — Buffs, Debuffs, and Synergy Bonuses
 */

// ===== Buff / Debuff Types =====
export interface GameBuff {
    id: string;
    label: string;
    icon: string;
    type: 'buff' | 'debuff';
    description: string;
    statAffected: string;
    modifier: number; // multiplier, e.g. 1.2 = +20%, 0.8 = -20%
}

// ===== Sleep Buffs/Debuffs =====
export function calculateSleepBuffs(avgHours: number, avgDepth: number): GameBuff[] {
    const buffs: GameBuff[] = [];

    // Exhaustion Debuff: avg sleep < 6 hours
    if (avgHours < 6) {
        buffs.push({
            id: 'exhaustion',
            label: 'Exhaustion Debuff',
            icon: '😴',
            type: 'debuff',
            description: 'Low sleep avg! Stamina capped at 80%.',
            statAffected: 'stamina',
            modifier: 0.8,
        });
    }

    // Clarity Buff: high sleep depth (>= 4/5 quality)
    if (avgDepth >= 4) {
        buffs.push({
            id: 'clarity',
            label: 'Clarity Buff',
            icon: '🧠',
            type: 'buff',
            description: 'Deep sleep! Wisdom XP +20% today.',
            statAffected: 'wisdom',
            modifier: 1.2,
        });
    }

    // Well-Rested Buff: avg sleep >= 7.5 hours
    if (avgHours >= 7.5) {
        buffs.push({
            id: 'well_rested',
            label: 'Well-Rested',
            icon: '💤',
            type: 'buff',
            description: 'Great sleep habits! Spirit XP +10%.',
            statAffected: 'spirit',
            modifier: 1.1,
        });
    }

    return buffs;
}

// ===== Synergy Bonuses =====
export interface SynergyBonus {
    id: string;
    label: string;
    icon: string;
    description: string;
    multiplier: number;
    category: string;
}

/**
 * Check for synergy bonuses based on what was completed today.
 */
export function calculateSynergyBonuses(
    hitSleepTarget: boolean,
    hitNutritionTarget: boolean,
    hitExerciseTarget: boolean,
    hitWorkTarget: boolean,
): SynergyBonus[] {
    const bonuses: SynergyBonus[] = [];

    // Sleep + Nutrition = Spirit multiplier
    if (hitSleepTarget && hitNutritionTarget) {
        bonuses.push({
            id: 'body_harmony',
            label: 'Body Harmony',
            icon: '🌿',
            description: 'Hit Sleep + Nutrition target! Spirit XP ×1.5',
            multiplier: 1.5,
            category: 'spirit',
        });
    }

    // Exercise + Work = Stamina multiplier
    if (hitExerciseTarget && hitWorkTarget) {
        bonuses.push({
            id: 'iron_will',
            label: 'Iron Will',
            icon: '🔥',
            description: 'Hit Exercise + Work target! Stamina XP ×1.3',
            multiplier: 1.3,
            category: 'stamina',
        });
    }

    // All 4 = Grand Synergy
    if (hitSleepTarget && hitNutritionTarget && hitExerciseTarget && hitWorkTarget) {
        bonuses.push({
            id: 'grand_synergy',
            label: 'Grand Synergy',
            icon: '👑',
            description: 'All targets hit! ALL XP ×1.5 today!',
            multiplier: 1.5,
            category: 'all',
        });
    }

    return bonuses;
}

// ===== Weekly Trend Check =====
export type TrendDirection = 'up' | 'down' | 'stable';

export function calculateTrend(values: number[]): TrendDirection {
    if (values.length < 2) return 'stable';
    const recent = values.slice(-3);
    const older = values.slice(0, Math.max(1, values.length - 3));
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    const diff = recentAvg - olderAvg;
    if (Math.abs(diff) < 0.5) return 'stable';
    return diff > 0 ? 'up' : 'down';
}

// ===== Daily Goal Check =====
export interface DailyGoalStatus {
    questCompleted: boolean;
    exerciseCompleted: boolean;
    foodLogged: boolean;
    allMet: boolean;
}

export function checkDailyGoals(
    questCount: number,
    exerciseCount: number,
    foodLogCount: number,
): DailyGoalStatus {
    const questCompleted = questCount >= 1;
    const exerciseCompleted = exerciseCount >= 1;
    const foodLogged = foodLogCount >= 1;
    return {
        questCompleted,
        exerciseCompleted,
        foodLogged,
        allMet: questCompleted && exerciseCompleted && foodLogged,
    };
}

// ===== Weekly Battle Pass Check =====
export function calculateWeeklyProgress(
    healthXP: number, wisdomXP: number, spiritXP: number, staminaXP: number,
    weeklyTarget: number = 100,
): { health: number; wisdom: number; spirit: number; stamina: number; badgeEarned: boolean } {
    const health = Math.min(1, healthXP / weeklyTarget);
    const wisdom = Math.min(1, wisdomXP / weeklyTarget);
    const spirit = Math.min(1, spiritXP / weeklyTarget);
    const stamina = Math.min(1, staminaXP / weeklyTarget);
    const badgeEarned = health >= 0.8 && wisdom >= 0.8 && spirit >= 0.8 && stamina >= 0.8;
    return { health, wisdom, spirit, stamina, badgeEarned };
}
