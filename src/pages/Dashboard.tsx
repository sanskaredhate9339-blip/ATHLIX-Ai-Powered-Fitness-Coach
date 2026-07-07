import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { useUnit } from '../context/UnitContext';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  Utensils, Flame, Droplet, Dumbbell, Calendar, 
  Plus, Sparkles, ChevronRight, Activity,
  X, Heart, Moon, Footprints, Apple
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    foods, weights, habits, habitLogs, activeWorkoutPlan, 
    logWeightEntry, toggleHabitStatus 
  } = useFitness();
  const { convertWeight, formatWeight, weightUnit } = useUnit();

  // State for Weight Log Modal
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(profile?.weight?.toString() || '');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [newWeightNotes, setNewWeightNotes] = useState('');
  const [isSubmittingWeight, setIsSubmittingWeight] = useState(false);

  // Date helper
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayDateString = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  // Calculate Nutrition Totals
  const calorieGoal = profile?.weight && profile?.goal 
    ? (profile.goal === 'Muscle Gain' ? Math.round(profile.weight * 35) : profile.goal === 'Weight Loss' ? Math.round(profile.weight * 25) : Math.round(profile.weight * 30))
    : 0;
  const proteinGoal = profile?.weight ? Math.round(profile.weight * 2.0) : 0; // 2g per kg
  const waterGoal = 8; // 8 glasses

  const totalCalsConsumed = foods.reduce((acc, f) => acc + f.calories, 0);
  const totalProteinConsumed = foods.reduce((acc, f) => acc + f.protein, 0);

  // Active workout calories burned
  const activeWorkoutToday = activeWorkoutPlan?.days.find(
    (d) => d.dayIndex === new Date().getDay() - 1 // monday-sunday 0-6 match
  );
  const calsBurnedWorkout = activeWorkoutToday?.completed ? activeWorkoutToday.estimated_calories : 0;
  // Only show actual workout calories, no passive burn
  const totalCalsBurned = calsBurnedWorkout;

  // Habit completion percent
  const habitsCount = habits.length;
  const completedHabitsCount = habitLogs.filter(h => h.completed).length;
  const habitPercentage = habitsCount > 0 ? Math.round((completedHabitsCount / habitsCount) * 100) : 0;

  // BMI calculations
  const calculateBMI = () => {
    if (!profile?.height || !profile?.weight) return { bmi: 0, category: 'Unknown', color: 'text-text-muted' };
    const heightM = profile.height / 100;
    const bmi = Number((profile.weight / (heightM * heightM)).toFixed(1));
    
    let category = 'Normal';
    let color = 'text-success';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-accent';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      color = 'text-warning';
    } else if (bmi >= 30) {
      category = 'Obese';
      color = 'text-danger';
    }

    return { bmi, category, color };
  };

  const bmiData = calculateBMI();

  // Recharts Chart formats
  const weightChartData = weights.slice(-7).map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: convertWeight(w.weight),
  }));

  const weeklyReportData = [
    { name: 'Mon', calories: 0 },
    { name: 'Tue', calories: 0 },
    { name: 'Wed', calories: 0 },
    { name: 'Thu', calories: 0 },
    { name: 'Fri', calories: totalCalsConsumed },
    { name: 'Sat', calories: 0 },
    { name: 'Sun', calories: 0 },
  ];

  // Habit Icon picker helper
  const renderHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Droplet': return <Droplet className="w-5 h-5" />;
      case 'Apple': return <Apple className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(newWeight);
    if (isNaN(weightNum) || weightNum <= 0) return;

    setIsSubmittingWeight(true);
    try {
      await logWeightEntry(
        weightNum,
        newBodyFat ? parseFloat(newBodyFat) : undefined,
        new Date().toISOString().split('T')[0],
        newWeightNotes || undefined
      );
      setWeightModalOpen(false);
      setNewWeightNotes('');
      setNewBodyFat('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingWeight(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Greeting banner */}
      <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-accent/10 border border-border-custom rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="z-10">
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white">
            {getGreeting()}, {profile?.name || 'Athlete'} 👋
          </h2>
          <p className="text-xs text-text-muted mt-1.5 flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-primary-light" /> Today is {todayDateString}
          </p>
        </div>
        <div className="hidden sm:flex z-10 w-12 h-12 rounded-2xl bg-white/5 border border-white/5 items-center justify-center text-accent">
          <Sparkles className="w-6 h-6 animate-pulse-glow" />
        </div>
      </div>

      {/* Profile incomplete warning */}
      {!profile?.onboarded && (
        <div className="glass-panel p-5 rounded-3xl border border-warning/20 bg-warning/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-warning/20 flex items-center justify-center text-warning">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-sm text-white">Complete Your Profile</h3>
              <p className="text-xs text-text-muted mt-1">Fill out your profile to see personalized nutrition goals and workout recommendations.</p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 rounded-xl bg-warning/20 hover:bg-warning/30 text-warning text-xs font-bold transition-all"
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {/* AI Daily Coach Suggestion */}
      <div className="glass-panel rounded-3xl p-5 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light mt-0.5 shadow-premium">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              Daily AI Coach Advice
            </h3>
            <p className="text-xs text-text-muted mt-1.5 leading-relaxed font-sans max-w-3xl">
              {profile?.name && profile?.goal && foods.length > 0
                ? `Great progress, ${profile.name.split(' ')[0]}! You've logged ${foods.length} meal${foods.length > 1 ? 's' : ''} today. Keep tracking your nutrition and workouts to receive personalized AI coaching advice.`
                : 'Complete your profile and log your first workout and meal to receive personalized AI coaching.'}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Metrics Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Consumed */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 relative group hover:border-primary/20 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Calories Consumed</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">{totalCalsConsumed} kcal</span>
            <span className="text-[9px] text-text-muted block mt-1">Goal: {calorieGoal || '--'} kcal</span>
          </div>
        </div>

        {/* Calories Burned */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 relative group hover:border-accent/20 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Active Burn</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">{calsBurnedWorkout} kcal</span>
            <span className="text-[9px] text-text-muted block mt-1">Total: {totalCalsBurned} kcal</span>
          </div>
        </div>

        {/* Protein */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 relative group hover:border-success/20 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Protein Logged</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">{totalProteinConsumed}g</span>
            <span className="text-[9px] text-text-muted block mt-1">Goal: {proteinGoal || '--'}g</span>
          </div>
        </div>

        {/* Water */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 relative group hover:border-cyan-500/20 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Water Intake</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">
              {completedHabitsCount > 0 ? `${completedHabitsCount}/${habitsCount}` : '0/8'} Glasses
            </span>
            <span className="text-[9px] text-text-muted block mt-1">Goal: {waterGoal} glasses</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Workout & Habits */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Workout Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-4">
              Today's Session
            </h3>
            
            {activeWorkoutToday ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-extrabold text-lg text-text-main">
                      {activeWorkoutToday.muscle_group}
                    </h4>
                    <p className="text-xs text-text-muted mt-1 font-sans">
                      Estimated Burn: <span className="text-accent font-semibold">{activeWorkoutToday.estimated_calories} kcal</span> &bull; {activeWorkoutToday.exercises.length} Exercises
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    activeWorkoutToday.completed 
                      ? 'bg-success/10 text-success border border-success/20' 
                      : 'bg-warning/10 text-warning border border-warning/20'
                  }`}>
                    {activeWorkoutToday.completed ? 'Session Complete ✓' : 'Scheduled'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex justify-between items-center text-xs text-text-muted mb-1.5">
                    <span>Workout Completion</span>
                    <span className="font-bold text-text-main">
                      {activeWorkoutToday.completed ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-bg-surface-alt rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: activeWorkoutToday.completed ? '100%' : '5%' }}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => navigate('/workouts')}
                    className="flex-1 py-3 rounded-2xl gradient-btn text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Dumbbell className="w-4 h-4" /> {activeWorkoutToday.completed ? 'Review Session' : 'Start Workout'}
                  </button>
                  <button
                    onClick={() => navigate('/form-analysis')}
                    className="py-3 px-4 rounded-2xl border border-border-custom hover:bg-white/5 text-xs font-bold text-slate-300"
                  >
                    Analyze Form
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Dumbbell className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-50" />
                <p className="text-xs text-text-muted mb-4 font-sans">No workout scheduled for today.</p>
                <button
                  onClick={() => navigate('/workouts')}
                  className="px-6 py-2.5 rounded-xl border border-primary/30 hover:border-primary text-xs font-bold text-primary-light transition-all"
                >
                  Generate New Split
                </button>
              </div>
            )}
          </div>

          {/* Weight Tracker mini chart */}
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
                  Weight Progression
                </h3>
                <span className="text-xs font-semibold text-white mt-1 block">
                  Current: {profile?.weight ? formatWeight(profile.weight) : '--'}
                </span>
              </div>
              <button 
                onClick={() => setWeightModalOpen(true)}
                className="p-2 rounded-xl border border-border-custom hover:bg-white/5 text-primary-light transition-colors"
                aria-label="Log weight"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="h-48 w-full font-mono text-[10px]">
              {weightChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="var(--text-muted)" tickLine={false} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="var(--text-muted)" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'var(--bg-surface)', 
                        borderColor: 'var(--border-custom)',
                        borderRadius: '16px',
                        color: 'var(--text-main)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '11px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="var(--primary)" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#weightGlow)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted text-xs">
                  No weight logged yet. Log your first weight entry above!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Habits summary, BMI, Macros breakdown */}
        <div className="flex flex-col gap-6">
          {/* Habits Circle card */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
                  Habit Streaks
                </h3>
                <span className="text-[10px] font-bold text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">
                  {habitPercentage}% Completed
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {habits.slice(0, 6).map((habit) => {
                  const log = habitLogs.find(l => l.habit_id === habit.id);
                  const isDone = log?.completed || false;
                  
                  return (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabitStatus(habit.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-success/15 border-success/30 text-success shadow-premium shadow-success/5'
                          : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                      }`}
                    >
                      {renderHabitIcon(habit.name === 'Workout Session' ? 'Dumbbell' : habit.name.includes('Water') ? 'Droplet' : habit.name.includes('Protein') ? 'Apple' : habit.name.includes('Sleep') ? 'Moon' : habit.name.includes('Walking') ? 'Footprints' : 'Activity')}
                      <span className="text-[9px] mt-1.5 font-sans font-medium text-center truncate w-full">
                        {habit.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <Link 
              to="/habits" 
              className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
            >
              Configure Habits <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
          </div>

          {/* BMI Card */}
          <div className="glass-panel rounded-3xl p-6">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-4">
              BMI index
            </h3>
            <div className="flex justify-between items-center mb-5">
              <div>
                <span className="font-heading font-extrabold text-2xl text-white">
                  {bmiData.bmi || '--'}
                </span>
                <span className={`text-xs font-semibold ml-2.5 ${bmiData.color}`}>
                  {bmiData.category}
                </span>
              </div>
              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-muted">
                <Heart className="w-4.5 h-4.5 text-accent" />
              </span>
            </div>

            {/* Slider track for category ranges */}
            <div className="w-full">
              <div className="relative w-full h-2.5 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-accent" style={{ width: '18.5%' }} />
                <div className="h-full bg-success" style={{ width: '25%' }} />
                <div className="h-full bg-warning" style={{ width: '25%' }} />
                <div className="h-full bg-danger" style={{ width: '31.5%' }} />
              </div>
              
              <div className="flex justify-between text-[8px] font-mono text-text-muted mt-2 px-1">
                <span>18.5 Under</span>
                <span>24.9 Normal</span>
                <span>29.9 Over</span>
                <span>Obese</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly reports review */}
      <div className="glass-panel rounded-3xl p-6 mb-6">
        <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5">
          Weekly Nutrition Trends
        </h3>
        <div className="h-44 w-full font-mono text-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyReportData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} />
              <YAxis stroke="var(--text-muted)" tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--bg-surface)', 
                  borderColor: 'var(--border-custom)',
                  borderRadius: '16px',
                  color: 'var(--text-main)'
                }} 
              />
              <Bar dataKey="calories" radius={[8, 8, 0, 0]}>
                {weeklyReportData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 4 ? 'var(--primary)' : 'rgba(124, 58, 237, 0.25)'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Action Button for Food Log */}
      <button
        onClick={() => navigate('/nutrition/log')}
        className="fixed right-6 bottom-24 z-30 w-14 h-14 rounded-full gradient-btn flex items-center justify-center text-white shadow-glow hover:scale-105 transition-transform"
        aria-label="Add meal entry"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Weight Log Modal */}
      {weightModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl relative animate-pulse-glow-once">
            <button
              onClick={() => setWeightModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-white mb-2">Record Weight</h3>
            <p className="text-xs text-text-muted mb-6">Log weight to update your tracker progression</p>

            <form onSubmit={handleSaveWeight} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300">Weight ({weightUnit})</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 78.5"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  placeholder="e.g. 18.2"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300">Notes (Optional)</label>
                <textarea
                  value={newWeightNotes}
                  onChange={(e) => setNewWeightNotes(e.target.value)}
                  placeholder="Notes about calorie shifts, hydration level..."
                  rows={2}
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingWeight}
                className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 mt-4"
              >
                Save Weight Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
