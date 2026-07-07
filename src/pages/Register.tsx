import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Password strength checks
  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const getStrengthPercent = () => {
    const passedCount = Object.values(checks).filter(Boolean).length;
    return (passedCount / 4) * 100;
  };

  const getStrengthLabel = () => {
    const percent = getStrengthPercent();
    if (percent === 0) return 'Very Weak';
    if (percent <= 25) return 'Weak';
    if (percent <= 50) return 'Medium';
    if (percent <= 75) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = () => {
    const percent = getStrengthPercent();
    if (percent <= 25) return 'bg-danger';
    if (percent <= 50) return 'bg-warning';
    return 'bg-success';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (getStrengthPercent() < 50) {
      setErrorMsg('Please choose a stronger password.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must accept the Terms and Conditions.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      // Turn on success screen to show verification step
      setSuccessMode(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  if (successMode) {
    return (
      <div className="min-h-screen bg-bg-app flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl text-center z-10">
          <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mx-auto mb-6 shadow-glow animate-bounce">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-text-main mb-2">Check your Inbox</h2>
          <p className="text-sm text-text-muted mb-4 leading-relaxed font-sans">
            We have sent a verification link to <span className="text-text-main font-semibold">{email}</span>. Please click the link to confirm your account and log in.
          </p>
          <div className="p-4 rounded-2xl bg-bg-surface-alt border border-border-custom text-xs text-text-muted mb-8 leading-relaxed italic">
            Hint: In Local Mode, you can bypass email checking. Tap the button below to complete setup.
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2"
          >
            Go to Onboarding (Direct Bypass)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <Link to="/" className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-heading font-extrabold text-lg tracking-wider text-white shadow-glow">
              A
            </div>
            <span className="font-heading font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              ATHLIX
            </span>
          </Link>
          <h2 className="font-heading font-bold text-xl text-text-main">Create Account</h2>
          <p className="text-xs text-text-muted mt-1">Start your AI health transformation today</p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-4 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted ml-1" htmlFor="name">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-sm font-sans focus:outline-none transition-all text-text-main placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
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
                className="w-full pl-12 pr-4 py-3 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-sm font-sans focus:outline-none transition-all text-text-main placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full pl-12 pr-12 py-3 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-sm font-sans focus:outline-none transition-all text-text-main placeholder:text-text-muted/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-main transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="mt-2.5 px-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                  <span>Strength: {getStrengthLabel()}</span>
                  <span>{Math.round(getStrengthPercent())}%</span>
                </div>
                <div className="w-full h-1.5 bg-bg-surface-alt rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                    style={{ width: `${getStrengthPercent()}%` }}
                  />
                </div>
                {/* Requirements checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px] text-text-muted font-sans font-medium">
                  <div className="flex items-center gap-1">
                    {checks.length ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-danger" />}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {checks.hasUpper ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-danger" />}
                    <span>1+ uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {checks.hasNumber ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-danger" />}
                    <span>1+ number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {checks.hasSpecial ? <Check className="w-3.5 h-3.5 text-success" /> : <X className="w-3.5 h-3.5 text-danger" />}
                    <span>1+ special char</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted ml-1" htmlFor="confirm">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                id="confirm"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-12 pr-4 py-3 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-sm font-sans focus:outline-none transition-all text-text-main placeholder:text-text-muted/60"
              />
            </div>
          </div>

          {/* Terms & Privacy checkbox */}
          <div className="flex items-start gap-2 px-1 mt-1">
            <input
              id="terms"
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4.5 h-4.5 accent-primary rounded-lg border-border-custom bg-bg-app mt-0.5"
            />
            <label htmlFor="terms" className="text-xs font-medium text-text-muted select-none cursor-pointer leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-primary-light hover:underline font-semibold">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary-light hover:underline font-semibold">Privacy Policy</a>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <hr className="w-full border-border-custom" />
          <span className="absolute px-3 bg-bg-surface text-[10px] font-bold text-text-muted uppercase tracking-wider">
            or continue with
          </span>
        </div>

        <button
          onClick={() => {
            setSuccessMode(true);
          }}
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl border border-border-custom hover:bg-white/5 text-sm font-bold text-slate-300 flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.253-3.133C18.29 1.57 15.539 0 12.24 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.923 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.188-1.989H12.24z"
            />
          </svg>
          Google Registration
        </button>

        <div className="mt-8 text-center text-xs text-text-muted font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light hover:text-accent font-semibold transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
