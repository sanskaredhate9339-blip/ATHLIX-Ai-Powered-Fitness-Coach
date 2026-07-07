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
      try {
        if (!supabase) {
          console.error('Supabase not configured');
          window.location.href = '/login?error=no_supabase';
          return;
        }
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('OAuth callback error:', error);
          window.location.href = '/login?error=oauth_failed';
          return;
        }
        if (data.session) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('OAuth callback exception:', err);
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
