'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface DiaryEntryModalProps {
    isOpen: boolean;
    milestoneName: string;
    onSubmit: (content: string) => void;
    onClose: () => void;
}

export default function DiaryEntryModal({
    isOpen,
    milestoneName,
    onSubmit,
    onClose,
}: DiaryEntryModalProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setIsSubmitting(true);
        await onSubmit(content.trim());
        setContent('');
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Quest Log</p>
                                <h2 className="text-lg font-black text-vita-text mt-0.5">{milestoneName}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Diary Text Area */}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write about your progress... What did you learn? What's next?"
                            className="w-full h-40 px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-100 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-vita-green/50 focus:bg-white transition-all resize-none text-sm leading-relaxed"
                        />

                        {/* Character Count & Submit */}
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-vita-text-muted">
                                {content.length} characters
                            </span>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all ${content.trim()
                                        ? 'bg-vita-green text-white'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Send size={16} />
                                {isSubmitting ? 'Saving...' : 'Turn In Quest'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
