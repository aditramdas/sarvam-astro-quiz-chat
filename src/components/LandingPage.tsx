
import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Stars, Moon, Sun, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartQuiz }) => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();

  const languages: { value: Language; label: string }[] = [
    { value: 'english', label: t('english') },
    { value: 'hindi', label: t('hindi') },
    { value: 'tamil', label: t('tamil') },
    { value: 'bengali', label: t('bengali') },
    { value: 'marathi', label: t('marathi') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary stars */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 bg-white/5 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-purple-400/20 rounded-full blur-lg"></div>
            <Moon className="text-amber-300 w-8 h-8 mr-3 relative z-10 animate-pulse" />
            <div className="relative z-10">
              <Stars className="text-purple-300 w-12 h-12 drop-shadow-lg" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <Sun className="text-amber-400 w-8 h-8 ml-3 relative z-10 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
            {t('appTitle')}
          </h1>
          <p className="text-purple-200/80 text-sm font-medium">
            {t('selectLanguage')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative group">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as Language)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center appearance-none cursor-pointer hover:bg-white/15 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-medium"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-slate-800 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Sparkles className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
            </div>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-2xl hover:from-purple-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border border-purple-400/30 hover:border-purple-300/50"
          >
            <div className="flex items-center justify-center gap-2">
              <span>{t('startQuiz')}</span>
              <Stars className="w-5 h-5 animate-pulse" />
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-purple-200/60 text-xs font-medium tracking-wide">
            ✨ Discover the mysteries of the cosmos ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
