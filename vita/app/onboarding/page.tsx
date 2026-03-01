'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Moon, Dumbbell, UtensilsCrossed, Droplets, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useGoals } from '@/components/GoalsContext';
import { UserGoals, DEFAULT_GOALS } from '@/lib/goals';

const STEP_COUNT = 4;

const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function OnboardingPage() {
    const router = useRouter();
    const { setGoals } = useGoals();
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [draft, setDraft] = useState<UserGoals>({ ...DEFAULT_GOALS });

    const next = () => {
        if (step < STEP_COUNT - 1) {
            setDirection(1);
            setStep(s => s + 1);
        }
    };

    const prev = () => {
        if (step > 0) {
            setDirection(-1);
            setStep(s => s - 1);
        }
    };

    const finish = () => {
        setGoals(draft);
        router.push('/');
    };

    const canProceed = step === 0 ? draft.username.trim().length > 0 : true;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{ background: 'linear-gradient(135deg, var(--color-vita-cream) 0%, var(--background) 50%, var(--color-vita-green-light) 100%)' }}>

            {/* Progress dots */}
            <div className="flex gap-2 mb-8">
                {Array.from({ length: STEP_COUNT }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            width: i === step ? 24 : 8,
                            backgroundColor: i <= step ? 'var(--color-vita-green)' : 'rgba(0,0,0,0.1)',
                        }}
                        className="h-2 rounded-full"
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </div>

            {/* Step content */}
            <div className="w-full max-w-sm relative overflow-hidden" style={{ minHeight: 360 }}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={step}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full"
                    >
                        {step === 0 && (
                            <div className="flex flex-col items-center gap-6 text-center">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="text-6xl"
                                >
                                    🌱
                                </motion.div>
                                <h1 className="text-3xl font-black text-gradient-vita">Welcome to Vita</h1>
                                <p className="text-vita-text-secondary text-sm leading-relaxed">
                                    Let&apos;s set up your daily goals so we can help you grow.
                                </p>
                                <div className="w-full">
                                    <label className="text-xs font-bold text-vita-text-muted uppercase tracking-wider block text-left mb-2">
                                        What should we call you?
                                    </label>
                                    <input
                                        type="text"
                                        value={draft.username}
                                        onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                                        placeholder="Enter your name"
                                        maxLength={20}
                                        className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-vita-card-border text-lg font-bold text-vita-text focus:outline-none focus:border-vita-green transition-colors placeholder:text-vita-text-muted/50"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="w-16 h-16 bg-vita-rest/20 rounded-2xl flex items-center justify-center">
                                    <Moon size={32} className="text-vita-rest" />
                                </div>
                                <h2 className="text-2xl font-black text-vita-text">Sleep Goal</h2>
                                <p className="text-vita-text-secondary text-sm">How many hours of sleep do you want per night?</p>

                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="text-5xl font-black text-vita-rest">{draft.sleepHours}h</div>
                                    <input
                                        type="range"
                                        min={4}
                                        max={12}
                                        step={0.5}
                                        value={draft.sleepHours}
                                        onChange={(e) => setDraft({ ...draft, sleepHours: parseFloat(e.target.value) })}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, var(--color-vita-rest) 0%, var(--color-vita-rest) ${((draft.sleepHours - 4) / 8) * 100}%, rgba(0,0,0,0.08) ${((draft.sleepHours - 4) / 8) * 100}%, rgba(0,0,0,0.08) 100%)`,
                                        }}
                                    />
                                    <div className="flex justify-between w-full text-xs text-vita-text-muted font-semibold">
                                        <span>4h</span>
                                        <span>8h (recommended)</span>
                                        <span>12h</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="w-16 h-16 bg-vita-green/20 rounded-2xl flex items-center justify-center">
                                    <Dumbbell size={32} className="text-vita-green-dark" />
                                </div>
                                <h2 className="text-2xl font-black text-vita-text">Exercise Goal</h2>
                                <p className="text-vita-text-secondary text-sm">How many minutes of exercise per day?</p>

                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="text-5xl font-black text-vita-green-dark">{draft.exerciseMinutes}m</div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={120}
                                        step={5}
                                        value={draft.exerciseMinutes}
                                        onChange={(e) => setDraft({ ...draft, exerciseMinutes: parseInt(e.target.value) })}
                                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, var(--color-vita-green-dark) 0%, var(--color-vita-green-dark) ${((draft.exerciseMinutes - 10) / 110) * 100}%, rgba(0,0,0,0.08) ${((draft.exerciseMinutes - 10) / 110) * 100}%, rgba(0,0,0,0.08) 100%)`,
                                        }}
                                    />
                                    <div className="flex justify-between w-full text-xs text-vita-text-muted font-semibold">
                                        <span>10 min</span>
                                        <span>30 min (recommended)</span>
                                        <span>120 min</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col items-center gap-6 text-center">
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 bg-vita-orange/20 rounded-2xl flex items-center justify-center">
                                        <UtensilsCrossed size={28} className="text-vita-orange-dark" />
                                    </div>
                                    <div className="w-14 h-14 bg-vita-blue/20 rounded-2xl flex items-center justify-center">
                                        <Droplets size={28} className="text-vita-blue" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-vita-text">Nutrition Goals</h2>

                                <div className="w-full flex flex-col gap-5">
                                    {/* Calories */}
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Daily Calories</p>
                                        <div className="text-4xl font-black text-vita-orange-dark">{draft.calorieTarget}</div>
                                        <input
                                            type="range"
                                            min={1200}
                                            max={4000}
                                            step={100}
                                            value={draft.calorieTarget}
                                            onChange={(e) => setDraft({ ...draft, calorieTarget: parseInt(e.target.value) })}
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, var(--color-vita-orange) 0%, var(--color-vita-orange) ${((draft.calorieTarget - 1200) / 2800) * 100}%, rgba(0,0,0,0.08) ${((draft.calorieTarget - 1200) / 2800) * 100}%, rgba(0,0,0,0.08) 100%)`,
                                            }}
                                        />
                                        <div className="flex justify-between w-full text-[10px] text-vita-text-muted font-semibold">
                                            <span>1200</span>
                                            <span>2000 (rec.)</span>
                                            <span>4000 kcal</span>
                                        </div>
                                    </div>

                                    {/* Water */}
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Water (glasses)</p>
                                        <div className="text-4xl font-black text-vita-blue">{draft.waterGlasses} 💧</div>
                                        <input
                                            type="range"
                                            min={4}
                                            max={16}
                                            step={1}
                                            value={draft.waterGlasses}
                                            onChange={(e) => setDraft({ ...draft, waterGlasses: parseInt(e.target.value) })}
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, var(--color-vita-blue) 0%, var(--color-vita-blue) ${((draft.waterGlasses - 4) / 12) * 100}%, rgba(0,0,0,0.08) ${((draft.waterGlasses - 4) / 12) * 100}%, rgba(0,0,0,0.08) 100%)`,
                                            }}
                                        />
                                        <div className="flex justify-between w-full text-[10px] text-vita-text-muted font-semibold">
                                            <span>4</span>
                                            <span>8 (recommended)</span>
                                            <span>16</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-8 w-full max-w-sm">
                {step > 0 && (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={prev}
                        className="flex items-center justify-center gap-1 px-5 py-3.5 rounded-2xl bg-white border border-vita-card-border text-vita-text-secondary font-bold text-sm"
                    >
                        <ChevronLeft size={16} />
                        Back
                    </motion.button>
                )}

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={step === STEP_COUNT - 1 ? finish : next}
                    disabled={!canProceed}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${canProceed
                            ? 'bg-gradient-to-r from-vita-green to-vita-green-dark text-white shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {step === STEP_COUNT - 1 ? (
                        <>
                            <Sparkles size={16} />
                            Start Growing
                        </>
                    ) : (
                        <>
                            Continue
                            <ChevronRight size={16} />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
