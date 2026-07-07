import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFitness } from '../context/FitnessContext';
import Webcam from 'react-webcam';
import { 
  Camera, Upload, Trash, Sparkles, 
  ArrowLeft, RefreshCw, CheckCircle
} from 'lucide-react';

export const NutritionLog: React.FC = () => {
  const navigate = useNavigate();
  const { logFoodWithAI, logFoodItem } = useFitness();

  // Webcam states
  const [webcamActive, setWebcamActive] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Core Flow States
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Editing Fields
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('0');
  const [protein, setProtein] = useState('0');
  const [fat, setFat] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [healthyScore, setHealthyScore] = useState(8);
  const [suggestions, setSuggestions] = useState('');
  const [servingSize, setServingSize] = useState('1 serving');
  
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');
  const [logDate, setLogDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [manualMode, setManualMode] = useState(false);

  // Enumerate available cameras
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        console.log('[Camera] Available video devices:', videoDevices.length);
      } catch (error) {
        console.error('[Camera] Error enumerating devices:', error);
      }
    };
    getDevices();
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (webcamRef.current && webcamRef.current.stream) {
        console.log('[Camera] Cleaning up camera stream on unmount');
        webcamRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startWebcam = () => {
    console.log('[Camera] Starting webcam with facingMode:', facingMode);
    setWebcamActive(true);
    setImagePreview(null);
    setAnalysisResult(null);
  };

  const stopWebcam = () => {
    console.log('[Camera] Stopping webcam');
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setWebcamActive(false);
  };

  const switchCamera = () => {
    console.log('[Camera] Switching camera');
    // Stop current stream before switching
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (webcamRef.current) {
      const base64 = webcamRef.current.getScreenshot();
      if (base64) {
        setImagePreview(base64);
        setWebcamActive(false);
        triggerAIAnalysis(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setWebcamActive(false);
        triggerAIAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAIAnalysis = async (img: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await logFoodWithAI(img, mealType);
      
      // Populate fields
      setAnalysisResult(res);
      setFoodName(res.food_name);
      setCalories(res.calories.toString());
      setProtein(res.protein.toString());
      setFat(res.fat.toString());
      setCarbs(res.carbs.toString());
      setHealthyScore(res.healthy_score);
      setSuggestions(res.suggestions);
      setServingSize(res.serving_size);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || parseFloat(calories) < 0) return;

    try {
      await logFoodItem({
        food_name: foodName,
        calories: Math.round(parseFloat(calories)),
        protein: Math.round(parseFloat(protein)),
        fat: Math.round(parseFloat(fat)),
        carbs: Math.round(parseFloat(carbs)),
        healthy_score: healthyScore,
        suggestions: suggestions || 'Manually logged.',
        serving_size: servingSize || '1 serving',
        meal_type: mealType,
      }, logDate);
      
      navigate('/nutrition');
    } catch (e) {
      console.error(e);
    }
  };

  const enableManualMode = () => {
    setManualMode(true);
    setWebcamActive(false);
    setImagePreview(null);
    setAnalysisResult(null);
    setFoodName('');
    setCalories('0');
    setProtein('0');
    setFat('0');
    setCarbs('0');
    setHealthyScore(7);
    setSuggestions('Manually created entry.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Controls */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/nutrition')}
          className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
        >
          <ArrowLeft className="w-5.5 h-5.5" />
        </button>
        <span className="text-xs text-text-muted font-medium">Cancel Log</span>
      </div>

      {/* Main Container */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="text-center mb-6">
          <h2 className="font-heading font-extrabold text-xl text-text-main">Food Calorie Scanner</h2>
          <p className="text-xs text-text-muted mt-1">Let AI identify your meal macros or log manually</p>
        </div>

        {/* Manual Input Mode vs Camera Upload flow */}
        {!manualMode ? (
          <div className="flex flex-col gap-6">
            {/* Camera feed or file picker display */}
            {webcamActive ? (
              <div className="flex flex-col gap-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-bg-app border border-border-custom shadow-premium">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/webp"
                    className="w-full h-full object-cover"
                    videoConstraints={{
                      facingMode: facingMode,
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }}
                    onUserMedia={(stream) => {
                      console.log('[Camera] User media granted, stream active:', stream.active);
                    }}
                    onUserMediaError={(error) => {
                      console.error('[Camera] User media error:', error);
                    }}
                  />
                  <div className="absolute inset-0 border border-primary/20 pointer-events-none rounded-3xl" />
                  
                  {/* Camera switch button for mobile */}
                  {devices.length > 1 && (
                    <button
                      onClick={switchCamera}
                      className="absolute top-4 right-4 z-20 p-3 bg-black/50 backdrop-blur-sm rounded-full text-text-main hover:bg-black/70 transition-colors"
                      aria-label="Switch camera"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-success to-emerald-400 text-text-main text-xs font-bold shadow-glow shadow-success/15 hover:brightness-105"
                  >
                    Capture Plate
                  </button>
                  <button
                    onClick={stopWebcam}
                    className="px-6 py-3.5 rounded-2xl border border-border-custom hover:bg-bg-surface-alt text-xs font-bold text-text-muted hover:text-text-main"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="flex flex-col gap-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-bg-app border border-border-custom max-h-[220px]">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Meal upload review" />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-[#09090E]/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-accent animate-spin" />
                      <span className="text-xs text-text-muted font-medium animate-pulse">
                        Analyzing plate values...
                      </span>
                    </div>
                  )}
                </div>

                {!isAnalyzing && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => triggerAIAnalysis(imagePreview)}
                      className="flex-1 py-3 rounded-2xl border border-primary/20 bg-primary/10 hover:bg-primary/20 text-xs font-bold text-primary-light flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-4 h-4" /> Re-Analyze
                    </button>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setAnalysisResult(null);
                      }}
                      className="px-4 py-3 rounded-2xl border border-border-custom text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      aria-label="Remove image"
                    >
                      <Trash className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={startWebcam}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-custom hover:border-primary/40 rounded-3xl bg-bg-app/40 hover:bg-primary/5 transition-all text-text-muted hover:text-primary-light group"
                >
                  <Camera className="w-8 h-8 group-hover:scale-110 transition-transform mb-3 text-text-muted group-hover:text-primary-light" />
                  <span className="text-xs font-bold">Take Photo</span>
                  <span className="text-[10px] opacity-75 mt-1 font-sans">Use device webcam</span>
                </button>

                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border-custom hover:border-accent/40 rounded-3xl bg-bg-app/40 hover:bg-accent/5 transition-all text-text-muted hover:text-accent cursor-pointer group">
                  <Upload className="w-8 h-8 group-hover:scale-110 transition-transform mb-3 text-text-muted group-hover:text-accent" />
                  <span className="text-xs font-bold">Choose Image</span>
                  <span className="text-[10px] opacity-75 mt-1 font-sans">Upload from gallery</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {!imagePreview && !webcamActive && (
              <button
                onClick={enableManualMode}
                className="text-center text-xs font-bold text-primary-light hover:text-accent transition-colors py-2"
              >
                Skip AI scanner, enter details manually
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setManualMode(false)}
            className="w-full py-2.5 rounded-xl border border-border-custom text-center text-xs font-bold text-primary-light hover:bg-bg-surface-alt transition-colors mb-4"
          >
            ← Return to AI Scan Mode
          </button>
        )}

        {/* AI Result Card & Editing Fields */}
        {(analysisResult || manualMode) && (
          <form onSubmit={handleSave} className="flex flex-col gap-5 border-t border-border-custom pt-6 mt-6">
            
            {analysisResult && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 relative overflow-hidden mb-2">
                <div className="absolute right-0 top-0 w-20 h-20 bg-accent/5 rounded-full blur-xl" />
                <h4 className="text-xs font-extrabold text-accent flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4" /> AI Plate estimation
                </h4>
                <p className="text-[11px] text-text-muted leading-relaxed font-sans">
                  {suggestions}
                </p>
                <div className="flex gap-4 mt-3 text-xs font-sans font-bold">
                  <span className="text-text-main">Healthy Score: <strong className="text-accent">{healthyScore}/10</strong></span>
                  <span className="text-text-main">Serving: <strong className="text-text-muted">{servingSize}</strong></span>
                </div>
              </div>
            )}

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Food Item Name</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Avocado Toast"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-text-main"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-muted ml-1">Serving Size</label>
                <input
                  type="text"
                  required
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  placeholder="e.g. 1 plate, 300g"
                  className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-text-main"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Calories */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-400 text-center">Calories</label>
                <input
                  type="number"
                  required
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full p-2 bg-bg-app border border-border-custom rounded-xl text-xs font-sans focus:outline-none focus:border-primary text-text-main text-center"
                />
              </div>

              {/* Protein */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-success text-center">Protein (g)</label>
                <input
                  type="number"
                  required
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full p-2 bg-bg-app border border-border-custom rounded-xl text-xs font-sans focus:outline-none focus:border-primary text-text-main text-center"
                />
              </div>

              {/* Carbs */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-warning text-center">Carbs (g)</label>
                <input
                  type="number"
                  required
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full p-2 bg-bg-app border border-border-custom rounded-xl text-xs font-sans focus:outline-none focus:border-primary text-text-main text-center"
                />
              </div>

              {/* Fat */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-danger text-center">Fat (g)</label>
                <input
                  type="number"
                  required
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full p-2 bg-bg-app border border-border-custom rounded-xl text-xs font-sans focus:outline-none focus:border-primary text-text-main text-center"
                />
              </div>
            </div>

            {/* Meal Type Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-muted ml-1">Meal Type</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${
                      mealType === type
                        ? 'border-primary bg-primary/10 text-primary-light'
                        : 'border-border-custom hover:bg-bg-surface-alt text-text-muted hover:text-text-main'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Pick */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-muted ml-1">Logging Date</label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-4 py-3 bg-bg-app border border-border-custom rounded-2xl text-xs font-sans focus:outline-none focus:border-primary text-text-main"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-btn text-xs font-bold flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle className="w-4.5 h-4.5" /> Save Food Entry
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
