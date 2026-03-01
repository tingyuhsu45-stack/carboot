'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, TrendingDown, Minus, Plus, Gift } from 'lucide-react';

interface MetricEntry {
    date: string;
    weightKg: number;
    waistCm?: number;
}

const MOCK_METRICS: MetricEntry[] = [
    { date: '2026-02-23', weightKg: 72.5 },
    { date: '2026-02-24', weightKg: 73.0 },
    { date: '2026-02-25', weightKg: 72.2, waistCm: 83 },
    { date: '2026-02-26', weightKg: 72.8 },
    { date: '2026-02-27', weightKg: 72.1 },
    { date: '2026-02-28', weightKg: 71.9, waistCm: 82.5 },
    { date: '2026-03-01', weightKg: 72.0 },
];

export default function BodyMetrics() {
    const [entries, setEntries] = useState<MetricEntry[]>(MOCK_METRICS);
    const [showInput, setShowInput] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [newWaist, setNewWaist] = useState('');

    // 7-day moving average (hides daily fluctuations)
    const recentWeights = entries.slice(-7).map(e => e.weightKg);
    const avg7Day = recentWeights.length > 0
        ? recentWeights.reduce((a, b) => a + b, 0) / recentWeights.length
        : 0;

    // Trend calculation
    const olderWeights = entries.slice(-14, -7).map(e => e.weightKg);
    const olderAvg = olderWeights.length > 0
        ? olderWeights.reduce((a, b) => a + b, 0) / olderWeights.length
        : avg7Day;
    const weightDiff = avg7Day - olderAvg;
    const trendDirection = Math.abs(weightDiff) < 0.3 ? 'stable' : weightDiff < 0 ? 'down' : 'up';

    // Latest waist
    const latestWaist = [...entries].reverse().find(e => e.waistCm)?.waistCm;

    // Weekly chest check: trending correctly = reward
    const trendingCorrectly = trendDirection === 'down' || trendDirection === 'stable';

    const handleAdd = () => {
        if (!newWeight) return;
        const entry: MetricEntry = {
            date: new Date().toISOString().split('T')[0],
            weightKg: parseFloat(newWeight),
            waistCm: newWaist ? parseFloat(newWaist) : undefined,
        };
        setEntries(prev => [...prev, entry]);
        setNewWeight('');
        setNewWaist('');
        setShowInput(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Main Metric Card */}
            <div className="vita-card p-5 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">7-Day Average</p>
                        <p className="text-4xl font-black text-vita-text mt-1">{avg7Day.toFixed(1)}<span className="text-lg text-vita-text-muted ml-1">kg</span></p>
                    </div>
                    <div className="text-right">
                        {latestWaist && (
                            <>
                                <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Waist</p>
                                <p className="text-2xl font-black text-vita-text mt-1">{latestWaist}<span className="text-sm text-vita-text-muted ml-0.5">cm</span></p>
                            </>
                        )}
                    </div>
                </div>

                {/* Trend Badge */}
                <div className="flex items-center gap-2 mt-4">
                    {trendDirection === 'down' ? (
                        <div className="flex items-center gap-1 bg-vita-green/15 px-3 py-1.5 rounded-full border border-vita-green/30">
                            <TrendingDown size={14} className="text-vita-green-dark" />
                            <span className="text-xs font-bold text-vita-green-dark">↓ {Math.abs(weightDiff).toFixed(1)}kg this week</span>
                        </div>
                    ) : trendDirection === 'up' ? (
                        <div className="flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
                            <TrendingUp size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-red-500">↑ {Math.abs(weightDiff).toFixed(1)}kg this week</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                            <Minus size={14} className="text-gray-400" />
                            <span className="text-xs font-bold text-gray-500">Stable this week</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Weight Graph (Simplified) */}
            <div className="vita-card p-5">
                <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider mb-4">Weight Trend</p>
                <div className="flex items-end gap-2 h-24">
                    {entries.slice(-7).map((entry, i) => {
                        const min = Math.min(...entries.slice(-7).map(e => e.weightKg)) - 1;
                        const max = Math.max(...entries.slice(-7).map(e => e.weightKg)) + 1;
                        const range = max - min;
                        const height = range > 0 ? ((entry.weightKg - min) / range) * 100 : 50;
                        const dayLabel = new Date(entry.date).toLocaleDateString([], { weekday: 'short' });

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[9px] font-bold text-vita-text-muted">{entry.weightKg}</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="w-full rounded-t-md bg-gray-300"
                                />
                                <span className="text-[10px] font-bold text-vita-text-muted">{dayLabel}</span>
                            </div>
                        );
                    })}
                </div>

                {/* 7-day avg line indicator */}
                <div className="mt-2 flex items-center gap-2">
                    <div className="h-0.5 w-4 bg-vita-orange rounded-full" />
                    <span className="text-[10px] text-vita-text-muted">7-Day Avg: {avg7Day.toFixed(1)}kg</span>
                </div>
            </div>

            {/* Weekly Chest Reward */}
            {trendingCorrectly && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="vita-card p-4 bg-gradient-to-r from-vita-orange/10 to-vita-cream flex items-center gap-3 border border-vita-orange/20"
                >
                    <div className="w-10 h-10 bg-vita-orange/20 rounded-xl flex items-center justify-center">
                        <Gift size={20} className="text-vita-orange" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-vita-text">Weekly Chest Available!</p>
                        <p className="text-xs text-vita-text-muted">Trend looks good — claim +25 Health XP</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="px-4 py-2 bg-vita-orange text-white rounded-xl font-bold text-sm shadow-md"
                    >
                        🎁 Claim
                    </motion.button>
                </motion.div>
            )}

            {/* Add Entry */}
            {!showInput ? (
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInput(true)}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 text-gray-400 font-bold"
                >
                    <Scale size={18} />
                    Log Metrics
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="vita-card p-5 flex flex-col gap-3"
                >
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-vita-text-muted uppercase">Weight (kg)</label>
                            <input
                                type="number" step="0.1" value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-lg font-bold focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-vita-text-muted uppercase">Waist (cm)</label>
                            <input
                                type="number" step="0.5" value={newWaist}
                                onChange={(e) => setNewWaist(e.target.value)}
                                placeholder="Optional"
                                className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-lg font-bold focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowInput(false)} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-400 font-bold">Cancel</button>
                        <button onClick={handleAdd} className="flex-1 py-3 rounded-xl bg-gray-600 text-white font-bold">
                            <Plus size={16} className="inline mr-1" />Save
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
