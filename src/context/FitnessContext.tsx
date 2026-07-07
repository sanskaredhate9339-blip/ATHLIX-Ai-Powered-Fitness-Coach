import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { FoodLog, WeightLog, Habit, HabitLog, WorkoutPlan, ChatMessage, NotificationItem, WorkoutExercise } from '../services/db';
import { ai } from '../services/ai';
import { useAuth } from './AuthContext';

interface FitnessContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  foods: FoodLog[];
  weights: WeightLog[];
  habits: Habit[];
  habitLogs: HabitLog[];
  workoutPlans: WorkoutPlan[];
  activeWorkoutPlan: WorkoutPlan | null;
  notifications: NotificationItem[];
  chatHistory: ChatMessage[];
  
  // States loaders
  isAnalyzingFood: boolean;
  isGeneratingPlan: boolean;
  isChatStreaming: boolean;
  
  // Actions
  changeSelectedDate: (date: string) => void;
  logFoodItem: (food: Omit<FoodLog, 'id' | 'date' | 'created_at'>, customDate?: string) => Promise<FoodLog>;
  logFoodWithAI: (fileOrBase64: string, mealType: FoodLog['meal_type']) => Promise<Omit<FoodLog, 'id' | 'date' | 'created_at' | 'meal_type'>>;
  deleteFoodItem: (id: string) => Promise<void>;
  
  logWeightEntry: (weight: number, fat?: number, date?: string, notes?: string) => Promise<WeightLog>;
  deleteWeightEntry: (id: string) => Promise<void>;
  
  toggleHabitStatus: (habitId: string) => Promise<void>;
  createCustomHabit: (name: string, icon: string) => Promise<Habit>;
  removeHabit: (id: string) => Promise<void>;
  
  generateWorkout: (form: {
    goal: string;
    split_type: string;
    days_per_week: number;
    duration: number;
    equipment: string[];
    experience: string;
    medical_conditions?: string;
  }) => Promise<WorkoutPlan>;
  saveGeneratedWorkout: (plan: WorkoutPlan) => Promise<void>;
  toggleDayCompletion: (planId: string, dayId: string, completed: boolean) => Promise<void>;
  updateActiveWorkoutProgress: (planId: string, dayId: string, exercises: WorkoutExercise[]) => Promise<void>;
  
  sendUserMessage: (text: string) => Promise<void>;
  clearConversation: () => Promise<void>;
  
  readNotification: (id: string) => Promise<void>;
  readAllNotifications: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, profile } = useAuth();
  
  const [selectedDate, setSelectedDateState] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [foods, setFoods] = useState<FoodLog[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [isAnalyzingFood, setIsAnalyzingFood] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isChatStreaming, setIsChatStreaming] = useState(false);

  // Load user data upon authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated, selectedDate]);

  const loadInitialData = async () => {
    try {
      const [
        loadedFoods,
        loadedWeights,
        loadedHabits,
        loadedHabitLogs,
        loadedPlans,
        loadedNotifs,
        loadedChat,
      ] = await Promise.all([
        db.fetchFoods(selectedDate),
        db.fetchWeights(),
        db.fetchHabits(),
        db.fetchHabitLogs(selectedDate),
        db.fetchWorkoutPlans(),
        db.fetchNotifications(),
        db.fetchChatHistory(),
      ]);

      setFoods(loadedFoods);
      setWeights(loadedWeights);
      setHabits(loadedHabits);
      setHabitLogs(loadedHabitLogs);
      setWorkoutPlans(loadedPlans);
      setNotifications(loadedNotifs);
      setChatHistory(loadedChat);
    } catch (e) {
      console.error('Error loading initial fitness data:', e);
    }
  };

  const changeSelectedDate = (dateStr: string) => {
    setSelectedDateState(dateStr);
  };

  // --- FOOD METHODS ---
  const logFoodItem = async (food: Omit<FoodLog, 'id' | 'date' | 'created_at'>, customDate?: string): Promise<FoodLog> => {
    const targetDate = customDate || selectedDate;
    const added = await db.addFood({
      ...food,
      date: targetDate,
    });
    // Refresh food list if current date
    if (targetDate === selectedDate) {
      setFoods(prev => [...prev, added]);
    }
    
    // Add Notification trigger if logged protein or high cal
    if (food.protein > 35) {
      await addSystemNotification('protein', 'Excellent Protein Intake! 🥩', `You just logged a high-protein meal (${food.protein}g) of ${food.food_name}.`);
    }
    return added;
  };

  const logFoodWithAI = async (fileOrBase64: string, _mealType: FoodLog['meal_type']) => {
    setIsAnalyzingFood(true);
    try {
      const result = await ai.analyzeFoodImage(fileOrBase64);
      return result;
    } finally {
      setIsAnalyzingFood(false);
    }
  };

  const deleteFoodItem = async (id: string) => {
    await db.deleteFood(id);
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  // --- WEIGHT METHODS ---
  const logWeightEntry = async (weight: number, fat?: number, date?: string, notes?: string): Promise<WeightLog> => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const added = await db.addWeight({
      weight,
      body_fat: fat,
      date: targetDate,
      notes,
    });
    
    // Trigger milestones celebration alerts
    const allWeights = await db.fetchWeights();
    setWeights(allWeights);
    
    if (allWeights.length > 1) {
      const diff = allWeights[0].weight - weight;
      if (diff > 0 && Math.abs(diff) >= 5) {
        await addSystemNotification('achievement', 'Milestone Reached! 🎉', `You have lost a total of ${diff.toFixed(1)} kg since your starting log!`);
      }
    }
    return added;
  };

  const deleteWeightEntry = async (id: string) => {
    await db.deleteWeight(id);
    setWeights(prev => prev.filter(w => w.id !== id));
  };

  // --- HABIT METHODS ---
  const toggleHabitStatus = async (habitId: string) => {
    const completed = await db.toggleHabitCompletion(habitId, selectedDate);
    const updatedLogs = await db.fetchHabitLogs(selectedDate);
    setHabitLogs(updatedLogs);
    
    if (completed) {
      // Create sound or text trigger milestone
      const allLogs = await db.fetchAllHabitLogs();
      const habitLogsForId = allLogs.filter(l => l.habit_id === habitId && l.completed);
      if (habitLogsForId.length % 5 === 0) {
        const habit = habits.find(h => h.id === habitId);
        await addSystemNotification('achievement', 'Streak Supercharged! 🔥', `You have completed "${habit?.name}" ${habitLogsForId.length} times!`);
      }
    }
  };

  const createCustomHabit = async (name: string, icon: string): Promise<Habit> => {
    const newHabit = await db.addCustomHabit(name, icon);
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const removeHabit = async (id: string) => {
    await db.deleteHabit(id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setHabitLogs(prev => prev.filter(l => l.habit_id !== id));
  };

  // --- WORKOUT METHODS ---
  const generateWorkout = async (form: {
    goal: string;
    split_type: string;
    days_per_week: number;
    duration: number;
    equipment: string[];
    experience: string;
    medical_conditions?: string;
  }) => {
    setIsGeneratingPlan(true);
    try {
      const newPlan = await ai.generateWorkoutPlan(form);
      return newPlan;
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const saveGeneratedWorkout = async (plan: WorkoutPlan) => {
    await db.saveWorkoutPlan(plan);
    const plans = await db.fetchWorkoutPlans();
    setWorkoutPlans(plans);
    await addSystemNotification('workout', 'New Plan Assigned! 🏋️', `"${plan.name}" is now your active workout split.`);
  };

  const toggleDayCompletion = async (planId: string, dayId: string, completed: boolean) => {
    await db.markWorkoutDayComplete(planId, dayId, completed);
    
    // Refresh workout plans state
    const plans = await db.fetchWorkoutPlans();
    setWorkoutPlans(plans);
    
    if (completed) {
      const plan = plans.find(p => p.id === planId);
      const day = plan?.days.find(d => d.id === dayId);
      await addSystemNotification('workout', 'Workout Crushed! 💪', `Logged completion of "${day?.muscle_group}". Great session!`);
    }
  };

  const updateActiveWorkoutProgress = async (planId: string, dayId: string, exercises: WorkoutExercise[]) => {
    await db.saveActiveWorkoutProgress(planId, dayId, exercises);
    const plans = await db.fetchWorkoutPlans();
    setWorkoutPlans(plans);
  };

  // --- CHAT METHODS ---
  const sendUserMessage = async (text: string) => {
    if (!text.trim() || !profile) return;
    
    // Add user message to state and local storage
    const userMsg = await db.saveChatMessage({ sender: 'user', text });
    setChatHistory(prev => [...prev, userMsg]);
    
    setIsChatStreaming(true);
    
    // Streaming placeholder
    const streamId = 'stream_' + Math.random().toString(36).substr(2, 9);
    setChatHistory(prev => [...prev, { id: streamId, sender: 'ai', text: '...', timestamp: new Date().toISOString() }]);
    
    try {
      await ai.chatStream(
        text,
        chatHistory,
        profile,
        (tokens) => {
          // Token update callback
          setChatHistory(prev => prev.map(m => m.id === streamId ? { ...m, text: tokens } : m));
        }
      );
      
      // Save final AI response
      const latestHistory = await db.fetchChatHistory();
      const lastMsg = latestHistory[latestHistory.length - 1];
      if (lastMsg && lastMsg.sender === 'ai') {
        // Swap stream item for verified DB message
        setChatHistory(prev => prev.map(m => m.id === streamId ? lastMsg : m));
      }
    } catch (e) {
      console.error(e);
      // Remove temporary item
      setChatHistory(prev => prev.filter(m => m.id !== streamId));
    } finally {
      setIsChatStreaming(false);
    }
  };

  const clearConversation = async () => {
    await db.clearChatHistory();
    setChatHistory([]);
  };

  // --- NOTIFICATIONS METHODS ---
  const readNotification = async (id: string) => {
    await db.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const readAllNotifications = async () => {
    await db.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addSystemNotification = async (type: NotificationItem['type'], title: string, body: string) => {
    const added = await db.addNotification(type, title, body);
    setNotifications(prev => [added, ...prev]);
  };

  // Computed helper: active plan is always the first plan
  const activeWorkoutPlan = workoutPlans[0] || null;

  return (
    <FitnessContext.Provider
      value={{
        selectedDate,
        setSelectedDate: changeSelectedDate,
        foods,
        weights,
        habits,
        habitLogs,
        workoutPlans,
        activeWorkoutPlan,
        notifications,
        chatHistory,
        
        isAnalyzingFood,
        isGeneratingPlan,
        isChatStreaming,
        
        changeSelectedDate,
        logFoodItem,
        logFoodWithAI,
        deleteFoodItem,
        
        logWeightEntry,
        deleteWeightEntry,
        
        toggleHabitStatus,
        createCustomHabit,
        removeHabit,
        
        generateWorkout,
        saveGeneratedWorkout,
        toggleDayCompletion,
        updateActiveWorkoutProgress,
        
        sendUserMessage,
        clearConversation,
        
        readNotification,
        readAllNotifications,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
