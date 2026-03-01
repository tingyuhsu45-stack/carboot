'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sword, Flame } from 'lucide-react';
import DailyQuestCard, { QuestConfig } from '@/components/DailyQuestCard';
import QuestTimer from '@/components/QuestTimer';
import { supabase } from '@/lib/supabase';
import { calculateQuestXP } from '@/lib/xp';

const DAILY_QUESTS: QuestConfig[] = [
    {
        type: 'puzzle',
        name: 'Brain Puzzle',
        icon: '🧩',
        color: 'bg-vita-blue',
        colorLight: 'bg-vita-blue/20',
        xpCategory: 'wisdom',
    },
    {
        type: 'guitar',
        name: 'Guitar Practice',
        icon: '🎸',
        color: 'bg-vita-orange',
        colorLight: 'bg-vita-orange/20',
        xpCategory: 'wisdom',
    },
    {
        type: 'webdesign',
        name: 'Web Design',
        icon: '💻',
        color: 'bg-vita-green',
        colorLight: 'bg-vita-green/20',
        xpCategory: 'wisdom',
    },
    {
        type: 'duolingo',
        name: 'Duolingo',
        icon: '🦉',
        color: 'bg-emerald-500',
        colorLight: 'bg-emerald-100',
        xpCategory: 'wisdom',
    },
    {
        type: 'yoga',
        name: 'Yoga & Stretch',
        icon: '🧘',
        color: 'bg-vita-rest',
        colorLight: 'bg-vita-rest-light/30',
        xpCategory: 'spirit',
    },
];

export default function QuestsPage() {
    const [completedQuests, setCompletedQuests] = useState<string[]>([]);
    const [activeQuest, setActiveQuest] = useState<QuestConfig | null>(null);

    const handleStartQuest = useCallback((quest: QuestConfig) => {
        setActiveQuest(quest);
    }, []);

    const handleCompleteQuest = useCallback(async () => {
        if (!activeQuest) return;

        const xp = calculateQuestXP(activeQuest.type);

        // Save to DB if configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('daily_quests').insert([{
                quest_type: activeQuest.type,
                quest_name: activeQuest.name,
                xp_category: activeQuest.xpCategory,
                xp_awarded: xp,
                duration_seconds: 300,
                completed_at: new Date().toISOString(),
            }]);
        }

        setCompletedQuests((prev) => [...prev, activeQuest.type]);
        setActiveQuest(null);
    }, [activeQuest]);

    const handleCancelQuest = useCallback(() => {
        setActiveQuest(null);
    }, []);

    const completedCount = completedQuests.length;
    const totalQuests = DAILY_QUESTS.length;

    return (
        <div className="flex flex-col gap-6 py-6">
            {/* Quest Timer Overlay */}
            <QuestTimer
                isOpen={activeQuest !== null}
                questName={activeQuest?.name ?? ''}
                questIcon={activeQuest?.icon ?? ''}
                color={activeQuest?.color ?? 'bg-vita-green'}
                durationSeconds={300}
                onComplete={handleCompleteQuest}
                onCancel={handleCancelQuest}
            />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-vita-orange/20 rounded-xl flex items-center justify-center">
                        <Sword size={22} className="text-vita-orange-dark" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-vita-text">Daily Quests</h1>
                        <p className="text-xs text-vita-text-muted">5-min micro-missions</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 bg-vita-cream/80 px-3 py-1.5 rounded-full border border-vita-card-border">
                    <Flame size={14} className="text-vita-orange" />
                    <span className="text-sm font-black text-vita-text">
                        {completedCount}/{totalQuests}
                    </span>
                </div>
            </motion.div>

            {/* Daily Progress Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / totalQuests) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-vita-orange to-vita-green rounded-full"
                />
            </div>

            {/* All-Complete Banner */}
            {completedCount === totalQuests && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-vita-green/20 to-vita-blue/20 rounded-2xl p-4 text-center border border-vita-green/30"
                >
                    <p className="text-lg font-black text-vita-green-dark">🎉 All Quests Complete!</p>
                    <p className="text-xs text-vita-text-muted mt-1">+{totalQuests * 10} XP earned today</p>
                </motion.div>
            )}

            {/* Quest Cards */}
            <div className="flex flex-col gap-3">
                {DAILY_QUESTS.map((quest, index) => (
                    <DailyQuestCard
                        key={quest.type}
                        quest={quest}
                        isCompleted={completedQuests.includes(quest.type)}
                        onStart={handleStartQuest}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}
