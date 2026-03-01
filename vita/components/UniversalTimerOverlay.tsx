'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Square, Dumbbell, Zap, Moon, Star, Send } from 'lucide-react';
import { ActivityType } from './TimelineNode';
import { supabase } from '@/lib/supabase';
import { calculateXP } from '@/lib/xp';

interface UniversalTimerOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (activity: { activity_type: ActivityType; description: string; duration_seconds: number; xp_awarded: number; created_at: string; is_routine?: boolean }) => void;
}

const MODES: { type: ActivityType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'bg-vita-green' },
    { type: 'work', label: 'Focus Work', icon: Zap, color: 'bg-vita-orange' },
    { type: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-vita-rest' },
];

// Types that need a task name after stopping
const NEEDS_NAME: ActivityType[] = ['exercise', 'work'];

export default function UniversalTimerOverlay({ isOpen, onClose, onComplete }: UniversalTimerOverlayProps) {
    const [selectedMode, setSelectedMode] = useState<ActivityType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showNamePrompt, setShowNamePrompt] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [isStarred, setIsStarred] = useState(false);

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

    const handleStop = () => {
        if (!selectedMode) return;
        setIsRunning(false);

        // If exercise or work, ask for a task name
        if (NEEDS_NAME.includes(selectedMode)) {
            setShowNamePrompt(true);
            return;
        }

        // Otherwise finalize immediately
        finalizeActivity(`Completed ${selectedMode} session`);
    };

    const handleNameSubmit = () => {
        const name = taskName.trim() || `${selectedMode} session`;
        finalizeActivity(name);
    };

    const finalizeActivity = async (description: string) => {
        if (!selectedMode) return;
        const xp = calculateXP(selectedMode, elapsedTime);

        const newActivity = {
            activity_type: selectedMode,
            description,
            duration_seconds: elapsedTime,
            xp_awarded: xp,
            created_at: new Date().toISOString(),
            is_routine: isStarred,
        };

        // Save to Supabase
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('activities').insert([newActivity]);
        }

        onComplete(newActivity);

        // Reset state
        setSelectedMode(null);
        setElapsedTime(0);
        setShowNamePrompt(false);
        setTaskName('');
        setIsStarred(false);
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
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
                        <X size={24} />
                    </button>

                    {/* Task Name Prompt — shown after stopping exercise/work */}
                    {showNamePrompt ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-1 flex flex-col justify-center w-full max-w-xs gap-6"
                        >
                            <div className="text-center">
                                <p className="text-4xl mb-3">🏆</p>
                                <h2 className="text-2xl font-black text-vita-text">Well Done!</h2>
                                <p className="text-sm text-vita-text-muted mt-1">{formatTime(elapsedTime)} of {selectedMode}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">What did you work on?</label>
                                <input
                                    type="text"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    placeholder={selectedMode === 'exercise' ? 'e.g. Morning Run, Gym Push Day...' : 'e.g. Portfolio Design, Study Session...'}
                                    autoFocus
                                    className="w-full mt-2 px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 text-base font-bold text-vita-text placeholder:text-gray-300 focus:outline-none focus:border-vita-green/50 transition-all"
                                />
                            </div>

                            {/* Star as Routine */}
                            <button
                                onClick={() => setIsStarred(!isStarred)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${isStarred
                                        ? 'bg-vita-orange/10 border-vita-orange/40'
                                        : 'bg-gray-50 border-gray-100'
                                    }`}
                            >
                                <Star
                                    size={20}
                                    className={isStarred ? 'text-vita-orange fill-vita-orange' : 'text-gray-300'}
                                />
                                <div className="text-left">
                                    <p className={`text-sm font-bold ${isStarred ? 'text-vita-orange-dark' : 'text-gray-400'}`}>
                                        Add to Routines
                                    </p>
                                    <p className="text-[10px] text-vita-text-muted">Show on Home screen for quick access</p>
                                </div>
                            </button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNameSubmit}
                                className="w-full py-4 rounded-2xl bg-vita-green text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Save Activity
                            </motion.button>
                        </motion.div>
                    ) : !selectedMode ? (
                        <div className="flex-1 flex flex-col justify-center w-full max-w-xs gap-5">
                            <h2 className="text-3xl font-black text-vita-text text-center mb-4">Start Growing</h2>
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
                                <div className="text-6xl font-black text-vita-text mt-2 font-mono">{formatTime(elapsedTime)}</div>
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
