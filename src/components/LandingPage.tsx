
import React from 'react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Stars, Moon, Sun } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Moon className="text-yellow-300 w-8 h-8 mr-2" />
            <Stars className="text-purple-300 w-10 h-10" />
            <Sun className="text-yellow-400 w-8 h-8 ml-2" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
            {t('appTitle')}
          </h1>
          <p className="text-purple-200 text-sm">
            {t('selectLanguage')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as Language)}
              className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white text-center appearance-none cursor-pointer hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-purple-900 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {t('startQuiz')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-purple-200 text-xs opacity-75">
            Discover the mysteries of the cosmos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
