import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { 
  Bell, Award, Dumbbell, Apple, CheckCircle2 
} from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications, readNotification, readAllNotifications } = useFitness();

  const handleMarkAllRead = async () => {
    await readAllNotifications();
    // Navigate back to dashboard after marking all as read
    window.history.back();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-accent" />;
      case 'workout': return <Dumbbell className="w-5 h-5 text-primary-light" />;
      case 'protein': return <Apple className="w-5 h-5 text-success" />;
      default: return <Bell className="w-5 h-5 text-warning" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Action Header controls */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-heading font-bold text-sm text-text-muted uppercase tracking-wider">
          Updates Log
        </h3>
        
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-primary-light hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="flex flex-col gap-3">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => !n.read && readNotification(n.id)}
              className={`glass-panel p-4.5 rounded-3xl flex items-start gap-4 transition-all relative overflow-hidden ${
                !n.read 
                  ? 'border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10' 
                  : 'border-border-custom hover:bg-white/5'
              }`}
            >
              {/* Highlight bar for unread item */}
              {!n.read && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              )}

              {/* Icon container */}
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                !n.read 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'bg-white/5 border-white/5 text-text-muted'
              }`}>
                {getNotifIcon(n.type)}
              </div>

              {/* Text descriptions */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-extrabold text-white leading-normal truncate">{n.title}</h4>
                  <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">
                    {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted mt-1 leading-relaxed font-sans font-medium">
                  {n.body}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 glass-panel rounded-3xl">
            <Bell className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40 animate-pulse" />
            <p className="text-xs text-text-muted font-sans italic">
              All caught up! No notifications to show.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
