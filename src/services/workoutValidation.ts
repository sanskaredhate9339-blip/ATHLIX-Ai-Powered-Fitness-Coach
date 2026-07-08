import type { WorkoutDay } from './db';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface WorkoutPlanValidation {
  riskLevel: RiskLevel;
  recoveryScore: number;
  weeklyMuscleBalance: Record<string, number>;
  fatigueScore: number;
  recommendations: string[];
  suggestedImprovements: string[];
}

const MUSCLE_KEYWORDS: Record<string, string[]> = {
  chest: ['chest', 'push', 'pec'],
  back: ['back', 'pull', 'lat'],
  legs: ['leg', 'quad', 'hamstring', 'glute', 'calf'],
  shoulders: ['shoulder', 'delt'],
  arms: ['arm', 'bicep', 'tricep'],
  core: ['core', 'ab'],
};

function extractMuscleGroups(day: WorkoutDay): string[] {
  const text = day.muscle_group.toLowerCase();
  if (text.includes('rest')) return ['rest'];
  const groups: string[] = [];
  for (const [muscle, keywords] of Object.entries(MUSCLE_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      groups.push(muscle);
    }
  }
  return groups.length > 0 ? groups : ['general'];
}

export function validateWorkoutPlan(
  days: WorkoutDay[],
  daysPerWeek: number,
  durationMinutes: number
): WorkoutPlanValidation {
  const recommendations: string[] = [];
  const suggestedImprovements: string[] = [];
  const weeklyMuscleBalance: Record<string, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0,
  };

  const workoutDays = days.filter((d) => !d.muscle_group.toLowerCase().includes('rest'));
  const restDays = days.length - workoutDays.length;

  workoutDays.forEach((day) => {
    const muscles = extractMuscleGroups(day);
    muscles.forEach((m) => {
      if (weeklyMuscleBalance[m] !== undefined) {
        weeklyMuscleBalance[m] += 1;
      }
    });
  });

  // Check same muscle trained too frequently
  for (const [muscle, count] of Object.entries(weeklyMuscleBalance)) {
    if (count >= 4) {
      recommendations.push(
        `Your workout plan may increase injury risk because recovery time is insufficient for ${muscle}. Athlix recommends waiting 48–72 hours before training the same muscle group again.`
      );
      suggestedImprovements.push(`Reduce ${muscle} training to 2–3 sessions per week with adequate rest.`);
    } else if (count === 3) {
      recommendations.push(
        `Training ${muscle} ${count} times per week is aggressive. Monitor soreness and sleep quality closely.`
      );
    }
  }

  if (weeklyMuscleBalance.legs >= 6) {
    recommendations.push(
      'Training legs six days per week creates excessive fatigue and limits recovery. Consider 2–3 leg sessions with progressive overload instead.'
    );
    suggestedImprovements.push('Schedule at least 4 rest or upper-body-only days between leg sessions.');
  }

  if (weeklyMuscleBalance.chest >= 5) {
    recommendations.push(
      'Training chest every day prevents muscle repair and can lead to overuse injuries in shoulders and elbows.'
    );
    suggestedImprovements.push('Rotate push movements across 2–3 days with pull exercises for balance.');
  }

  if (durationMinutes > 120) {
    recommendations.push(
      `${durationMinutes}-minute sessions may cause diminishing returns and elevated cortisol. Most athletes benefit from 45–90 minute focused sessions.`
    );
    suggestedImprovements.push('Split long sessions into AM/PM blocks or reduce exercise count per session.');
  }

  if (durationMinutes >= 240) {
    recommendations.push('4-hour workouts are unsustainable and increase injury risk significantly.');
  }

  if (restDays === 0 && daysPerWeek >= 6) {
    recommendations.push(
      'No rest days in your plan limits recovery and adaptation. Even elite athletes schedule at least one rest day per week.'
    );
    suggestedImprovements.push('Add at least 1 rest or active recovery day (mobility, light walk).');
  }

  const totalSets = workoutDays.reduce(
    (sum, day) => sum + day.exercises.reduce((s, ex) => s + ex.sets, 0),
    0
  );
  if (totalSets > 120) {
    recommendations.push(
      'Weekly volume exceeds recommended thresholds for most lifters. High volume without deload weeks increases overtraining risk.'
    );
    suggestedImprovements.push('Reduce sets by 15–20% or add a deload week every 4–6 weeks.');
  }

  // Recovery score: 100 = optimal
  let recoveryScore = 100;
  recoveryScore -= Math.max(0, daysPerWeek - 5) * 8;
  recoveryScore -= Math.max(0, restDays === 0 ? 20 : 0);
  Object.values(weeklyMuscleBalance).forEach((count) => {
    if (count >= 4) recoveryScore -= 15;
    else if (count >= 3) recoveryScore -= 8;
  });
  recoveryScore = Math.max(0, Math.min(100, recoveryScore));

  // Fatigue score: higher = more fatiguing
  let fatigueScore = Math.round((daysPerWeek / 7) * 40 + (durationMinutes / 180) * 30 + (totalSets / 100) * 30);
  fatigueScore = Math.min(100, fatigueScore);

  let riskLevel: RiskLevel = 'Low';
  if (recommendations.length >= 3 || recoveryScore < 40) riskLevel = 'Critical';
  else if (recommendations.length >= 2 || recoveryScore < 55) riskLevel = 'High';
  else if (recommendations.length >= 1 || recoveryScore < 70) riskLevel = 'Moderate';

  if (recommendations.length === 0) {
    recommendations.push('Your workout plan looks well-balanced. Keep monitoring recovery and adjust volume as needed.');
  }

  return {
    riskLevel,
    recoveryScore,
    weeklyMuscleBalance,
    fatigueScore,
    recommendations,
    suggestedImprovements,
  };
}
