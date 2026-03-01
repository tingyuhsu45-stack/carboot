'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award } from 'lucide-react';

interface WeeklySummaryProps {
    stats: {
        health: number;   // 0-1 progress
        wisdom: number;
        spirit: number;
        stamina: number;
    };
    badgeEarned: boolean;
}

const RING_CONFIG = [
    { key: 'health', label: 'Health', icon: '❤️', color: '#EF4444', trackColor: 'rgba(239,68,68,0.15)' },
    { key: 'wisdom', label: 'Wisdom', icon: '📖', color: '#93C5FD', trackColor: 'rgba(147,197,253,0.2)' },
    { key: 'spirit', label: 'Spirit', icon: '✨', color: '#A5B4FC', trackColor: 'rgba(165,180,252,0.2)' },
    { key: 'stamina', label: 'Stamina', icon: '⚡', color: '#FDBA74', trackColor: 'rgba(253,186,116,0.2)' },
];

function StatRing({ progress, color, trackColor, delay }: {
    progress: number; color: string; trackColor: string; delay: number;
}) {
    const r = 28;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - progress);

    return (
        <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
            <circle cx="36" cy="36" r={r} fill="none" stroke={trackColor} strokeWidth="6" />
            <motion.circle
                cx="36" cy="36" r={r}
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
        </svg>
    );
}

export default function WeeklySummary({ stats, badgeEarned }: WeeklySummaryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="vita-card p-6 bg-gradient-to-br from-white to-vita-cream/50"
        >
            <div className="flex items-center gap-2 mb-5">
                <Trophy size={18} className="text-vita-orange" />
                <h3 className="text-lg font-black text-vita-text uppercase tracking-tight">Weekly Summary</h3>
            </div>

            {/* 4 Stat Rings */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {RING_CONFIG.map((ring, i) => {
                    const val = stats[ring.key as keyof typeof stats];
                    const pct = Math.round(val * 100);

                    return (
                        <div key={ring.key} className="flex flex-col items-center gap-2">
                            <div className="relative">
                                <StatRing
                                    progress={val}
                                    color={ring.color}
                                    trackColor={ring.trackColor}
                                    delay={i * 0.15}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-lg">{ring.icon}</span>
                                </div>
                            </div>
                            <span className="text-xs font-black text-vita-text">{pct}%</span>
                            <span className="text-[10px] font-bold text-vita-text-muted uppercase">{ring.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Badge Result */}
            {badgeEarned ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-vita-green/20 to-vita-blue/20 rounded-2xl p-4 flex items-center gap-3 border border-vita-green/30"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Award size={28} className="text-vita-green-dark" />
                    </motion.div>
                    <div>
                        <p className="text-sm font-black text-vita-green-dark">Weekly Badge Earned!</p>
                        <p className="text-xs text-vita-text-muted">80%+ across all stats 🎖️</p>
                    </div>
                </motion.div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200">
                    <p className="text-sm font-bold text-gray-500">Hit 80% in all stats to earn the weekly badge</p>
                </div>
            )}
        </motion.div>
    );
}
