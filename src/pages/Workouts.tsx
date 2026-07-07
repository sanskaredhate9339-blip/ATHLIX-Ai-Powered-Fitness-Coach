import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { useUnit } from '../context/UnitContext';
import { 
  Dumbbell, Sparkles, Clock, Play, Pause, RotateCcw, 
  CheckCircle, ChevronDown, ChevronUp, Save 
} from 'lucide-react';

export const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    activeWorkoutPlan, generateWorkout, 
    saveGeneratedWorkout, toggleDayCompletion, updateActiveWorkoutProgress 
  } = useFitness();
  const { weightUnit } = useUnit();

  // Primary Tabs: myplan, generate, active
  const [activeTab, setActiveTab] = useState<'myplan' | 'generate' | 'active'>('myplan');
  
  // Collapse state for My Plan day items
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  // Generate form states
  const [goal, setGoal] = useState(profile?.goal || 'Muscle Gain');
  const [splitType, setSplitType] = useState('Push/Pull/Legs');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [duration, setDuration] = useState(60);
  const [equipment, setEquipment] = useState<string[]>(profile?.available_equipment || ['Dumbbells']);
  const [experience, setExperience] = useState(profile?.experience_level || 'Intermediate');
  const [medical, setMedical] = useState('');
  
  // AI generation loader states
  const [isGenerating, setIsGenerating] = useState(false);
  const [tempPlan, setTempPlan] = useState<any | null>(null);

  // Active workout tracker states
  const [activeDay, setActiveDay] = useState<any | null>(null);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [activeExercises, setActiveExercises] = useState<any[]>([]);

  // Stopwatch effect
  useEffect(() => {
    let interval: any = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [stopwatchActive]);

  // Load Active Workout context
  useEffect(() => {
    if (activeWorkoutPlan) {
      // Find today's day indices (0-6 Monday-Sunday)
      const dayIndex = new Date().getDay() - 1; 
      const todayDay = activeWorkoutPlan.days.find(d => d.dayIndex === dayIndex) || activeWorkoutPlan.days[0];
      if (todayDay) {
        setActiveDay(todayDay);
        // Copy exercises locally to maintain edit state
        setActiveExercises(
          JSON.parse(JSON.stringify(todayDay.exercises))
        );
      }
    }
  }, [activeWorkoutPlan]);

  const toggleExpandDay = (dayId: string) => {
    setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTempPlan(null);
    try {
      const plan = await generateWorkout({
        goal,
        split_type: splitType,
        days_per_week: daysPerWeek,
        duration,
        equipment,
        experience,
        medical_conditions: medical || undefined
      });
      setTempPlan(plan);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (tempPlan) {
      await saveGeneratedWorkout(tempPlan);
      setTempPlan(null);
      setActiveTab('myplan');
    }
  };

  // Stopwatch helper
  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = timeInSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active workout functions
  const handleToggleSetCheck = (exerciseIndex: number, setIndex: number) => {
    const updated = [...activeExercises];
    const exercise = { ...updated[exerciseIndex] };
    const completedSets = [...(exercise.completedSets || [])];
    
    // Fill up array to setIndex if not present
    while (completedSets.length <= setIndex) {
      completedSets.push(false);
    }

    completedSets[setIndex] = !completedSets[setIndex];
    exercise.completedSets = completedSets;
    updated[exerciseIndex] = exercise;
    setActiveExercises(updated);
  };

  const handleWeightChange = (exerciseIndex: number, setIndex: number, val: string) => {
    const updated = [...activeExercises];
    const exercise = { ...updated[exerciseIndex] };
    const weightCompleted = [...(exercise.weightCompleted || [])];

    while (weightCompleted.length <= setIndex) {
      weightCompleted.push(0);
    }

    weightCompleted[setIndex] = parseFloat(val) || 0;
    exercise.weightCompleted = weightCompleted;
    updated[exerciseIndex] = exercise;
    setActiveExercises(updated);
  };

  const handleRepsChange = (exerciseIndex: number, setIndex: number, val: string) => {
    const updated = [...activeExercises];
    const exercise = { ...updated[exerciseIndex] };
    const repsCompleted = [...(exercise.repsCompleted || [])];

    while (repsCompleted.length <= setIndex) {
      repsCompleted.push(exercise.reps || 10);
    }

    repsCompleted[setIndex] = parseInt(val) || 0;
    exercise.repsCompleted = repsCompleted;
    updated[exerciseIndex] = exercise;
    setActiveExercises(updated);
  };

  const handleSaveActiveWorkout = async () => {
    if (!activeWorkoutPlan || !activeDay) return;
    try {
      await updateActiveWorkoutProgress(activeWorkoutPlan.id, activeDay.id, activeExercises);
      await toggleDayCompletion(activeWorkoutPlan.id, activeDay.id, true);
      alert('Workout progression saved successfully!');
      setActiveTab('myplan');
    } catch (e) {
      console.error(e);
    }
  };

  const handleEquipmentToggle = (name: string) => {
    if (equipment.includes(name)) {
      setEquipment(prev => prev.filter(e => e !== name));
    } else {
      setEquipment(prev => [...prev, name]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab controls */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('myplan')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'myplan'
              ? 'bg-bg-surface text-white shadow-premium'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          My Weekly Plan
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'active'
              ? 'bg-bg-surface text-white shadow-premium'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Track Session
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'generate'
              ? 'bg-bg-surface text-white shadow-premium'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          AI Builder
        </button>
      </div>

      {/* TABS VIEW CONTROLLERS */}

      {activeTab === 'myplan' && (
        <div className="flex flex-col gap-4">
          {activeWorkoutPlan ? (
            <>
              {/* Plan overview info banner */}
              <div className="glass-panel p-5 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-white">{activeWorkoutPlan.name}</h3>
                  <p className="text-xs text-text-muted mt-1 font-sans">
                    Goal: <strong className="text-primary-light">{activeWorkoutPlan.goal}</strong> &bull; Experience: <strong>{activeWorkoutPlan.experience}</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300">
                    {activeWorkoutPlan.days.length} Days Split
                  </span>
                </div>
              </div>

              {/* Weekly Days Lists */}
              <div className="flex flex-col gap-3">
                {activeWorkoutPlan.days.map((day) => {
                  const isExpanded = expandedDays[day.id] || false;
                  
                  return (
                    <div 
                      key={day.id} 
                      className={`glass-panel rounded-3xl border transition-all ${
                        day.completed ? 'border-success/30 bg-success/5' : 'border-border-custom'
                      }`}
                    >
                      <button
                        onClick={() => toggleExpandDay(day.id)}
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">
                            Day {day.dayIndex + 1} &bull; {day.muscle_group}
                          </span>
                          <span className="font-heading font-bold text-sm text-white mt-1 block">
                            {day.muscle_group} Workout
                          </span>
                          <span className="text-[10px] text-text-muted mt-1.5 block font-sans">
                            {day.exercises.length} Exercises &bull; {day.estimated_calories} Calories
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {day.completed && (
                            <span className="text-[10px] font-bold text-success bg-success/15 border border-success/20 px-2.5 py-1 rounded-full">
                              Completed ✓
                            </span>
                          )}
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </button>

                      {/* Exercises detailed accordion section */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-border-custom/50 flex flex-col gap-3">
                          <div className="flex flex-col gap-2">
                            {day.exercises.map((ex, idx) => (
                              <div 
                                key={idx} 
                                className="flex justify-between items-center p-3 rounded-2xl bg-bg-app/40 border border-border-custom/60"
                              >
                                <div>
                                  <h5 className="text-xs font-bold text-white leading-normal">{ex.name}</h5>
                                  <p className="text-[9px] text-text-muted font-sans font-medium mt-0.5">
                                    {ex.sets} Sets &bull; {ex.reps} Reps &bull; Difficulty: {ex.difficulty}
                                  </p>
                                </div>
                                <button
                                  onClick={() => navigate('/exercises', { state: { search: ex.name } })}
                                  className="px-2.5 py-1.5 rounded-lg border border-border-custom hover:border-primary-light text-[9px] font-semibold text-text-muted hover:text-text-main transition-colors"
                                >
                                  View Guide
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => toggleDayCompletion(activeWorkoutPlan.id, day.id, !day.completed)}
                              className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${
                                day.completed
                                  ? 'border border-warning/20 bg-warning/5 text-warning hover:bg-warning/10'
                                  : 'bg-success/10 hover:bg-success/20 text-success border border-success/20'
                              }`}
                            >
                              {day.completed ? 'Mark Incomplete' : 'Quick Check Complete'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl">
              <Dumbbell className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-bold text-lg text-white mb-2">No Active Routine</h3>
              <p className="text-xs text-text-muted mb-6 max-w-sm mx-auto leading-relaxed">
                Generate a personalized weekly schedule by clicking the AI Builder tab to compile customized splits.
              </p>
              <button
                onClick={() => setActiveTab('generate')}
                className="px-6 py-3 rounded-2xl gradient-btn text-xs font-bold"
              >
                Assemble AI Workout
              </button>
            </div>
          )}
        </div>
      )}

      {/* TRACK SESSION TAB */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-6">
          {activeDay ? (
            <>
              {/* Stopwatch & Rest Timer Bar */}
              <div className="glass-panel p-5 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-primary-light">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Stopwatch Rest Timer</span>
                    <span className="font-heading font-extrabold text-xl text-white font-mono block mt-0.5">
                      {formatTime(stopwatchTime)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStopwatchActive(!stopwatchActive)}
                    className={`p-2.5 rounded-xl border text-white transition-all ${
                      stopwatchActive 
                        ? 'border-warning/30 bg-warning/10 hover:bg-warning/20' 
                        : 'border-success/30 bg-success/10 hover:bg-success/20'
                    }`}
                    aria-label={stopwatchActive ? 'Pause timer' : 'Start timer'}
                  >
                    {stopwatchActive ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setStopwatchTime(0);
                      setStopwatchActive(false);
                    }}
                    className="p-2.5 rounded-xl border border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main transition-all"
                    aria-label="Reset timer"
                  >
                    <RotateCcw className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Day title info */}
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Active Session: {activeDay.muscle_group}
                </h3>
                <p className="text-xs text-text-muted font-sans mt-0.5">
                  Complete all exercise sets below. Tap checkbox when done.
                </p>
              </div>

              {/* Set Tracker Rows */}
              <div className="flex flex-col gap-4">
                {activeExercises.map((ex, exIdx) => (
                  <div key={exIdx} className="glass-panel p-5 rounded-3xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-white">{ex.name}</h4>
                        <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">{ex.difficulty}</p>
                      </div>
                      <button
                        onClick={() => navigate('/form-analysis', { state: { exercise: ex.name } })}
                        className="px-2.5 py-1.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 text-[9px] font-semibold text-primary-light transition-all"
                      >
                        Form Checker
                      </button>
                    </div>

                    {/* Sets Grid */}
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold text-text-muted uppercase tracking-wider pb-1 px-1">
                        <span>Set</span>
                        <span>Weight ({weightUnit})</span>
                        <span>Reps</span>
                        <span>Done</span>
                      </div>

                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const setWeight = ex.weightCompleted?.[setIdx] ?? '';
                        const setReps = ex.repsCompleted?.[setIdx] ?? ex.reps;
                        const isSetCompleted = ex.completedSets?.[setIdx] ?? false;

                        return (
                          <div 
                            key={setIdx} 
                            className={`grid grid-cols-4 gap-2 items-center p-2.5 rounded-xl border transition-all ${
                              isSetCompleted 
                                ? 'bg-success/10 border-success/20' 
                                : 'bg-bg-app/40 border-border-custom/50'
                            }`}
                          >
                            <span className="text-xs font-bold text-white text-center font-mono">
                              {setIdx + 1}
                            </span>
                            
                            {/* Weight input */}
                            <input
                              type="number"
                              value={setWeight}
                              onChange={(e) => handleWeightChange(exIdx, setIdx, e.target.value)}
                              placeholder="kg/lbs"
                              className="w-full py-1.5 px-2 bg-bg-app border border-border-custom rounded-lg text-xs font-mono text-center focus:outline-none focus:border-primary text-white"
                            />

                            {/* Reps input */}
                            <input
                              type="number"
                              value={setReps}
                              onChange={(e) => handleRepsChange(exIdx, setIdx, e.target.value)}
                              placeholder="reps"
                              className="w-full py-1.5 px-2 bg-bg-app border border-border-custom rounded-lg text-xs font-mono text-center focus:outline-none focus:border-primary text-white"
                            />

                            {/* Checkbox button */}
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSetCheck(exIdx, setIdx)}
                                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                                  isSetCompleted
                                    ? 'bg-success border-success text-white'
                                    : 'border-border-custom hover:border-primary-light text-transparent hover:text-text-muted'
                                }`}
                                aria-label={`Mark set ${setIdx + 1} as complete`}
                              >
                                <CheckCircle className="w-4 h-4 text-current" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Active Workout details */}
              <button
                onClick={handleSaveActiveWorkout}
                className="w-full py-4 rounded-2xl gradient-btn text-xs font-bold flex items-center justify-center gap-2 mt-4"
              >
                <Save className="w-4.5 h-4.5" /> Save Workout Progression
              </button>
            </>
          ) : (
            <div className="text-center py-12 glass-panel rounded-3xl">
              <Dumbbell className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-bold text-lg text-white mb-2">No Scheduled Session</h3>
              <p className="text-xs text-text-muted mb-6 max-w-sm mx-auto leading-relaxed">
                There is no workout day registered for today. Pick a day under "My Weekly Plan" to expand and initiate tracking.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI GENERATE PLAN TAB */}
      {activeTab === 'generate' && (
        <div className="glass-panel p-6 rounded-3xl">
          <div className="mb-6">
            <h3 className="font-heading font-bold text-lg text-white">Generate Workout Plan</h3>
            <p className="text-xs text-text-muted mt-1">Let GPT-4o design an athletic program based on your body params</p>
          </div>

          {!tempPlan ? (
            <form onSubmit={handleGenerate} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Goal */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Goal objective</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs focus:outline-none focus:border-primary text-white"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Endurance">Endurance</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>

                {/* Split */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Workout Split</label>
                  <select
                    value={splitType}
                    onChange={(e) => setSplitType(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs focus:outline-none focus:border-primary text-white"
                  >
                    <option value="Push/Pull/Legs">Push / Pull / Legs (PPL)</option>
                    <option value="Upper/Lower">Upper / Lower</option>
                    <option value="Full Body">Full Body Split</option>
                    <option value="Arnold Split">Arnold Split</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Days/Week */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Days per week ({daysPerWeek})</label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">Duration ({duration} minutes)</label>
                  <input
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full accent-accent h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
              </div>

              {/* Equipment Multi-check */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">Equipment Available</label>
                <div className="flex flex-wrap gap-2">
                  {['Gym', 'Barbell', 'Dumbbells', 'Resistance Bands', 'Bodyweight Only'].map((eq) => {
                    const selected = equipment.includes(eq);
                    return (
                      <button
                        key={eq}
                        type="button"
                        onClick={() => handleEquipmentToggle(eq)}
                        className={`px-3 py-2 rounded-xl border text-[10px] font-semibold transition-all ${
                          selected 
                            ? 'border-accent bg-accent/15 text-accent font-bold' 
                            : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                        }`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience level */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Training Experience</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperience(level)}
                      className={`py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        experience === level
                          ? 'border-primary bg-primary/10 text-primary-light'
                          : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Injuries or limitations (Optional)</label>
                <input
                  type="text"
                  value={medical}
                  onChange={(e) => setMedical(e.target.value)}
                  placeholder="e.g. Knee tendonitis, shoulder impingement..."
                  className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl gradient-btn text-xs font-bold flex items-center justify-center gap-2 mt-4"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-accent rounded-full animate-spin" /> Assembling program splits...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" /> Assemble AI Workout Split
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Review and Save Temp plan output */
            <div className="flex flex-col gap-6 animate-pulse-glow-once">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-success/10 to-transparent border border-success/20">
                <h4 className="text-xs font-extrabold text-success flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4.5 h-4.5" /> Custom Workout Split Compiled
                </h4>
                <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                  The AI has prepared a {tempPlan.days.length}-day split targeted at <strong className="text-white">{tempPlan.goal}</strong>. Review and save below.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="border border-border-custom rounded-2xl p-4 bg-bg-app/40">
                  <h4 className="text-xs font-extrabold text-white mb-2">{tempPlan.name}</h4>
                  <p className="text-[10px] text-text-muted font-sans leading-relaxed">
                    Designed for {tempPlan.experience} level using {tempPlan.days.map((d: any) => d.muscle_group).join(', ')}.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSavePlan}
                  className="flex-1 py-4 rounded-2xl gradient-btn text-xs font-bold"
                >
                  Apply & Save Split
                </button>
                <button
                  onClick={() => setTempPlan(null)}
                  className="px-6 py-4 rounded-2xl border border-border-custom hover:bg-white/5 text-xs font-bold text-text-muted hover:text-text-main"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
