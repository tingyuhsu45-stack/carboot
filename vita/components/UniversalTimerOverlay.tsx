'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Square, Dumbbell, Zap, Moon } from 'lucide-react';
import { ActivityType } from './TimelineNode';
import { supabase } from '@/lib/supabase';
import { calculateXP } from '@/lib/xp';

interface UniversalTimerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (activity: { activity_type: ActivityType; description: string; duration_seconds: number; xp_awarded: number; created_at: string; }) => void;
}

const MODES: { type: ActivityType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'bg-vita-green' },
    { type: 'work', label: 'Focus Work', icon: Zap, color: 'bg-vita-orange' },
    { type: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-vita-rest' },
];

export default function UniversalTimerOverlay({ isOpen, onClose, onComplete }: UniversalTimerOverlayProps) {
    const [selectedMode, setSelectedMode] = useState<ActivityType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = (mode: ActivityType) => {
        setSelectedMode(mode);
        setIsRunning(true);
        setElapsedTime(0);
    };

    const handleStop = async () => {
        if (!selectedMode) return;
        setIsRunning(false);
        const xp = calculateXP(selectedMode, elapsedTime);

        const newActivity = {
            activity_type: selectedMode,
            description: `Completed ${selectedMode} session`,
            duration_seconds: elapsedTime,
            xp_awarded: xp,
            created_at: new Date().toISOString(),
        };

        // Save to Supabase if possible
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('activities').insert([newActivity]);
        }

        onComplete(newActivity);
        setSelectedMode(null);
        setElapsedTime(0);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center p-8 overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400">
                        <X size={24} />
                    </button>

                    {!selectedMode ? (
                        <div className="flex-1 flex flex-col justify-center w-full max-w-xs gap-6">
                            <h2 className="text-3xl font-black text-gray-800 text-center mb-4">Start Growing</h2>
                            {MODES.map((mode) => (
                                <button
                                    key={mode.type}
                                    onClick={() => handleStart(mode.type)}
                                    className={`w-full ${mode.color} p-6 rounded-3xl flex items-center gap-4 text-white shadow-lg active:scale-95 transition-transform`}
                                >
                                    <mode.icon size={32} />
                                    <span className="text-xl font-bold">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-between w-full py-12">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">{selectedMode}</h2>
                                <div className="text-6xl font-black text-gray-800 mt-2 font-mono">{formatTime(elapsedTime)}</div>
                            </div>

                            {/* Passive Animations */}
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {selectedMode === 'exercise' && (
                                    <motion.div
                                        animate={{ y: [0, -20, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                                        className="w-32 h-32 bg-vita-green rounded-3xl flex items-center justify-center shadow-lg"
                                    >
                                        <Dumbbell size={64} className="text-white" />
                                    </motion.div>
                                )}
                                {selectedMode === 'work' && (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="w-48 h-48 bg-vita-orange/20 rounded-full flex items-center justify-center"
                                    >
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Zap size={80} className="text-vita-orange" />
                                        </motion.div>
                                    </motion.div>
                                )}
                                {selectedMode === 'sleep' && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    >
                                        <Moon size={120} className="text-vita-rest" />
                                    </motion.div>
                                )}
                            </div>

                            <button
                                onClick={handleStop}
                                className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform"
                            >
                                <Square size={32} />
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
