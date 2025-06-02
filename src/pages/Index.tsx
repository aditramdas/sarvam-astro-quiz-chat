
import React, { useState } from 'react';
import { LanguageProvider } from '../contexts/LanguageContext';
import LandingPage from '../components/LandingPage';
import QuizChat from '../components/QuizChat';

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
          <QuizChat onBack={handleBackToLanding} />
        ) : (
          <LandingPage onStartQuiz={handleStartQuiz} />
        )}
      </div>
    </LanguageProvider>
  );
};

export default Index;
