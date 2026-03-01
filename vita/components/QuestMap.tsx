'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, Pen, Crown } from 'lucide-react';

export interface Milestone {
    id: string;
    title: string;
    description: string;
    milestone_order: number;
    is_boss: boolean;
    xp_reward: number;
    status: 'locked' | 'active' | 'completed';
}

interface QuestMapProps {
    milestones: Milestone[];
    questTitle: string;
    onMilestoneClick: (milestone: Milestone) => void;
}

const statusConfig = {
    locked: {
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-400',
        lineColor: 'bg-gray-200',
    },
    active: {
        bg: 'bg-vita-green/20',
        border: 'border-vita-green',
        text: 'text-vita-green-dark',
        lineColor: 'bg-vita-green/40',
    },
    completed: {
        bg: 'bg-vita-green',
        border: 'border-vita-green-dark',
        text: 'text-white',
        lineColor: 'bg-vita-green',
    },
};

export default function QuestMap({ milestones, questTitle, onMilestoneClick }: QuestMapProps) {
    return (
        <div className="flex flex-col items-center py-4">
            {/* Quest Title */}
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-black text-vita-text uppercase tracking-tight mb-8"
            >
                {questTitle}
            </motion.h2>

            {/* Milestone Path */}
            <div className="relative flex flex-col items-center gap-0 w-full max-w-xs">
                {milestones.map((milestone, index) => {
                    const config = statusConfig[milestone.status];
                    const isLast = index === milestones.length - 1;

                    return (
                        <React.Fragment key={milestone.id}>
                            {/* Node */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.4 }}
                                whileHover={milestone.status !== 'locked' ? { scale: 1.05 } : {}}
                                whileTap={milestone.status !== 'locked' ? { scale: 0.95 } : {}}
                                onClick={() => milestone.status !== 'locked' && onMilestoneClick(milestone)}
                                disabled={milestone.status === 'locked'}
                                className={`relative z-10 w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${config.bg} ${config.border} ${milestone.status === 'locked' ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                    }`}
                            >
                                {/* Node Icon */}
                                <div className={`w-12 h-12 rounded-xl ${milestone.status === 'completed' ? 'bg-white/30' :
                                        milestone.status === 'active' ? 'bg-vita-green/30' : 'bg-gray-200'
                                    } flex items-center justify-center`}>
                                    {milestone.status === 'completed' ? (
                                        <CheckCircle2 size={24} className="text-white" />
                                    ) : milestone.status === 'active' ? (
                                        <Pen size={20} className="text-vita-green-dark" />
                                    ) : (
                                        <Lock size={18} className="text-gray-400" />
                                    )}
                                </div>

                                {/* Node Content */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`text-sm font-bold ${config.text}`}>
                                            {milestone.title}
                                        </h3>
                                        {milestone.is_boss && (
                                            <Crown size={14} className="text-vita-orange" />
                                        )}
                                    </div>
                                    {milestone.description && (
                                        <p className={`text-xs mt-0.5 ${milestone.status === 'completed' ? 'text-white/70' : 'text-vita-text-muted'
                                            }`}>
                                            {milestone.description}
                                        </p>
                                    )}
                                </div>

                                {/* XP Badge */}
                                <div className={`px-2 py-1 rounded-lg text-xs font-black ${milestone.status === 'completed'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-vita-cream text-vita-orange-dark'
                                    }`}>
                                    {milestone.is_boss ? `🏆 ${milestone.xp_reward}` : `+${milestone.xp_reward}`} XP
                                </div>
                            </motion.button>

                            {/* Connector Line */}
                            {!isLast && (
                                <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                                    className={`w-0.5 h-6 ${config.lineColor} origin-top`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
