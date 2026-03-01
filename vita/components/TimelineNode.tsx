'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Zap, Dumbbell, Coffee, Scale } from 'lucide-react';

export type ActivityType = 'exercise' | 'work' | 'sleep' | 'food' | 'metric';

interface TimelineNodeProps {
    activity: {
        id: string;
        activity_type: ActivityType;
        description: string;
        created_at: string;
        duration_seconds?: number;
        xp_awarded: number;
    };
    index?: number;
    isLast?: boolean;
}

const iconMap = {
    exercise: <Dumbbell className="text-white" size={20} />,
    work: <Zap className="text-white" size={20} />,
    sleep: <Moon className="text-white" size={20} />,
    food: <Coffee className="text-white" size={20} />,
    metric: <Scale className="text-white" size={20} />,
};

const colorMap: Record<ActivityType, string> = {
    exercise: 'bg-vita-green',
    work: 'bg-vita-orange',
    sleep: 'bg-vita-rest',
    food: 'bg-vita-blue',
    metric: 'bg-gray-400',
};

const borderColorMap: Record<ActivityType, string> = {
    exercise: 'border-l-vita-green',
    work: 'border-l-vita-orange',
    sleep: 'border-l-vita-rest',
    food: 'border-l-vita-blue',
    metric: 'border-l-gray-400',
};

const nodeVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.08,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    }),
};

export default function TimelineNode({ activity, index = 0, isLast }: TimelineNodeProps) {
    const time = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            custom={index}
            variants={nodeVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-4 relative"
        >
            {/* Connector Line */}
            {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-transparent" />
            )}

            {/* Icon Node */}
            <div className="relative z-10">
                <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-full ${colorMap[activity.activity_type]} flex items-center justify-center`}
                    style={{ boxShadow: '0 3px 12px rgba(0,0,0,0.12)' }}
                >
                    {iconMap[activity.activity_type]}
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
                whileHover={{ y: -2, boxShadow: 'var(--shadow-card-hover)' }}
                whileTap={{ scale: 0.985 }}
                className={`pb-6 flex-1 vita-card p-4 mb-3 border-l-3 ${borderColorMap[activity.activity_type]}`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-semibold text-vita-text-muted uppercase tracking-wider">{time}</p>
                        <h3 className="text-base font-bold text-vita-text leading-snug mt-0.5">{activity.description}</h3>
                        {activity.duration_seconds && (
                            <p className="text-sm text-vita-text-secondary mt-1">
                                ⏱ {Math.floor(activity.duration_seconds / 60)}m
                            </p>
                        )}
                    </div>
                    <motion.div
                        className="xp-badge bg-gradient-to-br from-vita-cream to-vita-cream-deep px-3 py-1.5 rounded-xl"
                        whileHover={{ scale: 1.1 }}
                    >
                        <span className="text-xs font-extrabold text-vita-orange-dark">+{activity.xp_awarded} XP</span>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
