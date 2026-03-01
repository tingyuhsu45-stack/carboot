'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';
import Link from 'next/link';

/**
 * The Quests tab now shows navigation to Epic Quests (Projects).
 * Daily Quests have moved to the Home page.
 */
export default function QuestsPage() {
    return (
        <div className="flex flex-col gap-6 py-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-vita-rest/20 rounded-2xl flex items-center justify-center">
                    <Map size={22} className="text-vita-rest" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-vita-text">Epic Quests</h1>
                    <p className="text-xs text-vita-text-muted">Your life storylines &amp; projects</p>
                </div>
            </motion.div>

            <p className="text-sm text-vita-text-muted">
                View and manage your long-term projects and tech tree milestones.
            </p>

            <Link
                href="/projects"
                className="vita-card p-5 flex items-center gap-4 bg-gradient-to-r from-white to-vita-rest/10 border border-vita-rest/20"
            >
                <div className="w-12 h-12 bg-vita-rest/20 rounded-2xl flex items-center justify-center text-2xl">
                    🗺️
                </div>
                <div className="flex-1">
                    <p className="text-base font-bold text-vita-text">Open Quest Map</p>
                    <p className="text-xs text-vita-text-muted">View your tech tree &amp; milestones</p>
                </div>
                <span className="text-vita-text-muted text-lg">→</span>
            </Link>
        </div>
    );
}
