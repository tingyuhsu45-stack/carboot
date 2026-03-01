'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Home, User, Plus, ShieldCheck, Sword, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import UniversalTimerOverlay from "./UniversalTimerOverlay";
import LevelUpCelebration from "./LevelUpCelebration";
import AchievementOverlay from "./AchievementOverlay";
import { getLevelFromXP } from '@/lib/xp';
import { supabase } from '@/lib/supabase';
import { ActivityType } from './TimelineNode';
import { Achievement, calculateNewAchievements } from '@/lib/achievements';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isTimerOpen, setIsTimerOpen] = useState(false);

    // Gamification State
    const [totalXP, setTotalXP] = useState(0);
    const [streakShields, setStreakShields] = useState(0);
    const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);

    // UI State for Overlays
    const [celebrateLevel, setCelebrateLevel] = useState<number | null>(null);
    const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

    // Initial Fetch
    useEffect(() => {
        async function fetchData() {
            const { data: profile } = await supabase
                .from('profiles')
                .select('total_xp, streak_shields')
                .single();

            if (profile) {
                setTotalXP(profile.total_xp);
                setStreakShields(profile.streak_shields);
            }

            const { data: achievements } = await supabase
                .from('unlocked_achievements')
                .select('achievement_type');

            if (achievements) {
                setUnlockedAchievementIds(achievements.map(a => a.achievement_type));
            }
        }
        fetchData();
    }, []);

    const handleLevelUp = useCallback((oldXP: number, newXP: number) => {
        const oldLevel = getLevelFromXP(oldXP).level;
        const newLevel = getLevelFromXP(newXP).level;
        if (newLevel > oldLevel) {
            setCelebrateLevel(newLevel);
        }
    }, []);

    const checkAchievements = useCallback(async (latestActivity: { activity_type: ActivityType; created_at: string; duration_seconds?: number }) => {
        // Fetch all of today's activities for multi-type checking
        const today = new Date().toISOString().split('T')[0];
        const { data: todayActivities } = await supabase
            .from('activities')
            .select('activity_type, created_at, duration_seconds')
            .gte('created_at', today);

        if (!todayActivities) return;

        const newlyUnlocked = calculateNewAchievements(
            latestActivity,
            todayActivities,
            unlockedAchievementIds
        );

        if (newlyUnlocked.length > 0) {
            const achievement = newlyUnlocked[0]; // Just show one at a time
            setNewAchievement(achievement);
            setUnlockedAchievementIds(prev => [...prev, achievement.id]);

            // Persist to DB
            await supabase.from('unlocked_achievements').insert([{
                achievement_type: achievement.id
            }]);
        }
    }, [unlockedAchievementIds]);

    const handleXPGained = useCallback(async (xp: number, activity?: { activity_type: ActivityType; created_at: string; duration_seconds?: number }) => {
        const oldXP = totalXP;
        const newXP = totalXP + xp;
        setTotalXP(newXP);
        handleLevelUp(oldXP, newXP);

        // Update profile in DB
        await supabase.from('profiles').update({ total_xp: newXP }).eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (activity) {
            checkAchievements(activity);
        }
    }, [totalXP, handleLevelUp, checkAchievements]);

    const buyStreakShield = async () => {
        if (totalXP >= 500) {
            const newXP = totalXP - 500;
            const newShields = streakShields + 1;
            setTotalXP(newXP);
            setStreakShields(newShields);

            await supabase.from('profiles').update({
                total_xp: newXP,
                streak_shields: newShields
            }).eq('id', (await supabase.auth.getUser()).data.user?.id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center">
            <UniversalTimerOverlay
                isOpen={isTimerOpen}
                onClose={() => setIsTimerOpen(false)}
                onComplete={(activity) => {
                    setIsTimerOpen(false);
                    if (activity?.xp_awarded) {
                        handleXPGained(activity.xp_awarded, activity);
                    }
                }}
            />

            <LevelUpCelebration
                level={celebrateLevel ?? 1}
                isVisible={celebrateLevel !== null}
                onDismiss={() => setCelebrateLevel(null)}
            />

            <AchievementOverlay
                achievement={newAchievement}
                isVisible={newAchievement !== null}
                onDismiss={() => setNewAchievement(null)}
            />

            {/* Mobile-constrained container — responsive */}
            <main className="w-full max-w-md md:max-w-lg min-h-screen flex flex-col relative pb-28"
                style={{ background: 'var(--color-vita-card)' }}>

                {/* Header */}
                <header className="p-6 pb-3 flex justify-between items-start">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="text-3xl font-black text-gradient-vita"
                        >
                            Vita
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 48 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="h-1 bg-gradient-to-r from-vita-green to-vita-green-light rounded-full mt-1.5"
                        />
                    </div>

                    {/* Streak Shields & XP Shop Info */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 bg-vita-blue/10 px-2.5 py-1 rounded-full border border-vita-blue/20">
                            <ShieldCheck size={14} className="text-vita-blue" />
                            <span className="text-xs font-bold text-vita-blue-dark">{streakShields} Shields</span>
                        </div>
                        {pathname === '/profile' && totalXP >= 500 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={buyStreakShield}
                                className="text-[10px] font-black uppercase tracking-tighter bg-vita-orange/20 text-vita-orange-dark px-2 py-0.5 rounded-md border border-vita-orange/30"
                            >
                                Buy Shield (500 XP)
                            </motion.button>
                        )}
                    </div>
                </header>

                <div className="flex-1 px-6 overflow-y-auto">
                    {/* Inject handleXPGained into children if they are TimelineContainer */}
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child) && (child.type as { name?: string }).name === 'Home') {
                            // This is a bit hacky but for this MVP it works
                            // Ideally use a Context Provider for XP state
                            return child;
                        }
                        return child;
                    })}
                </div>

                {/* FAB — Start Activity */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20">
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsTimerOpen(true)}
                        className="fab-glow w-16 h-16 bg-gradient-to-br from-vita-green to-vita-green-dark rounded-full flex items-center justify-center text-white border-4 border-white/80 cursor-pointer"
                        style={{ boxShadow: 'var(--shadow-glow-green)' }}
                    >
                        <Plus size={30} strokeWidth={3} />
                    </motion.button>
                </div>

                {/* Bottom Navigation — Glassmorphism */}
                <nav className="fixed bottom-0 w-full max-w-md md:max-w-lg glass border-t border-vita-card-border px-4 py-3 flex justify-around items-center z-10"
                    style={{ boxShadow: 'var(--shadow-nav)' }}>
                    <Link href="/" className="flex flex-col items-center gap-0.5 group">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                            <Home
                                size={22}
                                className={pathname === '/' ? 'text-vita-green-dark' : 'text-vita-text-muted group-hover:text-vita-green transition-colors duration-300'}
                            />
                        </motion.div>
                        <span className={`text-[10px] font-semibold ${pathname === '/' ? 'text-vita-green-dark' : 'text-vita-text-muted'}`}>
                            Home
                        </span>
                    </Link>

                    <Link href="/quests" className="flex flex-col items-center gap-0.5 group">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                            <Sword
                                size={22}
                                className={pathname === '/quests' ? 'text-vita-green-dark' : 'text-vita-text-muted group-hover:text-vita-green transition-colors duration-300'}
                            />
                        </motion.div>
                        <span className={`text-[10px] font-semibold ${pathname === '/quests' ? 'text-vita-green-dark' : 'text-vita-text-muted'}`}>
                            Quests
                        </span>
                    </Link>

                    <div className="w-14" /> {/* Spacer for FAB */}

                    <Link href="/tracking" className="flex flex-col items-center gap-0.5 group">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                            <HeartPulse
                                size={22}
                                className={pathname === '/tracking' ? 'text-vita-green-dark' : 'text-vita-text-muted group-hover:text-vita-green transition-colors duration-300'}
                            />
                        </motion.div>
                        <span className={`text-[10px] font-semibold ${pathname === '/tracking' ? 'text-vita-green-dark' : 'text-vita-text-muted'}`}>
                            Vitals
                        </span>
                    </Link>

                    <Link href="/profile" className="flex flex-col items-center gap-0.5 group">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }}>
                            <User
                                size={22}
                                className={pathname === '/profile' ? 'text-vita-green-dark' : 'text-vita-text-muted group-hover:text-vita-green transition-colors duration-300'}
                            />
                        </motion.div>
                        <span className={`text-[10px] font-semibold ${pathname === '/profile' ? 'text-vita-green-dark' : 'text-vita-text-muted'}`}>
                            Profile
                        </span>
                    </Link>
                </nav>
            </main>
        </div>
    );
}
