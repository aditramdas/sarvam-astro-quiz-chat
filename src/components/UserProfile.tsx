import React, { useState } from 'react';
import { User, LogOut, Settings, Crown, Shield, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { authService, type User as UserType, type AuthState } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfileProps {
  authState: AuthState;
  onAuthChange: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ authState, onAuthChange }) => {
  const { t } = useLanguage();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const stats = gamificationService.getUserStats();
  const earnedBadges = gamificationService.getEarnedBadges();

  const handleSignOut = async () => {
    await authService.signOut();
    onAuthChange();
  };

  const handleUpgradeAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (upgradeData.password !== upgradeData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.upgradeGuestAccount(
        upgradeData.email,
        upgradeData.password,
        upgradeData.displayName
      );
      setShowUpgradeModal(false);
      onAuthChange();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!authState.user) {
    return (
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-300">Not signed in</p>
        </div>
      </div>
    );
  }

  const isGuest = authService.isGuest();

  return (
    <>
      <div className="space-y-4">
        {/* User Info Card */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            {authState.user.photoURL ? (
              <div className="relative">
                <img
                  src={authState.user.photoURL}
                  alt={authState.user.displayName || 'Profile'}
                  className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover bg-gray-200"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                  onLoad={(e) => {
                    // Show image successfully loaded
                    e.currentTarget.style.display = 'block';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'none';
                  }}
                />
                <div 
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-purple-400"
                  style={{ display: 'none' }}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                {/* Online status indicator for verified accounts */}
                {!isGuest && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-purple-400 shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                {/* Online status indicator for verified accounts */}
                {!isGuest && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{authState.user.displayName}</h3>
                {isGuest ? (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                    Guest
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Verified
                  </span>
                )}
              </div>
              {authState.user.email && (
                <p className="text-sm text-gray-400">{authState.user.email}</p>
              )}
            </div>
          </div>

          {isGuest && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <div className="flex items-start gap-2">
                <Crown className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">Upgrade Your Account</h4>
                  <p className="text-xs text-gray-300 mb-2">
                    Save progress across all devices and unlock premium features
                  </p>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{earnedBadges.length}</div>
            <div className="text-xs text-gray-400">Badges</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stats.bestStreak}</div>
            <div className="text-xs text-gray-400">Best Streak</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{stats.totalDaysPlayed}</div>
            <div className="text-xs text-gray-400">Days Played</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <div className="text-lg font-bold text-white">
              {stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white flex items-center gap-3 transition-colors">
            <Settings className="w-5 h-5" />
            Account Settings
          </button>
          
          <button
            onClick={handleSignOut}
            className="w-full p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl border border-red-500/30 text-red-300 flex items-center gap-3 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 w-full max-w-md p-6 shadow-2xl">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">Upgrade to Premium</h2>
              <p className="text-gray-300 text-sm">Convert your guest account to save your progress forever</p>
            </div>

            <form onSubmit={handleUpgradeAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  value={upgradeData.displayName}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, displayName: e.target.value }))}
                  required
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={upgradeData.email}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={upgradeData.password}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={upgradeData.confirmPassword}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 p-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Upgrading...' : 'Upgrade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile; 