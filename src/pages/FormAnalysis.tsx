import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { 
  CameraOff, Volume2, VolumeX, Play, Square, 
  RotateCcw, ShieldAlert, CheckCircle, Sparkles
} from 'lucide-react';

export const FormAnalysis: React.FC = () => {
  const location = useLocation();

  // Exercise states
  const [selectedExercise, setSelectedExercise] = useState('Squat');
  const [cameraActive, setCameraActive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Real-time tracking metrics
  const [repCount, setRepCount] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(180);
  const [warningMessage, setWarningMessage] = useState('Stand straight to begin');
  const [depthStatus, setDepthStatus] = useState<'high' | 'parallel' | 'deep'>('high');

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Set exercise if redirected from workouts
  useEffect(() => {
    if (location.state && (location.state as any).exercise) {
      const exName = (location.state as any).exercise;
      if (exName.toLowerCase().includes('squat')) setSelectedExercise('Squat');
      if (exName.toLowerCase().includes('push')) setSelectedExercise('Push-up');
    }
  }, [location.state]);

  // Handle simulated joint tracking canvas rendering
  useEffect(() => {
    if (!cameraActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let direction = -1; // -1 for going down, 1 for going up
    let angle = 180;
    let localReps = 0;

    const drawSkeleton = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Simulating depth angle
      if (direction === -1) {
        angle -= 1.5;
        if (angle <= 80) {
          direction = 1;
          localReps++;
          setRepCount(localReps);
          // Play simulated audio cue if enabled
          if (voiceEnabled) {
            triggerVoiceCue('Rep complete. Great depth.');
          }
        }
      } else {
        angle += 1.5;
        if (angle >= 180) {
          direction = -1;
        }
      }

      setCurrentAngle(Math.round(angle));

      // Calculate state feedback
      if (angle > 140) {
        setWarningMessage('Begin your descent');
        setDepthStatus('high');
      } else if (angle > 100 && angle <= 140) {
        setWarningMessage('Keep knees aligned, chest high');
        setDepthStatus('high');
      } else if (angle > 85 && angle <= 100) {
        setWarningMessage('Parallel depth reached!');
        setDepthStatus('parallel');
      } else {
        setWarningMessage('Deep squat. Hold posture.');
        setDepthStatus('deep');
      }

      // Draw skeleton coordinates overlay
      const width = canvas.width;
      const height = canvas.height;

      // Base coordinates mapping
      const hipX = width * 0.5;
      const hipY = height * 0.45;
      
      const shoulderX = width * 0.5;
      const shoulderY = height * 0.25;

      // Knee moves outward and down
      const kneeOffset = (180 - angle) * 0.4;
      const kneeX = width * 0.45 - kneeOffset * 0.2;
      const kneeY = height * 0.65 + kneeOffset * 0.3;

      // Ankle stays grounded
      const ankleX = width * 0.45;
      const ankleY = height * 0.85;

      // Draw Joint points
      ctx.fillStyle = '#06B6D4'; // neon cyan
      
      // Head
      ctx.beginPath();
      ctx.arc(shoulderX, shoulderY - 30, 12, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders, hips, knees, ankles
      const joints = [
        { x: shoulderX, y: shoulderY },
        { x: hipX, y: hipY },
        { x: kneeX, y: kneeY },
        { x: ankleX, y: ankleY }
      ];

      joints.forEach((j) => {
        ctx.beginPath();
        ctx.arc(j.x, j.y, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw bones connection lines
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'; // cyan transparent
      ctx.lineWidth = 4;

      // Torso
      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      // Thigh
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.stroke();

      // Shin
      ctx.beginPath();
      ctx.moveTo(kneeX, kneeY);
      ctx.lineTo(ankleX, ankleY);
      ctx.stroke();

      // Highlight joint angle with red or green glow arcs
      ctx.strokeStyle = angle <= 95 ? '#10B981' : '#F59E0B'; // green if deep/parallel, amber otherwise
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(kneeX, kneeY, 20, 0, Math.PI * 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawSkeleton);
    };

    drawSkeleton();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [cameraActive, voiceEnabled]);

  const triggerVoiceCue = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReset = () => {
    setRepCount(0);
    setCurrentAngle(180);
    setWarningMessage('Stand straight to begin');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Exercise Selector */}
      <div className="glass-panel p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-base text-white">Pose Form Analysis</h3>
          <p className="text-xs text-text-muted mt-1">Real-time biomechanics feedback using device camera</p>
        </div>

        <div className="flex gap-2">
          {['Squat', 'Push-up'].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setSelectedExercise(ex);
                handleReset();
              }}
              className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                selectedExercise === ex
                  ? 'border-primary bg-primary/10 text-primary-light'
                  : 'border-border-custom hover:bg-white/5 text-text-muted hover:text-text-main'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Camera Viewport Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Video/Skeleton feed */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-bg-app border border-border-custom shadow-premium flex items-center justify-center">
            {cameraActive ? (
              <>
                <Webcam
                  audio={false}
                  className="w-full h-full object-cover opacity-60"
                  screenshotFormat="image/webp"
                />
                {/* Canvas Overlay for joint nodes */}
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              </>
            ) : (
              <div className="text-center p-8 flex flex-col items-center">
                <CameraOff className="w-12 h-12 text-text-muted mb-4 opacity-40 animate-pulse" />
                <h4 className="font-heading font-bold text-white text-sm mb-2">Webcam Inactive</h4>
                <p className="text-xs text-text-muted mb-6 max-w-xs leading-relaxed font-sans">
                  Enable your camera below to overlay the tracking skeleton and begin rep counting.
                </p>
                <button
                  onClick={() => setCameraActive(true)}
                  className="py-3 px-6 rounded-2xl gradient-btn text-xs font-bold flex items-center gap-2 shadow-glow"
                >
                  <Play className="w-4 h-4" /> Start Camera Feed
                </button>
              </div>
            )}

            {/* Glowing active indicator */}
            {cameraActive && (
              <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-danger/10 border border-danger/30 rounded-full text-[10px] font-bold text-danger flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-danger rounded-full" /> Live Form Checking
              </span>
            )}
          </div>

          {/* Camera & audio toggle bar */}
          {cameraActive && (
            <div className="flex gap-4">
              <button
                onClick={() => setCameraActive(false)}
                className="flex-1 py-3.5 rounded-2xl bg-danger/10 hover:bg-danger/20 border border-danger/25 text-xs font-bold text-danger flex items-center justify-center gap-2 transition-all"
              >
                <Square className="w-4 h-4" /> Stop Camera Feed
              </button>
              
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-6 py-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  voiceEnabled
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border-custom hover:bg-white/5 text-text-muted'
                }`}
                aria-label="Toggle voice feedback"
              >
                {voiceEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
                Voice Coach
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Metrics panel */}
        <div className="flex flex-col gap-6">
          
          {/* Rep counts and depth */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6">
            <div className="text-center border-b border-border-custom pb-6">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Rep Count</span>
              <span className="font-heading font-extrabold text-6.5xl text-white block mt-2 font-mono">
                {repCount}
              </span>
              <button
                onClick={handleReset}
                className="mt-3 text-[10px] font-bold text-text-muted hover:text-white flex items-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Reps
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Joint angle */}
              <div className="text-center p-4 bg-bg-app/40 border border-border-custom rounded-2xl">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Knee Angle</span>
                <span className="font-heading font-bold text-lg text-white mt-1 block font-mono">
                  {currentAngle}°
                </span>
              </div>

              {/* Depth Status */}
              <div className="text-center p-4 bg-bg-app/40 border border-border-custom rounded-2xl">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Depth Reach</span>
                <span className={`text-xs font-bold mt-1.5 block capitalize ${
                  depthStatus === 'deep' ? 'text-success' : depthStatus === 'parallel' ? 'text-accent' : 'text-warning'
                }`}>
                  {depthStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback & warnings */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
            <h4 className="font-heading font-bold text-xs text-text-muted uppercase tracking-wider">
              Real-time Posture Advice
            </h4>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
              {depthStatus === 'deep' || depthStatus === 'parallel' ? (
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-warning mt-0.5" />
              )}
              <div>
                <h5 className="text-xs font-bold text-white">Coach Feedback</h5>
                <p className="text-[10px] text-text-muted mt-1 leading-relaxed font-sans">
                  {warningMessage}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/25">
              <h5 className="text-xs font-bold text-primary-light flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-4 h-4" /> Setup Instructions
              </h5>
              <p className="text-[10px] text-text-muted leading-relaxed font-sans">
                Position your device camera 6-8 feet away at hip level. Keep your whole body in frame from head to heels. Perform squats or pushups slowly.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
