import type { UserProfile, FoodLog, WorkoutPlan, WorkoutDay, WorkoutExercise, ChatMessage } from './db'
import { EXERCISE_LIBRARY } from './exerciseLibrary'
import { NUTRITION_DATABASE, MEAL_COMBINATIONS } from './nutritionDatabase'

// Helper to delay execution (simulates network latency)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ai = {
  /**
   * Generates a workout plan based on the user profile inputs
   */
  async generateWorkoutPlan(
    profile: {
      goal: string;
      split_type: string;
      days_per_week: number;
      duration: number;
      equipment: string[];
      experience: string;
      medical_conditions?: string;
    }
  ): Promise<WorkoutPlan> {
    await delay(2500); // Realistic AI generation load time

    const { goal, split_type, days_per_week, duration, equipment, experience } = profile;
    const planId = 'plan_' + Math.random().toString(36).substr(2, 9);
    
    // Choose appropriate exercises from the library or create matching ones
    const getExercisesByMuscle = (muscle: string, count: number): WorkoutExercise[] => {
      const matches = EXERCISE_LIBRARY.filter(
        ex => ex.muscle_group.toLowerCase() === muscle.toLowerCase()
      );
      
      // If we have library exercises, use them, otherwise generate custom names
      const exercises: WorkoutExercise[] = [];
      const usedNames = new Set<string>();

      // Load matching library exercises first
      matches.forEach(m => {
        if (exercises.length < count) {
          exercises.push({
            name: m.name,
            sets: experience === 'Advanced' ? 4 : 3,
            reps: goal === 'Strength Training' ? 5 : goal === 'Fat Loss' ? 15 : 10,
            rest: goal === 'Strength Training' ? 120 : 60,
            tips: m.instructions[0] || 'Maintain controlled form.',
            difficulty: m.difficulty
          });
          usedNames.add(m.name);
        }
      });

      // Fill in remaining exercises with generic ones matching muscle group
      const fallbacks: Record<string, string[]> = {
        'chest': ['Incline Dumbbell Bench Press', 'Cable Chest Flys', 'Decline Push-Ups', 'Dumbbell Pull-Overs'],
        'back': ['Lat Pulldowns', 'Bent Over Barbell Rows', 'Dumbbell Rows', 'Hyperextensions'],
        'legs': ['Romanian Deadlifts', 'Leg Extensions', 'Hamstring Curls', 'Standing Calf Raises', 'Leg Press'],
        'shoulders': ['Lateral Raises', 'Rear Delt Flys', 'Arnold Press', 'Barbell Shrugs'],
        'arms': ['Tricep Rope Pushdowns', 'Barbell Bicep Curls', 'Hammer Curls', 'Skull Crushers'],
        'core': ['Hanging Knee Raises', 'Ab Wheel Rollouts', 'Russian Twists', 'Cable Crunches']
      };

      const fallbackList = fallbacks[muscle.toLowerCase()] || ['Plank Hold', 'Stretching'];
      let idx = 0;
      while (exercises.length < count && idx < fallbackList.length) {
        const name = fallbackList[idx];
        if (!usedNames.has(name)) {
          exercises.push({
            name,
            sets: experience === 'Advanced' ? 4 : 3,
            reps: goal === 'Strength Training' ? 6 : 12,
            rest: 60,
            tips: `Keep core engaged. Move through full range of motion.`,
            difficulty: experience
          });
          usedNames.add(name);
        }
        idx++;
      }

      return exercises;
    };

    const days: WorkoutDay[] = [];
    let dayCount = 0;

    let splitSequence: Array<{ name: string; muscles: string[] }> = [];
    const normSplit = split_type.toLowerCase().replace('/', ' ').trim();

    if (normSplit.includes('push pull legs')) {
      splitSequence = [
        { name: 'Push (Chest, Shoulders, Triceps)', muscles: ['chest', 'shoulders', 'arms'] },
        { name: 'Pull (Back, Biceps)', muscles: ['back', 'arms'] },
        { name: 'Legs & Core', muscles: ['legs', 'core'] }
      ];
    } else if (normSplit.includes('upper lower')) {
      splitSequence = [
        { name: 'Upper Body Focus', muscles: ['chest', 'back', 'shoulders', 'arms'] },
        { name: 'Lower Body & Core', muscles: ['legs', 'core'] }
      ];
    } else if (normSplit.includes('bro split')) {
      splitSequence = [
        { name: 'Chest Day', muscles: ['chest'] },
        { name: 'Back Day', muscles: ['back'] },
        { name: 'Shoulders Day', muscles: ['shoulders'] },
        { name: 'Legs Day', muscles: ['legs'] },
        { name: 'Arms & Core Day', muscles: ['arms', 'core'] }
      ];
    } else if (normSplit.includes('arnold split')) {
      splitSequence = [
        { name: 'Chest & Back Day', muscles: ['chest', 'back'] },
        { name: 'Shoulders & Arms Day', muscles: ['shoulders', 'arms'] },
        { name: 'Legs & Core Day', muscles: ['legs', 'core'] }
      ];
    } else if (normSplit.includes('powerbuilding') || normSplit.includes('strength split')) {
      splitSequence = [
        { name: 'Squat Compound Day', muscles: ['legs', 'core'] },
        { name: 'Bench Compound Day', muscles: ['chest', 'arms'] },
        { name: 'Deadlift Compound Day', muscles: ['back', 'legs'] },
        { name: 'Overhead Compound Day', muscles: ['shoulders', 'core'] }
      ];
    } else if (normSplit.includes('functional') || normSplit.includes('hybrid') || normSplit.includes('crossfit')) {
      splitSequence = [
        { name: 'Functional Conditioning', muscles: ['legs', 'core', 'chest'] },
        { name: 'Strength Endurance Focus', muscles: ['back', 'shoulders', 'arms'] },
        { name: 'Full Body Work Capacity', muscles: ['chest', 'back', 'legs'] }
      ];
    } else if (normSplit.includes('bodyweight') || normSplit.includes('home workout')) {
      splitSequence = [
        { name: 'Home Push Focus', muscles: ['chest', 'shoulders', 'core'] },
        { name: 'Home Pull Focus', muscles: ['back', 'core'] },
        { name: 'Home Legs Focus', muscles: ['legs', 'core'] }
      ];
    } else if (normSplit.includes('hiit')) {
      splitSequence = [
        { name: 'HIIT Aerobic Capacity', muscles: ['legs', 'core'] },
        { name: 'HIIT Power Intervals', muscles: ['chest', 'back', 'shoulders'] },
        { name: 'HIIT Core & Conditioning', muscles: ['core', 'legs'] }
      ];
    } else if (normSplit.includes('mobility')) {
      splitSequence = [
        { name: 'Dynamic Flexibility Flow', muscles: ['legs', 'core'] },
        { name: 'Joint Range of Motion', muscles: ['shoulders', 'back'] },
        { name: 'Spinal Decompression & Core', muscles: ['core', 'back'] }
      ];
    } else { // Custom Split or Full Body fallback
      splitSequence = [
        { name: 'Full Body Routine', muscles: ['chest', 'back', 'legs', 'shoulders', 'core'] }
      ];
    }

    for (let i = 0; i < 7; i++) {
      let shouldWork = false;
      if (days_per_week === 1) shouldWork = i === 0;
      else if (days_per_week === 2) shouldWork = i === 0 || i === 3;
      else if (days_per_week === 3) shouldWork = i === 0 || i === 2 || i === 4;
      else if (days_per_week === 4) shouldWork = i === 0 || i === 1 || i === 3 || i === 4;
      else if (days_per_week === 5) shouldWork = i !== 2 && i !== 6;
      else if (days_per_week === 6) shouldWork = i !== 6;
      else if (days_per_week === 7) shouldWork = true;

      if (shouldWork && dayCount < days_per_week) {
        const splitItem = splitSequence[dayCount % splitSequence.length];
        const exercises: WorkoutExercise[] = [];
        splitItem.muscles.forEach(m => {
          exercises.push(...getExercisesByMuscle(m, 2));
        });

        days.push({
          id: `day_${i}`,
          dayIndex: i,
          muscle_group: splitItem.name,
          estimated_calories: Math.round(duration * 7.5),
          difficulty: experience,
          exercises: exercises.slice(0, 5) // limit to 5 exercises
        });
        dayCount++;
      }
    }

    return {
      id: planId,
      name: `Athlix Custom ${split_type} (${goal})`,
      goal,
      split_type,
      days_per_week,
      duration,
      equipment,
      experience,
      days,
      created_at: new Date().toISOString()
    };
  },

  /**
   * Analyzes food image and dynamically detects food items with nutrition estimation
   */
  async analyzeFoodImage(_base64Image: string | File): Promise<Omit<FoodLog, 'id' | 'date' | 'created_at' | 'meal_type'>> {
    await delay(2000); // Simulate AI Image model processing

    // Simulate dynamic food detection by randomly selecting a meal combination
    // In production, this would use actual AI vision to detect foods
    const mealCombination = MEAL_COMBINATIONS[Math.floor(Math.random() * MEAL_COMBINATIONS.length)];
    
    // Add some randomness to portion sizes to simulate realistic variation
    const detectedFoods = mealCombination.foods.map((foodName, index) => {
      const basePortion = mealCombination.typical_portions[index];
      const variation = 0.8 + Math.random() * 0.4; // 80% to 120% variation
      const portion = Math.round(basePortion * variation);
      
      const nutritionData = NUTRITION_DATABASE.find(n => n.name === foodName);
      if (!nutritionData) {
        throw new Error(`Nutrition data not found for: ${foodName}`);
      }
      
      // Calculate nutrition based on portion size
      const multiplier = portion / 100;
      const calories = Math.round(nutritionData.calories_per_100g * multiplier);
      const protein = Math.round(nutritionData.protein_per_100g * multiplier * 10) / 10;
      const carbs = Math.round(nutritionData.carbs_per_100g * multiplier * 10) / 10;
      const fat = Math.round(nutritionData.fat_per_100g * multiplier * 10) / 10;
      const fiber = Math.round(nutritionData.fiber_per_100g * multiplier * 10) / 10;
      const sugar = Math.round(nutritionData.sugar_per_100g * multiplier * 10) / 10;
      const sodium = Math.round(nutritionData.sodium_per_100g * multiplier);
      
      return {
        name: foodName,
        portion_g: portion,
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sugar,
        sodium
      };
    });
    
    // Calculate totals
    const totalCalories = detectedFoods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = Math.round(detectedFoods.reduce((sum, f) => sum + f.protein, 0) * 10) / 10;
    const totalCarbs = Math.round(detectedFoods.reduce((sum, f) => sum + f.carbs, 0) * 10) / 10;
    const totalFat = Math.round(detectedFoods.reduce((sum, f) => sum + f.fat, 0) * 10) / 10;
    
    // Calculate healthy score based on nutritional balance
    const proteinRatio = totalProtein / (totalCalories / 4);
    const fatRatio = totalFat / (totalCalories / 9);
    let healthyScore = 7;
    
    if (proteinRatio >= 0.2 && proteinRatio <= 0.35 && fatRatio >= 0.2 && fatRatio <= 0.35) {
      healthyScore = 9;
    } else if (proteinRatio >= 0.15 && fatRatio <= 0.4) {
      healthyScore = 8;
    } else if (proteinRatio >= 0.1) {
      healthyScore = 7;
    } else {
      healthyScore = 6;
    }
    
    // Generate food name from detected items
    const foodName = detectedFoods.map(f => f.name).join(', ');
    const totalWeight = detectedFoods.reduce((sum, f) => sum + f.portion_g, 0);
    
    // Generate suggestions based on detected foods
    const suggestions = ai.generateSuggestions(detectedFoods, totalProtein, totalFat);
    
    return {
      food_name: foodName,
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
      fiber: Math.round(detectedFoods.reduce((sum, f) => sum + (f.fiber || 0), 0) * 10) / 10,
      sugar: Math.round(detectedFoods.reduce((sum, f) => sum + (f.sugar || 0), 0) * 10) / 10,
      sodium: detectedFoods.reduce((sum, f) => sum + (f.sodium || 0), 0),
      healthy_score: healthyScore,
      serving_size: `${totalWeight}g total`,
      suggestions,
      detected_foods: detectedFoods
    };
  },
  
  /**
   * Generates nutrition suggestions based on detected foods
   */
  generateSuggestions(
    detectedFoods: Array<{
      name: string;
      portion_g: number;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>,
    totalProtein: number,
    totalFat: number
  ): string {
    const suggestions: string[] = [];
    
    // Check protein
    if (totalProtein < 20) {
      suggestions.push('Consider adding a protein source like chicken, fish, eggs, or legumes to meet your daily protein needs.');
    } else if (totalProtein >= 30) {
      suggestions.push('Excellent protein content! This meal will support muscle recovery and growth.');
    }
    
    // Check vegetables
    const hasVegetables = detectedFoods.some(f => 
      f.name.includes('Broccoli') || f.name.includes('Spinach') || 
      f.name.includes('Salad') || f.name.includes('Tomatoes') ||
      f.name.includes('Carrots') || f.name.includes('Cauliflower')
    );
    
    if (!hasVegetables) {
      suggestions.push('Add vegetables like broccoli, spinach, or salad for essential vitamins and fiber.');
    }
    
    // Check healthy fats
    const hasHealthyFats = detectedFoods.some(f =>
      f.name.includes('Salmon') || f.name.includes('Avocado') ||
      f.name.includes('Nuts') || f.name.includes('Olive Oil')
    );
    
    if (!hasHealthyFats && totalFat < 10) {
      suggestions.push('Consider adding healthy fats like avocado, nuts, or olive oil for better nutrient absorption.');
    }
    
    // Check whole grains
    const hasWholeGrains = detectedFoods.some(f =>
      f.name.includes('Brown Rice') || f.name.includes('Quinoa') ||
      f.name.includes('Oatmeal') || f.name.includes('Whole Wheat')
    );
    
    if (detectedFoods.some(f => f.name.includes('White Rice')) && !hasWholeGrains) {
      suggestions.push('For better nutrition, consider substituting white rice with brown rice or quinoa for more fiber.');
    }
    
    // General suggestion
    if (suggestions.length === 0) {
      suggestions.push('Well-balanced meal! Keep up the good nutrition habits.');
    }
    
    return suggestions.join(' ');
  },

  /**
   * Simulates streaming chatbot message response
   */
  chatStream(
    message: string,
    _history: ChatMessage[],
    profile: UserProfile,
    onToken: (token: string) => void
  ): Promise<string> {
    return new Promise(async (resolve) => {
      await delay(1000); // Initial delay to show typing indicator

      const lowerMsg = message.toLowerCase();
      let responseText = '';

      // Conversational responses built based on user metrics and keywords
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg.includes('hey')) {
        responseText = `Hi ${profile.name}! 👋 I am your Athlix Coach.\n\nLooking at your profile, your goal is **${profile.goal}** at a current weight of **${profile.weight} kg**. How can I help you today?
- Ask me for a **meal recommendation** or recipes.
- Ask about **form tips** for squats or deadlifts.
- Ask me to write a **short workout circuit** right here.`;
      } else if (lowerMsg.includes('protein') || lowerMsg.includes('eat') || lowerMsg.includes('nutrition') || lowerMsg.includes('diet')) {
        // Validate that weight is defined before calculating protein target
        const targetProtein = profile.weight ? Math.round(profile.weight * 2) : null;
        responseText = `For your goal of **${profile.goal}**, hitting your macronutrients is key.\n\n### Recommended Protein Target:\n${targetProtein ? `- **${targetProtein}g of protein daily** (calculated at ~2g per kg of body weight).` : '- Complete your profile with your weight to get a personalized protein target.'}\n\n### Top High-Protein Sources:\n1. **Animal-based:** Chicken Breast (31g/100g), Wild Salmon (25g/100g), Egg Whites, Lean Beef.\n2. **Plant-based:** Tempeh (20g/100g), Lentils (9g/100g), Greek Yogurt, Whey/Plant Protein Isolate.\n\nDo you want me to suggest a full day meal plan?`;
      } else if (lowerMsg.includes('workout') || lowerMsg.includes('plan') || lowerMsg.includes('exercise') || lowerMsg.includes('schedule')) {
        responseText = `Since your experience level is **${profile.experience_level}** using **${profile.available_equipment.join(', ')}**, we want to ensure you get structured workouts.\n\nI recommend utilizing our **Workout Planner** tab to generate a full weekly plan, but here is a quick **15-minute home burner** you can do right now:\n\n- **Jump Squats:** 3 sets × 15 reps (Rest 45s)\n- **Standard Push-Ups:** 3 sets × Max reps (Rest 45s)\n- **Walking Lunges:** 3 sets × 12 reps per leg (Rest 45s)\n- **Plank Hold:** 3 sets × 45s (Rest 30s)\n\nMake sure to log these in your dashboard!`;
      } else if (lowerMsg.includes('squat') || lowerMsg.includes('deadlift') || lowerMsg.includes('pushup') || lowerMsg.includes('form')) {
        responseText = `Good form prevents injury and maximizes muscle loading!\n\nFor **Squats**:\n1. Keep your feet shoulder-width, toes out.\n2. Sit back in your hips, keeping your heels flat. Don't let your knees cave in!\n3. Squat down to parallel depth.\n\nFeel free to try our **Camera Form Analysis** feature under the **More** menu to get real-time feedback through your camera!`;
      } else if (lowerMsg.includes('weight') || lowerMsg.includes('fat') || lowerMsg.includes('bmi')) {
        // Validate that height and weight are defined before calculating BMI
        if (!profile.height || !profile.weight) {
          responseText = `To calculate your BMI and provide personalized weight tracking advice, please complete your onboarding by adding your height and weight in your profile settings.\n\nSince your goal is **${profile.goal}**, tracking your weight trends is important:\n- **Muscle Gain:** Aim to increase weight by 0.5–1kg per month to minimize fat storage.\n- **Fat Loss:** Aim for a weight drop of 0.5kg per week by maintaining a minor caloric deficit.\n\nMake sure to log your weight under the **Weight** tab regularly to see your progress chart!`;
        } else {
          const heightM = profile.height / 100;
          const bmi = (profile.weight / (heightM * heightM)).toFixed(1);
          responseText = `Your current BMI is **${bmi}**, placing you in the *healthy weight* range.\n\nSince your goal is **${profile.goal}**, we want to track your weight trends gradually:\n- **Muscle Gain:** Aim to increase weight by 0.5–1kg per month to minimize fat storage.\n- **Fat Loss:** Aim for a weight drop of 0.5kg per week by maintaining a minor caloric deficit.\n\nMake sure to log your weight under the **Weight** tab regularly to see your progress chart!`;
        }
      } else {
        responseText = `That is an excellent question! When focusing on **${profile.goal}**, consistency is the single most important factor.\n\nRemember to stay hydrated (aim for 8+ glasses of water), hit your sleep target (7-9 hours), and stick to your workout days preference of **${profile.workout_days_preference} days per week**.\n\nIs there a specific detail about exercises, nutrition, or recover habits you would like to explore further?`;
      }

      // Stream the response token-by-token (split by words)
      const words = responseText.split(' ');
      let currentString = '';
      let wordIdx = 0;

      const timer = setInterval(() => {
        if (wordIdx < words.length) {
          currentString += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
          onToken(currentString);
          wordIdx++;
        } else {
          clearInterval(timer);
          resolve(responseText);
        }
      }, 50); // Speed of streaming
    });
  }
};
