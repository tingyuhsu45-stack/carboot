'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LifeTreeProps {
    level: number;
}

export default function LifeTree({ level }: LifeTreeProps) {
    const isSprout = level < 4;
    const isSapling = level >= 4 && level < 10;
    const isFullTree = level >= 10 && level < 20;
    const isBlooming = level >= 20;

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Trunk */}
                <motion.rect
                    x="48"
                    y={isSprout ? "85" : "60"}
                    width="4"
                    height={isSprout ? "5" : "30"}
                    rx="2"
                    fill="#7D5233"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Leaves / Branches */}
                {isSprout && (
                    <motion.path
                        d="M50 85C45 80 40 85 45 90C50 95 55 90 50 85Z"
                        fill="#A7F3D0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                )}

                {(isSapling || isFullTree || isBlooming) && (
                    <>
                        <motion.circle
                            cx="50"
                            cy="55"
                            r="15"
                            fill="#A7F3D0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                        />
                        <motion.circle
                            cx="40"
                            cy="65"
                            r="10"
                            fill="#A7F3D0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                        />
                        <motion.circle
                            cx="60"
                            cy="65"
                            r="10"
                            fill="#A7F3D0"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                        />
                    </>
                )}

                {(isFullTree || isBlooming) && (
                    <>
                        <motion.circle
                            cx="50"
                            cy="40"
                            r="20"
                            fill="#86EFAC"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4 }}
                        />
                        <motion.circle
                            cx="35"
                            cy="50"
                            r="12"
                            fill="#86EFAC"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                        />
                        <motion.circle
                            cx="65"
                            cy="50"
                            r="12"
                            fill="#86EFAC"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 }}
                        />
                    </>
                )}

                {isBlooming && (
                    <>
                        {/* Flowers */}
                        {[
                            { cx: 50, cy: 30 },
                            { cx: 30, cy: 45 },
                            { cx: 70, cy: 45 },
                            { cx: 40, cy: 60 },
                            { cx: 60, cy: 60 },
                        ].map((flower, i) => (
                            <motion.circle
                                key={i}
                                cx={flower.cx}
                                cy={flower.cy}
                                r="4"
                                fill={i % 2 === 0 ? "#FFD8A8" : "#BAE6FD"}
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                            />
                        ))}
                    </>
                )}
            </svg>
            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest text-center">
                {isSprout ? "New Sprout" : isSapling ? "Young Sapling" : isFullTree ? "Strong Tree" : "Blooming Life"}
            </p>
        </div>
    );
}
