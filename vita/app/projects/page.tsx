'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, ChevronRight } from 'lucide-react';
import QuestMap, { Milestone } from '@/components/QuestMap';
import DiaryEntryModal from '@/components/DiaryEntryModal';
import { supabase } from '@/lib/supabase';

// Mock data for demo purposes
interface EpicQuest {
    id: string;
    title: string;
    description: string;
    is_completed: boolean;
    milestones: Milestone[];
}

const MOCK_QUESTS: EpicQuest[] = [
    {
        id: 'q1',
        title: 'Website Development',
        description: 'Build and launch my portfolio website',
        is_completed: false,
        milestones: [
            { id: 'm1', title: 'Research & Wireframes', description: 'Plan the layout and content', milestone_order: 1, is_boss: false, xp_reward: 30, status: 'completed' },
            { id: 'm2', title: 'Build Homepage', description: 'Code the hero section and nav', milestone_order: 2, is_boss: false, xp_reward: 40, status: 'completed' },
            { id: 'm3', title: 'Add Projects Section', description: 'Showcase portfolio work', milestone_order: 3, is_boss: false, xp_reward: 40, status: 'active' },
            { id: 'm4', title: 'Deploy & Launch', description: 'Go live!', milestone_order: 4, is_boss: true, xp_reward: 100, status: 'locked' },
        ],
    },
    {
        id: 'q2',
        title: 'Finding Sponsors',
        description: 'Secure funding for the project',
        is_completed: false,
        milestones: [
            { id: 'm5', title: 'Create Pitch Deck', description: 'Design presentation slides', milestone_order: 1, is_boss: false, xp_reward: 30, status: 'active' },
            { id: 'm6', title: 'Outreach to 10 Sponsors', description: 'Send emails and DMs', milestone_order: 2, is_boss: false, xp_reward: 50, status: 'locked' },
            { id: 'm7', title: 'First Meeting', description: 'Schedule and attend', milestone_order: 3, is_boss: false, xp_reward: 40, status: 'locked' },
            { id: 'm8', title: 'Secure First Sponsor', description: 'Close the deal!', milestone_order: 4, is_boss: true, xp_reward: 200, status: 'locked' },
        ],
    },
    {
        id: 'q3',
        title: 'TCM Studies',
        description: 'Learn Traditional Chinese Medicine fundamentals',
        is_completed: false,
        milestones: [
            { id: 'm9', title: 'Yin-Yang Theory', description: 'Understand the foundation', milestone_order: 1, is_boss: false, xp_reward: 25, status: 'active' },
            { id: 'm10', title: 'Five Elements', description: 'Learn Wood, Fire, Earth, Metal, Water', milestone_order: 2, is_boss: false, xp_reward: 30, status: 'locked' },
            { id: 'm11', title: 'Meridian System', description: 'Map the 12 main meridians', milestone_order: 3, is_boss: true, xp_reward: 80, status: 'locked' },
        ],
    },
];

export default function ProjectsPage() {
    const [quests, setQuests] = useState<EpicQuest[]>(MOCK_QUESTS);
    const [selectedQuest, setSelectedQuest] = useState<EpicQuest | null>(null);
    const [diaryTarget, setDiaryTarget] = useState<Milestone | null>(null);

    const handleMilestoneClick = useCallback((milestone: Milestone) => {
        if (milestone.status === 'active') {
            setDiaryTarget(milestone);
        }
    }, []);

    const handleDiarySubmit = useCallback(async (content: string) => {
        if (!diaryTarget || !selectedQuest) return;

        // Save diary entry
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('diary_entries').insert([{
                milestone_id: diaryTarget.id,
                content,
            }]);
        }

        // Update milestone status: complete current, activate next
        setQuests((prev) =>
            prev.map((q) => {
                if (q.id !== selectedQuest.id) return q;
                const updatedMilestones = q.milestones.map((m, i) => {
                    if (m.id === diaryTarget.id) {
                        return { ...m, status: 'completed' as const };
                    }
                    // Activate the next locked milestone
                    if (i > 0 && q.milestones[i - 1].id === diaryTarget.id && m.status === 'locked') {
                        return { ...m, status: 'active' as const };
                    }
                    return m;
                });
                return { ...q, milestones: updatedMilestones };
            })
        );

        // Also update selectedQuest view
        setSelectedQuest((prev) => {
            if (!prev) return null;
            return {
                ...prev,
                milestones: prev.milestones.map((m, i) => {
                    if (m.id === diaryTarget.id) return { ...m, status: 'completed' as const };
                    if (i > 0 && prev.milestones[i - 1].id === diaryTarget.id && m.status === 'locked') {
                        return { ...m, status: 'active' as const };
                    }
                    return m;
                }),
            };
        });

        setDiaryTarget(null);
    }, [diaryTarget, selectedQuest]);

    // Show Quest Map if a quest is selected
    if (selectedQuest) {
        return (
            <div className="flex flex-col gap-4 py-6">
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedQuest(null)}
                    className="flex items-center gap-1 text-sm font-bold text-vita-text-muted hover:text-vita-text transition-colors self-start"
                >
                    ← Back to Quests
                </motion.button>

                <QuestMap
                    questTitle={selectedQuest.title}
                    milestones={selectedQuest.milestones}
                    onMilestoneClick={handleMilestoneClick}
                />

                <DiaryEntryModal
                    isOpen={diaryTarget !== null}
                    milestoneName={diaryTarget?.title ?? ''}
                    onSubmit={handleDiarySubmit}
                    onClose={() => setDiaryTarget(null)}
                />
            </div>
        );
    }

    // Quest List View
    return (
        <div className="flex flex-col gap-6 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-vita-rest/20 rounded-xl flex items-center justify-center">
                        <Map size={22} className="text-vita-rest" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-vita-text">Epic Quests</h1>
                        <p className="text-xs text-vita-text-muted">Your life storylines</p>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-vita-green/20 rounded-xl flex items-center justify-center"
                >
                    <Plus size={20} className="text-vita-green-dark" />
                </motion.button>
            </motion.div>

            {/* Quest Cards */}
            <div className="flex flex-col gap-3">
                {quests.map((quest, index) => {
                    const completed = quest.milestones.filter((m) => m.status === 'completed').length;
                    const total = quest.milestones.length;
                    const progress = completed / total;

                    return (
                        <motion.button
                            key={quest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedQuest(quest)}
                            className="vita-card p-5 flex items-center gap-4 text-left w-full"
                        >
                            {/* Progress Ring */}
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                                    <circle
                                        cx="20" cy="20" r="16"
                                        fill="none"
                                        stroke="#34D399"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${progress * 100.5} 100.5`}
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-vita-text">
                                    {completed}/{total}
                                </span>
                            </div>

                            {/* Quest Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-vita-text truncate">{quest.title}</h3>
                                <p className="text-xs text-vita-text-muted truncate">{quest.description}</p>
                            </div>

                            <ChevronRight size={20} className="text-vita-text-muted flex-shrink-0" />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
