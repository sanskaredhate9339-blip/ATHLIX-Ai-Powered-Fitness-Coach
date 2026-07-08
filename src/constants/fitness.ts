export const FITNESS_GOALS = [
  { title: 'Fat Loss', desc: 'Burn fat and get lean' },
  { title: 'Muscle Gain', desc: 'Build size and muscle density' },
  { title: 'Strength', desc: 'Increase maximal lifting power' },
  { title: 'Athletic Performance', desc: 'Speed, agility, and sport-specific fitness' },
  { title: 'Endurance', desc: 'Enhance conditioning and stamina' },
  { title: 'Mobility', desc: 'Flexibility, joint health, and movement quality' },
  { title: 'General Fitness', desc: 'Maintain health and energy levels' },
] as const;

export type FitnessGoal = (typeof FITNESS_GOALS)[number]['title'];

export const ACTIVITY_LEVELS = [
  { value: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'Lightly Active', desc: 'Light exercise 1–3 days/week' },
  { value: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week' },
  { value: 'Very Active', desc: 'Hard exercise 6–7 days/week' },
  { value: 'Extremely Active', desc: 'Very hard exercise or physical job' },
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]['value'];

export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const EQUIPMENT_OPTIONS = [
  { name: 'Gym', desc: 'Full commercial gym machines' },
  { name: 'Barbell', desc: 'Olympic plates and bars' },
  { name: 'Dumbbells', desc: 'Adjustable or rack pairs' },
  { name: 'Resistance Bands', desc: 'Elastic loops and cables' },
  { name: 'Bodyweight Only', desc: 'No equipment needed' },
] as const;

export const WORKOUT_DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;

export const SESSION_DURATION_OPTIONS = [15, 20, 30, 45, 60, 75, 90, 105, 120, 150, 180] as const;

export const ATHLIX_RECOMMENDED_SPLITS = [
  'Full Body',
  'Upper Lower',
  'Push Pull Legs',
  'Bro Split',
  'Arnold Split',
  'Powerbuilding',
  'Strength Split',
  'Functional Training',
  'Hybrid Athlete',
  'Athletic Performance',
  'CrossFit Style',
  'Bodyweight Only',
  'Home Workout',
  'HIIT Focus',
  'Mobility Focus',
  'Custom Split',
] as const;

export type AthlixSplit = (typeof ATHLIX_RECOMMENDED_SPLITS)[number];

export const CUSTOM_MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Cardio',
  'Mobility',
  'Rest',
] as const;

export type CustomMuscleGroup = (typeof CUSTOM_MUSCLE_GROUPS)[number];

export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary'] as const;
