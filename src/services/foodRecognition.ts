import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { NUTRITION_DATABASE, type NutritionData } from './nutritionDatabase';

export interface DetectedFoodItem {
  name: string;
  portion_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence: number;
}

export interface FoodRecognitionResult {
  food_name: string;
  serving_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  confidence: number;
  detected_foods: DetectedFoodItem[];
  healthy_score: number;
  suggestions: string;
}

let modelInstance: mobilenet.MobileNet | null = null;

/** Maps ImageNet / visual labels to nutrition database entries */
const LABEL_TO_FOOD: Record<string, string[]> = {
  plate: ['Cooked White Rice', 'Chicken Breast (Cooked)', 'Mixed Vegetables'],
  bowl: ['Dal (Lentil Curry)', 'Cooked White Rice', 'Chicken Curry'],
  soup: ['Dal (Lentil Curry)', 'Mixed Vegetables'],
  sandwich: ['Bread (Whole Wheat)', 'Chicken Breast (Cooked)'],
  pizza: ['Cooked Pasta', 'Mixed Vegetables'],
  burger: ['Chicken Breast (Cooked)', 'Bread (Whole Wheat)'],
  salad: ['Mixed Vegetables', 'Avocado', 'Grilled Chicken Salad'],
  banana: ['Banana'],
  apple: ['Apple'],
  orange: ['Orange'],
  bread: ['Bread (Whole Wheat)', 'Roti/Chapati', 'Naan Bread'],
  rice: ['Cooked White Rice', 'Biryani', 'Cooked Brown Rice'],
  pasta: ['Cooked Pasta'],
  chicken: ['Chicken Breast (Cooked)', 'Tandoori Chicken', 'Chicken Curry'],
  fish: ['Salmon (Cooked)', 'Fish Curry'],
  egg: ['Boiled Egg', 'Egg White Omelette'],
  cheese: ['Paneer (Cottage Cheese)', 'Greek Yogurt'],
  milk: ['Greek Yogurt', 'Milk'],
  yogurt: ['Greek Yogurt', 'Raita'],
  curry: ['Chicken Curry', 'Paneer Butter Masala', 'Dal (Lentil Curry)'],
  dal: ['Dal (Lentil Curry)'],
  roti: ['Roti/Chapati'],
  naan: ['Naan Bread'],
  dosa: ['Dosa'],
  idli: ['Idli'],
  samosa: ['Samosa'],
  biryani: ['Biryani'],
  paneer: ['Paneer (Cottage Cheese)', 'Paneer Butter Masala'],
  potato: ['Potato (Boiled)'],
  broccoli: ['Broccoli'],
  carrot: ['Carrots'],
  tomato: ['Tomatoes'],
  avocado: ['Avocado'],
  steak: ['Beef Steak (Cooked)'],
  shrimp: ['Shrimp (Cooked)'],
  sushi: ['Cooked White Rice', 'Salmon (Cooked)'],
  taco: ['Cooked White Rice', 'Chicken Breast (Cooked)'],
  burrito: ['Cooked White Rice', 'Black Beans', 'Chicken Breast (Cooked)'],
  noodle: ['Cooked Pasta', 'Maggi Noodles'],
  omelette: ['Egg White Omelette', 'Boiled Egg'],
  pancake: ['Bread (Whole Wheat)'],
  waffle: ['Bread (Whole Wheat)'],
  donut: ['Bread (Whole Wheat)'],
  cake: ['Bread (Whole Wheat)'],
  cookie: ['Almonds'],
  nut: ['Almonds', 'Mixed Nuts'],
  almond: ['Almonds'],
  peanut: ['Peanut Butter'],
  lentil: ['Dal (Lentil Curry)', 'Lentils (Cooked)'],
  bean: ['Black Beans', 'Chickpeas (Cooked)'],
  chickpea: ['Chickpeas (Cooked)', 'Chana Masala'],
  spinach: ['Spinach (Cooked)', 'Palak Paneer'],
  cauliflower: ['Cauliflower'],
  mushroom: ['Mushrooms'],
  corn: ['Sweet Corn'],
  mango: ['Mango'],
  grape: ['Grapes'],
  strawberry: ['Strawberries'],
  watermelon: ['Watermelon'],
  papaya: ['Papaya'],
  coconut: ['Coconut'],
  olive: ['Olive Oil'],
  butter: ['Butter/Ghee'],
  ghee: ['Butter/Ghee'],
  honey: ['Honey'],
  chocolate: ['Dark Chocolate'],
  coffee: ['Coffee (Black)'],
  tea: ['Green Tea'],
  juice: ['Orange Juice'],
  smoothie: ['Banana', 'Greek Yogurt'],
  protein: ['Whey Protein Shake', 'Grilled Chicken Salad'],
  gym: ['Grilled Chicken Salad', 'Chicken Breast (Cooked)'],
};

/** Indian food keywords detected via color/texture heuristics */
const INDIAN_FOOD_HINTS: Array<{ keywords: string[]; foods: string[]; colorRange?: [number, number, number, number] }> = [
  { keywords: ['curry', 'masala', 'tikka'], foods: ['Chicken Curry', 'Paneer Butter Masala', 'Dal (Lentil Curry)'] },
  { keywords: ['roti', 'chapati', 'paratha'], foods: ['Roti/Chapati'] },
  { keywords: ['biryani', 'pulao'], foods: ['Biryani'] },
  { keywords: ['dosa', 'idli', 'sambar'], foods: ['Dosa', 'Idli', 'Sambar'] },
  { keywords: ['samosa', 'pakora'], foods: ['Samosa'] },
  { keywords: ['paneer', 'palak'], foods: ['Palak Paneer', 'Paneer Butter Masala'] },
  { keywords: ['dal', 'lentil'], foods: ['Dal (Lentil Curry)'] },
  { keywords: ['naan', 'tandoori'], foods: ['Naan Bread', 'Tandoori Chicken'] },
];

async function loadModel(): Promise<mobilenet.MobileNet> {
  if (!modelInstance) {
    await tf.ready();
    modelInstance = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return modelInstance;
}

function base64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
  });
}

function analyzeImageColors(img: HTMLImageElement): { warmRatio: number; greenRatio: number; brownRatio: number } {
  const canvas = document.createElement('canvas');
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { warmRatio: 0, greenRatio: 0, brownRatio: 0 };

  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  let warm = 0, green = 0, brown = 0, total = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r + g + b < 30) continue;
    total++;
    if (r > 150 && g > 80 && b < 100) warm++;
    if (g > r && g > b && g > 80) green++;
    if (r > 80 && g > 40 && b < 60 && r > g) brown++;
  }

  return {
    warmRatio: total ? warm / total : 0,
    greenRatio: total ? green / total : 0,
    brownRatio: total ? brown / total : 0,
  };
}

function estimatePortionGrams(img: HTMLImageElement, confidence: number): number {
  const area = img.width * img.height;
  const basePortion = Math.min(350, Math.max(80, Math.sqrt(area) * 0.15));
  const confidenceFactor = 0.7 + confidence * 0.6;
  return Math.round(basePortion * confidenceFactor);
}

function findNutrition(foodName: string): NutritionData | undefined {
  return NUTRITION_DATABASE.find(
    (n) => n.name.toLowerCase() === foodName.toLowerCase()
  ) ?? NUTRITION_DATABASE.find(
    (n) => n.name.toLowerCase().includes(foodName.toLowerCase()) ||
      foodName.toLowerCase().includes(n.name.toLowerCase().split(' ')[0])
  );
}

function computeNutrition(nutrition: NutritionData, portionG: number, confidence: number): DetectedFoodItem {
  const multiplier = portionG / 100;
  return {
    name: nutrition.name,
    portion_g: portionG,
    calories: Math.round(nutrition.calories_per_100g * multiplier),
    protein: Math.round(nutrition.protein_per_100g * multiplier * 10) / 10,
    carbs: Math.round(nutrition.carbs_per_100g * multiplier * 10) / 10,
    fat: Math.round(nutrition.fat_per_100g * multiplier * 10) / 10,
    fiber: Math.round(nutrition.fiber_per_100g * multiplier * 10) / 10,
    sugar: Math.round(nutrition.sugar_per_100g * multiplier * 10) / 10,
    sodium: Math.round(nutrition.sodium_per_100g * multiplier),
    confidence: Math.round(confidence * 100) / 100,
  };
}

function mapPredictionsToFoods(
  predictions: Array<{ className: string; probability: number }>,
  colorHints: ReturnType<typeof analyzeImageColors>
): Array<{ foodName: string; confidence: number }> {
  const results = new Map<string, number>();

  for (const pred of predictions) {
    const label = pred.className.toLowerCase();
    for (const [key, foods] of Object.entries(LABEL_TO_FOOD)) {
      if (label.includes(key)) {
        foods.forEach((food, idx) => {
          const conf = pred.probability * (1 - idx * 0.15);
          const existing = results.get(food) ?? 0;
          results.set(food, Math.max(existing, conf));
        });
      }
    }
  }

  // Color-based Indian food hints
  if (colorHints.warmRatio > 0.15) {
    ['Chicken Curry', 'Dal (Lentil Curry)', 'Paneer Butter Masala'].forEach((food, idx) => {
      const conf = colorHints.warmRatio * (0.9 - idx * 0.1);
      const existing = results.get(food) ?? 0;
      results.set(food, Math.max(existing, conf));
    });
  }
  if (colorHints.greenRatio > 0.12) {
    ['Palak Paneer', 'Mixed Vegetables', 'Spinach (Cooked)'].forEach((food, idx) => {
      const conf = colorHints.greenRatio * (0.85 - idx * 0.1);
      const existing = results.get(food) ?? 0;
      results.set(food, Math.max(existing, conf));
    });
  }
  if (colorHints.brownRatio > 0.1) {
    ['Roti/Chapati', 'Cooked Brown Rice', 'Biryani'].forEach((food, idx) => {
      const conf = colorHints.brownRatio * (0.8 - idx * 0.1);
      const existing = results.get(food) ?? 0;
      results.set(food, Math.max(existing, conf));
    });
  }

  // Keyword matching from top predictions
  for (const pred of predictions.slice(0, 5)) {
    const label = pred.className.toLowerCase();
    for (const hint of INDIAN_FOOD_HINTS) {
      if (hint.keywords.some((kw) => label.includes(kw))) {
        hint.foods.forEach((food, idx) => {
          const conf = pred.probability * (0.95 - idx * 0.1);
          const existing = results.get(food) ?? 0;
          results.set(food, Math.max(existing, conf));
        });
      }
    }
  }

  return Array.from(results.entries())
    .map(([foodName, confidence]) => ({ foodName, confidence }))
    .filter((r) => r.confidence > 0.05)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

function buildSuggestions(foods: DetectedFoodItem[]): string {
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const suggestions: string[] = [];
  if (totalProtein < 20) {
    suggestions.push('Consider adding a protein source to support muscle recovery.');
  } else if (totalProtein >= 30) {
    suggestions.push('Excellent protein content detected in this meal.');
  }
  const hasVeg = foods.some((f) =>
    ['Mixed Vegetables', 'Broccoli', 'Spinach (Cooked)', 'Salad'].some((v) => f.name.includes(v))
  );
  if (!hasVeg) {
    suggestions.push('Adding vegetables would improve fiber and micronutrient intake.');
  }
  return suggestions.length > 0 ? suggestions.join(' ') : 'Balanced meal detected. Log consistently for better insights.';
}

export async function recognizeFoodFromImage(base64Image: string): Promise<FoodRecognitionResult> {
  const img = await base64ToImage(base64Image);
  const model = await loadModel();
  const predictions = await model.classify(img);
  const colorHints = analyzeImageColors(img);

  const mappedFoods = mapPredictionsToFoods(predictions, colorHints);

  if (mappedFoods.length === 0) {
    // Fallback: use top prediction generic mapping
    const topLabel = predictions[0]?.className.toLowerCase() ?? 'food';
    const fallbackFood = NUTRITION_DATABASE.find((n) =>
      topLabel.split(',').some((part: string) => n.name.toLowerCase().includes(part.trim().split(' ')[0]))
    ) ?? NUTRITION_DATABASE[0];

    const portion = estimatePortionGrams(img, predictions[0]?.probability ?? 0.3);
    const item = computeNutrition(fallbackFood, portion, predictions[0]?.probability ?? 0.3);
    return {
      food_name: item.name,
      serving_size: `${item.portion_g}g`,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
      sugar: item.sugar,
      sodium: item.sodium,
      confidence: item.confidence,
      detected_foods: [item],
      healthy_score: 7,
      suggestions: buildSuggestions([item]),
    };
  }

  const detectedFoods: DetectedFoodItem[] = [];
  for (const { foodName, confidence } of mappedFoods) {
    const nutrition = findNutrition(foodName);
    if (nutrition) {
      const portion = estimatePortionGrams(img, confidence);
      detectedFoods.push(computeNutrition(nutrition, portion, confidence));
    }
  }

  const avgConfidence =
    detectedFoods.reduce((s, f) => s + f.confidence, 0) / detectedFoods.length;

  const totals = detectedFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
      fiber: acc.fiber + f.fiber,
      sugar: acc.sugar + f.sugar,
      sodium: acc.sodium + f.sodium,
      weight: acc.weight + f.portion_g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, weight: 0 }
  );

  const proteinRatio = totals.calories > 0 ? totals.protein / (totals.calories / 4) : 0;
  let healthyScore = 7;
  if (proteinRatio >= 0.2 && proteinRatio <= 0.35) healthyScore = 9;
  else if (proteinRatio >= 0.15) healthyScore = 8;

  return {
    food_name: detectedFoods.map((f) => f.name).join(', '),
    serving_size: `${totals.weight}g total`,
    calories: totals.calories,
    protein: Math.round(totals.protein * 10) / 10,
    carbs: Math.round(totals.carbs * 10) / 10,
    fat: Math.round(totals.fat * 10) / 10,
    fiber: Math.round(totals.fiber * 10) / 10,
    sugar: Math.round(totals.sugar * 10) / 10,
    sodium: totals.sodium,
    confidence: Math.round(avgConfidence * 100) / 100,
    detected_foods: detectedFoods,
    healthy_score: healthyScore,
    suggestions: buildSuggestions(detectedFoods),
  };
}

export function disposeFoodModel(): void {
  if (modelInstance) {
    if (typeof (modelInstance as any).dispose === 'function') {
      (modelInstance as any).dispose();
    }
    modelInstance = null;
  }
}
