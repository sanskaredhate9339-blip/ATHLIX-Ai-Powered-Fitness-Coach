import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { useUnit } from '../context/UnitContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Plus, Trash2, Calendar, Scale, X, ShieldAlert, Heart, TrendingDown } from 'lucide-react';

export const Weight: React.FC = () => {
  const { profile } = useAuth();
  const { weights, logWeightEntry, deleteWeightEntry } = useFitness();
  const { convertWeight, formatWeight, weightUnit } = useUnit();

  const [modalOpen, setModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(profile?.weight?.toString() || '');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Target weight placeholder based on goal
  const isLoss = profile?.goal === 'Weight Loss';
  const targetWeight = isLoss ? (profile?.weight || 75) - 8 : (profile?.weight || 75) + 5;

  // BMI calculations
  const heightM = (profile?.height || 175) / 100;
  const currentWeight = weights[0]?.weight || profile?.weight || 70;
  const bmi = Number((currentWeight / (heightM * heightM)).toFixed(1));

  const getBmiDetails = () => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-accent', bg: 'bg-accent/10 border-accent/20' };
    if (bmi >= 18.5 && bmi < 25) return { label: 'Normal Weight', color: 'text-success', bg: 'bg-success/10 border-success/20' };
    if (bmi >= 25 && bmi < 30) return { label: 'Overweight', color: 'text-warning', bg: 'bg-warning/10 border-warning/20' };
    return { label: 'Obese', color: 'text-danger', bg: 'bg-danger/10 border-danger/20' };
  };

  const bmiDetails = getBmiDetails();

  const chartData = [...weights].reverse().map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: convertWeight(w.weight),
    fat: w.body_fat || null,
  }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightVal = parseFloat(newWeight);
    if (isNaN(weightVal) || weightVal <= 0) return;

    setIsSubmitting(true);
    try {
      await logWeightEntry(
        weightVal,
        newBodyFat ? parseFloat(newBodyFat) : undefined,
        new Date().toISOString().split('T')[0],
        notes || undefined
      );
      setModalOpen(false);
      setNotes('');
      setNewBodyFat('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top dashboard summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Weight */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary-light">
            <Scale className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Current Weight</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">
              {formatWeight(currentWeight)}
            </span>
            <span className="text-[9px] text-text-muted block mt-1">Starting: {profile?.weight ? formatWeight(profile.weight) : '--'}</span>
          </div>
        </div>

        {/* Target Weight */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center text-accent">
            <TrendingDown className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Target Goal</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">
              {formatWeight(targetWeight)}
            </span>
            <span className="text-[9px] text-text-muted block mt-1">Goal: {profile?.goal}</span>
          </div>
        </div>

        {/* Body Mass Index */}
        <div className="glass-panel p-5 rounded-3xl flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-success/10 border border-success/25 flex items-center justify-center text-success">
            <Heart className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">BMI Metric</span>
            <span className="font-heading font-extrabold text-lg text-text-main mt-0.5 block">{bmi || '--'}</span>
            <span className={`text-[9px] font-semibold block mt-1 ${bmiDetails.color}`}>{bmiDetails.label}</span>
          </div>
        </div>
      </div>

      {/* Grid of Weight Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Long Timeline Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
                Weight Timeline Tracker
              </h3>
              <button
                onClick={() => setModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary-light flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Log Weight
              </button>
            </div>

            <div className="h-56 w-full font-mono text-[10px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" strokeOpacity={0.1} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" tickLine={false} />
                    <YAxis stroke="var(--text-muted)" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-custom)',
                        borderRadius: '16px',
                        color: 'var(--text-main)'
                      }}
                    />
                    <Line type="monotone" dataKey="weight" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-text-muted text-xs font-sans italic">
                  No historical weights logged yet.
                </div>
              )}
            </div>
          </div>

          {/* Table list of logs */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5">
              Weight History Entries
            </h3>

            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {weights.length > 0 ? (
                weights.map((w) => (
                  <div 
                    key={w.id} 
                    className="flex justify-between items-center p-4 rounded-2xl bg-bg-app/40 border border-border-custom hover:border-primary-light/20 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-bg-surface-alt border border-border-custom text-text-muted">
                        <Calendar className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-text-main">{formatWeight(w.weight)}</h4>
                        <span className="text-[10px] text-text-muted font-sans font-medium mt-0.5 block">
                          Logged: {new Date(w.date).toLocaleDateString()} &bull; Fat: {w.body_fat ? `${w.body_fat}%` : 'N/A'}
                        </span>
                        {w.notes && (
                          <p className="text-[9px] text-text-muted font-sans mt-1.5 italic bg-bg-surface-alt px-2 py-1 rounded-lg w-fit">
                            "{w.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteWeightEntry(w.id)}
                      className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-text-muted text-xs font-sans italic">
                  No records to display.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: BMI Ticks */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-4">
              BMI Mass Categories
            </h3>

            <div className={`p-4 rounded-2xl border mb-5 font-sans ${bmiDetails.bg}`}>
              <h4 className={`text-xs font-bold ${bmiDetails.color}`}>{bmiDetails.label} Range</h4>
              <p className="text-[10px] text-text-muted leading-relaxed mt-1">
                Your body composition falls within the {bmiDetails.label.toLowerCase()} bracket based on your {profile?.height || 170}cm height definition.
              </p>
            </div>

            {/* Range Ticks details */}
            <div className="flex flex-col gap-3 font-sans text-[10px] text-text-muted font-medium">
              <div className="flex justify-between items-center py-1.5 border-b border-border-custom/50">
                <span>Underweight</span>
                <span className="text-text-main">&lt; 18.5</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-custom/50">
                <span className="text-success">Normal Range</span>
                <span className="text-text-main">18.5 - 24.9</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-border-custom/50">
                <span className="text-warning">Overweight</span>
                <span className="text-text-main">25.0 - 29.9</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-danger">Obese</span>
                <span className="text-text-main">&gt;= 30.0</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/25">
            <h4 className="text-xs font-extrabold text-accent flex items-center gap-1.5 mb-1.5">
              <ShieldAlert className="w-4.5 h-4.5" /> Biometrics Notice
            </h4>
            <p className="text-[10px] text-text-muted leading-relaxed font-sans">
              BMI is a general guideline and does not directly isolate muscle mass percentages. Rely on the body fat tracker and strength increments for high precision audits.
            </p>
          </div>
        </div>

      </div>

      {/* Log Weight modal popups */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-bg-app/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl relative animate-pulse-glow-once">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-extrabold text-xl text-text-main mb-2">Record Weight</h3>
            <p className="text-xs text-text-muted mb-6">Log weight metrics to update your profile stats</p>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted">Weight ({weightUnit})</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 74.5"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-text-main"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  placeholder="e.g. 15.4"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-text-main"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Morning log, fasted status..."
                  rows={2}
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary text-text-main resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 mt-4"
              >
                Log Weight Value
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
