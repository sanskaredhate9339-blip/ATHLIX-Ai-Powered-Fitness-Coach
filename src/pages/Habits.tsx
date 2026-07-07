import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Plus, Trash2, Award, Zap, Calendar, X, Check,
  Droplet, Moon, Footprints, Apple, Dumbbell, Activity 
} from 'lucide-react';

export const Habits: React.FC = () => {
  const { 
    habits, habitLogs, toggleHabitStatus, createCustomHabit, removeHabit 
  } = useFitness();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('Droplet');
  const [isSavingHabit, setIsSavingHabit] = useState(false);

  // Streak calculations
  const currentStreak = 5; // mock streak count
  const bestStreak = 12;

  // Icon names list
  const iconList = [
    { name: 'Droplet', label: 'Water' },
    { name: 'Moon', label: 'Sleep' },
    { name: 'Footprints', label: 'Steps' },
    { name: 'Apple', label: 'Nutrition' },
    { name: 'Dumbbell', label: 'Workout' },
    { name: 'Activity', label: 'General' }
  ];

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

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    setIsSavingHabit(true);
    try {
      await createCustomHabit(newHabitName, newHabitIcon);
      setNewHabitName('');
      setAddModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingHabit(false);
    }
  };

  // Generate heatmap coordinates for the past 30 days
  const getPast30Days = () => {
    const arr = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      arr.push(d);
    }
    return arr;
  };

  const past30Days = getPast30Days();

  // Mock completion rates for calendar heatmap drawing
  const getDayCompletionIntensity = (date: Date) => {
    const day = date.getDate();
    // Simulating completion levels
    if (day % 7 === 0) return 'bg-[#1E1E38]'; // 0%
    if (day % 3 === 0) return 'bg-[#7C3AED]/30'; // 30%
    if (day % 2 === 0) return 'bg-[#7C3AED]/60'; // 60%
    return 'bg-[#7C3AED]'; // 100% (electric violet)
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Streak Tracker summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current streak */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-light">
            <Zap className="w-5.5 h-5.5 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Current Streak</span>
            <span className="font-heading font-extrabold text-lg text-white mt-0.5 block">{currentStreak} Days</span>
            <span className="text-[9px] text-text-muted block mt-1">Keep training to lock it!</span>
          </div>
        </div>

        {/* Best streak */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
            <Award className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Best Streak Achievement</span>
            <span className="font-heading font-extrabold text-lg text-white mt-0.5 block">{bestStreak} Days</span>
            <span className="text-[9px] text-text-muted block mt-1">Record milestone reached!</span>
          </div>
        </div>

        {/* Completed today */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-success/10 border border-success/25 flex items-center justify-center text-success">
            <Check className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Completed Today</span>
            <span className="font-heading font-extrabold text-lg text-white mt-0.5 block">
              {habitLogs.filter(l => l.completed).length} / {habits.length}
            </span>
            <span className="text-[9px] text-text-muted block mt-1">Streaking metrics active</span>
          </div>
        </div>
      </div>

      {/* Main checklist & setup actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Habits list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
              My Routine Goals
            </h3>
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary-light flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Habit
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {habits.map((habit) => {
              const log = habitLogs.find(l => l.habit_id === habit.id);
              const isCompleted = log?.completed || false;
              
              return (
                <div 
                  key={habit.id} 
                  className={`glass-panel p-4.5 rounded-3xl flex justify-between items-center transition-all ${
                    isCompleted 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-border-custom'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleHabitStatus(habit.id)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
                        isCompleted
                          ? 'bg-success border-success text-white'
                          : 'border-border-custom hover:border-primary-light text-text-muted hover:text-text-main'
                      }`}
                      aria-label={`Toggle habit ${habit.name}`}
                    >
                      {renderHabitIcon(habit.name === 'Workout Session' ? 'Dumbbell' : habit.name.includes('Water') ? 'Droplet' : habit.name.includes('Protein') ? 'Apple' : habit.name.includes('Sleep') ? 'Moon' : habit.name.includes('Walking') ? 'Footprints' : 'Activity')}
                    </button>

                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">{habit.name}</h4>
                      <span className="text-[10px] text-text-muted block mt-0.5">
                        {isCompleted ? 'Goal checked off today ✓' : 'Daily Goal pending'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    aria-label={`Delete custom habit ${habit.name}`}
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Heatmap Calendar */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5 flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-primary-light" /> Monthly Heatmap
          </h3>

          <div className="grid grid-cols-7 gap-2.5 mb-6 justify-items-center">
            {/* Days header */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <span key={idx} className="text-[10px] font-bold text-text-muted">
                {day}
              </span>
            ))}

            {/* Past 30 Days boxes */}
            {past30Days.map((date, idx) => (
              <div 
                key={idx}
                className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center text-[10px] font-semibold text-white/90 ${getDayCompletionIntensity(date)}`}
                title={`${date.toLocaleDateString()}`}
              >
                {date.getDate()}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-border-custom pt-4 text-[9px] text-text-muted font-sans font-medium">
            <span>Less Completed</span>
            <div className="flex gap-1.5 items-center">
              <span className="w-3.5 h-3.5 rounded bg-[#1E1E38]" />
              <span className="w-3.5 h-3.5 rounded bg-[#7C3AED]/30" />
              <span className="w-3.5 h-3.5 rounded bg-[#7C3AED]/60" />
              <span className="w-3.5 h-3.5 rounded bg-[#7C3AED]" />
            </div>
            <span>Fully Done</span>
          </div>
        </div>

      </div>

      {/* Add Custom Habit Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl relative animate-pulse-glow-once">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-white mb-2">Add Habit</h3>
            <p className="text-xs text-text-muted mb-6">Create a daily checkpoint goal</p>

            <form onSubmit={handleCreateHabit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Habit Name</label>
                <input
                  type="text"
                  required
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. Read 10 Pages, Drink Green Tea..."
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-white"
                />
              </div>

              {/* Icon select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Icon Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {iconList.map((ic) => (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setNewHabitIcon(ic.name)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                        newHabitIcon === ic.name
                          ? 'border-primary bg-primary/10 text-primary-light'
                          : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                      }`}
                    >
                      {renderHabitIcon(ic.name)}
                      <span className="text-[10px] font-sans">{ic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingHabit}
                className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 mt-4"
              >
                Save Routine Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
