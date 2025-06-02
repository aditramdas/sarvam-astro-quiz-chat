import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import LandingPage from '../components/LandingPage';
import EnhancedQuizChat from '../components/EnhancedQuizChat';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleBackToLanding = () => {
    setShowQuiz(false);
  };

  return (
    <LanguageProvider>
      <div className="app">
        {showQuiz ? (
          <EnhancedQuizChat onBack={handleBackToLanding} />
        ) : (
          <LandingPage onStartQuiz={handleStartQuiz} />
        )}
      </div>
    </LanguageProvider>
  );
};

export default Index;
