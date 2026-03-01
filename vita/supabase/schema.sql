-- Table: profiles (extends default auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text,
  total_xp integer default 0,
  health_xp integer default 0,
  wisdom_xp integer default 0,
  spirit_xp integer default 0,
  stamina_xp integer default 0,
  current_streak integer default 0,
  streak_shields integer default 0,
  streak_freeze_count integer default 0
);

-- Table: activities (The core record for the timeline)
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  activity_type text not null, -- 'exercise','work','sleep','food','metric'
  duration_seconds integer,
  description text,
  xp_awarded integer default 0,
  xp_category text default 'health', -- 'health','wisdom','spirit','stamina'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: daily_quests (5-min To-Dos)
create table public.daily_quests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  quest_type text not null, -- 'puzzle','guitar','webdesign','duolingo','yoga'
  quest_name text not null,
  xp_category text not null, -- 'wisdom' or 'spirit'
  xp_awarded integer default 10,
  duration_seconds integer default 300, -- 5 min default
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: epic_quests (Projects / Storylines)
create table public.epic_quests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null, -- e.g. 'Website Dev', 'Finding Sponsors', 'TCM'
  description text,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: quest_milestones (Tech Tree Nodes)
create table public.quest_milestones (
  id uuid default gen_random_uuid() primary key,
  quest_id uuid references public.epic_quests(id) on delete cascade not null,
  title text not null,
  description text,
  milestone_order integer not null, -- position in the tree
  is_boss boolean default false, -- boss milestone = major checkpoint
  xp_reward integer default 50,
  status text default 'locked', -- 'locked','active','completed'
  completed_at timestamp with time zone
);

-- Table: diary_entries (Quest turn-in mechanic)
create table public.diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  milestone_id uuid references public.quest_milestones(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: sleep_logs
create table public.sleep_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  hours numeric(4,2) not null,
  quality integer check (quality between 1 and 5), -- 1=poor, 5=excellent
  depth_score numeric(4,2), -- calculated sleep depth
  logged_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, logged_date)
);

-- Table: food_logs
create table public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  description text not null,
  calories integer,
  is_water boolean default false,
  water_ml integer, -- if is_water=true
  is_off_plan boolean default false, -- "Can't Eat" item
  is_favorite boolean default false, -- saved to Crafting Book
  logged_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: body_metrics
create table public.body_metrics (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  weight_kg numeric(5,2),
  waist_cm numeric(5,2),
  logged_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, logged_date)
);

-- Table: shop_purchases
create table public.shop_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  item_type text not null, -- 'cheat_meal','cloak_of_rest','streak_freeze','golden_theme','app_icon'
  xp_cost integer not null,
  xp_category text not null, -- which XP pool was spent
  purchased_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.activities enable row level security;
create policy "Users can view their own activities."
  on public.activities for select using ( auth.uid() = user_id );
create policy "Users can insert their own activities."
  on public.activities for insert with check ( auth.uid() = user_id );

alter table public.profiles enable row level security;
create policy "Users can view their own profile."
  on public.profiles for select using ( auth.uid() = id );
create policy "Users can update their own profile."
  on public.profiles for update using ( auth.uid() = id );

alter table public.unlocked_achievements enable row level security;
create policy "Users can view their own achievements."
  on public.unlocked_achievements for select using ( auth.uid() = user_id );
create policy "Users can insert their own achievements."
  on public.unlocked_achievements for insert with check ( auth.uid() = user_id );

-- Table: unlocked_achievements
create table public.unlocked_achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  achievement_type text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_type)
);

-- RLS for new tables
alter table public.daily_quests enable row level security;
create policy "Users can manage their own quests."
  on public.daily_quests for all using ( auth.uid() = user_id );

alter table public.epic_quests enable row level security;
create policy "Users can manage their own epic quests."
  on public.epic_quests for all using ( auth.uid() = user_id );

alter table public.quest_milestones enable row level security;
create policy "Users can manage milestones of their quests."
  on public.quest_milestones for all using (
    exists (select 1 from public.epic_quests eq where eq.id = quest_id and eq.user_id = auth.uid())
  );

alter table public.diary_entries enable row level security;
create policy "Users can manage their own diary entries."
  on public.diary_entries for all using ( auth.uid() = user_id );

alter table public.sleep_logs enable row level security;
create policy "Users can manage their own sleep logs."
  on public.sleep_logs for all using ( auth.uid() = user_id );

alter table public.food_logs enable row level security;
create policy "Users can manage their own food logs."
  on public.food_logs for all using ( auth.uid() = user_id );

alter table public.body_metrics enable row level security;
create policy "Users can manage their own body metrics."
  on public.body_metrics for all using ( auth.uid() = user_id );

alter table public.shop_purchases enable row level security;
create policy "Users can manage their own purchases."
  on public.shop_purchases for all using ( auth.uid() = user_id );
