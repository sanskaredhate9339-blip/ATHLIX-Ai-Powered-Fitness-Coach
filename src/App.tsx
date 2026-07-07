import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './services/supabase';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { UnitProvider } from './context/UnitContext';
import { AuthProvider } from './context/AuthContext';
import { FitnessProvider } from './context/FitnessContext';

// Layout Wrappers
import { AppLayout } from './components/layout/AppLayout';

// Public Guest Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';

// Protected App Pages
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Nutrition } from './pages/Nutrition';
import { NutritionLog } from './pages/NutritionLog';
import { Workouts } from './pages/Workouts';
import { Exercises } from './pages/Exercises';
import { FormAnalysis } from './pages/FormAnalysis';
import { Chat } from './pages/Chat';
import { Habits } from './pages/Habits';
import { Weight } from './pages/Weight';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

// OAuth Callback Handler
const AuthCallback = () => {
  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('[AuthCallback] Starting OAuth callback handling');
      
      try {
        if (!supabase) {
          console.error('[AuthCallback] Supabase not configured');
          window.location.href = '/login?error=no_supabase';
          return;
        }

        // Supabase handles OAuth session exchange automatically from URL hash/params
        // We need to wait for the session to be established
        console.log('[AuthCallback] Waiting for session to be established...');
        
        // Try to get session with retries for slower mobile networks
        let session = null;
        let lastError = null;
        
        for (let i = 0; i < 5; i++) {
          const { data, error } = await supabase.auth.getSession();
          lastError = error;
          
          if (data.session) {
            session = data.session;
            console.log('[AuthCallback] Session established on attempt', i + 1);
            break;
          }
          
          // Wait before retry (exponential backoff)
          if (i < 4) {
            const delay = 500 * Math.pow(2, i);
            console.log(`[AuthCallback] No session yet, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        if (lastError) {
          console.error('[AuthCallback] OAuth callback error:', lastError);
          window.location.href = '/login?error=oauth_failed';
          return;
        }

        if (session) {
          console.log('[AuthCallback] Session established successfully');
          console.log('[AuthCallback] User ID:', session.user.id);
          console.log('[AuthCallback] User email:', session.user.email);
          
          // Wait a moment for auth state to propagate
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Navigate to dashboard (auth context will handle onboarding check)
          window.location.href = '/dashboard';
        } else {
          console.error('[AuthCallback] No session after retries');
          window.location.href = '/login?error=no_session';
        }
      } catch (err) {
        console.error('[AuthCallback] OAuth callback exception:', err);
        window.location.href = '/login?error=oauth_error';
      }
    };
    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-primary border-t-accent animate-spin" />
        <span className="font-heading font-semibold text-text-muted text-sm tracking-wide animate-pulse">
          Signing in with Google...
        </span>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <UnitProvider>
          <AuthProvider>
            <FitnessProvider>
              <Routes>
                {/* Public Guest Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected Routes (Require Auth & Onboarding checks) */}
                <Route element={<AppLayout />}>
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nutrition" element={<Nutrition />} />
                  <Route path="/nutrition/log" element={<NutritionLog />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/exercises" element={<Exercises />} />
                  <Route path="/form-analysis" element={<FormAnalysis />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/habits" element={<Habits />} />
                  <Route path="/weight" element={<Weight />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* 404 Fallback Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </FitnessProvider>
          </AuthProvider>
        </UnitProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
