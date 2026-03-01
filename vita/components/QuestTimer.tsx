'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

interface QuestTimerProps {
    isOpen: boolean;
    questName: string;
    questIcon: string;
    color: string;
    durationSeconds: number;
    onComplete: () => void;
    onCancel: () => void;
}

export default function QuestTimer({
    isOpen,
    questName,
    questIcon,
    color,
    durationSeconds,
    onComplete,
    onCancel,
}: QuestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setTimeLeft(durationSeconds);
            setIsRunning(false);
            setIsFinished(false);
            return;
        }
        setIsRunning(true);
    }, [isOpen, durationSeconds]);

    React.useEffect(() => {
        if (!isRunning || isFinished) return;
        if (timeLeft <= 0) {
            setIsFinished(true);
            setIsRunning(false);
            return;
        }
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsFinished(true);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, isFinished, timeLeft]);

    const progress = 1 - timeLeft / durationSeconds;
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference * (1 - progress);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8"
                >
                    <button
                        onClick={onCancel}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.25em] mb-8">
                        {questName}
                    </p>

                    {/* Circular Timer */}
                    <div className="relative w-40 h-40 mb-8">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            {/* Background Ring */}
                            <circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                stroke="rgba(0,0,0,0.06)"
                                strokeWidth="8"
                            />
                            {/* Progress Ring */}
                            <motion.circle
                                cx="60" cy="60" r="54"
                                fill="none"
                                stroke={isFinished ? '#34D399' : '#6EE7B7'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {isFinished ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.3, 1] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Check size={48} className="text-vita-green-dark" strokeWidth={3} />
                                </motion.div>
                            ) : (
                                <>
                                    <span className="text-4xl">{questIcon}</span>
                                    <span className="text-2xl font-black text-gray-800 font-mono mt-1">
                                        {formatTime(timeLeft)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {isFinished ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <p className="text-2xl font-black text-gray-800">Quest Complete!</p>
                            <p className="text-sm text-gray-400">+10 XP earned ✨</p>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onComplete}
                                className={`${color} text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg`}
                            >
                                Claim Reward 🎁
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-sm text-gray-400 font-medium"
                        >
                            Focus on your task...
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
