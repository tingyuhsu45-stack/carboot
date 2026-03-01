'use client';

import { motion } from 'framer-motion';
import LifeTree from "@/components/LifeTree";
import { getLevelFromXP, CATEGORY_CONFIG, getStatLevel } from "@/lib/xp";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Sword, Flame, Play, Star } from "lucide-react";
import DailyQuestCard, { QuestConfig } from "@/components/DailyQuestCard";
import QuestTimer from "@/components/QuestTimer";
import { calculateQuestXP, XPCategory } from "@/lib/xp";

const DAILY_QUESTS: QuestConfig[] = [
  { type: 'puzzle', name: 'Brain Puzzle', icon: '🧩', color: 'bg-vita-blue', colorLight: 'bg-vita-blue/20', xpCategory: 'wisdom' },
  { type: 'guitar', name: 'Guitar Practice', icon: '🎸', color: 'bg-vita-orange', colorLight: 'bg-vita-orange/20', xpCategory: 'wisdom' },
  { type: 'webdesign', name: 'Web Design', icon: '💻', color: 'bg-vita-green', colorLight: 'bg-vita-green/20', xpCategory: 'wisdom' },
  { type: 'duolingo', name: 'Duolingo', icon: '🦉', color: 'bg-emerald-500', colorLight: 'bg-emerald-100', xpCategory: 'wisdom' },
  { type: 'yoga', name: 'Yoga & Stretch', icon: '🧘', color: 'bg-vita-rest', colorLight: 'bg-vita-rest-light/30', xpCategory: 'spirit' },
];

interface RoutineItem {
  activity_type: string;
  description: string;
  count: number;
}

export default function Home() {
  const [totalXP, setTotalXP] = useState(0);
  const [statXP, setStatXP] = useState({ health: 0, wisdom: 0, spirit: 0, stamina: 0 });
  const { level, progress } = getLevelFromXP(totalXP);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuest, setActiveQuest] = useState<QuestConfig | null>(null);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase.from('profiles').select('total_xp, health_xp, wisdom_xp, spirit_xp, stamina_xp').single();
      if (!error && data) {
        setTotalXP(data.total_xp);
        setStatXP({ health: data.health_xp || 0, wisdom: data.wisdom_xp || 0, spirit: data.spirit_xp || 0, stamina: data.stamina_xp || 0 });
      }
    }

    async function fetchRoutines() {
      // Fetch starred activities
      const { data } = await supabase
        .from('activities')
        .select('activity_type, description')
        .eq('is_routine', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Group by description, count occurrences
        const grouped: Record<string, RoutineItem> = {};
        data.forEach(a => {
          const key = a.description;
          if (!grouped[key]) grouped[key] = { activity_type: a.activity_type, description: a.description, count: 0 };
          grouped[key].count++;
        });
        setRoutines(Object.values(grouped).slice(0, 6));
      }
    }

    fetchProfile();
    fetchRoutines();
  }, []);

  const handleStartQuest = useCallback((quest: QuestConfig) => {
    setActiveQuest(quest);
  }, []);

  const handleCompleteQuest = useCallback(async () => {
    if (!activeQuest) return;
    const xp = calculateQuestXP(activeQuest.type);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('daily_quests').insert([{
        quest_type: activeQuest.type,
        quest_name: activeQuest.name,
        xp_category: activeQuest.xpCategory,
        xp_awarded: xp,
        duration_seconds: 300,
        completed_at: new Date().toISOString(),
      }]);
    }
    setCompletedQuests((prev) => [...prev, activeQuest.type]);
    setActiveQuest(null);
  }, [activeQuest]);

  const completedCount = completedQuests.length;
  const totalQuests = DAILY_QUESTS.length;

  // Mock routines if none from DB
  const displayRoutines = routines.length > 0 ? routines : [
    { activity_type: 'exercise', description: 'Morning Run', count: 12 },
    { activity_type: 'work', description: 'Portfolio Design', count: 8 },
    { activity_type: 'exercise', description: 'Gym Push Day', count: 5 },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Quest Timer Overlay */}
      <QuestTimer
        isOpen={activeQuest !== null}
        questName={activeQuest?.name ?? ''}
        questIcon={activeQuest?.icon ?? ''}
        color={activeQuest?.color ?? 'bg-vita-green'}
        durationSeconds={300}
        onComplete={handleCompleteQuest}
        onCancel={() => setActiveQuest(null)}
      />

      {/* Life Tree + Level Row */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4"
      >
        <div className="w-20 h-20">
          <LifeTree level={level} />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-black text-vita-text">LVL {level}</p>
          <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-vita-green-dark to-vita-green rounded-full"
            />
          </div>
          <p className="text-xs text-vita-text-muted mt-1">{Math.round(progress * 100)}% to next level</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-vita-orange-dark">🔥 5</p>
          <p className="text-[10px] font-bold text-vita-text-muted uppercase">Streak</p>
        </div>
      </motion.div>

      {/* Stat Mini Bars */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(CATEGORY_CONFIG) as XPCategory[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const { level: sLvl, progress: sProg } = getStatLevel(statXP[cat]);
          return (
            <div key={cat} className="vita-card p-2.5 flex flex-col items-center gap-1">
              <span className="text-lg">{cfg.icon}</span>
              <p className="text-xs font-black text-vita-text">Lv {sLvl}</p>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${cfg.color} rounded-full`} style={{ width: `${sProg * 100}%` }} />
              </div>
              <p className="text-[9px] font-bold text-vita-text-muted uppercase">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* ⭐ Routines Section */}
      {displayRoutines.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-vita-orange fill-vita-orange" />
            <h3 className="text-sm font-black text-vita-text uppercase tracking-wider">Routines</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {displayRoutines.map((r, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 vita-card px-4 py-3 flex items-center gap-2.5 bg-gradient-to-r from-white to-vita-cream"
              >
                <span className="text-lg">
                  {r.activity_type === 'exercise' ? '💪' : '⚡'}
                </span>
                <div className="text-left">
                  <p className="text-xs font-bold text-vita-text whitespace-nowrap">{r.description}</p>
                  <p className="text-[10px] text-vita-text-muted">{r.count}× done</p>
                </div>
                <Play size={12} className="text-vita-green-dark ml-1" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ⚔️ Daily Quests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sword size={16} className="text-vita-orange-dark" />
            <h3 className="text-sm font-black text-vita-text uppercase tracking-wider">Daily Quests</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
            <Flame size={12} className="text-vita-orange" />
            <span className="text-xs font-black text-vita-text">{completedCount}/{totalQuests}</span>
          </div>
        </div>

        {/* Quest Progress */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalQuests) * 100}%` }}
            className="h-full bg-gradient-to-r from-vita-orange to-vita-green rounded-full"
          />
        </div>

        {/* All Complete */}
        {completedCount === totalQuests && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-vita-green/15 to-vita-blue/15 rounded-2xl p-3 text-center border border-vita-green/20 mb-3"
          >
            <p className="text-sm font-black text-vita-green-dark">🎉 All Quests Complete!</p>
          </motion.div>
        )}

        <div className="flex flex-col gap-2.5">
          {DAILY_QUESTS.map((quest, index) => (
            <DailyQuestCard
              key={quest.type}
              quest={quest}
              isCompleted={completedQuests.includes(quest.type)}
              onStart={handleStartQuest}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
