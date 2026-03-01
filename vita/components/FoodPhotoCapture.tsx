'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Sparkles, Loader2 } from 'lucide-react';

interface FoodAnalysis {
    foods: { name: string; calories: number; portion: string }[];
    totalCalories: number;
    description: string;
}

interface FoodPhotoCaptureProps {
    onAnalysisComplete: (analysis: FoodAnalysis) => void;
    onClose: () => void;
    isOpen: boolean;
}

export default function FoodPhotoCapture({ onAnalysisComplete, onClose, isOpen }: FoodPhotoCaptureProps) {
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraActive(true);
            setError(null);
        } catch {
            setError('Camera access denied. Use file upload instead.');
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraActive(false);
    }, []);

    const captureFromCamera = useCallback(() => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(dataUrl);
            stopCamera();
        }
    }, [stopCamera]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setCapturedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const analyzeImage = useCallback(async () => {
        if (!capturedImage) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const res = await fetch('/api/analyze-food', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: capturedImage }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Analysis failed');
            }

            const data: FoodAnalysis = await res.json();
            setAnalysis(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze food');
        } finally {
            setIsAnalyzing(false);
        }
    }, [capturedImage]);

    const handleConfirm = useCallback(() => {
        if (analysis) {
            onAnalysisComplete(analysis);
            // Reset state
            setCapturedImage(null);
            setAnalysis(null);
            setError(null);
        }
    }, [analysis, onAnalysisComplete]);

    const handleReset = useCallback(() => {
        setCapturedImage(null);
        setAnalysis(null);
        setError(null);
        stopCamera();
    }, [stopCamera]);

    const handleClose = useCallback(() => {
        handleReset();
        onClose();
    }, [handleReset, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="fixed inset-0 z-50 bg-white flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h2 className="text-lg font-black text-vita-text flex items-center gap-2">
                            <Sparkles size={20} className="text-vita-orange" />
                            AI Food Scanner
                        </h2>
                        <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
                        {/* Step 1: Capture or Upload */}
                        {!capturedImage && !isCameraActive && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-6 w-full"
                            >
                                <div className="w-32 h-32 bg-vita-orange/10 rounded-3xl flex items-center justify-center">
                                    <Camera size={48} className="text-vita-orange" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-vita-text">Snap your food</p>
                                    <p className="text-sm text-vita-text-muted mt-1">AI will identify it and estimate calories</p>
                                </div>

                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startCamera}
                                        className="w-full py-4 rounded-2xl bg-vita-orange text-white font-bold text-base shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Camera size={20} />
                                        Take Photo
                                    </motion.button>

                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-4 rounded-2xl bg-gray-100 text-vita-text font-bold text-base flex items-center justify-center gap-2"
                                    >
                                        📁 Upload from Gallery
                                    </motion.button>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Camera View */}
                        {isCameraActive && (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Viewfinder overlay */}
                                    <div className="absolute inset-4 border-2 border-white/40 rounded-xl pointer-events-none" />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={stopCamera}
                                        className="px-6 py-3 rounded-xl bg-gray-200 text-gray-600 font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={captureFromCamera}
                                        className="w-16 h-16 rounded-full bg-vita-orange text-white shadow-lg flex items-center justify-center border-4 border-white"
                                    >
                                        <Camera size={28} />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Preview & Analyze */}
                        {capturedImage && !analysis && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-4 w-full"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={capturedImage}
                                    alt="Captured food"
                                    className="w-full max-w-sm rounded-2xl shadow-lg object-cover aspect-[4/3]"
                                />

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm font-bold px-4 py-2 rounded-xl border border-red-200 w-full max-w-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 w-full max-w-sm">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} />
                                        Retake
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={analyzeImage}
                                        disabled={isAnalyzing}
                                        className="flex-1 py-3 rounded-xl bg-vita-orange text-white font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Analyze Food
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Analysis Results */}
                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-4 w-full max-w-sm"
                            >
                                {capturedImage && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={capturedImage}
                                        alt="Analyzed food"
                                        className="w-full rounded-2xl shadow-md object-cover aspect-[4/3]"
                                    />
                                )}

                                {/* Total */}
                                <div className="bg-gradient-to-r from-vita-orange/10 to-vita-cream rounded-2xl p-4 text-center border border-vita-orange/20">
                                    <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Estimated Total</p>
                                    <p className="text-3xl font-black text-vita-orange-dark mt-1">{analysis.totalCalories} <span className="text-base">kcal</span></p>
                                    <p className="text-xs text-vita-text-muted mt-1">{analysis.description}</p>
                                </div>

                                {/* Individual Items */}
                                <div className="flex flex-col gap-2">
                                    {analysis.foods.map((food, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.08 }}
                                            className="vita-card p-3 flex items-center gap-3"
                                        >
                                            <span className="text-lg">🍽️</span>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-vita-text">{food.name}</p>
                                                <p className="text-xs text-vita-text-muted">{food.portion}</p>
                                            </div>
                                            <span className="text-sm font-black text-vita-orange-dark">{food.calories} kcal</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-500 font-bold"
                                    >
                                        Retake
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleConfirm}
                                        className="flex-1 py-3 rounded-xl bg-vita-green text-white font-bold shadow-md"
                                    >
                                        ✅ Add to Log
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
