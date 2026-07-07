import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setSuccessMode(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send recovery email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090E] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl z-10 transition-all duration-300">
        {!successMode ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light mb-4 shadow-glow">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-bold text-xl text-white">Password Recovery</h2>
              <p className="text-xs text-text-muted text-center mt-1.5 px-4 leading-relaxed">
                Enter your email address and we will email you a link to reset your password.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-bg-app border border-border-custom focus:border-primary rounded-2xl text-sm font-sans focus:outline-none transition-all placeholder:text-text-muted/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gradient-btn text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mx-auto mb-6 shadow-glow animate-pulse">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white mb-2">Check your Email</h2>
            <p className="text-sm text-text-muted mb-8 leading-relaxed font-sans px-2">
              If an account exists for <span className="text-white font-semibold">{email}</span>, a message has been sent with link credentials to rewrite your password.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
