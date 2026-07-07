import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../services/supabase';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Auth failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-heading font-extrabold text-lg tracking-wider text-white shadow-glow">
              A
            </div>
            <span className="font-heading font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              ATHLIX
            </span>
          </Link>
          <h2 className="font-heading font-bold text-xl text-text-main">Welcome Back</h2>
          <p className="text-xs text-text-muted mt-1">Enter your credentials to enter the coach</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger font-medium leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-muted ml-1" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-xs font-sans focus:outline-none transition-all text-text-main placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-text-muted" htmlFor="password">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-bold text-primary-light hover:text-accent transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-12 py-3.5 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-xs font-mono focus:outline-none transition-all text-text-main placeholder:text-text-muted/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2.5 ml-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 bg-bg-app border border-border-custom rounded-md focus:ring-0 text-primary accent-primary"
            />
            <label htmlFor="remember" className="text-[11px] font-semibold text-text-muted cursor-pointer font-sans select-none">
              Remember my session
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <hr className="w-full border-border-custom" />
          <span className="absolute px-3 bg-bg-surface text-[10px] font-bold text-text-muted uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting || !isSupabaseConfigured}
          className="w-full py-3.5 rounded-2xl border border-border-custom hover:bg-white/5 text-sm font-bold text-slate-300 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={!isSupabaseConfigured ? 'Google SSO requires Supabase configuration' : ''}
        >
          {/* Flat Google logo */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.29 1.57 15.539 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.923 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.188-1.989H12.24z"
            />
          </svg>
          Google Single Sign-On
        </button>
        {!isSupabaseConfigured && (
          <p className="text-[10px] text-text-muted text-center mt-2">
            Google SSO requires Supabase configuration
          </p>
        )}

        <div className="mt-8 text-center text-xs text-text-muted font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-light hover:text-accent font-semibold transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
