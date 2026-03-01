import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only use the provided URL if it looks like a valid URL, otherwise fallback to placeholder
const supabaseUrl = (rawUrl.startsWith('http') && !rawUrl.includes('your_supabase_url_here'))
    ? rawUrl
    : 'https://placeholder.supabase.co';

const supabaseAnonKey = (rawKey && !rawKey.includes('your_supabase_anon_key_here'))
    ? rawKey
    : 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
