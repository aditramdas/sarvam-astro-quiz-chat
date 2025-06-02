import React, { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import { Badge } from '../services/gamificationService';

interface BadgeNotificationProps {
  badge: Badge;
  onClose: () => void;
  delay?: number;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, delay);

    const hideTimer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, delay + 4000); // Show for 4 seconds

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [delay, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl p-4 shadow-2xl border-2 border-yellow-300 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-800" />
            <h3 className="font-bold text-amber-900">New Badge Earned!</h3>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              setTimeout(onClose, 300);
            }}
            className="text-amber-800 hover:text-amber-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-3xl animate-bounce">{badge.icon}</div>
          <div>
            <p className="font-semibold text-amber-900">{badge.name}</p>
            <p className="text-sm text-amber-800">{badge.description}</p>
          </div>
        </div>
        
        <div className="mt-3 bg-amber-200 rounded-lg p-2">
          <p className="text-xs text-amber-800 text-center font-medium">
            🎉 Keep exploring space to earn more badges! 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification; 