import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitness } from '../../context/FitnessContext';
import {
  Bell, Award, Dumbbell, Apple, CheckCircle2, X, Check
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, readNotification, readAllNotifications } = useFitness();
  const [activeNotifications, setActiveNotifications] = React.useState(notifications);

  useEffect(() => {
    setActiveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-accent" />;
      case 'workout': return <Dumbbell className="w-5 h-5 text-primary-light" />;
      case 'protein': return <Apple className="w-5 h-5 text-success" />;
      default: return <Bell className="w-5 h-5 text-warning" />;
    }
  };

  const handleMarkRead = async (id: string) => {
    // Animate item removal locally first
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
    // Wait for exit animation to complete, then update DB and close
    setTimeout(async () => {
      await readNotification(id);
      onClose();
    }, 350);
  };

  const handleMarkAllRead = async () => {
    // Animate all removal locally
    setActiveNotifications([]);
    setTimeout(async () => {
      await readAllNotifications();
      onClose();
    }, 350);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-surface border-l border-border-custom z-50 flex flex-col shadow-2xl"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between p-4 border-b border-border-custom">
              <div>
                <h2 className="font-heading font-bold text-lg text-text-main">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-[10px] text-text-muted mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-bold text-primary-light hover:text-accent flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-surface-alt transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {activeNotifications.length > 0 ? (
                <AnimatePresence initial={false}>
                  {activeNotifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                      className={`glass-panel p-4 rounded-2xl flex items-start gap-3 transition-all relative overflow-hidden ${
                        !n.read
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border-custom'
                      }`}
                    >
                      {!n.read && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
                      )}

                      <div className={`p-2 rounded-xl border shrink-0 ${
                        !n.read
                          ? 'bg-primary/10 border-primary/20'
                          : 'bg-bg-surface-alt border-border-custom'
                      }`}>
                        {getNotifIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-extrabold text-text-main leading-normal">{n.title}</h4>
                          <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-muted mt-1 leading-relaxed">{n.body}</p>

                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="mt-2.5 text-[10px] font-bold text-primary-light hover:text-accent flex items-center gap-1 transition-colors"
                          >
                            <Check className="w-3 h-3" /> Mark as Read
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-16">
                  <Bell className="w-10 h-10 text-text-muted mx-auto mb-3 opacity-40" />
                  <p className="text-xs text-text-muted italic">All caught up! No notifications to show.</p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
