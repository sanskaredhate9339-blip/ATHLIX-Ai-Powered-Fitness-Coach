import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { userEmail } = useAuth();
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setIsResending(false);
      setCooldown(60);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#09090E] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl text-center z-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mx-auto mb-6 shadow-glow animate-pulse">
          <Mail className="w-7 h-7" />
        </div>

        <h2 className="font-heading font-extrabold text-2xl text-white mb-2">Check your Inbox</h2>
        <p className="text-sm text-text-muted mb-6 leading-relaxed px-4">
          We have sent a verification link to your email:<br />
          <span className="text-white font-semibold">{userEmail || 'your-email@example.com'}</span>
        </p>

        <p className="text-xs text-text-muted mb-8 px-6 leading-relaxed">
          Please click the confirmation link in the email to activate your account. If you don't see it, check your spam folder.
        </p>

        <button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="w-full py-4 rounded-2xl border border-border-custom hover:bg-white/5 disabled:bg-transparent text-sm font-bold text-slate-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
          {cooldown > 0 ? `Resend Link in ${cooldown}s` : 'Resend Verification Email'}
        </button>

        <div className="mt-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
