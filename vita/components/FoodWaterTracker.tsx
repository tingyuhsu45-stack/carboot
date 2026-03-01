'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, UtensilsCrossed, BookOpen, Camera } from 'lucide-react';
import FoodPhotoCapture from './FoodPhotoCapture';
import { useGoals } from './GoalsContext';

interface FoodEntry {
    id: string;
    description: string;
    calories: number;
    isOffPlan: boolean;
    isFavorite: boolean;
}

interface WaterState {
    glasses: number;
    target: number;
}

const MOCK_FOOD: FoodEntry[] = [
    { id: '1', description: 'Oatmeal with berries', calories: 320, isOffPlan: false, isFavorite: true },
    { id: '2', description: 'Grilled chicken salad', calories: 450, isOffPlan: false, isFavorite: false },
];

export default function FoodWaterTracker() {
    const { goals } = useGoals();
    const [foodEntries, setFoodEntries] = useState<FoodEntry[]>(MOCK_FOOD);
    const [water, setWater] = useState<WaterState>({ glasses: 4, target: goals.waterGlasses });
    const [showAddFood, setShowAddFood] = useState(false);
    const [newFoodDesc, setNewFoodDesc] = useState('');
    const [newFoodCal, setNewFoodCal] = useState('');
    const [showCraftingBook, setShowCraftingBook] = useState(false);
    const [showPhotoCapture, setShowPhotoCapture] = useState(false);

    const handlePhotoAnalysis = useCallback((analysis: { foods: { name: string; calories: number; portion: string }[]; totalCalories: number; description: string }) => {
        const newEntries: FoodEntry[] = analysis.foods.map((food, i) => ({
            id: `ai-${Date.now()}-${i}`,
            description: `${food.name} (${food.portion})`,
            calories: food.calories,
            isOffPlan: false,
            isFavorite: false,
        }));
        setFoodEntries(prev => [...prev, ...newEntries]);
        setShowPhotoCapture(false);
    }, []);

    const dailyCalories = foodEntries.reduce((sum, e) => sum + e.calories, 0);
    const calorieTarget = goals.calorieTarget;
    const calorieProgress = Math.min(1, dailyCalories / calorieTarget);
    const waterProgress = water.glasses / water.target;

    const handleAddWater = () => {
        setWater(prev => ({ ...prev, glasses: Math.min(prev.glasses + 1, 12) }));
    };

    const handleAddFood = () => {
        if (!newFoodDesc.trim()) return;
        const entry: FoodEntry = {
            id: Date.now().toString(),
            description: newFoodDesc.trim(),
            calories: parseInt(newFoodCal) || 0,
            isOffPlan: false,
            isFavorite: false,
        };
        setFoodEntries(prev => [...prev, entry]);
        setNewFoodDesc('');
        setNewFoodCal('');
        setShowAddFood(false);
    };

    const toggleFavorite = (id: string) => {
        setFoodEntries(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
    };

    const favorites = foodEntries.filter(e => e.isFavorite);

    return (
        <div className="flex flex-col gap-5">
            {/* Water Tracker */}
            <div className="vita-card p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Droplets size={18} className="text-vita-blue" />
                        <p className="text-sm font-bold text-vita-text uppercase tracking-wider">Water Intake</p>
                    </div>
                    <span className="text-sm font-black text-vita-blue">{water.glasses}/{water.target} glasses</span>
                </div>

                {/* Water Glass Icons */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                    {Array.from({ length: water.target }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className={`w-8 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${i < water.glasses
                                ? 'bg-vita-blue/20 border border-vita-blue/40'
                                : 'bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {i < water.glasses ? '💧' : ''}
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddWater}
                    className="w-full py-2.5 rounded-xl bg-vita-blue/15 text-vita-blue font-bold text-sm border border-vita-blue/20"
                >
                    + Drink Water
                </motion.button>
            </div>

            {/* Calorie Progress */}
            <div className="vita-card p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed size={18} className="text-vita-orange" />
                        <p className="text-sm font-bold text-vita-text uppercase tracking-wider">Calories</p>
                    </div>
                    <span className="text-sm font-black text-vita-orange-dark">{dailyCalories} / {calorieTarget} kcal</span>
                </div>

                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calorieProgress * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${calorieProgress > 1 ? 'bg-red-400' : 'bg-gradient-to-r from-vita-orange to-vita-green'
                            }`}
                    />
                </div>

                {/* Synergy Hint */}
                {waterProgress >= 1 && calorieProgress >= 0.5 && calorieProgress <= 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200"
                    >
                        <span className="text-sm">🌿</span>
                        <span className="text-xs font-bold text-emerald-700">Nutrition on track! Hit sleep target for Spirit Synergy Bonus</span>
                    </motion.div>
                )}
            </div>

            {/* Food Log */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-bold text-vita-text-muted uppercase tracking-wider">Today&apos;s Food Log</p>
                    <button
                        onClick={() => setShowCraftingBook(!showCraftingBook)}
                        className="flex items-center gap-1 text-xs font-bold text-vita-text-muted hover:text-vita-text"
                    >
                        <BookOpen size={12} />
                        {showCraftingBook ? 'Hide' : 'Recipes'}
                    </button>
                </div>

                {/* Crafting Book (Favorites) */}
                {showCraftingBook && favorites.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="vita-card p-3 bg-vita-cream/50"
                    >
                        <p className="text-xs font-bold text-vita-orange-dark mb-2">📖 Crafting Book</p>
                        <div className="flex flex-wrap gap-2">
                            {favorites.map(f => (
                                <button
                                    key={f.id}
                                    className="px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-vita-text border border-vita-card-border"
                                >
                                    {f.description}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {foodEntries.map((entry, i) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`vita-card p-3 flex items-center gap-3 ${entry.isOffPlan ? 'border-l-2 border-l-red-300' : ''}`}
                    >
                        <span className="text-lg">{entry.isOffPlan ? '☠️' : '🍽️'}</span>
                        <div className="flex-1">
                            <p className={`text-sm font-bold ${entry.isOffPlan ? 'text-red-400' : 'text-vita-text'}`}>
                                {entry.description}
                            </p>
                            {entry.calories > 0 && (
                                <p className="text-xs text-vita-text-muted">{entry.calories} kcal</p>
                            )}
                        </div>
                        <button
                            onClick={() => toggleFavorite(entry.id)}
                            className={`text-sm ${entry.isFavorite ? 'text-vita-orange' : 'text-gray-300'}`}
                        >
                            {entry.isFavorite ? '⭐' : '☆'}
                        </button>
                    </motion.div>
                ))}

                {/* AI Photo Scanner */}
                <FoodPhotoCapture
                    isOpen={showPhotoCapture}
                    onClose={() => setShowPhotoCapture(false)}
                    onAnalysisComplete={handlePhotoAnalysis}
                />

                {/* Quick Add Food */}
                {!showAddFood ? (
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPhotoCapture(true)}
                            className="flex-1 py-3 rounded-2xl bg-vita-orange text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                        >
                            <Camera size={16} />📸 Scan Food
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddFood(true)}
                            className="flex-1 py-3 rounded-2xl bg-vita-orange/15 border-2 border-dashed border-vita-orange/30 text-vita-orange font-bold text-sm"
                        >
                            <Plus size={16} className="inline mr-1" />Manual
                        </motion.button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="vita-card p-4 flex flex-col gap-3"
                    >
                        <input
                            type="text"
                            value={newFoodDesc}
                            onChange={(e) => setNewFoodDesc(e.target.value)}
                            placeholder="What did you eat?"
                            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vita-orange/50"
                        />
                        <input
                            type="number"
                            value={newFoodCal}
                            onChange={(e) => setNewFoodCal(e.target.value)}
                            placeholder="Calories (optional)"
                            className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-vita-orange/50"
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setShowAddFood(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm">Cancel</button>
                            <button onClick={handleAddFood} className="flex-1 py-2.5 rounded-xl bg-vita-orange text-white font-bold text-sm">Save</button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
