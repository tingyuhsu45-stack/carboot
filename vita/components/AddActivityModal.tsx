'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Dumbbell, Zap, Moon, Coffee, Scale, Loader2 } from 'lucide-react';
import { ActivityType } from './TimelineNode';
import { supabase } from '@/lib/supabase';
import { calculateXP } from '@/lib/xp';

interface AddActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (activity: any) => void;
}

const ACTIVITY_OPTIONS: { type: ActivityType; label: string; icon: any; color: string; bgLight: string }[] = [
    { type: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'bg-vita-green', bgLight: 'bg-vita-green/20 text-emerald-700 border-vita-green/40' },
    { type: 'work', label: 'Work', icon: Zap, color: 'bg-vita-orange', bgLight: 'bg-vita-orange/20 text-amber-700 border-vita-orange/40' },
    { type: 'sleep', label: 'Sleep', icon: Moon, color: 'bg-vita-rest', bgLight: 'bg-vita-rest/20 text-indigo-700 border-vita-rest/40' },
    { type: 'food', label: 'Food', icon: Coffee, color: 'bg-vita-blue', bgLight: 'bg-vita-blue/20 text-sky-700 border-vita-blue/40' },
    { type: 'metric', label: 'Metric', icon: Scale, color: 'bg-gray-400', bgLight: 'bg-gray-100 text-gray-700 border-gray-300' },
];

export default function AddActivityModal({ isOpen, onClose, onComplete }: AddActivityModalProps) {
    const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOption = ACTIVITY_OPTIONS.find(o => o.type === selectedType);

    const handleSubmit = async () => {
        if (!selectedType || !description.trim()) return;

        setIsSubmitting(true);

        const xp = calculateXP(selectedType!);

        const newActivity = {
            activity_type: selectedType,
            description: description.trim(),
            xp_awarded: xp,
            created_at: new Date().toISOString(),
        };

        // Save to Supabase if configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
            await supabase.from('activities').insert([newActivity]);
        }

        setIsSubmitting(false);
        onComplete(newActivity);

        // Reset form
        setSelectedType(null);
        setDescription('');
    };

    const handleClose = () => {
        setSelectedType(null);
        setDescription('');
        onClose();
    };

    const canSubmit = selectedType && description.trim().length > 0 && !isSubmitting;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    className="fixed inset-0 z-50 bg-white flex flex-col items-center overflow-hidden"
                >
                    {/* Header */}
                    <div className="w-full max-w-md px-6 pt-6 pb-2 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-800">Log Activity</h2>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full max-w-md px-6 py-6 flex flex-col gap-8 overflow-y-auto">
                        {/* Activity Type Selector */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                What did you do?
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ACTIVITY_OPTIONS.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = selectedType === option.type;
                                    return (
                                        <motion.button
                                            key={option.type}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedType(option.type)}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold text-sm transition-all ${isSelected
                                                ? `${option.color} text-white border-transparent shadow-md`
                                                : `${option.bgLight} border-transparent hover:border-current`
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {option.label}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                Description
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={
                                    selectedType === 'exercise' ? 'e.g., Morning jog 🏃' :
                                        selectedType === 'work' ? 'e.g., Finished report 📄' :
                                            selectedType === 'sleep' ? 'e.g., 8 hours of rest 😴' :
                                                selectedType === 'food' ? 'e.g., Ate a healthy salad 🥗' :
                                                    selectedType === 'metric' ? 'e.g., Weight: 70kg ⚖️' :
                                                        'What did you do?'
                                }
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-800 text-lg placeholder:text-gray-300 focus:outline-none focus:border-vita-green/50 focus:bg-white transition-all"
                            />
                        </div>

                        {/* XP Preview */}
                        {selectedType && description.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-vita-cream/60 rounded-2xl p-4 flex items-center justify-between"
                            >
                                <span className="text-sm font-medium text-gray-500">XP you'll earn</span>
                                <span className="text-lg font-black text-vita-orange">+{calculateXP(selectedType!)} XP ✨</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="w-full max-w-md px-6 pb-10 pt-4">
                        <motion.button
                            whileTap={canSubmit ? { scale: 0.97 } : {}}
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${canSubmit
                                ? `${selectedOption?.color || 'bg-vita-green'} text-white active:shadow-md`
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Log Activity 🌱'
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
