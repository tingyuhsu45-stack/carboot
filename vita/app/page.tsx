'use client';

import { motion } from 'framer-motion';
import TimelineContainer from "@/components/TimelineContainer";
import LifeTree from "@/components/LifeTree";
import { getLevelFromXP } from "@/lib/xp";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useGoals } from "@/components/GoalsContext";
import { Moon, Dumbbell, UtensilsCrossed, Droplets } from 'lucide-react';

export default function Home() {
  const [totalXP, setTotalXP] = useState(0);
  const { level, progress } = getLevelFromXP(totalXP);
  const { goals } = useGoals();

  useEffect(() => {
    async function fetchProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_xp')
        .single();

      if (!error && data) {
        setTotalXP(data.total_xp);
      }
    }
    fetchProfile();
  }, []);

  const goalItems = [
    {
      icon: Moon,
      label: 'Sleep',
      target: `${goals.sleepHours}h`,
      color: 'text-vita-rest',
      bgColor: 'bg-vita-rest/15',
      ringColor: 'stroke-vita-rest',
    },
    {
      icon: Dumbbell,
      label: 'Exercise',
      target: `${goals.exerciseMinutes}m`,
      color: 'text-vita-green-dark',
      bgColor: 'bg-vita-green/15',
      ringColor: 'stroke-vita-green-dark',
    },
    {
      icon: UtensilsCrossed,
      label: 'Calories',
      target: `${goals.calorieTarget}`,
      color: 'text-vita-orange-dark',
      bgColor: 'bg-vita-orange/15',
      ringColor: 'stroke-vita-orange',
    },
    {
      icon: Droplets,
      label: 'Water',
      target: `${goals.waterGlasses} 💧`,
      color: 'text-vita-blue',
      bgColor: 'bg-vita-blue/15',
      ringColor: 'stroke-vita-blue',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Life Tree Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mt-4 flex flex-col items-center"
      >
        <LifeTree level={level} />
      </motion.div>

      {/* Level & Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 1] }}
        className="vita-card p-5 bg-gradient-to-br from-vita-green/10 to-vita-cream"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-vita-text-secondary uppercase tracking-wider">Current Level</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-2xl font-black text-vita-green-dark">LVL {level}</p>
              <div className="h-2.5 w-24 bg-vita-green/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 1] }}
                  className="h-full bg-gradient-to-r from-vita-green-dark to-vita-green rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-vita-text-secondary uppercase tracking-wider">Daily Streak</p>
            <p className="text-2xl font-black text-vita-orange-dark mt-1">🔥 5 Days</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Goals */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-sm font-black text-vita-text uppercase tracking-wider mb-3">Daily Goals</h2>
        <div className="grid grid-cols-4 gap-2">
          {goalItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`vita-card p-3 flex flex-col items-center gap-1.5 ${item.bgColor}`}
              >
                <div className={`w-9 h-9 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                  <Icon size={18} className={item.color} />
                </div>
                <span className="text-[10px] font-bold text-vita-text-muted uppercase">{item.label}</span>
                <span className={`text-xs font-black ${item.color}`}>{item.target}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Today Section */}
      <div className="flex flex-col gap-2">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-black text-vita-text"
        >
          Today
        </motion.h2>
        <TimelineContainer />
      </div>
    </div>
  );
}
