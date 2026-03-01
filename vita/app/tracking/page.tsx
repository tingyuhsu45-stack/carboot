'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, UtensilsCrossed, Scale } from 'lucide-react';
import SleepTracker from '@/components/SleepTracker';
import FoodWaterTracker from '@/components/FoodWaterTracker';
import BodyMetrics from '@/components/BodyMetrics';

type TrackingTab = 'sleep' | 'food' | 'body';

const TABS: { id: TrackingTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-vita-rest' },
    { id: 'food', label: 'Food', icon: UtensilsCrossed, color: 'text-vita-orange' },
    { id: 'body', label: 'Body', icon: Scale, color: 'text-gray-500' },
];

export default function TrackingPage() {
    const [activeTab, setActiveTab] = useState<TrackingTab>('sleep');

    return (
        <div className="flex flex-col gap-5 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-xl font-black text-vita-text">Survival HQ</h1>
                <p className="text-xs text-vita-text-muted">Track your vitals and survive</p>
            </motion.div>

            {/* Tab Switcher */}
            <div className="flex gap-1 bg-gray-100 rounded-2xl p-1">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                    ? 'bg-white shadow-md text-vita-text'
                                    : 'text-vita-text-muted hover:text-vita-text'
                                }`}
                        >
                            <Icon size={16} className={isActive ? tab.color : ''} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Active Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'sleep' && <SleepTracker />}
                {activeTab === 'food' && <FoodWaterTracker />}
                {activeTab === 'body' && <BodyMetrics />}
            </motion.div>
        </div>
    );
}
