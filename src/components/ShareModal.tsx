import React, { useState } from 'react';
import { X, Share2, Copy, Twitter, Facebook, MessageCircle, CheckCircle } from 'lucide-react';
import { UserStats, gamificationService } from '../services/gamificationService';

interface ShareModalProps {
  stats: UserStats;
  currentLanguage: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ stats, currentLanguage, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const shareMessage = gamificationService.generateShareMessage(stats, currentLanguage);
  const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const earnedBadges = gamificationService.getEarnedBadges();
  const progressToNext = gamificationService.getProgressToNextBadge(stats);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Share Your Achievement</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{accuracy}%</p>
                <p className="text-xs opacity-90">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.bestStreak}</p>
                <p className="text-xs opacity-90">Best Streak</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{earnedBadges.length}</p>
                <p className="text-xs opacity-90">Badges</p>
              </div>
            </div>
          </div>

          {/* Recent Badges */}
          {earnedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Badges</h3>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.slice(-6).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-2 rounded-full border border-amber-200"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <span className="text-xs font-medium text-amber-800">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress to Next Badge */}
          {progressToNext && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Next Badge Progress</h3>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{progressToNext.badge.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{progressToNext.badge.name}</p>
                    <p className="text-xs text-gray-600">{progressToNext.badge.description}</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((progressToNext.progress / progressToNext.total) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {progressToNext.progress} / {progressToNext.total}
                </p>
              </div>
            </div>
          )}

          {/* Share Message */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Share Message</h3>
            <div className="bg-gray-50 rounded-lg p-4 relative">
              <p className="text-sm text-gray-800 leading-relaxed">{shareMessage}</p>
              <button
                onClick={handleCopyToClipboard}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 ${
                  copied ? 'bg-green-100 text-green-600' : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Share On</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex flex-col items-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex flex-col items-center gap-2 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Twitter className="w-6 h-6" />
                <span className="text-xs font-medium">Twitter</span>
              </button>
              
              <button
                onClick={() => handleSocialShare('facebook')}
                className="flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Facebook className="w-6 h-6" />
                <span className="text-xs font-medium">Facebook</span>
              </button>
            </div>

            <button
              onClick={handleCopyToClipboard}
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="font-medium">
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 