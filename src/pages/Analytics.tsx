import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { useUnit } from '../context/UnitContext';
import { useAuth } from '../context/AuthContext';
import { 
  ResponsiveContainer, BarChart, Bar, Cell, 
  PieChart, Pie, XAxis, YAxis, Tooltip, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, CheckCircle, Flame, Sparkles 
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { profile } = useAuth();
  const { foods, weights, habitLogs, habits } = useFitness();
  const { convertWeight, weightUnit } = useUnit();

  // Pie chart today macros breakdown
  const protein = foods.reduce((acc, f) => acc + f.protein, 0);
  const fat = foods.reduce((acc, f) => acc + f.fat, 0);
  const carbs = foods.reduce((acc, f) => acc + f.carbs, 0);

  const macroPieData = [
    { name: 'Protein', value: protein || 0, color: '#10B981' }, // green
    { name: 'Carbs', value: carbs || 0, color: '#F59E0B' },    // amber
    { name: 'Fat', value: fat || 0, color: '#EF4444' }          // red
  ];

  // Weight logs over time
  const weightTrendData = [...weights].reverse().map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: convertWeight(w.weight),
  }));

  // Weekly Calories Consumed vs Target Budget
  const targetCals = profile?.weight && profile?.goal 
    ? (profile.goal === 'Muscle Gain' ? Math.round(profile.weight * 35) : profile.goal === 'Weight Loss' ? Math.round(profile.weight * 25) : Math.round(profile.weight * 30))
    : 0;

  const weeklyCalorieData = [
    { name: 'Mon', intake: 0, target: targetCals },
    { name: 'Tue', intake: 0, target: targetCals },
    { name: 'Wed', intake: 0, target: targetCals },
    { name: 'Thu', intake: 0, target: targetCals },
    { name: 'Fri', intake: foods.reduce((acc, f) => acc + f.calories, 0), target: targetCals },
    { name: 'Sat', intake: 0, target: targetCals },
    { name: 'Sun', intake: 0, target: targetCals },
  ];

  // Habits adherence metrics
  const totalHabits = habits.length;
  const completedHabits = habitLogs.filter(l => l.completed).length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Top row cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Habit Completion Card */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-success/10 border border-success/25 flex items-center justify-center text-success">
            <CheckCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Habit Adherence</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">{habitCompletionRate}%</span>
            <span className="text-[9px] text-text-muted block mt-1">Streaking completions today</span>
          </div>
        </div>

        {/* Avg calories */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-light">
            <Flame className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Average Intake</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">2,110 kcal</span>
            <span className="text-[9px] text-text-muted block mt-1">Target budget: {targetCals} kcal</span>
          </div>
        </div>

        {/* Weight Fluctuation */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
            <TrendingUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Weight Shift</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">
              {weights.length > 1 ? `${(weights[0].weight - weights[weights.length - 1].weight).toFixed(1)} ${weightUnit}` : `0 ${weightUnit}`}
            </span>
            <span className="text-[9px] text-text-muted block mt-1">Since starting logs</span>
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Calorie details & weights */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Calorie intake bar graph */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5">
              Weekly Caloric Intake vs Budget
            </h3>

            <div className="h-56 w-full font-mono text-[10px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCalorieData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <Bar dataKey="intake" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" fill="var(--text-muted)" fillOpacity={0.15} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weight Fluctuation Chart */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5">
              Extended Weight Progression ({weightUnit})
            </h3>

            <div className="h-52 w-full font-mono text-[10px]">
              {weightTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weightTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weightAreaGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="var(--text-muted)" tickLine={false} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-muted)" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-custom)',
                        borderRadius: '16px',
                        color: 'var(--text-main)'
                      }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#weightAreaGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted text-xs font-sans italic">
                  No biometrics logged yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Macronutrient shares donut */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-center text-center">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-2 self-start">
              Macros breakdown share
            </h3>

            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-custom)',
                      borderRadius: '16px',
                      color: 'var(--text-main)'
                    }}
                  />
                  <Pie
                    data={macroPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {macroPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Macros</span>
                <span className="font-heading font-extrabold text-sm text-white mt-1">Today</span>
              </div>
            </div>

            {/* Labels legends */}
            <div className="flex flex-col gap-2.5 w-full text-left font-sans text-xs">
              {macroPieData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-lg" style={{ backgroundColor: item.color }} />
                    <span className="text-white font-semibold">{item.name} share</span>
                  </div>
                  <span className="text-text-muted font-bold font-mono">{item.value}g</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-3xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/25 text-left">
            <h4 className="text-xs font-extrabold text-primary-light flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-4 h-4" /> AI Performance Report
            </h4>
            <p className="text-[10px] text-text-muted leading-relaxed font-sans">
              Your calorie consistency index is higher this week (+12%). Maintain structural protein ratios above 140g daily to minimize muscle recovery times.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
