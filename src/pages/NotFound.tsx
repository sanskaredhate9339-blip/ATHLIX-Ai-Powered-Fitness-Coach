import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090E] flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-danger/5 rounded-full blur-[80px]" />
      
      <div className="glass-panel p-10 rounded-3xl z-10 max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-danger/15 border border-danger/20 flex items-center justify-center text-danger mx-auto mb-6 shadow-glow shadow-danger/10 animate-bounce">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <h1 className="font-heading font-extrabold text-6xl text-white mb-2 tracking-tight">404</h1>
        <h2 className="font-heading font-bold text-lg text-white mb-3">Page Not Found</h2>
        <p className="text-xs text-text-muted mb-8 leading-relaxed">
          The route you are trying to access does not exist or has been moved. Let's get you back on track.
        </p>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};
