import { ActivityType } from '@/components/TimelineNode';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
    early_bird: {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Completed a workout before 8:00 AM',
        icon: '🌅',
        color: 'bg-vita-orange',
    },
    deep_work: {
        id: 'deep_work',
        title: 'Deep Work Master',
        description: 'Completed a focus session longer than 2 hours',
        icon: '🧠',
        color: 'bg-vita-blue',
    },
    consistency: {
        id: 'consistency',
        title: 'Consistency King',
        description: 'Logged 3 different activity types in one day',
        icon: '👑',
        color: 'bg-vita-green',
    },
};

export interface Activity {
    activity_type: ActivityType;
    created_at: string;
    duration_seconds?: number;
}

export function calculateNewAchievements(
    latestActivity: Activity,
    allTodayActivities: Activity[],
    unlockedAchievementIds: string[]
): Achievement[] {
    const newAchievements: Achievement[] = [];

    // Early Bird: Exercise before 8 AM
    if (!unlockedAchievementIds.includes('early_bird')) {
        const date = new Date(latestActivity.created_at);
        if (latestActivity.activity_type === 'exercise' && date.getHours() < 8) {
            newAchievements.push(ACHIEVEMENTS.early_bird);
        }
    }

    // Deep Work Master: Work > 2 hours (7200s)
    if (!unlockedAchievementIds.includes('deep_work')) {
        if (latestActivity.activity_type === 'work' && (latestActivity.duration_seconds || 0) >= 7200) {
            newAchievements.push(ACHIEVEMENTS.deep_work);
        }
    }

    // Consistency King: 3 unique types today
    if (!unlockedAchievementIds.includes('consistency')) {
        const uniqueTypes = new Set(allTodayActivities.map(a => a.activity_type));
        if (uniqueTypes.size >= 3) {
            newAchievements.push(ACHIEVEMENTS.consistency);
        }
    }

    return newAchievements;
}
