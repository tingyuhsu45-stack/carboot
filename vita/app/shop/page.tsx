'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Shield, UtensilsCrossed, Palette, Smartphone, Lock } from 'lucide-react';

interface ShopItem {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    emoji: string;
    xpCost: number;
    xpCategory: string;
    categoryLabel: string;
    color: string;
    colorLight: string;
}

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'cheat_meal',
        name: 'Cheat Meal Scroll',
        description: 'One off-plan meal without breaking Food Streak',
        icon: UtensilsCrossed,
        emoji: '🍕',
        xpCost: 150,
        xpCategory: 'health',
        categoryLabel: 'Health XP',
        color: 'bg-red-400',
        colorLight: 'bg-red-50',
    },
    {
        id: 'cloak_of_rest',
        name: 'Cloak of Rest',
        description: 'Skip a workout day while keeping Exercise Streak',
        icon: Shield,
        emoji: '🛡️',
        xpCost: 200,
        xpCategory: 'stamina',
        categoryLabel: 'Stamina XP',
        color: 'bg-vita-orange',
        colorLight: 'bg-vita-orange/10',
    },
    {
        id: 'streak_freeze',
        name: 'Streak Freeze',
        description: 'Save your streak after a missed day',
        icon: Sparkles,
        emoji: '❄️',
        xpCost: 300,
        xpCategory: 'stamina',
        categoryLabel: 'Stamina XP',
        color: 'bg-vita-blue',
        colorLight: 'bg-vita-blue/10',
    },
    {
        id: 'golden_theme',
        name: 'Golden Quest Map',
        description: 'Unlock a golden theme for your project maps',
        icon: Palette,
        emoji: '✨',
        xpCost: 500,
        xpCategory: 'wisdom',
        categoryLabel: 'Wisdom XP',
        color: 'bg-vita-orange',
        colorLight: 'bg-vita-cream',
    },
    {
        id: 'app_icon',
        name: 'Custom App Icon',
        description: 'Unlock premium app icon styles',
        icon: Smartphone,
        emoji: '📱',
        xpCost: 400,
        xpCategory: 'wisdom',
        categoryLabel: 'Wisdom XP',
        color: 'bg-vita-rest',
        colorLight: 'bg-vita-rest-light/20',
    },
];

export default function ShopPage() {
    // Mock XP balances
    const [xpBalances] = useState({
        health: 320,
        wisdom: 580,
        spirit: 210,
        stamina: 445,
    });
    const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
    const [lastPurchased, setLastPurchased] = useState<string | null>(null);

    const handlePurchase = (item: ShopItem) => {
        const balance = xpBalances[item.xpCategory as keyof typeof xpBalances];
        if (balance >= item.xpCost && !purchasedItems.includes(item.id)) {
            setPurchasedItems(prev => [...prev, item.id]);
            setLastPurchased(item.id);
            setTimeout(() => setLastPurchased(null), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-6 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-vita-cream rounded-xl flex items-center justify-center">
                    <ShoppingBag size={22} className="text-vita-orange-dark" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-vita-text">XP Shop</h1>
                    <p className="text-xs text-vita-text-muted">Spend your hard-earned XP</p>
                </div>
            </motion.div>

            {/* XP Balances */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { label: 'Health', xp: xpBalances.health, icon: '❤️', color: 'border-red-200 bg-red-50' },
                    { label: 'Wisdom', xp: xpBalances.wisdom, icon: '📖', color: 'border-vita-blue/30 bg-vita-blue/10' },
                    { label: 'Spirit', xp: xpBalances.spirit, icon: '✨', color: 'border-vita-rest/30 bg-vita-rest/10' },
                    { label: 'Stamina', xp: xpBalances.stamina, icon: '⚡', color: 'border-vita-orange/30 bg-vita-orange/10' },
                ].map((stat) => (
                    <div key={stat.label} className={`p-3 rounded-xl border text-center ${stat.color}`}>
                        <span className="text-lg">{stat.icon}</span>
                        <p className="text-lg font-black text-vita-text mt-0.5">{stat.xp}</p>
                        <p className="text-[10px] font-bold text-vita-text-muted uppercase">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Shop Items */}
            <div className="flex flex-col gap-3">
                {SHOP_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const balance = xpBalances[item.xpCategory as keyof typeof xpBalances];
                    const canAfford = balance >= item.xpCost;
                    const isPurchased = purchasedItems.includes(item.id);
                    const justPurchased = lastPurchased === item.id;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                            className={`vita-card p-4 flex items-center gap-4 ${isPurchased ? 'opacity-50' : ''}`}
                        >
                            {/* Item Icon */}
                            <div className={`w-14 h-14 ${item.colorLight} rounded-2xl flex items-center justify-center text-2xl`}>
                                {justPurchased ? '🎉' : item.emoji}
                            </div>

                            {/* Item Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-vita-text">{item.name}</h3>
                                <p className="text-xs text-vita-text-muted mt-0.5 leading-snug">{item.description}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Icon size={10} className="text-vita-text-muted" />
                                    <span className="text-[10px] font-bold text-vita-text-muted uppercase">{item.categoryLabel}</span>
                                </div>
                            </div>

                            {/* Purchase Button */}
                            {isPurchased ? (
                                <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-bold text-sm">
                                    Owned
                                </div>
                            ) : (
                                <motion.button
                                    whileTap={canAfford ? { scale: 0.92 } : {}}
                                    onClick={() => handlePurchase(item)}
                                    disabled={!canAfford}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 ${canAfford
                                            ? `${item.color} text-white shadow-md`
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {!canAfford && <Lock size={12} />}
                                    {item.xpCost} XP
                                </motion.button>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
