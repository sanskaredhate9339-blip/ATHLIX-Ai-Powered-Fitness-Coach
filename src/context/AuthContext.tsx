import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { db } from '../services/db';
import type { UserProfile } from '../services/db';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeOnboarding: (onboardingData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Session Listeners
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          setUserEmail(session.user.email || null);
          
          const p = await db.fetchUserProfile();
          
          // If no profile exists for this user, check localStorage first
          if (!p) {
            const localProfile = localStorage.getItem('athlix_profile');
            if (localProfile) {
              try {
                const parsed = JSON.parse(localProfile);
                if (parsed && parsed.onboarded) {
                  setProfile(parsed);
                  // Sync to Supabase to prevent future data loss
                  await db.updateUserProfile(parsed);
                  setIsLoading(false);
                  return;
                }
              } catch (e) {
                // If parse fails, continue to create new profile
              }
            }
            // Only create minimal profile if no valid local profile exists
            const newProfile = await db.updateUserProfile({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              age: 0,
              gender: '',
              height: 0,
              weight: 0,
              goal: '',
              experience_level: 'Beginner',
              available_equipment: [],
              workout_days_preference: 3,
              preferred_session_duration: 45,
              unit_preference: 'metric',
              notification_preferences: {
                workout: true,
                water: true,
                protein: true,
                sleep: true,
                weekly_report: true,
              },
              onboarded: false,
            });
            setProfile(newProfile);
          } else {
            setProfile(p);
          }
        } else {
        }
        setIsLoading(false);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          
          if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.user.email || null);
            
            const p = await db.fetchUserProfile();
            
            // If no profile exists for this user, check localStorage first
            if (!p) {
              const localProfile = localStorage.getItem('athlix_profile');
              if (localProfile) {
                try {
                  const parsed = JSON.parse(localProfile);
                  if (parsed && parsed.onboarded) {
                    setProfile(parsed);
                    // Sync to Supabase to prevent future data loss
                    await db.updateUserProfile(parsed);
                    return;
                  }
                } catch (e) {
                  // If parse fails, continue to create new profile
                }
              }
              // Only create minimal profile if no valid local profile exists
              const newProfile = await db.updateUserProfile({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                age: 0,
                gender: '',
                height: 0,
                weight: 0,
                goal: '',
                experience_level: 'Beginner',
                available_equipment: [],
                workout_days_preference: 3,
                preferred_session_duration: 45,
                unit_preference: 'metric',
                notification_preferences: {
                  workout: true,
                  water: true,
                  protein: true,
                  sleep: true,
                  weekly_report: true,
                },
                onboarded: false,
              });
              setProfile(newProfile);
            } else {
              setProfile(p);
            }
          } else {
            setIsAuthenticated(false);
            setUserEmail(null);
            setProfile(null);
          }
          setIsLoading(false);
        });

        return () => subscription.unsubscribe();
      } else {
        // Local Fallback Auth Check
        console.log('[Auth] Local fallback auth check');
        const sessionActive = localStorage.getItem('athlix_session_active') === 'true';
        console.log('[Auth] Session active:', sessionActive);
        if (sessionActive) {
          setIsAuthenticated(true);
          const activeEmail = localStorage.getItem('athlix_session_email');
          console.log('[Auth] Active email:', activeEmail);
          setUserEmail(activeEmail);
          const p = await db.fetchUserProfile();
          console.log('[Auth] Fetched profile:', p);
          setProfile(p);
        } else {
          console.log('[Auth] No active session, checking for existing profile');
          // Even without session, check if there's a profile in localStorage
          const existingProfile = localStorage.getItem('athlix_profile');
          console.log('[Auth] Existing profile in localStorage:', existingProfile);
          if (existingProfile) {
            try {
              const parsed = JSON.parse(existingProfile);
              if (parsed && parsed.onboarded) {
                console.log('[Auth] Found valid profile, setting authenticated state');
                setIsAuthenticated(true);
                const activeEmail = localStorage.getItem('athlix_session_email');
                setUserEmail(activeEmail);
                setProfile(parsed);
                setIsLoading(false);
                return;
              }
            } catch (e) {
              console.error('[Auth] Error parsing existing profile:', e);
            }
          }
          setIsAuthenticated(false);
          setUserEmail(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const refreshProfile = async () => {
    const p = await db.fetchUserProfile();
    setProfile(p);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Mock success
        localStorage.setItem('athlix_session_active', 'true');
        localStorage.setItem('athlix_session_email', email);
        
        setIsAuthenticated(true);
        setUserEmail(email);
        const p = await db.fetchUserProfile();
        setProfile(p);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const redirectUrl = `${window.location.origin}/auth/callback`;
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: false, // Ensure redirect-based flow (not popup)
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            }
          }
        });
        
        if (error) {
          console.error('[Auth] Google OAuth error:', error);
          throw error;
        }
        
      } else {
        throw new Error('Google SSO requires Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      }
    } catch (error) {
      console.error('[Auth] Google sign-in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
      } else {
        // Mock register: Setup fresh profile with minimal data, force onboarding
        localStorage.setItem('athlix_session_active', 'true');
        localStorage.setItem('athlix_session_email', email);
        
        const freshProfile: UserProfile = {
          name,
          age: 0,
          gender: '',
          height: 0,
          weight: 0,
          goal: '',
          experience_level: 'Beginner',
          available_equipment: [],
          workout_days_preference: 3,
          preferred_session_duration: 45,
          unit_preference: 'metric',
          notification_preferences: {
            workout: true,
            water: true,
            protein: true,
            sleep: true,
            weekly_report: true,
          },
          onboarded: false, // forces onboarding redirect
        };
        
        // Save fresh profile to local storage database
        localStorage.setItem('athlix_profile', JSON.stringify(freshProfile));
        setIsAuthenticated(true);
        setUserEmail(email);
        setProfile(freshProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
        // Clear local state but keep profile in localStorage for recovery
        setIsAuthenticated(false);
        setUserEmail(null);
        setProfile(null);
      } else {
        localStorage.removeItem('athlix_session_active');
        localStorage.removeItem('athlix_session_email');
        setIsAuthenticated(false);
        setUserEmail(null);
        setProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) throw error;
    } else {
      // Mock reset email triggers console alert
      console.log(`Mock reset password link sent to: ${email}`);
    }
  };

  const completeOnboarding = async (onboardingData: Partial<UserProfile>) => {
    console.log('[Auth] completeOnboarding called with:', onboardingData);
    const updated = await db.updateUserProfile({
      ...onboardingData,
      onboarded: true
    });
    console.log('[Auth] Updated profile from DB:', updated);
    // Directly set the updated profile to ensure state is correct
    setProfile(updated);
    // Force sync to localStorage immediately
    localStorage.setItem('athlix_profile', JSON.stringify(updated));
    console.log('[Auth] Profile saved to localStorage');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        profile,
        login,
        loginWithGoogle,
        register,
        logout,
        resetPassword,
        refreshProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
