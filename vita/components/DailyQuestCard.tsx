'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export interface QuestConfig {
    type: string;
    name: string;
    icon: string;
    color: string;
    colorLight: string;
    xpCategory: string;
}

interface DailyQuestCardProps {
    quest: QuestConfig;
    isCompleted: boolean;
    onStart: (quest: QuestConfig) => void;
    index: number;
}

export default function DailyQuestCard({ quest, isCompleted, onStart, index }: DailyQuestCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`vita-card p-4 flex items-center gap-4 transition-all ${isCompleted ? 'opacity-60' : ''
                }`}
        >
            {/* Quest Icon */}
            <motion.div
                whileHover={!isCompleted ? { scale: 1.1, rotate: 5 } : {}}
                className={`w-14 h-14 rounded-2xl ${isCompleted ? 'bg-gray-200' : quest.colorLight} flex items-center justify-center text-2xl shadow-sm`}
            >
                {isCompleted ? '✅' : quest.icon}
            </motion.div>

            {/* Quest Info */}
            <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold ${isCompleted ? 'text-gray-400 line-through' : 'text-vita-text'}`}>
                    {quest.name}
                </h3>
                <p className="text-xs text-vita-text-muted mt-0.5">5 min · +10 XP</p>
            </div>

            {/* Start Button */}
            {!isCompleted ? (
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => onStart(quest)}
                    className={`${quest.color} text-white w-11 h-11 rounded-xl flex items-center justify-center shadow-md`}
                >
                    <Play size={20} fill="white" />
                </motion.button>
            ) : (
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-black text-gray-400">Done</span>
                </div>
            )}
        </motion.div>
    );
}
