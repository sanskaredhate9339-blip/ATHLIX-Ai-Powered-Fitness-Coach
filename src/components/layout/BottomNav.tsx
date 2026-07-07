import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Apple, Dumbbell, MessageCircle, User } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ComponentType<any>;
  route: string;
}

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Home', icon: Home, route: '/dashboard' },
    { label: 'Nutrition', icon: Apple, route: '/nutrition' },
    { label: 'Workout', icon: Dumbbell, route: '/workouts' },
    { label: 'Coach', icon: MessageCircle, route: '/chat' },
    { label: 'Profile', icon: User, route: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border-custom px-4 py-2 flex justify-around items-center md:top-0 md:bottom-auto md:left-0 md:right-auto md:w-64 md:h-screen md:flex-col md:justify-start md:items-stretch md:py-8 md:px-6 md:border-r md:border-t-0">
      {/* Brand logo for desktop sidebar */}
      <div className="hidden md:flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-heading font-extrabold text-lg tracking-wider text-white shadow-glow">
          A
        </div>
        <span className="font-heading font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
          ATHLIX
        </span>
      </div>

      <div className="flex justify-around w-full md:flex-col md:gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Check if active: either exact match or route is prefix (e.g. /nutrition/log matches /nutrition)
          const isActive = 
            location.pathname === item.route || 
            (item.route !== '/dashboard' && location.pathname.startsWith(item.route));

          return (
            <NavLink
              key={item.route}
              to={item.route}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300 md:flex-row md:justify-start md:gap-4 md:py-3.5 md:px-5 ${
                isActive
                  ? 'text-primary md:bg-primary/10 md:text-primary-light font-semibold shadow-premium'
                  : 'text-text-muted hover:text-text-main md:hover:bg-bg-surface-alt'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full md:hidden" />
                )}
              </div>
              <span className="text-[10px] mt-1 md:text-sm md:mt-0 font-sans tracking-wide">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
