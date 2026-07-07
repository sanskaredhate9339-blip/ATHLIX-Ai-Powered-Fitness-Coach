import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUnit } from '../context/UnitContext';
import { db } from '../services/db';
import { motion } from 'framer-motion';
import { 
  User, Calendar, 
  ArrowRight, ArrowLeft, Check, CheckCircle2 
} from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOnboarding, profile, userEmail } = useAuth();
  const { unitSystem, setUnitSystem } = useUnit();
  const isEditMode = searchParams.get('edit') === 'true';

  const [step, setStep] = useState(1);

  // Onboarding Form States
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>('');
  const [height, setHeight] = useState<number | undefined>(undefined); // stored in cm
  const [weight, setWeight] = useState<number | undefined>(undefined);  // stored in kg
  const [goal, setGoal] = useState<string>('');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced' | undefined>(undefined);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState(3);
  const [duration, setDuration] = useState(45);

  // Height Imperial input helper states
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  // Weight Imperial helper state
  const [weightLbs, setWeightLbs] = useState(150);

  // Pre-fill form if editing existing profile
  useEffect(() => {
    if (isEditMode && profile) {
      setName(profile.name || '');
      setAge(profile.age);
      setGender(profile.gender || '');
      setHeight(profile.height);
      setWeight(profile.weight);
      setGoal(profile.goal || '');
      setExperience(profile.experience_level);
      setEquipment(profile.available_equipment || []);
      setWorkoutDays(profile.workout_days_preference || 3);
      setDuration(profile.preferred_session_duration || 45);
      
      // Sync imperial values if needed
      if (profile.height) {
        const totalInches = profile.height / 2.54;
        setHeightFt(Math.floor(totalInches / 12));
        setHeightIn(Math.round(totalInches % 12));
      }
      if (profile.weight) {
        setWeightLbs(Math.round(profile.weight * 2.20462));
      }
    }
  }, [isEditMode, profile]);

  const goals = [
    { title: 'Weight Loss', desc: 'Burn fat and get lean' },
    { title: 'Muscle Gain', desc: 'Build size and core density' },
    { title: 'Strength Training', desc: 'Increase structural pulling power' },
    { title: 'Endurance', desc: 'Enhance conditioning and stamina' },
    { title: 'General Fitness', desc: 'Maintain health and energy levels' }
  ];

  const equipments = [
    { name: 'Gym', desc: 'Full commercial gym machines' },
    { name: 'Barbell', desc: 'Olympic plates and bars' },
    { name: 'Dumbbells', desc: 'Adjustable or rack pairs' },
    { name: 'Resistance Bands', desc: 'Elastic loops and cables' },
    { name: 'Bodyweight Only', desc: 'No equipment needed' }
  ];

  const handleNext = async () => {
    // Save current step data to database
    await saveStepData();
    if (step < 5) setStep(step + 1);
  };

  const saveStepData = async () => {
    try {
      const dataToSave: any = {};
      
      // Save data based on current step
      if (step >= 1) {
        if (name) dataToSave.name = name;
        if (age) dataToSave.age = age;
        if (gender) dataToSave.gender = gender;
      }
      if (step >= 2) {
        if (height) dataToSave.height = height;
        if (weight) dataToSave.weight = weight;
        dataToSave.unit_preference = unitSystem;
      }
      if (step >= 3) {
        if (goal) dataToSave.goal = goal;
      }
      if (step >= 4) {
        if (experience) dataToSave.experience_level = experience;
        if (equipment.length > 0) dataToSave.available_equipment = equipment;
      }
      if (step >= 5) {
        dataToSave.workout_days_preference = workoutDays;
        dataToSave.preferred_session_duration = duration;
      }

      // Add email if available
      if (userEmail) {
        dataToSave.email = userEmail;
      }

      // Only save if we have data
      if (Object.keys(dataToSave).length > 0) {
        await db.updateUserProfile(dataToSave);
      }
    } catch (error) {
      console.error('Error saving step data:', error);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleEquipmentToggle = (item: string) => {
    if (item === 'Bodyweight Only') {
      setEquipment(['Bodyweight Only']);
      return;
    }
    
    let updated = equipment.filter(e => e !== 'Bodyweight Only');
    if (updated.includes(item)) {
      updated = updated.filter(e => e !== item);
    } else {
      updated.push(item);
    }
    setEquipment(updated.length === 0 ? ['Bodyweight Only'] : updated);
  };

  const handleUnitToggle = () => {
    const nextSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(nextSystem);

    if (nextSystem === 'imperial') {
      // Sync cm to ft/in
      const totalInches = height / 2.54;
      setHeightFt(Math.floor(totalInches / 12));
      setHeightIn(Math.round(totalInches % 12));
      // Sync kg to lbs
      setWeightLbs(Math.round(weight * 2.20462));
    } else {
      // Sync ft/in to cm
      const totalCm = (heightFt * 12 + heightIn) * 2.54;
      setHeight(Math.round(totalCm));
      // Sync lbs to kg
      setWeight(Math.round(weightLbs / 2.20462));
    }
  };

  const handleFinish = async () => {
    // Validation
    if (!name || !age || !gender || !height || !weight || !goal || !experience || equipment.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    let finalHeight = height;
    let finalWeight = weight;

    if (unitSystem === 'imperial') {
      finalHeight = Math.round((heightFt * 12 + heightIn) * 2.54);
      finalWeight = Math.round(weightLbs / 2.20462);
    }

    const onboardingData = {
      name,
      age,
      gender,
      height: finalHeight,
      weight: finalWeight,
      goal,
      experience_level: experience,
      available_equipment: equipment,
      workout_days_preference: workoutDays,
      preferred_session_duration: duration,
      unit_preference: unitSystem,
      notification_preferences: {
        workout: true,
        water: true,
        protein: true,
        sleep: true,
        weekly_report: true,
      },
    };

    try {
      // Save final step data
      await saveStepData();
      // Mark as onboarded
      await completeOnboarding(onboardingData);
      navigate(isEditMode ? '/profile' : '/dashboard');
    } catch (e) {
      console.error('Error completing onboarding:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090E] flex flex-col justify-center items-center p-6 relative overflow-hidden text-text-main">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px]" />

      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl z-10">
        {/* Step tracker */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
            Step {step} of 5
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'w-6 bg-primary' : 'w-2 bg-white/5'
                }`}
              />
            ))}
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs text-text-muted hover:text-text-main font-medium"
          >
            Skip Setup
          </button>
        </div>

        {/* Dynamic Step Content with animations */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Let's meet you</h2>
                <p className="text-xs text-text-muted mt-1">Tell us a bit about who you are</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300 ml-1">Preferred Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex"
                    className="w-full pl-12 pr-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-300 ml-1">Age (Years)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={age || ''}
                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="25"
                    className="w-full pl-12 pr-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Gender Identification</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Non-binary'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        gender === g
                          ? 'border-primary bg-primary/10 text-primary-light'
                          : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-white">Body Metrics</h2>
                  <p className="text-xs text-text-muted mt-1">This helps us calculate your BMI and caloric base</p>
                </div>
                <button
                  type="button"
                  onClick={handleUnitToggle}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-primary-light uppercase tracking-wider hover:bg-white/10 transition-all"
                >
                  Unit: {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                </button>
              </div>

              {unitSystem === 'metric' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Height (cm)</label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={height || ''}
                      onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      value={weight || ''}
                      onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Height (Feet / Inches)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="number"
                          min="3"
                          max="8"
                          value={heightFt}
                          onChange={(e) => setHeightFt(parseInt(e.target.value) || 5)}
                          className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white text-center"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">ft</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={heightIn}
                          onChange={(e) => setHeightIn(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white text-center"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">in</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 ml-1">Weight (lbs)</label>
                    <input
                      type="number"
                      min="50"
                      max="600"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(parseInt(e.target.value) || 150)}
                      className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-white"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Fitness Goal</h2>
                <p className="text-xs text-text-muted mt-1">Select your primary fitness objective</p>
              </div>

              <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
                {goals.map((g) => (
                  <button
                    key={g.title}
                    onClick={() => setGoal(g.title)}
                    className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      goal === g.title
                        ? 'border-primary bg-primary/10 text-white'
                        : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold">{g.title}</h4>
                      <p className="text-[11px] opacity-80 mt-0.5 font-sans font-medium">{g.desc}</p>
                    </div>
                    {goal === g.title && <CheckCircle2 className="w-5 h-5 text-accent" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Experience & Gear</h2>
                <p className="text-xs text-text-muted mt-1">Tell us your background and what you train with</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setExperience(exp)}
                      className={`py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                        experience === exp
                          ? 'border-primary bg-primary/10 text-primary-light'
                          : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300 ml-1">Available Equipment</label>
                <div className="flex flex-wrap gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {equipments.map((eq) => {
                    const selected = equipment.includes(eq.name);
                    return (
                      <button
                        key={eq.name}
                        onClick={() => handleEquipmentToggle(eq.name)}
                        className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                          selected
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
                        }`}
                      >
                        {eq.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-white">Preferences</h2>
                <p className="text-xs text-text-muted mt-1">Set your commitment splits and schedule</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-slate-300">Workout Days (Per Week)</label>
                  <span className="text-xs font-bold text-primary-light">{workoutDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={workoutDays}
                  onChange={(e) => setWorkoutDays(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-sans px-1">
                  <span>1 day</span>
                  <span>4 days</span>
                  <span>7 days</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-slate-300">Session Duration</label>
                  <span className="text-xs font-bold text-accent">{duration} minutes</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full accent-accent h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-sans px-1">
                  <span>15 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Buttons Nav controls */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-border-custom">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-6 py-3.5 rounded-2xl border border-border-custom hover:bg-white/5 text-sm font-bold text-text-muted hover:text-text-main flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3.5 rounded-2xl gradient-btn text-sm font-bold flex items-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-success to-emerald-400 text-white text-sm font-bold flex items-center gap-2 shadow-glow shadow-success/10 hover:brightness-110 transition-all"
            >
              Finish Setup <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
