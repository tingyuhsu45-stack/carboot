'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useGoals } from './GoalsContext';

interface SleepEntry {
    date: string;
    hours: number;
    quality: number; // 1-5
}

const MOCK_SLEEP: SleepEntry[] = [
    { date: '2026-02-23', hours: 7.5, quality: 4 },
    { date: '2026-02-24', hours: 6, quality: 3 },
    { date: '2026-02-25', hours: 8, quality: 5 },
    { date: '2026-02-26', hours: 5.5, quality: 2 },
    { date: '2026-02-27', hours: 7, quality: 4 },
    { date: '2026-02-28', hours: 7.5, quality: 4 },
    { date: '2026-03-01', hours: 8, quality: 5 },
];

const qualityEmojis = ['', '😫', '😔', '😐', '😊', '😴'];
const qualityLabels = ['', 'Poor', 'Light', 'Fair', 'Good', 'Deep'];

export default function SleepTracker() {
    const { goals } = useGoals();
    const sleepGoal = goals.sleepHours;
    const [entries, setEntries] = useState<SleepEntry[]>(MOCK_SLEEP);
    const [showInput, setShowInput] = useState(false);
    const [newHours, setNewHours] = useState('7');
    const [newQuality, setNewQuality] = useState(3);

    const avg7Day = entries.length > 0
        ? entries.slice(-7).reduce((sum, e) => sum + e.hours, 0) / Math.min(entries.length, 7)
        : 0;

    const avgQuality = entries.length > 0
        ? entries.slice(-7).reduce((sum, e) => sum + e.quality, 0) / Math.min(entries.length, 7)
        : 0;

    const maxHours = Math.max(...entries.map(e => e.hours), 10);

    // Buff/Debuff display — based on user's goal
    const hasExhaustion = avg7Day < (sleepGoal - 2);
    const hasClarity = avgQuality >= 4;
    const isOnTrack = avg7Day >= sleepGoal;

    const handleAddSleep = () => {
        const entry: SleepEntry = {
            date: new Date().toISOString().split('T')[0],
            hours: parseFloat(newHours) || 7,
            quality: newQuality,
        };
        setEntries(prev => [...prev, entry]);
        setShowInput(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* 7-Day Average Card */}
            <div className="vita-card p-5 bg-gradient-to-br from-vita-rest/10 to-white">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">7-Day Avg / Goal: {sleepGoal}h</p>
                        <p className="text-3xl font-black text-vita-text mt-1">{avg7Day.toFixed(1)}h</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Sleep Depth</p>
                        <p className="text-lg font-black text-vita-rest mt-1">{qualityEmojis[Math.round(avgQuality)]} {qualityLabels[Math.round(avgQuality)]}</p>
                    </div>
                </div>

                {/* Buffs / Debuffs */}
                <div className="flex gap-2 flex-wrap">
                    {hasClarity && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1.5 bg-vita-blue/15 px-3 py-1.5 rounded-full border border-vita-blue/30"
                        >
                            <span className="text-sm">🧠</span>
                            <span className="text-xs font-bold text-vita-blue-dark">Clarity Buff: Wisdom +20%</span>
                        </motion.div>
                    )}
                    {hasExhaustion && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1.5 bg-red-100 px-3 py-1.5 rounded-full border border-red-200"
                        >
                            <span className="text-sm">😴</span>
                            <span className="text-xs font-bold text-red-500">Exhaustion: Stamina capped 80%</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bar Chart */}
            <div className="vita-card p-5">
                <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider mb-4">Last 7 Days</p>
                <div className="flex items-end gap-2 h-32">
                    {entries.slice(-7).map((entry, i) => {
                        const height = (entry.hours / maxHours) * 100;
                        const dayLabel = new Date(entry.date).toLocaleDateString([], { weekday: 'short' });
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] font-bold text-vita-text-muted">{entry.hours}h</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className={`w-full rounded-t-lg ${entry.quality >= 4 ? 'bg-vita-rest' :
                                        entry.quality >= 3 ? 'bg-vita-rest/60' : 'bg-red-300'
                                        }`}
                                />
                                <span className="text-[10px] font-bold text-vita-text-muted">{dayLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-3 px-2">
                {avg7Day >= sleepGoal ? (
                    <><TrendingUp size={16} className="text-vita-green" /><span className="text-xs font-bold text-vita-green-dark">Great sleep trend!</span></>
                ) : avg7Day < (sleepGoal - 2) ? (
                    <><TrendingDown size={16} className="text-red-400" /><span className="text-xs font-bold text-red-500">Sleep needs attention</span></>
                ) : (
                    <><Minus size={16} className="text-vita-text-muted" /><span className="text-xs font-bold text-vita-text-muted">Sleep is stable</span></>
                )}
            </div>

            {/* Quick Add */}
            {!showInput ? (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInput(true)}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-vita-rest/20 border-2 border-dashed border-vita-rest/30 text-vita-rest font-bold"
                >
                    <Moon size={18} />
                    Log Sleep
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="vita-card p-5 flex flex-col gap-4"
                >
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Hours</label>
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="16"
                                value={newHours}
                                onChange={(e) => setNewHours(e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-lg font-bold text-vita-text focus:outline-none focus:border-vita-rest"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Quality</label>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setNewQuality(q)}
                                        className={`w-9 h-9 rounded-lg text-sm ${q === newQuality ? 'bg-vita-rest text-white' : 'bg-gray-100 text-gray-400'
                                            } transition-all`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowInput(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-400 font-bold">Cancel</button>
                        <button onClick={handleAddSleep} className="flex-1 py-3 rounded-xl bg-vita-rest text-white font-bold">
                            <Plus size={16} className="inline mr-1" />Save
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
