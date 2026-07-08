import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-4 border-primary border-t-accent animate-spin" />
          <span className="font-heading font-semibold text-text-muted text-sm tracking-wide animate-pulse">
            Loading Athlix...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wait for profile to load before making redirect decisions
  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-4 border-primary border-t-accent animate-spin" />
          <span className="font-heading font-semibold text-text-muted text-sm tracking-wide animate-pulse">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if authenticated but onboarding is incomplete
  if (!profile.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding page but already onboarded, redirect to dashboard
  if (profile.onboarded && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-app text-text-main pb-20 md:pb-0 md:pl-64">
      {/* Top Header */}
      <TopHeader />

      {/* Main Content Area */}
      <main className="pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto transition-all duration-300">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};
