'use client';

import React, { useState, useEffect } from 'react';

import BloomReport from '@/components/BloomReport';
import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { Trophy, Star, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = useState<{ username?: string; total_xp?: number; streak_shields?: number } | null>(null);
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [stats, setStats] = useState({ exercise: 0, work: 0, sleep: 0 });

    useEffect(() => {
        async function fetchProfileData() {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .single();
            setProfile(profile);

            const { data: achievements } = await supabase
                .from('unlocked_achievements')
                .select('achievement_type');
            if (achievements) {
                setUnlockedIds(achievements.map(a => a.achievement_type));
            }

            // Fetch last 7 days for stats
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { data: activities } = await supabase
                .from('activities')
                .select('activity_type, duration_seconds')
                .gte('created_at', weekAgo.toISOString());

            if (activities) {
                const newStats = { exercise: 0, work: 0, sleep: 0 };
                activities.forEach(a => {
                    const mins = (a.duration_seconds || 0) / 60;
                    if (a.activity_type === 'exercise') newStats.exercise += mins;
                    if (a.activity_type === 'work') newStats.work += mins;
                    if (a.activity_type === 'sleep') newStats.sleep += mins;
                });
                setStats(newStats);
            }
        }
        fetchProfileData();
    }, []);

    return (
        <div className="flex flex-col gap-6 py-6">
            <header className="flex flex-col items-center mb-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vita-green to-vita-blue p-1 mb-4">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl shadow-inner">
                        👤
                    </div>
                </div>
                <h2 className="text-2xl font-black text-vita-text uppercase tracking-tight">
                    {profile?.username || 'Grown User'}
                </h2>
                <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1 text-vita-orange-dark font-black">
                        <Star size={16} fill="currentColor" />
                        <span>{profile?.total_xp || 0} XP</span>
                    </div>
                    <div className="flex items-center gap-1 text-vita-blue-dark font-black">
                        <ShieldCheck size={16} fill="currentColor" />
                        <span>{profile?.streak_shields || 0} Shields</span>
                    </div>
                </div>
            </header>

            <BloomReport stats={stats} />

            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Trophy size={20} className="text-vita-orange" />
                    <h3 className="text-lg font-black text-vita-text uppercase tracking-tight">Unlocked Badges</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {Object.values(ACHIEVEMENTS).map((achievement) => {
                        const isUnlocked = unlockedIds.includes(achievement.id);
                        return (
                            <div
                                key={achievement.id}
                                className={`vita-card p-4 flex flex-col items-center text-center transition-opacity duration-500 ${isUnlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
                            >
                                <div className={`w-12 h-12 ${achievement.color} rounded-full flex items-center justify-center text-2xl mb-2 shadow-sm`}>
                                    {achievement.icon}
                                </div>
                                <h4 className="text-xs font-black text-vita-text uppercase mb-1">{achievement.title}</h4>
                                <p className="text-[10px] text-vita-text-secondary leading-tight">{achievement.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
