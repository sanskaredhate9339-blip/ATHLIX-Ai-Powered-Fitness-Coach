import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, Moon, Bell, Volume2, Shield, 
  Trash2, Database, Key, HelpCircle, ChevronRight
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // Mock settings states
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [googleFitSync, setGoogleFitSync] = useState(false);

  const handleResetCache = () => {
    if (confirm('Are you sure you want to reset all app cache? This will clear local logs and database seeds.')) {
      localStorage.clear();
      alert('Local database cache cleared.');
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Settings Options Card */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-5">
        <h4 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider mb-2">
          Interface Configuration
        </h4>

        {/* Theme Settings */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-custom/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-bg-surface-alt text-text-muted">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h5 className="text-xs font-bold text-text-main">App Dark Theme</h5>
              <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">Toggle interface luminance</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-[10px] font-bold text-primary-light uppercase tracking-wider transition-all"
          >
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-custom/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-bg-surface-alt text-text-muted">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-text-main">Push Notifications</h5>
              <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">Alerts about workout targets and hydration check-ins</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-10 h-5 bg-bg-surface-alt rounded-full appearance-none cursor-pointer border border-border-custom checked:bg-primary relative before:absolute before:content-[''] before:w-4 before:h-4 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:translate-x-5 before:transition-all"
          />
        </div>

        {/* Voice Coach Sound */}
        <div className="flex justify-between items-center py-2.5 border-b border-border-custom/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-bg-surface-alt text-text-muted">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-text-main">Audio Form Feedback</h5>
              <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">Voice feedback alerts during squats checking</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-10 h-5 bg-bg-surface-alt rounded-full appearance-none cursor-pointer border border-border-custom checked:bg-primary relative before:absolute before:content-[''] before:w-4 before:h-4 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:translate-x-5 before:transition-all"
          />
        </div>

        {/* Health database sync */}
        <div className="flex justify-between items-center py-2.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-bg-surface-alt text-text-muted">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-text-main">Google Fit Synchronization</h5>
              <p className="text-[10px] text-text-muted font-sans font-medium mt-0.5">Sync step counts and weights with external clouds</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={googleFitSync}
            onChange={(e) => setGoogleFitSync(e.target.checked)}
            className="w-10 h-5 bg-bg-surface-alt rounded-full appearance-none cursor-pointer border border-border-custom checked:bg-primary relative before:absolute before:content-[''] before:w-4 before:h-4 before:bg-white before:rounded-full before:top-[1px] before:left-[1px] checked:before:translate-x-5 before:transition-all"
          />
        </div>
      </div>

      {/* Security Info Card */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
        <h4 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
          Security Settings
        </h4>

        <div className="flex justify-between items-center py-1.5 border-b border-border-custom/50 text-xs font-sans hover:text-text-main cursor-pointer group transition-colors">
          <div className="flex items-center gap-3">
            <Key className="w-4.5 h-4.5 text-text-muted" />
            <span>Update Credentials Password</span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-text-muted group-hover:text-text-main transition-colors" />
        </div>

        <div className="flex justify-between items-center py-1.5 border-b border-border-custom/50 text-xs font-sans hover:text-text-main cursor-pointer group transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-4.5 h-4.5 text-text-muted" />
            <span>Privacy & GDPR Configurations</span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-text-muted group-hover:text-text-main transition-colors" />
        </div>

        <div className="flex justify-between items-center py-1.5 text-xs font-sans hover:text-text-main cursor-pointer group transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4.5 h-4.5 text-text-muted" />
            <span>Terms of Service Agreement</span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-text-muted group-hover:text-text-main transition-colors" />
        </div>
      </div>

      {/* Cache controller */}
      <div className="glass-panel p-6 rounded-3xl border border-danger/25 bg-danger/5">
        <h4 className="font-heading font-bold text-sm text-danger uppercase tracking-wider mb-2">
          Danger Area
        </h4>
        <p className="text-[10px] text-text-muted leading-relaxed mb-5 font-sans">
          This operation clears all cache seeds, including weight logs, macros entries, habits completes, and auth sessions. Use only for sandboxed development resets.
        </p>

        <button
          onClick={handleResetCache}
          className="w-full py-3.5 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Trash2 className="w-4.5 h-4.5" /> Reset Local Sandbox Cache
        </button>
      </div>
    </div>
  );
};
