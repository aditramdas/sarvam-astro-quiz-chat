import React, { useState, useEffect } from 'react';
import { useLanguage, type Language } from '../contexts/LanguageContext';
import { Stars, Globe, Play, User, LogIn, Settings } from 'lucide-react';
import { authService, type AuthState } from '../services/authService';
import { gamificationService } from '../services/gamificationService';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({ 
    user: null, 
    isLoading: true, 
    isAuthenticated: false 
  });

  useEffect(() => {
    const unsubscribe = authService.subscribe((newAuthState) => {
      setAuthState(newAuthState);
    });

    // Sync from cloud if authenticated
    if (authState.isAuthenticated) {
      gamificationService.syncFromCloud();
    }

    return unsubscribe;
  }, [authState.isAuthenticated]);

  const handleStartQuiz = () => {
    if (!authState.user) {
      setShowAuthModal(true);
      return;
    }
    onStartQuiz();
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // Sync data after successful auth
    gamificationService.syncFromCloud();
    onStartQuiz();
  };

  const handleAuthChange = () => {
    // Refresh auth state is handled by the subscription
  };

  const languages: { code: Language; flag: string }[] = [
    { code: 'hindi', flag: '🇮🇳' },
    { code: 'tamil', flag: '🇮🇳' },
    { code: 'bengali', flag: '🇮🇳' },
    { code: 'marathi', flag: '🇮🇳' },
    { code: 'malayalam', flag: '🇮🇳' },
    { code: 'english', flag: '🇺🇸' },
  ];

  const stats = gamificationService.getUserStats();
  const earnedBadges = gamificationService.getEarnedBadges();
  const streakStatus = gamificationService.getStreakStatus(stats);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 shadow-2xl">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Stars className="w-8 h-8 text-amber-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('appTitle')}</h1>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center gap-3">
            {authState.user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowUserProfile(!showUserProfile)}
                  className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all"
                >
                  {authState.user.photoURL ? (
                    <div className="relative w-8 h-8">
                      <img 
                        src={authState.user.photoURL} 
                        alt={authState.user.displayName || 'Profile'} 
                        className="w-8 h-8 rounded-full object-cover border border-purple-300/50 bg-gray-200" 
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
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border border-purple-300/50"
                        style={{ display: 'none' }}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      {/* Active status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm">
                        <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-8 h-8">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border border-purple-300/50 shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      {/* Active status indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm">
                        <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                  <span className="text-white text-sm hidden sm:block">{authState.user.displayName}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:block">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Explore
                  </span>
                  <br />
                  the Cosmos
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
                  Test your knowledge of astronomy with live NASA data in your preferred language
                </p>
              </div>

              {/* Language Selection */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">{t('selectLanguage')}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setCurrentLanguage(lang.code)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        currentLanguage === lang.code
                          ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                          : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-2">{lang.flag}</div>
                      <div className="text-white font-medium text-sm">{t(lang.code)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Quiz Button */}
              <div className="text-center lg:text-left">
                <button
                  onClick={handleStartQuiz}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  {t('startQuiz')}
                </button>
                
                {!authState.user && (
                  <p className="text-sm text-gray-400 mt-3">
                    Sign in to save your progress and compete with friends!
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Features */}
            <div className="space-y-6">
              {/* User Stats */}
              {authState.user && (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-400" />
                    Your Progress
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-white">{stats.bestStreak}</div>
                      <div className="text-sm text-gray-400">Best Streak</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-2xl font-bold text-white">{earnedBadges.length}</div>
                      <div className="text-sm text-gray-400">Badges Earned</div>
                    </div>
                  </div>

                  {/* Streak Status */}
                  <div className={`p-3 rounded-xl border ${
                    streakStatus.isActive 
                      ? 'bg-green-500/20 border-green-500/30 text-green-300'
                      : 'bg-red-500/20 border-red-500/30 text-red-300'
                  }`}>
                    <div className="text-sm font-medium">{streakStatus.message}</div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">✨ Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Live NASA Data</div>
                      <div className="text-sm text-gray-400">Fresh questions from APOD, Mars Rovers, and Near-Earth Objects</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Multilingual AI</div>
                      <div className="text-sm text-gray-400">Powered by Sarvam AI for natural translations</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Gamification</div>
                      <div className="text-sm text-gray-400">Earn badges, maintain streaks, and compete globally</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <div className="text-white font-medium">Cloud Sync</div>
                      <div className="text-sm text-gray-400">Progress saved across all your devices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Sidebar */}
      {showUserProfile && authState.user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:relative lg:bg-transparent lg:backdrop-blur-none">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-l border-white/10 p-6 overflow-y-auto lg:relative lg:max-w-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile</h2>
              <button
                onClick={() => setShowUserProfile(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors lg:hidden"
              >
                ✕
              </button>
            </div>
            
            <UserProfile 
              authState={authState} 
              onAuthChange={handleAuthChange}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
