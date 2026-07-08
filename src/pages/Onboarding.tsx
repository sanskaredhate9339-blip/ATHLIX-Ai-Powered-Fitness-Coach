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
import { 
  ACTIVITY_LEVELS, 
  SESSION_DURATION_OPTIONS, 
  FITNESS_GOALS
} from '../constants/fitness';

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
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [activityLevel, setActivityLevel] = useState<string>('');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced' | undefined>(undefined);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [workoutDays, setWorkoutDays] = useState(3);
  const [duration, setDuration] = useState(45);

  // Height Imperial input helper states
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  // Weight Imperial helper state
  const [weightLbs, setWeightLbs] = useState(150);

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Pre-fill form if editing or returning user with profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age || undefined);
      setGender(profile.gender || '');
      setHeight(profile.height || undefined);
      setWeight(profile.weight || undefined);
      if (profile.goal) {
        setSelectedGoals(profile.goal.split(', ').map(g => g.trim()).filter(Boolean));
      }
      setActivityLevel(profile.activity_level || '');
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
  }, [profile]);

  const equipments = [
    { name: 'Gym', desc: 'Full commercial gym machines' },
    { name: 'Barbell', desc: 'Olympic plates and bars' },
    { name: 'Dumbbells', desc: 'Adjustable or rack pairs' },
    { name: 'Resistance Bands', desc: 'Elastic loops and cables' },
    { name: 'Bodyweight Only', desc: 'No equipment needed' }
  ];

  // Helper validation logic for current step fields
  const validateStepFields = (stepIndex: number): Record<string, string> => {
    const stepErrors: Record<string, string> = {};
    if (stepIndex === 1) {
      if (!name || name.trim() === '') {
        stepErrors.name = 'Please enter your name';
      } else if (name.trim().length < 2) {
        stepErrors.name = 'Name must be at least 2 characters';
      }
      if (age === undefined || isNaN(age)) {
        stepErrors.age = 'Please enter your age';
      } else if (age < 13 || age > 100) {
        stepErrors.age = 'Age must be between 13 and 100';
      }
      if (!gender) {
        stepErrors.gender = 'Please select your gender';
      }
    } else if (stepIndex === 2) {
      if (unitSystem === 'metric') {
        if (height === undefined || isNaN(height)) {
          stepErrors.height = 'Please enter your height';
        } else if (height < 100 || height > 250) {
          stepErrors.height = 'Height must be between 100 and 250 cm';
        }
        if (weight === undefined || isNaN(weight)) {
          stepErrors.weight = 'Please enter your weight';
        } else if (weight < 25 || weight > 300) {
          stepErrors.weight = 'Weight must be between 25 and 300 kg';
        }
      } else {
        const totalInches = heightFt * 12 + heightIn;
        const heightCm = Math.round(totalInches * 2.54);
        if (heightFt < 3 || heightFt > 8 || heightIn < 0 || heightIn > 11 || heightCm < 100 || heightCm > 250) {
          stepErrors.height = 'Height must be between 100 and 250 cm (3\'3" - 8\'2")';
        }
        const weightKg = Math.round((weightLbs / 2.20462) * 10) / 10;
        if (weightLbs < 55 || weightLbs > 660 || weightKg < 25 || weightKg > 300) {
          stepErrors.weight = 'Weight must be between 55 and 660 lbs (25-300 kg)';
        }
      }
    } else if (stepIndex === 3) {
      if (selectedGoals.length === 0) {
        stepErrors.goal = 'Please select at least one fitness goal';
      }
      if (!activityLevel) {
        stepErrors.activityLevel = 'Please select your activity level';
      }
    } else if (stepIndex === 4) {
      if (!experience) {
        stepErrors.experience = 'Please select your experience level';
      }
      if (equipment.length === 0) {
        stepErrors.equipment = 'Please select at least one equipment option';
      }
    } else if (stepIndex === 5) {
      if (workoutDays < 1 || workoutDays > 7) {
        stepErrors.workoutDays = 'Workout days must be between 1 and 7';
      }
      if (!SESSION_DURATION_OPTIONS.includes(duration as any)) {
        stepErrors.duration = 'Please select a valid session duration';
      }
    }
    return stepErrors;
  };

  const handleNext = async () => {
    const stepErrors = validateStepFields(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      const stepFields: Record<string, boolean> = {};
      Object.keys(stepErrors).forEach(key => { stepFields[key] = true; });
      setTouched(prev => ({ ...prev, ...stepFields }));
      return;
    }
    
    // Save current step data to database
    await saveStepData();
    if (step < 5) setStep(step + 1);
  };

  const saveStepData = async () => {
    try {
      const dataToSave: any = {};
      
      if (step >= 1) {
        if (name) dataToSave.name = name;
        if (age) dataToSave.age = age;
        if (gender) dataToSave.gender = gender;
      }
      if (step >= 2) {
        if (unitSystem === 'metric') {
          if (height) dataToSave.height = height;
          if (weight) dataToSave.weight = weight;
        } else {
          dataToSave.height = Math.round((heightFt * 12 + heightIn) * 2.54);
          dataToSave.weight = Math.round(weightLbs / 2.20462);
        }
        dataToSave.unit_preference = unitSystem;
      }
      if (step >= 3) {
        if (selectedGoals.length > 0) dataToSave.goal = selectedGoals.join(', ');
        if (activityLevel) dataToSave.activity_level = activityLevel;
      }
      if (step >= 4) {
        if (experience) dataToSave.experience_level = experience;
        if (equipment.length > 0) dataToSave.available_equipment = equipment;
      }
      if (step >= 5) {
        dataToSave.workout_days_preference = workoutDays;
        dataToSave.preferred_session_duration = duration;
      }

      if (userEmail) {
        dataToSave.email = userEmail;
      }

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
      setErrors(prev => ({ ...prev, equipment: '' }));
      return;
    }
    
    let updated = equipment.filter(e => e !== 'Bodyweight Only');
    if (updated.includes(item)) {
      updated = updated.filter(e => e !== item);
    } else {
      updated.push(item);
    }
    const finalEquip = updated.length === 0 ? ['Bodyweight Only'] : updated;
    setEquipment(finalEquip);
    setErrors(prev => ({ ...prev, equipment: '' }));
  };

  const handleUnitToggle = () => {
    const nextSystem = unitSystem === 'metric' ? 'imperial' : 'metric';
    setUnitSystem(nextSystem);

    if (nextSystem === 'imperial') {
      if (height) {
        const totalInches = height / 2.54;
        setHeightFt(Math.floor(totalInches / 12));
        setHeightIn(Math.round(totalInches % 12));
      }
      if (weight) {
        setWeightLbs(Math.round(weight * 2.20462));
      }
    } else {
      const totalCm = (heightFt * 12 + heightIn) * 2.54;
      setHeight(Math.round(totalCm));
      setWeight(Math.round(weightLbs / 2.20462));
    }
  };

  const handleFinish = async () => {
    const stepErrors = validateStepFields(5);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setTouched(prev => ({ ...prev, workoutDays: true, duration: true }));
      return;
    }

    let allErrors: Record<string, string> = {};
    for (let i = 1; i <= 5; i++) {
      allErrors = { ...allErrors, ...validateStepFields(i) };
    }

    if (Object.keys(allErrors).length > 0) {
      alert('Please fill in all required fields correctly before finishing.');
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
      goal: selectedGoals.join(', '),
      activity_level: activityLevel as any,
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
      await completeOnboarding(onboardingData);
      // Wait a moment to ensure data is persisted
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate(isEditMode ? '/profile' : '/dashboard');
    } catch (e) {
      console.error('Error completing onboarding:', e);
    }
  };

  // Live validation on changes helper
  const handleFieldChange = (fieldName: string, _value: any) => {
    if (touched[fieldName]) {
      const currentStepErrors = validateStepFields(step);
      setErrors(prev => ({ ...prev, [fieldName]: currentStepErrors[fieldName] || '' }));
    }
  };

  // Helper to determine if Continue button should be disabled
  const currentStepErrors = validateStepFields(step);
  const isCurrentStepInvalid = Object.keys(currentStepErrors).length > 0;

  // Overtraining calculations
  const getOvertrainingWarnings = (): string[] => {
    const warnings: string[] = [];
    if (experience === 'Beginner') {
      if (workoutDays >= 5 || duration >= 90) {
        warnings.push('This workout volume may increase fatigue.');
        warnings.push('You may be at higher injury risk.');
        warnings.push('Recovery days are recommended.');
      }
    } else if (experience === 'Intermediate') {
      if (workoutDays >= 6 || duration >= 120) {
        warnings.push('This workout volume may increase fatigue.');
        warnings.push('You may be at higher injury risk.');
        warnings.push('Recovery days are recommended.');
      }
    } else if (experience === 'Advanced') {
      if (workoutDays >= 7 && duration > 180) {
        warnings.push('This workout volume may increase fatigue.');
        warnings.push('You may be at higher injury risk.');
        warnings.push('Recovery days are recommended.');
      }
    }
    return warnings;
  };

  const overtrainingWarnings = getOvertrainingWarnings();

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center items-center p-6 relative overflow-hidden text-text-main">
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
                  i <= step ? 'w-6 bg-primary' : 'w-2 bg-border-custom'
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
        <div className="min-h-[320px]">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-text-main">Let's meet you</h2>
                <p className="text-xs text-text-muted mt-1">Tell us a bit about who you are</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-muted ml-1">Preferred Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      handleFieldChange('name', e.target.value);
                    }}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, name: true }));
                      const currentStepErrors = validateStepFields(1);
                      setErrors(prev => ({ ...prev, name: currentStepErrors.name || '' }));
                    }}
                    placeholder="Alex"
                    className={`w-full pl-12 pr-4 py-3 bg-bg-app border rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main ${
                      touched.name && errors.name ? 'border-danger/60 focus:border-danger' : 'border-border-custom'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-muted ml-1">Age (Years)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="number"
                    min="13"
                    max="100"
                    value={age ?? ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : undefined;
                      setAge(val);
                      handleFieldChange('age', val);
                    }}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, age: true }));
                      const currentStepErrors = validateStepFields(1);
                      setErrors(prev => ({ ...prev, age: currentStepErrors.age || '' }));
                    }}
                    placeholder="25"
                    className={`w-full pl-12 pr-4 py-3 bg-bg-app border rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main ${
                      touched.age && errors.age ? 'border-danger/60 focus:border-danger' : 'border-border-custom'
                    }`}
                  />
                </div>
                {touched.age && errors.age && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.age}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Gender Identification</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Non-binary'].map((g) => {
                    const isSelected = gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGender(g);
                          setErrors(prev => ({ ...prev, gender: '' }));
                        }}
                        className={`py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary-light'
                            : (touched.gender && errors.gender ? 'border-danger/60 text-danger' : 'border-border-custom hover:bg-bg-surface-alt text-text-muted hover:text-text-main')
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
                {touched.gender && errors.gender && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.gender}</span>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-text-main">Body Metrics</h2>
                  <p className="text-xs text-text-muted mt-1">This helps us calculate your BMI and caloric base</p>
                </div>
                <button
                  type="button"
                  onClick={handleUnitToggle}
                  className="px-3.5 py-1.5 rounded-xl bg-bg-surface-alt border border-border-custom text-[10px] font-bold text-primary-light uppercase tracking-wider hover:bg-bg-surface transition-all"
                >
                  Unit: {unitSystem === 'metric' ? 'Metric' : 'Imperial'}
                </button>
              </div>

              {unitSystem === 'metric' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-muted ml-1">Height (cm)</label>
                    <input
                      type="number"
                      min="100"
                      max="250"
                      value={height ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value) : undefined;
                        setHeight(val);
                        handleFieldChange('height', val);
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, height: true }));
                        const currentStepErrors = validateStepFields(2);
                        setErrors(prev => ({ ...prev, height: currentStepErrors.height || '' }));
                      }}
                      className={`w-full px-4 py-3.5 bg-bg-app border rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main ${
                        touched.height && errors.height ? 'border-danger/60 focus:border-danger' : 'border-border-custom'
                      }`}
                    />
                    {touched.height && errors.height && (
                      <span className="text-[10px] text-danger ml-1 font-semibold">{errors.height}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-muted ml-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="25"
                      max="300"
                      value={weight ?? ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : undefined;
                        setWeight(val);
                        handleFieldChange('weight', val);
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, weight: true }));
                        const currentStepErrors = validateStepFields(2);
                        setErrors(prev => ({ ...prev, weight: currentStepErrors.weight || '' }));
                      }}
                      className={`w-full px-4 py-3.5 bg-bg-app border rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main ${
                        touched.weight && errors.weight ? 'border-danger/60 focus:border-danger' : 'border-border-custom'
                      }`}
                    />
                    {touched.weight && errors.weight && (
                      <span className="text-[10px] text-danger ml-1 font-semibold">{errors.weight}</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-muted ml-1">Height (Feet / Inches)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="number"
                          min="3"
                          max="8"
                          value={heightFt}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 5;
                            setHeightFt(val);
                            if (touched.height) {
                              const totalInches = val * 12 + heightIn;
                              const heightCm = Math.round(totalInches * 2.54);
                              setErrors(prev => ({ ...prev, height: (heightCm < 100 || heightCm > 250) ? 'Height must be between 100 and 250 cm (3\'3" - 8\'2")' : '' }));
                            }
                          }}
                          className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main text-center"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">ft</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="11"
                          value={heightIn}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setHeightIn(val);
                            if (touched.height) {
                              const totalInches = heightFt * 12 + val;
                              const heightCm = Math.round(totalInches * 2.54);
                              setErrors(prev => ({ ...prev, height: (heightCm < 100 || heightCm > 250) ? 'Height must be between 100 and 250 cm (3\'3" - 8\'2")' : '' }));
                            }
                          }}
                          className="w-full px-4 py-3.5 bg-bg-app border border-border-custom rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main text-center"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted">in</span>
                      </div>
                    </div>
                    {touched.height && errors.height && (
                      <span className="text-[10px] text-danger ml-1 font-semibold">{errors.height}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-muted ml-1">Weight (lbs)</label>
                    <input
                      type="number"
                      min="55"
                      max="660"
                      value={weightLbs}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 150;
                        setWeightLbs(val);
                        if (touched.weight) {
                          const weightKg = Math.round((val / 2.20462) * 10) / 10;
                          setErrors(prev => ({ ...prev, weight: (weightKg < 25 || weightKg > 300) ? 'Weight must be between 55 and 660 lbs (25-300 kg)' : '' }));
                        }
                      }}
                      onBlur={() => {
                        setTouched(prev => ({ ...prev, weight: true }));
                        const currentStepErrors = validateStepFields(2);
                        setErrors(prev => ({ ...prev, weight: currentStepErrors.weight || '' }));
                      }}
                      className={`w-full px-4 py-3.5 bg-bg-app border rounded-2xl text-sm font-sans focus:outline-none focus:border-primary transition-all text-text-main ${
                        touched.weight && errors.weight ? 'border-danger/60 focus:border-danger' : 'border-border-custom'
                      }`}
                    />
                    {touched.weight && errors.weight && (
                      <span className="text-[10px] text-danger ml-1 font-semibold">{errors.weight}</span>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-text-main">Goals & Activity</h2>
                <p className="text-xs text-text-muted mt-1">Select your fitness goals and daily activity level</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Fitness Goals (Select one or more)</label>
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {FITNESS_GOALS.map((g) => {
                    const isSelected = selectedGoals.includes(g.title);
                    return (
                      <button
                        key={g.title}
                        type="button"
                        onClick={() => {
                          let updatedGoals = [];
                          if (isSelected) {
                            updatedGoals = selectedGoals.filter(goalItem => goalItem !== g.title);
                          } else {
                            updatedGoals = [...selectedGoals, g.title];
                          }
                          setSelectedGoals(updatedGoals);
                          
                          if (touched.goal || touched.goals) {
                            setErrors(prev => ({ ...prev, goal: updatedGoals.length === 0 ? 'Please select at least one fitness goal' : '' }));
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-white'
                            : (touched.goal && errors.goal ? 'border-danger/60 text-danger' : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main')
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-bold">{g.title}</h4>
                          <p className="text-[10px] opacity-80 mt-0.5 font-sans font-medium">{g.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-accent" />}
                      </button>
                    );
                  })}
                </div>
                {touched.goal && errors.goal && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.goal}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-muted ml-1">Daily Activity Level</label>
                <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto pr-1">
                  {ACTIVITY_LEVELS.map((level) => {
                    const isSelected = activityLevel === level.value;
                    return (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => {
                          setActivityLevel(level.value);
                          setErrors(prev => ({ ...prev, activityLevel: '' }));
                        }}
                        className={`p-3 rounded-2xl border text-left flex justify-between items-center transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/10 text-accent font-bold'
                            : (touched.activityLevel && errors.activityLevel ? 'border-danger/60 text-danger' : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main')
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-bold">{level.value}</h4>
                          <p className="text-[10px] opacity-80 mt-0.5 font-sans font-medium">{level.desc}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-accent" />}
                      </button>
                    );
                  })}
                </div>
                {touched.activityLevel && errors.activityLevel && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.activityLevel}</span>
                )}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-text-main">Experience & Gear</h2>
                <p className="text-xs text-text-muted mt-1">Tell us your background and what you train with</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((exp) => {
                    const isSelected = experience === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => {
                          setExperience(exp);
                          setErrors(prev => ({ ...prev, experience: '' }));
                        }}
                        className={`py-3.5 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary-light'
                            : (touched.experience && errors.experience ? 'border-danger/60 text-danger' : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main')
                        }`}
                      >
                        {exp}
                      </button>
                    );
                  })}
                </div>
                {touched.experience && errors.experience && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.experience}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-muted ml-1">Available Equipment</label>
                <div className="flex flex-wrap gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {equipments.map((eq) => {
                    const selected = equipment.includes(eq.name);
                    return (
                      <button
                        key={eq.name}
                        type="button"
                        onClick={() => handleEquipmentToggle(eq.name)}
                        className={`px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all ${
                          selected
                            ? 'border-accent bg-accent/10 text-accent'
                            : (touched.equipment && errors.equipment ? 'border-danger/60 text-danger' : 'border-border-custom hover:bg-bg-surface-alt text-text-muted hover:text-text-main')
                        }`}
                      >
                        {eq.name}
                      </button>
                    );
                  })}
                </div>
                {touched.equipment && errors.equipment && (
                  <span className="text-[10px] text-danger ml-1 font-semibold">{errors.equipment}</span>
                )}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
              <div>
                <h2 className="font-heading font-extrabold text-2xl text-text-main">Preferences</h2>
                <p className="text-xs text-text-muted mt-1">Set your commitment splits and schedule</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-text-muted">Workout Days (Per Week)</label>
                  <span className="text-xs font-bold text-primary-light">{workoutDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={workoutDays}
                  onChange={(e) => setWorkoutDays(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-bg-surface-alt rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-sans px-1">
                  <span>1 day</span>
                  <span>4 days</span>
                  <span>7 days</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-semibold text-text-muted">Session Duration</label>
                  <span className="text-xs font-bold text-accent">{duration} minutes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={SESSION_DURATION_OPTIONS.length - 1}
                  step="1"
                  value={SESSION_DURATION_OPTIONS.indexOf(duration as any) !== -1 ? SESSION_DURATION_OPTIONS.indexOf(duration as any) : 3}
                  onChange={(e) => {
                    const selectedDur = SESSION_DURATION_OPTIONS[parseInt(e.target.value)];
                    setDuration(selectedDur);
                  }}
                  className="w-full accent-primary h-1.5 bg-bg-surface-alt rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-text-muted font-sans px-1">
                  <span>15 min</span>
                  <span>60 min</span>
                  <span>180 min</span>
                </div>
              </div>

              {/* Overtraining Warning Cards */}
              {overtrainingWarnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 text-warning mt-2 flex flex-col gap-1.5">
                  <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                    ⚠️ Overtraining Warning
                  </h4>
                  {overtrainingWarnings.map((w, index) => (
                    <p key={index} className="text-[10px] font-sans font-semibold leading-relaxed">
                      • {w}
                    </p>
                  ))}
                </div>
              )}
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
              disabled={isCurrentStepInvalid}
              className={`px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${
                isCurrentStepInvalid 
                  ? 'bg-border-custom text-text-muted cursor-not-allowed opacity-50' 
                  : 'gradient-btn'
              }`}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isCurrentStepInvalid}
              className={`px-8 py-3.5 rounded-2xl text-white text-sm font-bold flex items-center gap-2 shadow-glow transition-all ${
                isCurrentStepInvalid 
                  ? 'bg-border-custom text-text-muted cursor-not-allowed opacity-50 shadow-none' 
                  : 'bg-gradient-to-r from-success to-emerald-400 shadow-success/10 hover:brightness-110'
              }`}
            >
              Finish Setup <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
