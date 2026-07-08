import type { ActivityLevel } from '../constants/fitness';

export type OnboardingFieldErrors = Record<string, string>;

export interface Step1Data {
  name: string;
  age: number | undefined;
  gender: string;
}

export interface Step2Data {
  unitSystem: 'metric' | 'imperial';
  height: number | undefined;
  weight: number | undefined;
  heightFt: number;
  heightIn: number;
  weightLbs: number;
}

export interface Step3Data {
  goal: string;
  activityLevel: ActivityLevel | '';
}

export interface Step4Data {
  experience: string;
  equipment: string[];
}

export interface Step5Data {
  workoutDays: number;
  duration: number;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(value);
}

export function getEffectiveHeightCm(data: Step2Data): number | undefined {
  if (data.unitSystem === 'metric') {
    return isValidNumber(data.height) ? data.height : undefined;
  }
  const totalInches = data.heightFt * 12 + data.heightIn;
  if (totalInches <= 0) return undefined;
  return Math.round(totalInches * 2.54);
}

export function getEffectiveWeightKg(data: Step2Data): number | undefined {
  if (data.unitSystem === 'metric') {
    return isValidNumber(data.weight) ? data.weight : undefined;
  }
  if (!isValidNumber(data.weightLbs) || data.weightLbs <= 0) return undefined;
  return Math.round((data.weightLbs / 2.20462) * 10) / 10;
}

export function validateStep1(data: Step1Data): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Please enter your name';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!isValidNumber(data.age)) {
    errors.age = 'Please enter your age';
  } else if (data.age < 13 || data.age > 100) {
    errors.age = 'Age must be between 13 and 100';
  } else if (!Number.isInteger(data.age)) {
    errors.age = 'Age must be a whole number';
  }
  if (!data.gender) {
    errors.gender = 'Please select your gender';
  }
  return errors;
}

export function validateStep2(data: Step2Data): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  const heightCm = getEffectiveHeightCm(data);
  const weightKg = getEffectiveWeightKg(data);

  if (data.unitSystem === 'metric') {
    if (!isValidNumber(data.height)) {
      errors.height = 'Please enter your height';
    } else if (data.height < 100 || data.height > 250) {
      errors.height = 'Height must be between 100 and 250 cm';
    }
    if (!isValidNumber(data.weight)) {
      errors.weight = 'Please enter your weight';
    } else if (data.weight < 25 || data.weight > 300) {
      errors.weight = 'Weight must be between 25 and 300 kg';
    }
  } else {
    if (!isValidNumber(data.heightFt) || data.heightFt < 3 || data.heightFt > 8) {
      errors.height = 'Please enter a valid height in feet (3–8 ft)';
    } else if (!isValidNumber(data.heightIn) || data.heightIn < 0 || data.heightIn > 11) {
      errors.height = 'Inches must be between 0 and 11';
    } else if (!heightCm || heightCm < 100 || heightCm > 250) {
      errors.height = 'Height must be between 100 and 250 cm';
    }
    if (!isValidNumber(data.weightLbs) || data.weightLbs < 55 || data.weightLbs > 660) {
      errors.weight = 'Weight must be between 55 and 660 lbs (25–300 kg)';
    } else if (!weightKg || weightKg < 25 || weightKg > 300) {
      errors.weight = 'Weight must be between 25 and 300 kg';
    }
  }

  return errors;
}

export function validateStep3(data: Step3Data): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  if (!data.goal) {
    errors.goal = 'Please select your fitness goal';
  }
  if (!data.activityLevel) {
    errors.activityLevel = 'Please select your activity level';
  }
  return errors;
}

export function validateStep4(data: Step4Data): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  if (!data.experience) {
    errors.experience = 'Please select your experience level';
  }
  if (data.equipment.length === 0) {
    errors.equipment = 'Please select at least one equipment option';
  }
  return errors;
}

export function validateStep5(data: Step5Data): OnboardingFieldErrors {
  const errors: OnboardingFieldErrors = {};
  if (data.workoutDays < 1 || data.workoutDays > 7) {
    errors.workoutDays = 'Workout days must be between 1 and 7';
  }
  if (data.duration < 15 || data.duration > 180) {
    errors.duration = 'Session duration must be between 15 and 180 minutes';
  }
  return errors;
}

export function validateStep(step: number, data: {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
}): OnboardingFieldErrors {
  switch (step) {
    case 1: return validateStep1(data.step1);
    case 2: return validateStep2(data.step2);
    case 3: return validateStep3(data.step3);
    case 4: return validateStep4(data.step4);
    case 5: return validateStep5(data.step5);
    default: return {};
  }
}

export function isStepValid(step: number, data: Parameters<typeof validateStep>[1]): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}

export function getFirstError(errors: OnboardingFieldErrors): string | null {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
}
