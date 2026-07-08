import { supabase, isSupabaseConfigured } from './supabase'

// --- Interface Definitions ---
export interface UserProfile {
  id?: string; // Supabase user ID
  email?: string;
  name: string;
  age: number;
  gender: string;
  height: number; // in cm
  weight: number; // in kg
  goal: string;
  activity_level?: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extremely Active';
  experience_level: 'Beginner' | 'Intermediate' | 'Advanced';
  available_equipment: string[];
  workout_days_preference: number;
  preferred_session_duration: number; // in minutes
  unit_preference: 'metric' | 'imperial';
  notification_preferences: {
    workout: boolean;
    water: boolean;
    protein: boolean;
    sleep: boolean;
    weekly_report: boolean;
  };
  avatar_url?: string;
  onboarded: boolean;
  workout_settings?: any;
  ai_settings?: any;
  acknowledged_warnings?: string[];
}

export interface FoodLog {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  healthy_score: number; // 0-10
  suggestions: string;
  serving_size: string;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string; // YYYY-MM-DD
  created_at: string;
  detected_foods?: Array<{
    name: string;
    portion_g: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  }>;
}

export interface WeightLog {
  id: string;
  weight: number; // always stored in kg
  body_fat?: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  isCustom?: boolean;
  frequency: 'daily' | 'weekdays' | 'custom';
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  rest: number; // in seconds
  tempo?: string;
  tips: string;
  difficulty: string;
  // Dynamic fields during active workout tracking
  completedSets?: boolean[];
  weightCompleted?: number[];
  repsCompleted?: number[];
}

export interface WorkoutDay {
  id: string;
  dayIndex: number; // 0 to 6 (Monday to Sunday)
  muscle_group: string;
  exercises: WorkoutExercise[];
  warmup?: string[];
  cooldown?: string[];
  estimated_calories: number;
  difficulty: string;
  completed?: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  split_type: string;
  days_per_week: number;
  duration: number;
  equipment: string[];
  experience: string;
  days: WorkoutDay[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'workout' | 'water' | 'protein' | 'sleep' | 'weekly_report' | 'achievement';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface CaloriePredictionLog {
  id: string;
  user_id?: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  workout_type: string;
  workout_duration: number;
  steps: number;
  heart_rate: number;
  calories_consumed: number;
  calories_burned: number;
  confidence: number;
  created_at: string;
}


// Seed Weight logs over the last 10 days
const getPastDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const SEED_WEIGHTS: WeightLog[] = [
  { id: 'w1', weight: 85.2, body_fat: 21.0, date: getPastDateString(10), notes: 'Starting weight', created_at: new Date().toISOString() },
  { id: 'w2', weight: 84.8, body_fat: 20.8, date: getPastDateString(8), notes: 'Feeling lighter', created_at: new Date().toISOString() },
  { id: 'w3', weight: 84.1, body_fat: 20.4, date: getPastDateString(6), notes: 'Good progress', created_at: new Date().toISOString() },
  { id: 'w4', weight: 83.5, body_fat: 20.1, date: getPastDateString(4), notes: 'Cardio day completed', created_at: new Date().toISOString() },
  { id: 'w5', weight: 82.9, body_fat: 19.8, date: getPastDateString(2), notes: 'Clean nutrition', created_at: new Date().toISOString() },
  { id: 'w6', weight: 82.5, body_fat: 19.5, date: getPastDateString(0), notes: 'Today log', created_at: new Date().toISOString() },
];

const SEED_FOODS: FoodLog[] = [
  {
    id: 'f1',
    food_name: 'Avocado Toast with 2 Poached Eggs',
    calories: 420,
    protein: 22,
    fat: 24,
    carbs: 32,
    healthy_score: 9,
    suggestions: 'Great source of healthy fats and protein. Consider replacing white toast with sourdough for better digestion.',
    serving_size: '1 plate',
    meal_type: 'Breakfast',
    date: getPastDateString(0),
    created_at: new Date().toISOString()
  },
  {
    id: 'f2',
    food_name: 'Grilled Salmon with Quinoa & Asparagus',
    calories: 580,
    protein: 45,
    fat: 22,
    carbs: 48,
    healthy_score: 10,
    suggestions: 'Perfect muscle-building dinner rich in Omega-3 fatty acids and complex carbohydrates.',
    serving_size: '1 fillet + 1 cup quinoa',
    meal_type: 'Dinner',
    date: getPastDateString(0),
    created_at: new Date().toISOString()
  },
  {
    id: 'f3',
    food_name: 'Whey Protein Shake with Banana & Almond Milk',
    calories: 310,
    protein: 30,
    fat: 5,
    carbs: 38,
    healthy_score: 8,
    suggestions: 'Ideal post-workout snack. Fast digesting protein and glycogen replacement.',
    serving_size: '500ml',
    meal_type: 'Snack',
    date: getPastDateString(0),
    created_at: new Date().toISOString()
  },
  {
    id: 'f4',
    food_name: 'Chicken Rice Bowl',
    calories: 620,
    protein: 48,
    fat: 12,
    carbs: 75,
    healthy_score: 8,
    suggestions: 'Great clean lunch. Excellent balance of carbs and lean protein.',
    serving_size: '1 bowl',
    meal_type: 'Lunch',
    date: getPastDateString(1),
    created_at: new Date().toISOString()
  }
];

const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Workout Session', icon: 'Dumbbell', frequency: 'daily' },
  { id: 'h2', name: 'Water Intake (8 Glasses)', icon: 'Droplet', frequency: 'daily' },
  { id: 'h3', name: 'Protein Goal (150g+)', icon: 'Apple', frequency: 'daily' },
  { id: 'h4', name: 'Sleep (7-9 Hours)', icon: 'Moon', frequency: 'daily' },
  { id: 'h5', name: 'Mindful Meditation', icon: 'Heart', frequency: 'daily' },
  { id: 'h6', name: 'Walking (10,000 steps)', icon: 'Footprints', frequency: 'daily' },
];

const SEED_HABIT_LOGS: HabitLog[] = [];
// Log completions for the last 5 days
for (let d = 0; d <= 5; d++) {
  const dateStr = getPastDateString(d);
  DEFAULT_HABITS.forEach((habit) => {
    // Randomize completions to simulate real usage
    const isCompleted = Math.random() > (d === 0 ? 0.3 : 0.4); // higher completion for today
    SEED_HABIT_LOGS.push({
      id: `${habit.id}-${dateStr}`,
      habit_id: habit.id,
      date: dateStr,
      completed: isCompleted,
    });
  });
}

const SEED_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'c1', sender: 'ai', text: 'Hello! I am your Athlix AI Coach. How are your fitness goals coming along? Need a custom workout plan, a meal breakdown, or some motivation?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: 'c2', sender: 'user', text: 'Hey, I want to gain muscle, can you help?', timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
  { id: 'c3', sender: 'ai', text: 'Absolutely! To build muscle effectively, we need to focus on **Progressive Overload** (gradually increasing weights/reps), consuming a **Caloric Surplus**, and hit a daily protein goal of roughly **1.6-2.2g of protein per kg** of body weight.\n\nI recommend we generate a custom **Push/Pull/Legs** or **Upper/Lower** split in the **Workout Planner** tab! Shall we build one now?', timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString() },
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', type: 'achievement', title: 'Athlix Account Active!', body: 'Welcome aboard! Let\'s crush your wellness goals.', timestamp: getPastDateString(1) + 'T08:00:00.000Z', read: true },
  { id: 'n2', type: 'weekly_report', title: 'Weekly Recap Available', body: 'You completed 4/4 scheduled workouts this week! Keep it up.', timestamp: getPastDateString(2) + 'T18:30:00.000Z', read: false },
  { id: 'n3', type: 'water', title: 'Hydration Check 💧', body: 'Time to drink some water and log it to reach your daily goal.', timestamp: getPastDateString(0) + 'T14:00:00.000Z', read: false },
];

// Seed a starter workout plan
const SEED_WORKOUT_PLAN: WorkoutPlan = {
  id: 'plan_1',
  name: 'Athlix Hypertrophy 4-Day Split',
  goal: 'Muscle Gain',
  split_type: 'Upper/Lower',
  days_per_week: 4,
  duration: 60,
  equipment: ['Gym', 'Dumbbells', 'Barbell'],
  experience: 'Intermediate',
  created_at: new Date().toISOString(),
  days: [
    {
      id: 'day_0',
      dayIndex: 0, // Monday
      muscle_group: 'Upper Body A',
      estimated_calories: 450,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: 8, rest: 90, tips: 'Keep shoulder blades squeezed. Pull elbows to 45 deg.', difficulty: 'Intermediate' },
        { name: 'Overhand Pull-Up', sets: 4, reps: 6, rest: 90, tips: 'Pull chest to bar. Do not swing.', difficulty: 'Advanced' },
        { name: 'Dumbbell Standing Shoulder Press', sets: 3, reps: 10, rest: 75, tips: 'Brace core, press straight up.', difficulty: 'Intermediate' },
        { name: 'Dumbbell Alternate Bicep Curl', sets: 3, reps: 12, rest: 60, tips: 'Keep elbows locked at your side.', difficulty: 'Beginner' }
      ]
    },
    {
      id: 'day_1',
      dayIndex: 1, // Tuesday
      muscle_group: 'Lower Body A',
      estimated_calories: 550,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: 6, rest: 120, tips: 'Reach parallel depth, push knees out.', difficulty: 'Intermediate' },
        { name: 'Bodyweight Forward Lunge', sets: 3, reps: 12, rest: 60, tips: 'Keep body tall. 90 deg knee bend.', difficulty: 'Beginner' },
        { name: 'Leg Curls', sets: 3, reps: 12, rest: 60, tips: 'Squeeze hamstrings at bottom.', difficulty: 'Beginner' },
        { name: 'Calf Raises', sets: 4, reps: 15, rest: 45, tips: 'Full range of motion, squeeze at top.', difficulty: 'Beginner' }
      ]
    },
    {
      id: 'day_3',
      dayIndex: 3, // Thursday
      muscle_group: 'Upper Body B',
      estimated_calories: 420,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Barbell Conventional Deadlift', sets: 3, reps: 5, rest: 150, tips: 'Keep spine flat, pull slack out of bar.', difficulty: 'Advanced' },
        { name: 'Standard Push-Up', sets: 3, reps: 15, rest: 60, tips: 'Keep straight body line, chest to floor.', difficulty: 'Beginner' },
        { name: 'Dumbbell Rows', sets: 3, reps: 10, rest: 75, tips: 'Pull weight to hip, squeeze upper back.', difficulty: 'Beginner' },
        { name: 'Triceps Overhead Extension', sets: 3, reps: 12, rest: 60, tips: 'Pin elbows to head, extend elbows.', difficulty: 'Beginner' }
      ]
    },
    {
      id: 'day_4',
      dayIndex: 4, // Friday
      muscle_group: 'Lower Body B',
      estimated_calories: 500,
      difficulty: 'Intermediate',
      exercises: [
        { name: 'Romanian Deadlift (RDL)', sets: 3, reps: 10, rest: 90, tips: 'Hinge at hips, feel hamstrings stretch.', difficulty: 'Intermediate' },
        { name: 'Leg Press', sets: 3, reps: 10, rest: 90, tips: 'Do not lock knees completely at top.', difficulty: 'Beginner' },
        { name: 'Plank Hold', sets: 3, reps: 60, rest: 45, tips: 'Keep core tight, body straight.', difficulty: 'Beginner' }
      ]
    }
  ]
};

// --- LocalStorage Database Helper Actions ---
const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (e) {
    console.error('[DB] Error in getLocal for key:', key, e);
    return defaultValue;
  }
};

// Safe get that doesn't overwrite existing data
const getLocalSafe = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      return defaultValue;
    }
    return JSON.parse(data) as T;
  } catch (e) {
    console.error('[DB] Error in getLocalSafe for key:', key, e);
    return defaultValue;
  }
};

const setLocal = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log('[DB] Successfully set localStorage key:', key);
  } catch (e) {
    console.error('[DB] Error in setLocal for key:', key, e);
  }
};

// Initialize localStorage values if they do not exist
const initLocalStorage = () => {
  console.log('[DB] initLocalStorage called');
  console.log('[DB] Browser info:', navigator.userAgent);
  console.log('[DB] localStorage available:', typeof localStorage !== 'undefined');

  try {
    // Check if profile exists before initializing
    const existingProfile = localStorage.getItem('athlix_profile');
    console.log('[DB] Existing profile before init:', existingProfile);

    // Only initialize other data, leave profile alone
    getLocal('athlix_weights', SEED_WEIGHTS);
    getLocal('athlix_foods', SEED_FOODS);
    getLocal('athlix_habits', DEFAULT_HABITS);
    getLocal('athlix_habit_logs', SEED_HABIT_LOGS);
    getLocal('athlix_chat_messages', SEED_CHAT_MESSAGES);
    getLocal('athlix_notifications', SEED_NOTIFICATIONS);
    getLocal('athlix_workout_plans', [SEED_WORKOUT_PLAN]);

    const profileAfterInit = localStorage.getItem('athlix_profile');
    console.log('[DB] Profile after init:', profileAfterInit);
    console.log('[DB] Profile preserved:', existingProfile === profileAfterInit);
  } catch (e) {
    console.error('[DB] Error during initLocalStorage:', e);
  }
};

// Auto-run local init
if (typeof window !== 'undefined') {
  initLocalStorage();
}

// --- DB ADAPTER IMPLEMENTATION ---
export const db = {
  // --- USER PROFILE FUNCTIONS ---
  async fetchUserProfile(): Promise<UserProfile | null> {
    console.log('[DB] fetchUserProfile called, Supabase configured:', isSupabaseConfigured);
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[DB] Current user:', user?.id, user?.email);
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          console.log('[DB] Supabase query result:', data, error);
          if (data && !error) {
            console.log('[DB] Returning profile from Supabase');
            return data as UserProfile;
          }
          // If no profile exists in Supabase, check localStorage
          if (error && error.code === 'PGRST116') {
            console.log('[DB] No profile in Supabase, checking localStorage');
            const localProfile = getLocalSafe<UserProfile | null>('athlix_profile', null);
            if (localProfile && localProfile.onboarded) {
              console.log('[DB] Using local profile as fallback');
              return localProfile;
            }
            return null;
          }
          if (error) {
            console.error('[DB] Error fetching profile:', error);
            // If table doesn't exist, fall back to localStorage
            if (error.message.includes('does not exist') || error.code === '42P01') {
              console.log('[DB] Users table does not exist, using localStorage');
              return getLocalSafe<UserProfile | null>('athlix_profile', null);
            }
          }
        } catch (e) {
          console.error('[DB] Exception in fetchUserProfile:', e);
          return getLocalSafe<UserProfile | null>('athlix_profile', null);
        }
      } else {
        console.log('[DB] No authenticated user');
      }
    }
    console.log('[DB] Returning from localStorage');
    return getLocalSafe<UserProfile | null>('athlix_profile', null);
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    console.log('[DB] updateUserProfile called with:', profile);
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('[DB] Current user for update:', user?.id, user?.email);
      if (user) {
        try {
          // Use upsert to either insert or update
          const { data, error } = await supabase
            .from('users')
            .upsert({
              id: user.id,
              email: user.email,
              ...profile,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          console.log('[DB] Upsert result:', data, error);
          if (data && !error) {
            console.log('[DB] Profile updated successfully in Supabase');
            // Also update localStorage as backup
            localStorage.setItem('athlix_profile', JSON.stringify(data));
            return data as UserProfile;
          }
          if (error) {
            console.error('[DB] Error updating profile:', error);
            // If table doesn't exist, fall back to localStorage
            if (error.message.includes('does not exist') || error.code === '42P01') {
              console.log('[DB] Users table does not exist, using localStorage');
              const current = getLocalSafe<UserProfile | null>('athlix_profile', null);
              const updated = current ? { ...current, ...profile } : profile as UserProfile;
              setLocal('athlix_profile', updated);
              localStorage.setItem('athlix_profile', JSON.stringify(updated));
              return updated;
            }
          }
        } catch (e) {
          console.error('[DB] Exception in updateUserProfile:', e);
          // Fall back to localStorage on exception
          const current = getLocalSafe<UserProfile | null>('athlix_profile', null);
          const updated = current ? { ...current, ...profile } : profile as UserProfile;
          setLocal('athlix_profile', updated);
          localStorage.setItem('athlix_profile', JSON.stringify(updated));
          return updated;
        }
      }
    }
    console.log('[DB] Using local fallback for profile update');
    const current = getLocalSafe<UserProfile | null>('athlix_profile', null);
    const updated = current ? { ...current, ...profile } : profile as UserProfile;
    setLocal('athlix_profile', updated);
    // Also update localStorage directly to ensure persistence
    localStorage.setItem('athlix_profile', JSON.stringify(updated));
    console.log('[DB] Profile saved to localStorage:', updated);
    return updated;
  },

  // --- FOODS LOG FUNCTIONS ---
  async fetchFoods(date: string): Promise<FoodLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .eq('date', date)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (data && !error) return data as FoodLog[];
      }
    }
    const allFoods = getLocal<FoodLog[]>('athlix_foods', SEED_FOODS);
    return allFoods.filter((f) => f.date === date);
  },

  async fetchAllFoods(): Promise<FoodLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (data && !error) return data as FoodLog[];
      }
    }
    return getLocal<FoodLog[]>('athlix_foods', SEED_FOODS).sort((a, b) => b.date.localeCompare(a.date));
  },

  async addFood(food: Omit<FoodLog, 'id' | 'created_at'>): Promise<FoodLog> {
    const newFood: FoodLog = {
      ...food,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('foods')
          .insert([{ ...food, user_id: user.id }])
          .select()
          .single();
        if (error) {
          console.error('Supabase addFood error:', error);
          // Fall back to localStorage on error
        } else if (data) {
          return data as FoodLog;
        }
      }
    }

    const allFoods = getLocal<FoodLog[]>('athlix_foods', SEED_FOODS);
    allFoods.push(newFood);
    setLocal('athlix_foods', allFoods);
    return newFood;
  },

  async deleteFood(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('foods').delete().eq('id', id).eq('user_id', user.id);
        if (error) {
          console.error('Supabase deleteFood error:', error);
          // Fall back to localStorage on error
        } else {
          return;
        }
      }
    }
    const allFoods = getLocal<FoodLog[]>('athlix_foods', SEED_FOODS);
    const filtered = allFoods.filter((f) => f.id !== id);
    setLocal('athlix_foods', filtered);
  },

  // --- WEIGHT LOG FUNCTIONS ---
  async fetchWeights(): Promise<WeightLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('weights')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        if (data && !error) return data as WeightLog[];
      }
    }
    return getLocal<WeightLog[]>('athlix_weights', SEED_WEIGHTS).sort((a, b) => a.date.localeCompare(b.date));
  },

  async addWeight(entry: Omit<WeightLog, 'id' | 'created_at'>): Promise<WeightLog> {
    const newWeight: WeightLog = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('weights')
          .insert([{ ...entry, user_id: user.id }])
          .select()
          .single();
        if (error) {
          console.error('Supabase addWeight error:', error);
          // Fall back to localStorage on error
        } else if (data) {
          return data as WeightLog;
        }
      }
    }

    // Update profile weight as well
    const profile = getLocal<UserProfile | null>('athlix_profile', null);
    if (profile) {
      profile.weight = entry.weight;
      setLocal('athlix_profile', profile);
    }

    const allWeights = getLocal<WeightLog[]>('athlix_weights', SEED_WEIGHTS);
    // Remove if there's already an entry for this exact date to prevent duplicates in chart
    const filtered = allWeights.filter((w) => w.date !== entry.date);
    filtered.push(newWeight);
    setLocal('athlix_weights', filtered);
    return newWeight;
  },

  async deleteWeight(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('weights').delete().eq('id', id);
      return;
    }
    const allWeights = getLocal<WeightLog[]>('athlix_weights', SEED_WEIGHTS);
    const filtered = allWeights.filter((w) => w.id !== id);
    setLocal('athlix_weights', filtered);
  },

  // --- HABIT FUNCTIONS ---
  async fetchHabits(): Promise<Habit[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id);
        if (data && !error) return data as Habit[];
      }
    }
    return getLocal<Habit[]>('athlix_habits', DEFAULT_HABITS);
  },

  async addCustomHabit(name: string, icon: string): Promise<Habit> {
    const newHabit: Habit = {
      id: 'h_' + Math.random().toString(36).substr(2, 9),
      name,
      icon,
      isCustom: true,
      frequency: 'daily'
    };

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('habits')
          .insert([{ name, icon, user_id: user.id }])
          .select()
          .single();
        if (error) {
          console.error('Supabase addCustomHabit error:', error);
          // Fall back to localStorage on error
        } else if (data) {
          return data as Habit;
        }
      }
    }

    const currentHabits = getLocal<Habit[]>('athlix_habits', DEFAULT_HABITS);
    currentHabits.push(newHabit);
    setLocal('athlix_habits', currentHabits);
    return newHabit;
  },

  async deleteHabit(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('habits').delete().eq('id', id);
      return;
    }
    const currentHabits = getLocal<Habit[]>('athlix_habits', DEFAULT_HABITS);
    setLocal('athlix_habits', currentHabits.filter(h => h.id !== id));
    
    // Also remove logs
    const currentLogs = getLocal<HabitLog[]>('athlix_habit_logs', SEED_HABIT_LOGS);
    setLocal('athlix_habit_logs', currentLogs.filter(l => l.habit_id !== id));
  },

  async fetchHabitLogs(date: string): Promise<HabitLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('habit_logs')
          .select('*')
          .eq('date', date)
          .eq('user_id', user.id);
        if (data && !error) return data as HabitLog[];
      }
    }
    const logs = getLocal<HabitLog[]>('athlix_habit_logs', SEED_HABIT_LOGS);
    return logs.filter((l) => l.date === date);
  },

  async toggleHabitCompletion(habitId: string, date: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      // Logic for supabase check/uncheck
      // Query if exists
      // If exists, delete/update, else create
    }
    
    const logs = getLocal<HabitLog[]>('athlix_habit_logs', SEED_HABIT_LOGS);
    const existingIndex = logs.findIndex((l) => l.habit_id === habitId && l.date === date);
    
    let isCompleted = false;
    if (existingIndex >= 0) {
      isCompleted = !logs[existingIndex].completed;
      logs[existingIndex].completed = isCompleted;
    } else {
      isCompleted = true;
      logs.push({
        id: `${habitId}-${date}`,
        habit_id: habitId,
        date,
        completed: true,
      });
    }
    
    setLocal('athlix_habit_logs', logs);
    return isCompleted;
  },

  async fetchAllHabitLogs(): Promise<HabitLog[]> {
    return getLocal<HabitLog[]>('athlix_habit_logs', SEED_HABIT_LOGS);
  },

  // --- WORKOUT PLAN FUNCTIONS ---
  async fetchWorkoutPlans(): Promise<WorkoutPlan[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data && !error) return data as WorkoutPlan[];
      }
    }
    return getLocal<WorkoutPlan[]>('athlix_workout_plans', [SEED_WORKOUT_PLAN]);
  },

  async saveWorkoutPlan(plan: WorkoutPlan): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('workouts')
          .insert([{ ...plan, user_id: user.id }]);
        if (error) {
          console.error('Supabase saveWorkoutPlan error:', error);
          // Fall back to localStorage on error
        } else {
          return;
        }
      }
    }
    const plans = getLocal<WorkoutPlan[]>('athlix_workout_plans', [SEED_WORKOUT_PLAN]);
    plans.unshift(plan); // put new plan first
    setLocal('athlix_workout_plans', plans);
  },

  async markWorkoutDayComplete(planId: string, dayId: string, completed: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // Update inside supabase workouts JSON
    }
    const plans = getLocal<WorkoutPlan[]>('athlix_workout_plans', [SEED_WORKOUT_PLAN]);
    const planIndex = plans.findIndex((p) => p.id === planId);
    if (planIndex >= 0) {
      const dayIndex = plans[planIndex].days.findIndex((d) => d.id === dayId);
      if (dayIndex >= 0) {
        plans[planIndex].days[dayIndex].completed = completed;
        setLocal('athlix_workout_plans', plans);
      }
    }
  },

  async saveActiveWorkoutProgress(planId: string, dayId: string, exercises: WorkoutExercise[]): Promise<void> {
    const plans = getLocal<WorkoutPlan[]>('athlix_workout_plans', [SEED_WORKOUT_PLAN]);
    const planIndex = plans.findIndex((p) => p.id === planId);
    if (planIndex >= 0) {
      const dayIndex = plans[planIndex].days.findIndex((d) => d.id === dayId);
      if (dayIndex >= 0) {
        plans[planIndex].days[dayIndex].exercises = exercises;
        setLocal('athlix_workout_plans', plans);
      }
    }
  },

  // --- CHAT HISTORY FUNCTIONS ---
  async fetchChatHistory(): Promise<ChatMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        if (data && !error) return data as ChatMessage[];
      }
    }
    return getLocal<ChatMessage[]>('athlix_chat_messages', SEED_CHAT_MESSAGES);
  },

  async saveChatMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('chat_history')
          .insert([{ sender: msg.sender, text: msg.text, user_id: user.id }]);
        if (error) {
          console.error('Supabase saveChatMessage error:', error);
          // Fall back to localStorage on error
        } else {
          return newMsg;
        }
      }
    }

    const current = getLocal<ChatMessage[]>('athlix_chat_messages', SEED_CHAT_MESSAGES);
    current.push(newMsg);
    setLocal('athlix_chat_messages', current);
    return newMsg;
  },

  async clearChatHistory(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('chat_history').delete().eq('user_id', user.id);
      }
    }
    setLocal('athlix_chat_messages', []);
  },

  // --- NOTIFICATIONS FUNCTIONS ---
  async fetchNotifications(): Promise<NotificationItem[]> {
    console.log('[DB] fetchNotifications called');
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log('[DB] Current user for notifications:', user?.id);
        if (user) {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });
          console.log('[DB] Notifications query result:', data, error);
          if (data && !error) {
            // Convert UUID id to string for compatibility
            const notifications = data.map((n: any) => ({
              ...n,
              id: n.id.toString()
            })) as NotificationItem[];
            return notifications;
          }
          if (error) {
            console.error('[DB] Notifications query error:', error);
            // If table doesn't exist, fall back to localStorage
            if (error.code === '42P01' || error.message.includes('does not exist')) {
              console.log('[DB] Notifications table does not exist, using localStorage');
              return getLocal<NotificationItem[]>('athlix_notifications', SEED_NOTIFICATIONS);
            }
          }
        }
      } catch (e) {
        console.error('[DB] fetchNotifications exception:', e);
      }
    }
    console.log('[DB] Using localStorage for notifications');
    return getLocal<NotificationItem[]>('athlix_notifications', SEED_NOTIFICATIONS);
  },

  async markNotificationRead(id: string): Promise<void> {
    console.log('[DB] markNotificationRead called for id:', id);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id)
            .eq('user_id', user.id);
          if (error) {
            console.error('[DB] markNotificationRead error:', error);
          } else {
            console.log('[DB] Successfully marked notification as read in Supabase');
          }
        }
      } catch (e) {
        console.error('[DB] markNotificationRead exception:', e);
      }
    }
    // Always update localStorage as backup
    const notifications = getLocal<NotificationItem[]>('athlix_notifications', SEED_NOTIFICATIONS);
    const index = notifications.findIndex((n) => n.id === id);
    if (index >= 0) {
      notifications[index].read = true;
      setLocal('athlix_notifications', notifications);
      console.log('[DB] Updated notification as read in localStorage');
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    console.log('[DB] markAllNotificationsRead called');
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id);
          if (error) {
            console.error('[DB] markAllNotificationsRead error:', error);
          } else {
            console.log('[DB] Successfully marked all notifications as read in Supabase');
          }
        }
      } catch (e) {
        console.error('[DB] markAllNotificationsRead exception:', e);
      }
    }
    // Always update localStorage as backup
    const notifications = getLocal<NotificationItem[]>('athlix_notifications', SEED_NOTIFICATIONS);
    notifications.forEach((n) => { n.read = true; });
    setLocal('athlix_notifications', notifications);
    console.log('[DB] Updated all notifications as read in localStorage');
  },

  async addNotification(type: NotificationItem['type'], title: string, body: string): Promise<NotificationItem> {
    const newNotif: NotificationItem = {
      id: 'n_' + Math.random().toString(36).substr(2, 9),
      type,
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
    };
    console.log('[DB] addNotification called:', newNotif);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('notifications')
            .insert([{ ...newNotif, user_id: user.id }])
            .select()
            .single();
          if (error) {
            console.error('[DB] addNotification error:', error);
            // If table doesn't exist, fall back to localStorage only
            if (error.code === '42P01' || error.message.includes('does not exist')) {
              console.log('[DB] Notifications table does not exist, using localStorage only');
            }
          } else if (data) {
            console.log('[DB] Successfully added notification to Supabase');
            // Update the id with the UUID from Supabase
            newNotif.id = data.id.toString();
          }
        }
      } catch (e) {
        console.error('[DB] addNotification exception:', e);
      }
    }
    // Always add to localStorage as backup
    const notifications = getLocal<NotificationItem[]>('athlix_notifications', SEED_NOTIFICATIONS);
    notifications.unshift(newNotif);
    setLocal('athlix_notifications', notifications);
    console.log('[DB] Added notification to localStorage');
    return newNotif;
  },

  // --- ML PREDICTIONS FUNCTIONS ---
  async fetchPredictions(): Promise<CaloriePredictionLog[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('calories_predictions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (data && !error) return data as CaloriePredictionLog[];
        }
      } catch (e) {
        console.error('[DB] fetchPredictions error:', e);
      }
    }
    return getLocal<CaloriePredictionLog[]>('athlix_predictions', []);
  },

  async savePrediction(prediction: Omit<CaloriePredictionLog, 'id' | 'created_at'>): Promise<CaloriePredictionLog> {
    const newPrediction: CaloriePredictionLog = {
      ...prediction,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('calories_predictions')
            .insert([{ ...newPrediction, user_id: user.id }])
            .select()
            .single();
          if (data && !error) return data as CaloriePredictionLog;
        }
      } catch (e) {
        console.error('[DB] savePrediction error:', e);
      }
    }
    const predictions = getLocal<CaloriePredictionLog[]>('athlix_predictions', []);
    predictions.unshift(newPrediction);
    setLocal('athlix_predictions', predictions);
    return newPrediction;
  }
};

