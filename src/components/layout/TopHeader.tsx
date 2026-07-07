import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';

export const TopHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useFitness();

  const path = location.pathname;

  // Determine page title
  const getPageTitle = (): string => {
    if (path.startsWith('/dashboard')) return 'Athlix';
    if (path.startsWith('/nutrition/log')) return 'AI Meal Log';
    if (path.startsWith('/nutrition')) return 'Nutrition Log';
    if (path.startsWith('/workouts')) return 'Workout Plan';
    if (path.startsWith('/chat')) return 'AI Coach';
    if (path.startsWith('/profile')) return 'My Profile';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/form-analysis')) return 'Form Analysis';
    if (path.startsWith('/habits')) return 'Habit Tracker';
    if (path.startsWith('/weight')) return 'Weight Tracker';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/notifications')) return 'Notifications';
    if (path.startsWith('/exercises')) return 'Exercise Library';
    return 'Athlix';
  };

  // Determine if it is a main tab root
  const rootRoutes = ['/dashboard', '/nutrition', '/workouts', '/chat', '/profile'];
  const isRoot = rootRoutes.includes(path);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-panel h-16 px-4 flex items-center justify-between md:left-64 md:border-b md:border-border-custom md:shadow-none">
      <div className="flex items-center gap-3">
        {!isRoot && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="font-heading font-bold text-lg md:text-xl tracking-tight text-text-main">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications Icon */}
        {path !== '/notifications' && (
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-5.5 h-5.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border border-bg-surface animate-pulse" />
            )}
          </button>
        )}

        {/* Profile Settings Icon */}
        {path.startsWith('/profile') && (
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
            aria-label="Open settings"
          >
            <Settings className="w-5.5 h-5.5" />
          </button>
        )}
      </div>
    </header>
  );
};
