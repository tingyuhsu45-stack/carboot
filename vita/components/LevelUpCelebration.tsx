'use client';

import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

interface LevelUpCelebrationProps {
    level: number;
    isVisible: boolean;
    onDismiss: () => void;
}

/** Generates random confetti-like particles using Vita palette colors */
const PARTICLE_COLORS = [
    'bg-vita-green',
    'bg-vita-blue',
    'bg-vita-orange',
    'bg-vita-cream',
    'bg-vita-rest',
];

function ConfettiParticle({ index }: { index: number }) {
    const angle = (index / 12) * 360;
    const randomDist = (index * 0.37) % 1;
    const distance = 120 + randomDist * 80;
    const radians = (angle * Math.PI) / 180;
    const x = Math.cos(radians) * distance;
    const y = Math.sin(radians) * distance;
    const randomSize = (index * 0.71) % 1;
    const size = 8 + randomSize * 12;
    const color = PARTICLE_COLORS[index % PARTICLE_COLORS.length];

    return (
        <motion.div
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
                opacity: [1, 1, 0],
                x: [0, x * 0.6, x],
                y: [0, y * 0.6, y],
                scale: [0, 1.5, 0.5],
                rotate: [0, 180, 360],
            }}
            transition={{
                duration: 1.2,
                delay: 0.3 + index * 0.03,
                ease: 'easeOut',
            }}
            className={`absolute rounded-full ${color}`}
            style={{ width: size, height: size }}
        />
    );
}

export default function LevelUpCelebration({ level, isVisible, onDismiss }: LevelUpCelebrationProps) {
    const handleDismiss = useCallback(() => {
        onDismiss();
    }, [onDismiss]);

    // Auto-dismiss after 3 seconds
    useEffect(() => {
        if (!isVisible) return;
        const timer = setTimeout(handleDismiss, 3000);
        return () => clearTimeout(timer);
    }, [isVisible, handleDismiss]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleDismiss}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
                >
                    {/* Confetti burst */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <ConfettiParticle key={i} index={i} />
                        ))}
                    </div>

                    {/* "LEVEL UP!" text */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
                        className="text-xl font-black uppercase tracking-[0.3em] text-white/80 mb-4"
                    >
                        Level Up!
                    </motion.p>

                    {/* Glowing level badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 12,
                            delay: 0.2,
                        }}
                        className="relative"
                    >
                        {/* Glow ring */}
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(167, 243, 208, 0.4)',
                                    '0 0 60px rgba(167, 243, 208, 0.8)',
                                    '0 0 20px rgba(167, 243, 208, 0.4)',
                                ],
                            }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-36 h-36 rounded-full bg-gradient-to-br from-vita-green to-vita-blue flex items-center justify-center"
                        >
                            <div className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center">
                                <Star className="text-vita-orange mb-1" size={24} />
                                <span className="text-5xl font-black text-gray-800">{level}</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Encouraging message */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="mt-6 text-lg font-bold text-white/90"
                    >
                        Keep up the great work! 🎉
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-4 text-sm text-white/50"
                    >
                        Tap anywhere to continue
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
