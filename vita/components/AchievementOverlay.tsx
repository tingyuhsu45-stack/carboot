'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/achievements';
import { Trophy } from 'lucide-react';

interface AchievementOverlayProps {
    achievement: Achievement | null;
    isVisible: boolean;
    onDismiss: () => void;
}

export default function AchievementOverlay({ achievement, isVisible, onDismiss }: AchievementOverlayProps) {
    useEffect(() => {
        if (!isVisible) return;
        const timer = setTimeout(onDismiss, 5000); // Auto-dismiss after 5s
        return () => clearTimeout(timer);
    }, [isVisible, onDismiss]);

    if (!achievement) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    className="fixed inset-x-6 bottom-32 z-[110] flex flex-col items-center"
                    onClick={onDismiss}
                >
                    <div className="vita-card p-6 flex flex-col items-center bg-white shadow-2xl border-2 border-vita-green overflow-hidden relative">
                        {/* Animated background glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className={`absolute inset-0 ${achievement.color} opacity-20`}
                        />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-16 h-16 ${achievement.color} rounded-full flex items-center justify-center text-3xl shadow-lg mb-4`}>
                                {achievement.icon}
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <Trophy size={16} className="text-vita-orange" />
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Badge Unlocked!</h3>
                            </div>

                            <h2 className="text-2xl font-black text-vita-green-dark mb-2">{achievement.title}</h2>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[220px]">
                                {achievement.description}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
