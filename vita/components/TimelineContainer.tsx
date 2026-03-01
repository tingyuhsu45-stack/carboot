'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TimelineNode, { ActivityType } from './TimelineNode';
import { supabase } from '@/lib/supabase';

interface Activity {
    id: string;
    activity_type: ActivityType;
    description: string;
    created_at: string;
    duration_seconds?: number;
    xp_awarded: number;
}

const MOCK_ACTIVITIES: Activity[] = [
    {
        id: '1',
        activity_type: 'sleep',
        description: 'Good night sleep',
        created_at: new Date(new Date().setHours(8, 0)).toISOString(),
        duration_seconds: 28800,
        xp_awarded: 50
    },
    {
        id: '2',
        activity_type: 'food',
        description: 'Healthy breakfast',
        created_at: new Date(new Date().setHours(9, 30)).toISOString(),
        xp_awarded: 10
    },
    {
        id: '3',
        activity_type: 'work',
        description: 'Deep work session',
        created_at: new Date(new Date().setHours(11, 0)).toISOString(),
        duration_seconds: 5400,
        xp_awarded: 30
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

interface TimelineContainerProps {
    onXPGained?: (xp: number) => void;
    onActivityAdded?: (activity: Activity) => void;
}

export default function TimelineContainer({ onXPGained, onActivityAdded }: TimelineContainerProps) {
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
    const [loading, setLoading] = useState(false);

    const handleNewActivity = useCallback(
        (activity: Activity) => {
            setActivities((prev) => {
                const newActivities = [activity, ...prev];
                if (onActivityAdded) {
                    onActivityAdded(activity);
                }
                return newActivities;
            });
            if (onXPGained && activity.xp_awarded) {
                onXPGained(activity.xp_awarded);
            }
        },
        [onXPGained, onActivityAdded]
    );

    useEffect(() => {
        const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

        async function fetchActivities() {
            setLoading(true);
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data && data.length > 0) {
                setActivities(data);
            }
            setLoading(false);
        }

        if (isConfigured) {
            fetchActivities();
        }

        // Real-time subscription
        if (!isConfigured) return;

        const channel = supabase
            .channel('activities-realtime')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'activities',
                },
                (payload) => {
                    const newActivity = payload.new as Activity;
                    handleNewActivity(newActivity);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [handleNewActivity]);

    if (loading) {
        return (
            <div className="py-10 text-center">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-vita-text-muted font-medium"
                >
                    Loading your day...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="py-6">
            {activities.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 vita-card p-8"
                >
                    <p className="text-3xl mb-3">🌱</p>
                    <p className="text-vita-text-secondary font-medium">No activities yet.</p>
                    <p className="text-vita-text-muted text-sm mt-1">Tap &quot;+&quot; to start growing!</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {activities.map((activity, index) => (
                        <TimelineNode
                            key={activity.id}
                            activity={activity}
                            index={index}
                            isLast={index === activities.length - 1}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
}
