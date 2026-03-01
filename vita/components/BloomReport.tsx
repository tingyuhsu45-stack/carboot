'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BloomReportProps {
    stats: {
        exercise: number; // minutes
        work: number;
        sleep: number;
    };
}

export default function BloomReport({ stats }: BloomReportProps) {
    const total = stats.exercise + stats.work + stats.sleep || 1;
    const exercisePct = (stats.exercise / total) * 100;
    const workPct = (stats.work / total) * 100;
    const sleepPct = (stats.sleep / total) * 100;

    return (
        <div className="vita-card p-6 bg-white">
            <h3 className="text-lg font-black text-vita-text mb-4 uppercase tracking-tight">Weekly Bloom Balance</h3>

            <div className="space-y-6">
                {/* Exercise Bar */}
                <div>
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold text-vita-green-dark uppercase tracking-wider">Exercise</span>
                        <span className="text-sm font-black text-vita-text">{Math.round(exercisePct)}%</span>
                    </div>
                    <div className="h-4 bg-vita-green/10 rounded-full overflow-hidden border border-vita-green/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${exercisePct}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-vita-green-dark to-vita-green"
                        />
                    </div>
                </div>

                {/* Work Bar */}
                <div>
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold text-vita-orange-dark uppercase tracking-wider">Focus Work</span>
                        <span className="text-sm font-black text-vita-text">{Math.round(workPct)}%</span>
                    </div>
                    <div className="h-4 bg-vita-orange/10 rounded-full overflow-hidden border border-vita-orange/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${workPct}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-vita-orange-dark to-vita-orange"
                        />
                    </div>
                </div>

                {/* Sleep Bar */}
                <div>
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-xs font-bold text-vita-rest uppercase tracking-wider">Rest & Sleep</span>
                        <span className="text-sm font-black text-vita-text">{Math.round(sleepPct)}%</span>
                    </div>
                    <div className="h-4 bg-vita-rest-light/30 rounded-full overflow-hidden border border-vita-rest-light/40">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${sleepPct}%` }}
                            transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-vita-rest to-vita-rest-light"
                        />
                    </div>
                </div>
            </div>

            <p className="mt-6 text-[11px] text-vita-text-muted italic leading-tight">
                "Balance is the key to growth. Keep blooming."
            </p>
        </div>
    );
}
