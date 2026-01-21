'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ArrowUp, ArrowDown, Plus, X, CheckCircle } from 'lucide-react';
import { MOCK_ACTIVITY } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleViewAllActivity = () => {
    onClose();
    router.push('/profile');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'return':
        return ArrowUp;
      case 'list':
        return Plus;
      case 'borrow':
        return ArrowDown;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'return':
        return 'text-ethos-exemplary bg-ethos-exemplary/10';
      case 'list':
        return 'text-gold bg-gold/10';
      case 'borrow':
        return 'text-ethos-reputable bg-ethos-reputable/10';
      default:
        return 'text-dark-muted bg-dark-card';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:max-w-[384px] card p-0 overflow-hidden shadow-xl max-h-[80vh] flex flex-col"
        style={{ boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border bg-gradient-to-br from-gold/5 to-transparent">
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gold" />
            <h3 className="font-semibold text-lg">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-border rounded-lg transition-colors"
          >
            <X size={18} className="text-dark-muted" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1">
          {MOCK_ACTIVITY.length > 0 ? (
            <div className="divide-y divide-dark-border">
              {MOCK_ACTIVITY.map((activity, index) => {
                const Icon = getIcon(activity.type);
                const iconColorClass = getIconColor(activity.type);

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-dark-card/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-lg ${iconColorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-medium text-sm text-dark-text">
                            {activity.title}
                          </h4>
                          {activity.scoreChange !== 0 && (
                            <span
                              className={`text-xs font-semibold flex items-center gap-0.5 flex-shrink-0 ${
                                activity.scoreChange > 0
                                  ? 'text-ethos-exemplary'
                                  : 'text-ethos-untrusted'
                              }`}
                            >
                              {activity.scoreChange > 0 ? '+' : ''}
                              {activity.scoreChange}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-dark-muted mb-1">
                          {activity.subtitle}
                        </p>
                        <p className="text-xs text-dark-muted/70">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-card flex items-center justify-center">
                <Bell size={32} className="text-dark-muted" />
              </div>
              <p className="text-dark-muted">No notifications yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {MOCK_ACTIVITY.length > 0 && (
          <div className="p-3 border-t border-dark-border bg-dark-card/30">
            <button 
              onClick={handleViewAllActivity}
              className="w-full text-center text-sm text-gold hover:underline"
            >
              View All Activity
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
