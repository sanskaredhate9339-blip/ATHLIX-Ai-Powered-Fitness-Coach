import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { 
  Calendar, Search, Plus, Trash, 
  Apple, Heart, Activity, Coffee 
} from 'lucide-react';

export const Nutrition: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { foods, deleteFoodItem, logFoodItem } = useFitness();

  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyDateFilter, setHistoryDateFilter] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  });
  const [historyFoods, setHistoryFoods] = useState<any[]>([]);
  const [isSearchingHistory, setIsSearchingHistory] = useState(false);

  // Targets based on user profile goals
  const targetCals = profile?.weight && profile?.goal 
    ? (profile.goal === 'Muscle Gain' ? Math.round(profile.weight * 35) : profile.goal === 'Weight Loss' ? Math.round(profile.weight * 25) : Math.round(profile.weight * 30))
    : 0;
  const targetProtein = profile?.weight ? Math.round(profile.weight * 2.0) : 0; // 2g per kg
  const targetCarbs = profile?.weight && profile?.goal
    ? (profile.goal === 'Muscle Gain' ? Math.round(profile.weight * 4) : profile.goal === 'Weight Loss' ? Math.round(profile.weight * 2) : Math.round(profile.weight * 3))
    : 0;
  const targetFat = profile?.weight && profile?.goal
    ? (profile.goal === 'Muscle Gain' ? Math.round(profile.weight * 1) : profile.goal === 'Weight Loss' ? Math.round(profile.weight * 0.8) : Math.round(profile.weight * 0.9))
    : 0;

  // Real-time Sum calculations
  const totalCals = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);

  // Group foods by meal type
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
  const groupedFoods = {
    Breakfast: foods.filter(f => f.meal_type === 'Breakfast'),
    Lunch: foods.filter(f => f.meal_type === 'Lunch'),
    Dinner: foods.filter(f => f.meal_type === 'Dinner'),
    Snack: foods.filter(f => f.meal_type === 'Snack'),
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'Breakfast': return <Coffee className="w-4 h-4 text-warning" />;
      case 'Lunch': return <Apple className="w-4 h-4 text-success" />;
      case 'Dinner': return <Activity className="w-4 h-4 text-primary-light" />;
      default: return <Heart className="w-4 h-4 text-accent" />;
    }
  };

  const handleSearchHistory = async () => {
    setIsSearchingHistory(true);
    // Simulate API fetch delay
    setTimeout(() => {
      // Seed fallback history query
      const allHistoric = [
        { id: 'h_f1', food_name: 'Grilled Steak & Sweet Potato', calories: 650, protein: 42, fat: 25, carbs: 40, meal_type: 'Dinner', date: historyDateFilter },
        { id: 'h_f2', food_name: 'Protein Shake + Peanut Butter', calories: 340, protein: 32, fat: 12, carbs: 18, meal_type: 'Snack', date: historyDateFilter },
        { id: 'h_f3', food_name: 'Greek Yogurt with Granola', calories: 280, protein: 18, fat: 6, carbs: 32, meal_type: 'Breakfast', date: historyDateFilter },
      ];
      
      const filtered = allHistoric.filter(f => 
        f.food_name.toLowerCase().includes(historySearchQuery.toLowerCase()) &&
        f.date === historyDateFilter
      );
      setHistoryFoods(filtered);
      setIsSearchingHistory(false);
    }, 800);
  };

  const handleQuickAddHistory = async (food: any) => {
    // Add to current log (today)
    await logFoodItem({
      food_name: food.food_name,
      calories: food.calories,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      healthy_score: 8,
      suggestions: 'Loaded from search history.',
      serving_size: '1 serving',
      meal_type: food.meal_type,
    });
    setActiveTab('today');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Tabs */}
      <div className="flex bg-white/5 border border-white/5 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'today'
              ? 'bg-bg-surface text-white shadow-premium'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Today's Log
        </button>
        <button
          onClick={() => {
            setActiveTab('history');
            handleSearchHistory();
          }}
          className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'history'
              ? 'bg-bg-surface text-white shadow-premium'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          Search History
        </button>
      </div>

      {activeTab === 'today' ? (
        <>
          {/* Macronutrients Summary Section */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-4">
              Daily Macro Intake
            </h3>
            
            {/* Calories Ring/Progress bar */}
            <div className="flex justify-between items-center text-xs text-text-muted mb-2">
              <span>Caloric Budget</span>
              <span className="font-bold text-white">{totalCals} / {targetCals} kcal</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${Math.min((totalCals / targetCals) * 100, 100)}%` }}
              />
            </div>

            {/* Protein, Carbs, Fat details */}
            <div className="grid grid-cols-3 gap-4">
              {/* Protein */}
              <div>
                <div className="flex justify-between text-[10px] text-text-muted mb-1 font-sans">
                  <span>Protein</span>
                  <span className="font-bold text-white">{totalProtein}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${Math.min((totalProtein / targetProtein) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[8px] text-text-muted block mt-1">Goal: {targetProtein}g</span>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between text-[10px] text-text-muted mb-1 font-sans">
                  <span>Carbs</span>
                  <span className="font-bold text-white">{totalCarbs}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-warning transition-all duration-300"
                    style={{ width: `${Math.min((totalCarbs / targetCarbs) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[8px] text-text-muted block mt-1">Goal: {targetCarbs}g</span>
              </div>

              {/* Fat */}
              <div>
                <div className="flex justify-between text-[10px] text-text-muted mb-1 font-sans">
                  <span>Fat</span>
                  <span className="font-bold text-white">{totalFat}g</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-danger transition-all duration-300"
                    style={{ width: `${Math.min((totalFat / targetFat) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-[8px] text-text-muted block mt-1">Goal: {targetFat}g</span>
              </div>
            </div>
          </div>

          {/* Meals group lists */}
          <div className="flex flex-col gap-4">
            {mealTypes.map((mealType) => {
              const list = groupedFoods[mealType];
              const mealCals = list.reduce((sum, f) => sum + f.calories, 0);

              return (
                <div key={mealType} className="glass-panel p-5 rounded-3xl">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5">
                        {getMealTypeIcon(mealType)}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white">{mealType}</h4>
                    </div>
                    <span className="text-xs font-bold text-text-muted font-mono">{mealCals} kcal</span>
                  </div>

                  {list.length > 0 ? (
                    <div className="flex flex-col gap-2.5">
                      {list.map((food) => (
                        <div 
                          key={food.id} 
                          className="flex justify-between items-center p-3 rounded-2xl bg-bg-app/40 border border-border-custom"
                        >
                          <div>
                            <h5 className="text-xs font-bold text-white leading-normal">{food.food_name}</h5>
                            <div className="flex gap-2.5 mt-1 text-[9px] text-text-muted font-sans font-medium">
                              <span>P: <strong className="text-success">{food.protein}g</strong></span>
                              <span>C: <strong className="text-warning">{food.carbs}g</strong></span>
                              <span>F: <strong className="text-danger">{food.fat}g</strong></span>
                              {food.healthy_score > 0 && (
                                <span className="text-accent bg-accent/5 px-1.5 rounded-md">Score: {food.healthy_score}/10</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold font-mono text-white">{food.calories} kcal</span>
                            <button
                              onClick={() => deleteFoodItem(food.id)}
                              className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                              aria-label={`Delete ${food.food_name}`}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-text-muted italic px-1 font-sans">
                      No foods logged for {mealType.toLowerCase()} yet.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/nutrition/log')}
            className="w-full py-4 rounded-2xl gradient-btn text-xs font-bold flex items-center justify-center gap-2 mt-4"
          >
            <Plus className="w-4.5 h-4.5" /> Log New Food Item
          </button>
        </>
      ) : (
        /* History tab view */
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
            Search History
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                type="text"
                value={historySearchQuery}
                onChange={(e) => setHistorySearchQuery(e.target.value)}
                placeholder="Search food item name..."
                className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-white"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted pointer-events-none" />
              <input
                type="date"
                value={historyDateFilter}
                onChange={(e) => setHistoryDateFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-white"
              />
            </div>

            <button
              onClick={handleSearchHistory}
              className="py-3 px-6 rounded-2xl gradient-btn text-xs font-bold"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {isSearchingHistory ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-accent animate-spin mx-auto mb-2" />
                <span className="text-xs text-text-muted animate-pulse">Searching catalog logs...</span>
              </div>
            ) : historyFoods.length > 0 ? (
              historyFoods.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center p-4 rounded-2xl bg-bg-app/40 border border-border-custom group hover:border-primary-light/30 transition-all"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.food_name}</h4>
                    <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">
                      P: {item.protein}g &bull; C: {item.carbs}g &bull; F: {item.fat}g &bull; Logged on {item.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-white">{item.calories} kcal</span>
                    <button
                      onClick={() => handleQuickAddHistory(item)}
                      className="px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/20 text-[10px] font-bold text-primary-light transition-all"
                    >
                      Quick Add
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-text-muted text-xs font-sans italic">
                No historic records found for this date. Adjust date filter or search query.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
