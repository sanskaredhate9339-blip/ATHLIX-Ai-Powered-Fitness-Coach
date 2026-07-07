export interface Exercise {
  id: string;
  name: string;
  muscle_group: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';
  equipment: 'Gym' | 'Dumbbells' | 'Barbell' | 'Resistance Bands' | 'Bodyweight';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  mistakes: string[];
  benefits: string[];
  alternatives: string[];
  demo_url: string;
}

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'squat',
    name: 'Barbell Back Squat',
    muscle_group: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Rest the barbell across your upper back/traps, not your neck. Grip the bar firmly.',
      'Set your feet shoulder-width apart, toes pointing slightly outward (about 15-30 degrees).',
      'Brace your core, inhale, and initiate the movement by breaking at your hips, sitting back and down.',
      'Lower your hips until your thighs are at least parallel to the floor, keeping your knees tracking in line with your feet.',
      'Drive through your feet, keeping your chest up and back flat, to return to the starting position. Exhale as you ascend.'
    ],
    mistakes: [
      'Knees caving inwards (valgus collapse). Keep knees pushed outward.',
      'Heels lifting off the ground. Push weight through midfoot/heel.',
      'Rounding the lower back (butt wink) at the bottom. Maintain a neutral spine.',
      'Squatting too shallow. Try to reach parallel depth.'
    ],
    benefits: [
      'Builds massive lower body strength (quads, hamstrings, glutes).',
      'Improves core stability and spinal load capacity.',
      'Enhances athletic performance and daily functional mobility.'
    ],
    alternatives: ['Goblet Squat', 'Leg Press', 'Bulgarian Split Squat', 'Bodyweight Squat'],
    demo_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'pushup',
    name: 'Standard Push-Up',
    muscle_group: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Place your hands slightly wider than shoulder-width apart on the floor, fingers pointing forward or slightly out.',
      'Extend your legs straight back, balancing on the balls of your feet. Maintain a straight line from head to heels.',
      'Engage your glutes and core to keep your lower back from sagging.',
      'Inhale as you lower your chest to the floor by bending your elbows. Keep elbows at a 45-degree angle to your torso.',
      'Push through your palms to return to the starting position, exhaling at the top.'
    ],
    mistakes: [
      'Flaring elbows out to 90 degrees. This stresses the shoulders. Keep them tucked to 45 degrees.',
      'Sagging hips or lower back. Keep core fully braced.',
      'Incomplete range of motion. Touch chest to the floor and lock out elbows.'
    ],
    benefits: [
      'Develops chest, anterior deltoids, and triceps.',
      'Requires zero equipment, installable/executable anywhere.',
      'Increases core and shoulder girdle stability.'
    ],
    alternatives: ['Incline Push-Up', 'Decline Push-Up', 'Dumbbell Bench Press', 'Knee Push-Up'],
    demo_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'deadlift',
    name: 'Barbell Conventional Deadlift',
    muscle_group: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart, with the barbell positioned over the middle of your feet.',
      'Bend at your hips and knees to grip the bar with a shoulder-width grip, keeping your arms straight.',
      'Flatten your back, lower your hips slightly, pull your shoulder blades down, and pull the "slack" out of the bar.',
      'Drive through your legs to lift the bar, keeping it close to your shins and thighs as you stand up tall.',
      'Lock out your hips and knees at the top (avoid hyperextending your lower back). Lower the bar under control by pushing your hips back.'
    ],
    mistakes: [
      'Rounding the lower back (posterior tilt) during the lift. This is highly risky for spinal discs.',
      'Keeping the bar too far away from the body. Keep it touching your legs.',
      'Squatting the deadlift (hips too low at start). Maintain a hip hinge setup.'
    ],
    benefits: [
      'Trains the entire posterior chain (hamstrings, glutes, lower back, traps).',
      'Improves grip strength and overall pulling power.',
      'Boosts core integrity and athletic output.'
    ],
    alternatives: ['Sumo Deadlift', 'Romanian Deadlift (RDL)', 'Trap Bar Deadlift', 'Kettlebell Swing'],
    demo_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'benchpress',
    name: 'Barbell Bench Press',
    muscle_group: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on the bench, feet pressed firmly into the floor. Eyes should be directly under the barbell.',
      'Grip the bar slightly wider than shoulder-width. Pull your shoulder blades down and pinch them together into the bench.',
      'Unrack the barbell and hold it over your collarbones with locked-out elbows.',
      'Inhale and lower the bar slowly to your mid-chest (touching the sternum), keeping elbows tucked at roughly 45-75 degrees.',
      'Drive the bar back up in a slight diagonal arc, exhaling as you press.'
    ],
    mistakes: [
      'Bouncing the bar off your chest. Lower under control and touch lightly.',
      'Flaring elbows out to 90 degrees, stressing rotator cuffs.',
      'Lifting feet off the ground. Feet drive helps stabilize the weight.'
    ],
    benefits: [
      'Golden standard for chest thickness and push power.',
      'Improves horizontal pressing strength.',
      'Engages triceps and anterior shoulders heavily.'
    ],
    alternatives: ['Dumbbell Bench Press', 'Push-Up', 'Chest Fly', 'Incline Barbell Press'],
    demo_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'shoulderpress',
    name: 'Dumbbell Standing Shoulder Press',
    muscle_group: 'Shoulders',
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Stand with feet shoulder-width apart, holding dumbbells at shoulder level with an overhand grip.',
      'Brace your core, squeeze your glutes, and press the dumbbells straight overhead until your elbows lock.',
      'Keep your wrists stacked directly over your elbows throughout the movement.',
      'Lower the dumbbells back down to shoulder level slowly and with control, inhaling as you do.'
    ],
    mistakes: [
      'Excessively arching the lower back. Keep glutes and abs squeezed tight.',
      'Clashing dumbbells at the top. Keep weights vertical and parallel.',
      'Half reps. Lower weights all the way to collarbones.'
    ],
    benefits: [
      'Builds strong, rounded deltoids (front and side caps).',
      'Trains overhead stability and core control.',
      'Improves unilateral shoulder coordination and balance.'
    ],
    alternatives: ['Military Press', 'Arnold Press', 'Pike Push-Up', 'Machine Shoulder Press'],
    demo_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'lunge',
    name: 'Bodyweight Forward Lunge',
    muscle_group: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand tall with feet hip-width apart, chest high, and hands on your hips or by your side.',
      'Take a large step forward with your right foot, planting your heel first.',
      'Lower your hips until your rear knee is an inch off the floor, and your front thigh is parallel. Both knees should form 90-degree angles.',
      'Ensure your front knee does not slide past your toes.',
      'Push off your front foot and step back to the starting position. Alternate legs.'
    ],
    mistakes: [
      'Front knee drifting far forward beyond toes. Step further forward.',
      'Torso leaning excessively forward. Keep spine tall and chest up.',
      'Losing balance. Set feet hip-width apart (like walking on train tracks, not a tightrope).'
    ],
    benefits: [
      'Improves unilateral leg strength and balance.',
      'Targets glutes, quads, hamstrings, and calves.',
      'Corrects side-to-side muscle imbalances.'
    ],
    alternatives: ['Reverse Lunge', 'Walking Lunge', 'Bulgarian Split Squat', 'Step-Up'],
    demo_url: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'bicepcurl',
    name: 'Dumbbell Alternate Bicep Curl',
    muscle_group: 'Arms',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand straight with a dumbbell in each hand, arms hanging at your sides, palms facing forward.',
      'Keep your elbows tucked close to your torso.',
      'Curl the right weight up towards your shoulder by contracting your bicep. Exhale and avoid moving your elbow forward.',
      'At the top, squeeze the bicep. Inhale and slowly lower the dumbbell back to the starting position.',
      'Repeat on the left arm. Continue alternating.'
    ],
    mistakes: [
      'Swinging hips or upper body (using momentum). Keep core locked and torso still.',
      'Elbows drifting forward or outwards. Keep elbows pinned to your rib cage.',
      'Dropping the weight too fast. Control the eccentric phase.'
    ],
    benefits: [
      'Isolates and builds size in the biceps brachii.',
      'Improves forearm and grip strength.',
      'Enhances elbow flexion health.'
    ],
    alternatives: ['Barbell Curl', 'Hammer Curl', 'Cable Curl', 'Chin-Up'],
    demo_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'pullup',
    name: 'Overhand Pull-Up',
    muscle_group: 'Back',
    equipment: 'Gym',
    difficulty: 'Advanced',
    instructions: [
      'Grasp the pull-up bar with an overhand grip (palms facing away), hands slightly wider than shoulder-width.',
      'Hang with arms fully extended (dead hang), shoulders active, feet crossed behind you.',
      'Inhale, pull your shoulder blades down and together, and pull your body up by driving your elbows down toward your ribs.',
      'Pull until your chin clears the bar. Squeeze your lats at the top.',
      'Lower your body with control until your arms are straight again. Exhale at the bottom.'
    ],
    mistakes: [
      'Using momentum (kipping) when trying to build strict strength.',
      'Incomplete range of motion. Not going all the way down, or chin not clearing the bar.',
      'Shoulders rounding forward at the top. Keep chest proud and shoulder blades retracted.'
    ],
    benefits: [
      'Gold standard for building upper body pull strength and back width.',
      'Works the latissimus dorsi, rhomboids, traps, and biceps.',
      'Improves posture and shoulder health.'
    ],
    alternatives: ['Chin-Up', 'Lat Pulldown', 'Assisted Pull-Up', 'Inverted Row'],
    demo_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=400'
  }
];
