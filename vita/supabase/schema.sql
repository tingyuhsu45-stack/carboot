-- Table: profiles (extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  total_xp integer default 0,
  current_streak integer default 0,
  streak_shields integer default 0
);

-- Table: activities (The core record for the timeline)
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  activity_type text not null, -- Enum: 'exercise', 'work', 'sleep', 'food', 'metric'
  duration_seconds integer, -- Nullable for 'food' or 'metric'
  description text, -- e.g., "Morning jog" or "Ate salad"
  xp_awarded integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS Policies
alter table public.activities enable row level security;
create policy "Users can view their own activities."
  on public.activities for select
  using ( auth.uid() = user_id );
create policy "Users can insert their own activities."
  on public.activities for insert
  with check ( auth.uid() = user_id );

alter table public.profiles enable row level security;
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );
create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Table: unlocked_achievements
create table public.unlocked_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  achievement_type text not null, -- 'early_bird', 'deep_work', 'consistency'
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_type)
);

alter table public.unlocked_achievements enable row level security;
create policy "Users can view their own achievements."
  on public.unlocked_achievements for select
  using ( auth.uid() = user_id );
create policy "Users can insert their own achievements."
  on public.unlocked_achievements for insert
  with check ( auth.uid() = user_id );
