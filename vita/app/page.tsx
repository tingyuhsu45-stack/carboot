'use client';

import { motion } from 'framer-motion';
import TimelineContainer from "@/components/TimelineContainer";
import LifeTree from "@/components/LifeTree";
import { getLevelFromXP } from "@/lib/xp";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [totalXP, setTotalXP] = useState(0);
  const { level, progress } = getLevelFromXP(totalXP);

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
