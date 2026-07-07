// Comprehensive nutrition database for common foods
// Values per 100g unless specified otherwise

export interface NutritionData {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  category: 'grains' | 'protein' | 'vegetables' | 'fruits' | 'dairy' | 'legumes' | 'nuts' | 'oils' | 'other';
}

export const NUTRITION_DATABASE: NutritionData[] = [
  // Grains
  {
    name: 'Cooked White Rice',
    calories_per_100g: 130,
    protein_per_100g: 2.7,
    carbs_per_100g: 28,
    fat_per_100g: 0.3,
    fiber_per_100g: 0.4,
    sugar_per_100g: 0.1,
    sodium_per_100g: 1,
    category: 'grains'
  },
  {
    name: 'Cooked Brown Rice',
    calories_per_100g: 112,
    protein_per_100g: 2.6,
    carbs_per_100g: 24,
    fat_per_100g: 0.9,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.4,
    sodium_per_100g: 2,
    category: 'grains'
  },
  {
    name: 'Cooked Quinoa',
    calories_per_100g: 120,
    protein_per_100g: 4.4,
    carbs_per_100g: 21,
    fat_per_100g: 1.9,
    fiber_per_100g: 2.8,
    sugar_per_100g: 0.9,
    sodium_per_100g: 5,
    category: 'grains'
  },
  {
    name: 'Cooked Pasta',
    calories_per_100g: 131,
    protein_per_100g: 5,
    carbs_per_100g: 25,
    fat_per_100g: 1.1,
    fiber_per_100g: 1.5,
    sugar_per_100g: 0.6,
    sodium_per_100g: 6,
    category: 'grains'
  },
  {
    name: 'Bread (Whole Wheat)',
    calories_per_100g: 247,
    protein_per_100g: 13,
    carbs_per_100g: 41,
    fat_per_100g: 3.4,
    fiber_per_100g: 6,
    sugar_per_100g: 5,
    sodium_per_100g: 400,
    category: 'grains'
  },
  {
    name: 'Roti/Chapati',
    calories_per_100g: 104,
    protein_per_100g: 3.5,
    carbs_per_100g: 18,
    fat_per_100g: 1.2,
    fiber_per_100g: 2,
    sugar_per_100g: 0.5,
    sodium_per_100g: 200,
    category: 'grains'
  },
  {
    name: 'Naan Bread',
    calories_per_100g: 310,
    protein_per_100g: 8,
    carbs_per_100g: 45,
    fat_per_100g: 11,
    fiber_per_100g: 2,
    sugar_per_100g: 2,
    sodium_per_100g: 450,
    category: 'grains'
  },
  
  // Protein - Meat
  {
    name: 'Chicken Breast (Cooked)',
    calories_per_100g: 165,
    protein_per_100g: 31,
    carbs_per_100g: 0,
    fat_per_100g: 3.6,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 74,
    category: 'protein'
  },
  {
    name: 'Chicken Thigh (Cooked)',
    calories_per_100g: 209,
    protein_per_100g: 26,
    carbs_per_100g: 0,
    fat_per_100g: 11,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 80,
    category: 'protein'
  },
  {
    name: 'Beef Steak (Lean)',
    calories_per_100g: 250,
    protein_per_100g: 26,
    carbs_per_100g: 0,
    fat_per_100g: 15,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 60,
    category: 'protein'
  },
  {
    name: 'Ribeye Steak',
    calories_per_100g: 291,
    protein_per_100g: 25,
    carbs_per_100g: 0,
    fat_per_100g: 21,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 65,
    category: 'protein'
  },
  {
    name: 'Ground Beef (85% Lean)',
    calories_per_100g: 250,
    protein_per_100g: 26,
    carbs_per_100g: 0,
    fat_per_100g: 17,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 75,
    category: 'protein'
  },
  {
    name: 'Pork Chop (Cooked)',
    calories_per_100g: 231,
    protein_per_100g: 25,
    carbs_per_100g: 0,
    fat_per_100g: 14,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 60,
    category: 'protein'
  },
  {
    name: 'Lamb (Cooked)',
    calories_per_100g: 294,
    protein_per_100g: 25,
    carbs_per_100g: 0,
    fat_per_100g: 21,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 70,
    category: 'protein'
  },
  
  // Protein - Fish
  {
    name: 'Salmon (Cooked)',
    calories_per_100g: 208,
    protein_per_100g: 20,
    carbs_per_100g: 0,
    fat_per_100g: 13,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 60,
    category: 'protein'
  },
  {
    name: 'Tuna (Cooked)',
    calories_per_100g: 132,
    protein_per_100g: 28,
    carbs_per_100g: 0,
    fat_per_100g: 1,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 40,
    category: 'protein'
  },
  {
    name: 'Cod (Cooked)',
    calories_per_100g: 82,
    protein_per_100g: 18,
    carbs_per_100g: 0,
    fat_per_100g: 0.7,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 90,
    category: 'protein'
  },
  {
    name: 'Shrimp (Cooked)',
    calories_per_100g: 99,
    protein_per_100g: 24,
    carbs_per_100g: 0.2,
    fat_per_100g: 0.3,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 110,
    category: 'protein'
  },
  
  // Protein - Eggs & Dairy
  {
    name: 'Eggs (Cooked)',
    calories_per_100g: 155,
    protein_per_100g: 13,
    carbs_per_100g: 1.1,
    fat_per_100g: 11,
    fiber_per_100g: 0,
    sugar_per_100g: 1.1,
    sodium_per_100g: 124,
    category: 'protein'
  },
  {
    name: 'Paneer',
    calories_per_100g: 265,
    protein_per_100g: 18,
    carbs_per_100g: 3.4,
    fat_per_100g: 20,
    fiber_per_100g: 0,
    sugar_per_100g: 2,
    sodium_per_100g: 50,
    category: 'dairy'
  },
  {
    name: 'Greek Yogurt',
    calories_per_100g: 59,
    protein_per_100g: 10,
    carbs_per_100g: 3.6,
    fat_per_100g: 0.4,
    fiber_per_100g: 0,
    sugar_per_100g: 3.6,
    sodium_per_100g: 36,
    category: 'dairy'
  },
  {
    name: 'Cottage Cheese',
    calories_per_100g: 98,
    protein_per_100g: 11,
    carbs_per_100g: 3.4,
    fat_per_100g: 4.3,
    fiber_per_100g: 0,
    sugar_per_100g: 2.7,
    sodium_per_100g: 364,
    category: 'dairy'
  },
  {
    name: 'Cheese (Cheddar)',
    calories_per_100g: 403,
    protein_per_100g: 25,
    carbs_per_100g: 1.3,
    fat_per_100g: 33,
    fiber_per_100g: 0,
    sugar_per_100g: 0.5,
    sodium_per_100g: 621,
    category: 'dairy'
  },
  
  // Protein - Plant-based
  {
    name: 'Tofu',
    calories_per_100g: 144,
    protein_per_100g: 17,
    carbs_per_100g: 3,
    fat_per_100g: 9,
    fiber_per_100g: 2,
    sugar_per_100g: 0.9,
    sodium_per_100g: 8,
    category: 'protein'
  },
  {
    name: 'Tempeh',
    calories_per_100g: 193,
    protein_per_100g: 19,
    carbs_per_100g: 9,
    fat_per_100g: 11,
    fiber_per_100g: 6,
    sugar_per_100g: 0,
    sodium_per_100g: 10,
    category: 'protein'
  },
  
  // Legumes
  {
    name: 'Dal Tadka (Cooked Lentils)',
    calories_per_100g: 120,
    protein_per_100g: 9,
    carbs_per_100g: 16,
    fat_per_100g: 3,
    fiber_per_100g: 5,
    sugar_per_100g: 1,
    sodium_per_100g: 200,
    category: 'legumes'
  },
  {
    name: 'Kidney Beans (Rajma)',
    calories_per_100g: 127,
    protein_per_100g: 8.7,
    carbs_per_100g: 23,
    fat_per_100g: 0.5,
    fiber_per_100g: 6,
    sugar_per_100g: 0.5,
    sodium_per_100g: 5,
    category: 'legumes'
  },
  {
    name: 'Chickpeas (Chana)',
    calories_per_100g: 164,
    protein_per_100g: 8.9,
    carbs_per_100g: 27,
    fat_per_100g: 2.6,
    fiber_per_100g: 7.6,
    sugar_per_100g: 4.8,
    sodium_per_100g: 24,
    category: 'legumes'
  },
  {
    name: 'Black Beans',
    calories_per_100g: 132,
    protein_per_100g: 8.9,
    carbs_per_100g: 23,
    fat_per_100g: 0.5,
    fiber_per_100g: 8.7,
    sugar_per_100g: 0.3,
    sodium_per_100g: 5,
    category: 'legumes'
  },
  {
    name: 'Moong Dal',
    calories_per_100g: 105,
    protein_per_100g: 7.5,
    carbs_per_100g: 19,
    fat_per_100g: 0.4,
    fiber_per_100g: 4.5,
    sugar_per_100g: 0.5,
    sodium_per_100g: 10,
    category: 'legumes'
  },
  
  // Vegetables
  {
    name: 'Broccoli (Cooked)',
    calories_per_100g: 35,
    protein_per_100g: 2.4,
    carbs_per_100g: 7,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.6,
    sugar_per_100g: 1.5,
    sodium_per_100g: 41,
    category: 'vegetables'
  },
  {
    name: 'Sweet Potato (Cooked)',
    calories_per_100g: 90,
    protein_per_100g: 2,
    carbs_per_100g: 21,
    fat_per_100g: 0.1,
    fiber_per_100g: 3,
    sugar_per_100g: 4.2,
    sodium_per_100g: 5,
    category: 'vegetables'
  },
  {
    name: 'Potato (Cooked)',
    calories_per_100g: 87,
    protein_per_100g: 1.9,
    carbs_per_100g: 20,
    fat_per_100g: 0.1,
    fiber_per_100g: 1.8,
    sugar_per_100g: 0.9,
    sodium_per_100g: 5,
    category: 'vegetables'
  },
  {
    name: 'Spinach (Cooked)',
    calories_per_100g: 23,
    protein_per_100g: 3,
    carbs_per_100g: 4,
    fat_per_100g: 0.4,
    fiber_per_100g: 2.4,
    sugar_per_100g: 0.4,
    sodium_per_100g: 70,
    category: 'vegetables'
  },
  {
    name: 'Mixed Salad',
    calories_per_100g: 20,
    protein_per_100g: 1.5,
    carbs_per_100g: 3.5,
    fat_per_100g: 0.2,
    fiber_per_100g: 1.5,
    sugar_per_100g: 2,
    sodium_per_100g: 50,
    category: 'vegetables'
  },
  {
    name: 'Tomatoes',
    calories_per_100g: 18,
    protein_per_100g: 0.9,
    carbs_per_100g: 3.9,
    fat_per_100g: 0.2,
    fiber_per_100g: 1.2,
    sugar_per_100g: 2.6,
    sodium_per_100g: 5,
    category: 'vegetables'
  },
  {
    name: 'Onions',
    calories_per_100g: 40,
    protein_per_100g: 1.1,
    carbs_per_100g: 9.3,
    fat_per_100g: 0.1,
    fiber_per_100g: 1.7,
    sugar_per_100g: 4.2,
    sodium_per_100g: 4,
    category: 'vegetables'
  },
  {
    name: 'Carrots (Cooked)',
    calories_per_100g: 35,
    protein_per_100g: 0.8,
    carbs_per_100g: 8,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.3,
    sugar_per_100g: 4,
    sodium_per_100g: 58,
    category: 'vegetables'
  },
  {
    name: 'Cauliflower (Cooked)',
    calories_per_100g: 23,
    protein_per_100g: 1.8,
    carbs_per_100g: 5,
    fat_per_100g: 0.2,
    fiber_per_100g: 2,
    sugar_per_100g: 2,
    sodium_per_100g: 15,
    category: 'vegetables'
  },
  {
    name: 'Green Peas',
    calories_per_100g: 84,
    protein_per_100g: 5.4,
    carbs_per_100g: 15,
    fat_per_100g: 0.4,
    fiber_per_100g: 5.7,
    sugar_per_100g: 5.7,
    sodium_per_100g: 5,
    category: 'vegetables'
  },
  
  // Fruits
  {
    name: 'Apple',
    calories_per_100g: 52,
    protein_per_100g: 0.3,
    carbs_per_100g: 14,
    fat_per_100g: 0.2,
    fiber_per_100g: 2.4,
    sugar_per_100g: 10,
    sodium_per_100g: 1,
    category: 'fruits'
  },
  {
    name: 'Banana',
    calories_per_100g: 89,
    protein_per_100g: 1.1,
    carbs_per_100g: 23,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.6,
    sugar_per_100g: 12,
    sodium_per_100g: 1,
    category: 'fruits'
  },
  {
    name: 'Orange',
    calories_per_100g: 47,
    protein_per_100g: 0.9,
    carbs_per_100g: 12,
    fat_per_100g: 0.1,
    fiber_per_100g: 2.4,
    sugar_per_100g: 9,
    sodium_per_100g: 0,
    category: 'fruits'
  },
  {
    name: 'Mixed Berries',
    calories_per_100g: 57,
    protein_per_100g: 0.7,
    carbs_per_100g: 14,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.4,
    sugar_per_100g: 7,
    sodium_per_100g: 1,
    category: 'fruits'
  },
  {
    name: 'Mango',
    calories_per_100g: 60,
    protein_per_100g: 0.8,
    carbs_per_100g: 15,
    fat_per_100g: 0.4,
    fiber_per_100g: 1.6,
    sugar_per_100g: 14,
    sodium_per_100g: 1,
    category: 'fruits'
  },
  
  // Nuts & Seeds
  {
    name: 'Peanuts',
    calories_per_100g: 567,
    protein_per_100g: 25,
    carbs_per_100g: 16,
    fat_per_100g: 49,
    fiber_per_100g: 8.5,
    sugar_per_100g: 4,
    sodium_per_100g: 6,
    category: 'nuts'
  },
  {
    name: 'Almonds',
    calories_per_100g: 579,
    protein_per_100g: 21,
    carbs_per_100g: 22,
    fat_per_100g: 50,
    fiber_per_100g: 12,
    sugar_per_100g: 4,
    sodium_per_100g: 1,
    category: 'nuts'
  },
  {
    name: 'Walnuts',
    calories_per_100g: 654,
    protein_per_100g: 15,
    carbs_per_100g: 14,
    fat_per_100g: 65,
    fiber_per_100g: 6.7,
    sugar_per_100g: 2.6,
    sodium_per_100g: 2,
    category: 'nuts'
  },
  {
    name: 'Cashews',
    calories_per_100g: 553,
    protein_per_100g: 18,
    carbs_per_100g: 30,
    fat_per_100g: 44,
    fiber_per_100g: 3.3,
    sugar_per_100g: 5,
    sodium_per_100g: 12,
    category: 'nuts'
  },
  
  // Oils
  {
    name: 'Olive Oil',
    calories_per_100g: 884,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 100,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 2,
    category: 'oils'
  },
  {
    name: 'Vegetable Oil',
    calories_per_100g: 884,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 100,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 0,
    category: 'oils'
  },
  {
    name: 'Butter',
    calories_per_100g: 717,
    protein_per_100g: 0.9,
    carbs_per_100g: 0.1,
    fat_per_100g: 81,
    fiber_per_100g: 0,
    sugar_per_100g: 0.1,
    sodium_per_100g: 11,
    category: 'oils'
  },
  {
    name: 'Ghee',
    calories_per_100g: 900,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 100,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 0,
    category: 'oils'
  },
  {
    name: 'Coconut Oil',
    calories_per_100g: 862,
    protein_per_100g: 0,
    carbs_per_100g: 0,
    fat_per_100g: 100,
    fiber_per_100g: 0,
    sugar_per_100g: 0,
    sodium_per_100g: 0,
    category: 'oils'
  },
  
  // Other
  {
    name: 'Avocado',
    calories_per_100g: 160,
    protein_per_100g: 2,
    carbs_per_100g: 9,
    fat_per_100g: 15,
    fiber_per_100g: 7,
    sugar_per_100g: 0.7,
    sodium_per_100g: 7,
    category: 'other'
  },
  {
    name: 'Granola',
    calories_per_100g: 471,
    protein_per_100g: 11,
    carbs_per_100g: 53,
    fat_per_100g: 21,
    fiber_per_100g: 6,
    sugar_per_100g: 15,
    sodium_per_100g: 200,
    category: 'other'
  },
  {
    name: 'Oatmeal (Cooked)',
    calories_per_100g: 71,
    protein_per_100g: 2.5,
    carbs_per_100g: 12,
    fat_per_100g: 1.3,
    fiber_per_100g: 1.7,
    sugar_per_100g: 0.6,
    sodium_per_100g: 49,
    category: 'grains'
  },
  {
    name: 'Lemon Rice',
    calories_per_100g: 150,
    protein_per_100g: 3,
    carbs_per_100g: 25,
    fat_per_100g: 5,
    fiber_per_100g: 1,
    sugar_per_100g: 0.5,
    sodium_per_100g: 150,
    category: 'grains'
  },
  {
    name: 'Paneer Curry',
    calories_per_100g: 200,
    protein_per_100g: 12,
    carbs_per_100g: 8,
    fat_per_100g: 14,
    fiber_per_100g: 2,
    sugar_per_100g: 3,
    sodium_per_100g: 300,
    category: 'dairy'
  },
  {
    name: 'Tortillas',
    calories_per_100g: 218,
    protein_per_100g: 6,
    carbs_per_100g: 36,
    fat_per_100g: 6,
    fiber_per_100g: 2,
    sugar_per_100g: 1,
    sodium_per_100g: 400,
    category: 'grains'
  },
  {
    name: 'Cabbage',
    calories_per_100g: 25,
    protein_per_100g: 1.3,
    carbs_per_100g: 6,
    fat_per_100g: 0.1,
    fiber_per_100g: 2.5,
    sugar_per_100g: 3.2,
    sodium_per_100g: 18,
    category: 'vegetables'
  },
  {
    name: 'Lemon',
    calories_per_100g: 29,
    protein_per_100g: 1.1,
    carbs_per_100g: 9.3,
    fat_per_100g: 0.3,
    fiber_per_100g: 2.8,
    sugar_per_100g: 2.5,
    sodium_per_100g: 2,
    category: 'fruits'
  },
  {
    name: 'Biryani',
    calories_per_100g: 200,
    protein_per_100g: 8,
    carbs_per_100g: 25,
    fat_per_100g: 7,
    fiber_per_100g: 1.5,
    sugar_per_100g: 1,
    sodium_per_100g: 300,
    category: 'grains'
  },
  {
    name: 'Fried Rice',
    calories_per_100g: 180,
    protein_per_100g: 5,
    carbs_per_100g: 22,
    fat_per_100g: 8,
    fiber_per_100g: 1,
    sugar_per_100g: 1,
    sodium_per_100g: 400,
    category: 'grains'
  }
];

// Common meal combinations for detection
export const MEAL_COMBINATIONS = [
  {
    name: 'Indian Thali',
    foods: ['Cooked White Rice', 'Dal Tadka', 'Mixed Salad', 'Paneer'],
    typical_portions: [150, 120, 80, 100]
  },
  {
    name: 'Biryani Meal',
    foods: ['Biryani', 'Chicken Thigh (Cooked)', 'Onions', 'Mixed Salad'],
    typical_portions: [200, 100, 50, 60]
  },
  {
    name: 'Protein Bowl',
    foods: ['Cooked Brown Rice', 'Chicken Breast (Cooked)', 'Broccoli (Cooked)', 'Sweet Potato (Cooked)'],
    typical_portions: [150, 150, 100, 100]
  },
  {
    name: 'Breakfast Bowl',
    foods: ['Oatmeal (Cooked)', 'Mixed Berries', 'Greek Yogurt', 'Almonds'],
    typical_portions: [150, 80, 100, 20]
  },
  {
    name: 'Lemon Rice Bowl',
    foods: ['Lemon Rice', 'Peanuts', 'Onions', 'Mixed Salad'],
    typical_portions: [180, 15, 30, 50]
  },
  {
    name: 'Salmon Dinner',
    foods: ['Salmon (Cooked)', 'Cooked Quinoa', 'Broccoli (Cooked)', 'Spinach (Cooked)'],
    typical_portions: [150, 120, 100, 80]
  },
  {
    name: 'Steak Dinner',
    foods: ['Ribeye Steak', 'Sweet Potato (Cooked)', 'Broccoli (Cooked)', 'Mixed Salad'],
    typical_portions: [150, 150, 100, 80]
  },
  {
    name: 'Chicken Salad',
    foods: ['Chicken Breast (Cooked)', 'Mixed Salad', 'Tomatoes', 'Olive Oil'],
    typical_portions: [150, 150, 50, 15]
  },
  {
    name: 'Vegetarian Curry',
    foods: ['Cooked White Rice', 'Kidney Beans (Rajma)', 'Onions', 'Tomatoes'],
    typical_portions: [150, 120, 40, 40]
  },
  {
    name: 'Chickpea Curry',
    foods: ['Roti/Chapati', 'Chickpeas (Chana)', 'Onions', 'Spinach (Cooked)'],
    typical_portions: [100, 150, 40, 80]
  },
  {
    name: 'Egg Breakfast',
    foods: ['Eggs (Cooked)', 'Bread (Whole Wheat)', 'Tomatoes', 'Mixed Salad'],
    typical_portions: [100, 80, 50, 60]
  },
  {
    name: 'Avocado Toast',
    foods: ['Bread (Whole Wheat)', 'Avocado', 'Tomatoes', 'Eggs (Cooked)'],
    typical_portions: [80, 80, 50, 80]
  },
  {
    name: 'Pasta Meal',
    foods: ['Cooked Pasta', 'Chicken Breast (Cooked)', 'Broccoli (Cooked)', 'Olive Oil'],
    typical_portions: [150, 120, 100, 15]
  },
  {
    name: 'Tofu Stir Fry',
    foods: ['Tofu', 'Cooked Brown Rice', 'Broccoli (Cooked)', 'Carrots (Cooked)'],
    typical_portions: [120, 150, 100, 80]
  },
  {
    name: 'Fish Tacos',
    foods: ['Cod (Cooked)', 'Tortillas', 'Cabbage', 'Lemon'],
    typical_portions: [120, 80, 60, 20]
  },
  {
    name: 'Lentil Soup',
    foods: ['Moong Dal', 'Cooked White Rice', 'Onions', 'Tomatoes'],
    typical_portions: [150, 120, 40, 40]
  }
];
