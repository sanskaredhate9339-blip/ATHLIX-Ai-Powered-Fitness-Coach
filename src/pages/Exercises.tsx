import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EXERCISE_LIBRARY } from '../services/exerciseLibrary';
import type { Exercise } from '../services/exerciseLibrary';
import { Search, ChevronRight, X, Dumbbell, Award, HelpCircle } from 'lucide-react';

export const Exercises: React.FC = () => {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Set search query if redirected from workout guide
  useEffect(() => {
    if (location.state && (location.state as any).search) {
      setSearchQuery((location.state as any).search);
    }
  }, [location.state]);

  const muscles = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  // Filter exercises
  const filteredExercises = EXERCISE_LIBRARY.filter((ex: Exercise) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscle_group === selectedMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header controls */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises (e.g. Bench Press, Squats)..."
            className="w-full pl-11 pr-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
            >
              Clear
            </button>
          )}
        </div>

        {/* Muscle group filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {muscles.map((muscle) => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-4 py-2.5 rounded-xl border text-[10px] font-bold transition-all whitespace-nowrap ${
                selectedMuscle === muscle
                  ? 'border-primary bg-primary/10 text-primary-light'
                  : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex: Exercise) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="glass-panel p-5 rounded-3xl text-left border border-border-custom hover:border-primary/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary-light group-hover:scale-105 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">{ex.name}</h4>
                  <span className="text-[10px] text-text-muted font-sans font-medium mt-1 block">
                    {ex.muscle_group} &bull; {ex.equipment}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
            </button>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 glass-panel rounded-3xl">
            <HelpCircle className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-50" />
            <p className="text-xs text-text-muted font-sans italic">
              No exercises match your search filters.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Modal view */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 bg-[#09090E]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl max-h-[85vh] overflow-y-auto relative animate-pulse-glow-once">
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute right-4 top-4 p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">{selectedExercise.name}</h3>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mt-0.5">
                  Difficulty: {selectedExercise.difficulty}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300">
                Muscle Group: {selectedExercise.muscle_group}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-slate-300">
                Equipment: {selectedExercise.equipment}
              </span>
            </div>

            {/* Steps description */}
            <div className="mb-6">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5">
                Execution Steps
              </h4>
              <ol className="text-xs text-text-muted font-sans flex flex-col gap-2.5 list-decimal pl-4 leading-relaxed">
                {selectedExercise.instructions.map((stepStr: string, idx: number) => (
                  <li key={idx}>
                    {stepStr}
                  </li>
                ))}
              </ol>
            </div>

            {/* Alternatives section */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/25">
              <h4 className="text-xs font-extrabold text-primary-light flex items-center gap-1.5 mb-1.5">
                <Award className="w-4 h-4" /> Recommended Alternatives
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed font-sans font-medium">
                {selectedExercise.alternatives.length > 0 
                  ? selectedExercise.alternatives.join(', ') 
                  : 'No direct alternatives registered. Choose alternative compound exercises with similar movement mechanics.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
