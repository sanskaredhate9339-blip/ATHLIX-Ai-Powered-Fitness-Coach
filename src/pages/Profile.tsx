import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUnit } from '../context/UnitContext';
import { useFitness } from '../context/FitnessContext';
import { 
  Target, Settings, Award, Lock, LogOut, UserPlus, Loader2 
} from 'lucide-react';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout, userEmail, refreshProfile } = useAuth();
  const { unitSystem, setUnitSystem, formatWeight } = useUnit();
  const { foods, weights, habitLogs } = useFitness();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      await refreshProfile();
      setIsLoading(false);
    };
    loadProfile();
  }, [refreshProfile]);

  // Redirect to onboarding if profile doesn't exist or is incomplete
  useEffect(() => {
    if (!isLoading && (!profile || !profile.onboarded)) {
      navigate('/onboarding');
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || !profile.onboarded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="font-heading font-extrabold text-xl text-white">Complete Your Profile</h3>
          <p className="text-xs text-text-muted mt-2 max-w-md">
            Tell us about yourself so Athlix can generate personalized workout and nutrition plans.
          </p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="px-8 py-4 rounded-2xl gradient-btn text-sm font-bold"
        >
          Complete Profile
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnitToggle = () => {
    setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric');
  };

  // Convert height
  const formatHeight = (cm: number) => {
    if (unitSystem === 'metric') return `${cm} cm`;
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}'${inches}"`;
  };

  // Achievement Trophies criteria validation
  const achievementsList = [
    {
      id: 'a1',
      title: 'First Scan Completed',
      desc: 'Analysed a food item using AI Vision scanning',
      earned: foods.length > 0,
    },
    {
      id: 'a2',
      title: 'Weight Milestone Tracker',
      desc: 'Logged more than 3 weight check-ins',
      earned: weights.length >= 3,
    },
    {
      id: 'a3',
      title: 'Habit Streak Catalyst',
      desc: 'Logged a completed habit routine checkoff',
      earned: habitLogs.filter(h => h.completed).length > 0,
    },
    {
      id: 'a4',
      title: 'Fitness Practitioner',
      desc: 'Constructed or generated custom AI workout plans',
      earned: true, // defaulted once setup complete
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Profile Overview Card */}
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 flex flex-col sm:flex-row items-center gap-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
        
        {/* Avatar logo placeholder */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center border-4 border-white/5 shadow-premium text-white font-heading font-extrabold text-3xl">
          {profile.name ? profile.name[0].toUpperCase() : 'A'}
        </div>

        <div className="text-center sm:text-left flex-1">
          <h3 className="font-heading font-extrabold text-xl text-white">
            {profile.name || 'Not provided'}
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-normal font-sans">
            {userEmail || 'Not provided'}
          </p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary-light mt-3">
            <Target className="w-3.5 h-3.5" /> Goal: {profile.goal || 'Not provided'}
          </span>
        </div>
      </div>

      {/* Body Bio Parameters */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
            Biometrics Parameters
          </h4>

          {/* Unit Toggle Button */}
          <button
            onClick={handleUnitToggle}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-primary-light uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            System: {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 rounded-2xl bg-bg-app/40 border border-border-custom flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Height</span>
            <span className="font-heading font-bold text-sm text-white block">
              {profile.height ? formatHeight(profile.height) : 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-app/40 border border-border-custom flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Target weight</span>
            <span className="font-heading font-bold text-sm text-white block">
              {profile.weight ? formatWeight(profile.weight) : 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-app/40 border border-border-custom flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Experience Range</span>
            <span className="font-heading font-bold text-sm text-white block capitalize">
              {profile.experience_level || 'Not provided'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-app/40 border border-border-custom flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Age Range</span>
            <span className="font-heading font-bold text-sm text-white block">
              {profile.age ? `${profile.age} Years` : 'Not provided'}
            </span>
          </div>
        </div>

        {profile.available_equipment && profile.available_equipment.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-bg-app/40 border border-border-custom flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Available Gym Gear</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.available_equipment.map((eq) => (
                <span key={eq} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-semibold text-slate-300 font-sans">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trophy achievements */}
      <div className="glass-panel p-6 rounded-3xl">
        <h4 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-5">
          Trophy Achievements
        </h4>

        <div className="flex flex-col gap-3.5">
          {achievementsList.map((a) => (
            <div 
              key={a.id}
              className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
                a.earned 
                  ? 'border-success/20 bg-success/5 text-white' 
                  : 'border-border-custom text-text-muted'
              }`}
            >
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                a.earned 
                  ? 'bg-success/15 border-success/20 text-success shadow-glow shadow-success/5' 
                  : 'bg-white/5 border-white/5 text-text-muted'
              }`}>
                {a.earned ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5 opacity-60" />}
              </div>

              <div>
                <h5 className={`text-xs font-bold ${a.earned ? 'text-white' : 'text-text-muted font-medium'}`}>
                  {a.title}
                </h5>
                <p className="text-[10px] text-text-muted font-sans mt-0.5 leading-relaxed font-medium">
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout / settings control panel */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-all"
        >
          <Settings className="w-4.5 h-4.5" /> App Settings
        </button>
        
        <button
          onClick={() => navigate('/onboarding?edit=true')}
          className="flex-1 py-4 bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Target className="w-4.5 h-4.5" /> Edit Profile
        </button>
        
        <button
          onClick={handleLogout}
          className="flex-1 py-4 bg-danger/10 hover:bg-danger/20 border border-danger/25 text-danger rounded-2xl text-center text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" /> Log Out Session
        </button>
      </div>
    </div>
  );
};
