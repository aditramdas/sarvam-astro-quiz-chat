import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import BadgeNotification from './BadgeNotification';
import ShareModal from './ShareModal';
import { Send, ArrowLeft, Stars, Flame, Trophy, Award, Share2, Image, Camera, Satellite } from 'lucide-react';
import { nasaApi } from '../services/nasaApi';
import { sarvamApi, QuizQuestion } from '../services/sarvamApi';
import { gamificationService, Badge, UserStats } from '../services/gamificationService';

interface EnhancedQuizChatProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  isCorrect?: boolean;
  imageUrl?: string;
  category?: 'apod' | 'mars_rover' | 'neo';
  mediaType?: 'image' | 'video';
}

// Question cache to prevent repetition and speed up generation
interface QuestionCache {
  apod: QuizQuestion[];
  mars_rover: QuizQuestion[];
  neo: QuizQuestion[];
  fallback: QuizQuestion[];
  lastUpdated: number;
}

const EnhancedQuizChat: React.FC<EnhancedQuizChatProps> = ({ onBack }) => {
  const { t, currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [userStats, setUserStats] = useState<UserStats>(gamificationService.getUserStats());
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [questionsInSession, setQuestionsInSession] = useState<QuizQuestion[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [questionCache, setQuestionCache] = useState<QuestionCache>({
    apod: [],
    mars_rover: [],
    neo: [],
    fallback: [],
    lastUpdated: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: '0',
      message: t('welcome'),
      isBot: true
    }]);
    
    // Clear cache when language changes to ensure fresh translations
    setQuestionCache({
      apod: [],
      mars_rover: [],
      neo: [],
      fallback: [],
      lastUpdated: 0
    });
    
    // Pre-load questions for faster experience
    preloadQuestions();
    
    // Start first question quickly
    setTimeout(() => {
      generateNextQuestion();
    }, 500); // Reduced from 1000ms
  }, [t, currentLanguage]);

  // Pre-load diverse questions to avoid repetition and speed up generation
  const preloadQuestions = async () => {
    try {
      // Always force refresh for now to ensure fresh translations
      console.log('Force refreshing question cache for language:', currentLanguage);
      
      // Load multiple questions in parallel for speed
      const [apodQuestions, marsQuestions, neoQuestions, fallbackQuestions] = await Promise.all([
        generateAPODQuestions(),
        generateMarsQuestions(),
        generateNeoQuestions(),
        generateFallbackQuestions()
      ]);

      setQuestionCache({
        apod: apodQuestions,
        mars_rover: marsQuestions,
        neo: neoQuestions,
        fallback: fallbackQuestions,
        lastUpdated: Date.now()
      });

      console.log('Questions pre-loaded successfully!', {
        apod: apodQuestions.length,
        mars_rover: marsQuestions.length,
        neo: neoQuestions.length,
        fallback: fallbackQuestions.length
      });
    } catch (error) {
      console.error('Error pre-loading questions:', error);
    }
  };

  const generateAPODQuestions = async (): Promise<QuizQuestion[]> => {
    const questions: QuizQuestion[] = [];
    try {
      // Get APOD for today and previous days for variety
      const dates = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
      }

      for (const date of dates) {
        try {
          const apodData = await nasaApi.getAPOD(date);
          if (apodData.media_type === 'image') {
            const question = await sarvamApi.generateQuizQuestion('apod', apodData, currentLanguage);
            questions.push(question);
          }
        } catch (error) {
          console.log(`Skipping APOD for ${date}:`, error);
        }
      }
    } catch (error) {
      console.error('Error generating APOD questions:', error);
    }
    return questions;
  };

  const generateMarsQuestions = async (): Promise<QuizQuestion[]> => {
    const questions: QuizQuestion[] = [];
    try {
      // Get photos from different rovers and sols for variety
      const rovers = ['curiosity', 'opportunity', 'spirit'] as const;
      
      for (const rover of rovers) {
        try {
          const photos = await nasaApi.getMarsRoverPhotos(rover);
          if (photos.length > 0) {
            // Create questions from first 2 photos to get variety
            for (let i = 0; i < Math.min(2, photos.length); i++) {
              const question = await sarvamApi.generateQuizQuestion('mars_rover', photos[i], currentLanguage);
              questions.push(question);
            }
          }
        } catch (error) {
          console.log(`Skipping ${rover} photos:`, error);
        }
      }
    } catch (error) {
      console.error('Error generating Mars questions:', error);
    }
    return questions;
  };

  const generateNeoQuestions = async (): Promise<QuizQuestion[]> => {
    const questions: QuizQuestion[] = [];
    try {
      const neoData = await nasaApi.getInterestingNearEarthObjects();
      if (neoData.length > 0) {
        // Create multiple NEO questions for variety
        const questionCount = Math.min(3, neoData.length);
        for (let i = 0; i < questionCount; i++) {
          const selectedNeos = neoData.slice(i, i + 3); // Different sets of NEOs
          const question = await sarvamApi.generateQuizQuestion('neo', selectedNeos, currentLanguage);
          questions.push(question);
        }
      }
    } catch (error) {
      console.error('Error generating NEO questions:', error);
    }
    return questions;
  };

  const generateFallbackQuestions = async (): Promise<QuizQuestion[]> => {
    const fallbackData = [
      {
        question: 'How many planets are there in our solar system?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: 'There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        explanation: 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.'
      },
      {
        question: 'What is the largest planet in our solar system?',
        options: ['Saturn', 'Jupiter', 'Neptune', 'Earth'],
        correctAnswer: 'Jupiter',
        explanation: 'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.'
      },
      {
        question: 'How long does it take for light from the Sun to reach Earth?',
        options: ['8 minutes', '8 seconds', '8 hours', '8 days'],
        correctAnswer: '8 minutes',
        explanation: 'Light from the Sun takes approximately 8 minutes and 20 seconds to travel the 93 million miles to Earth.'
      }
    ];

    const questions: QuizQuestion[] = [];
    for (const [index, data] of fallbackData.entries()) {
      const question = await sarvamApi.translate({
        input: data.question,
        source_language_code: 'en-IN',
        target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
      });

      const explanation = await sarvamApi.translate({
        input: data.explanation,
        source_language_code: 'en-IN',
        target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
      });

      // Translate options for questions where translation makes sense
      let translatedOptions = data.options;
      if (data.options.some(option => isNaN(Number(option)) && !['Mars', 'Venus', 'Jupiter', 'Saturn', 'Neptune', 'Earth'].includes(option))) {
        // Translate non-numeric, non-planet name options
        translatedOptions = await Promise.all(
          data.options.map(option => 
            sarvamApi.translate({
              input: option,
              source_language_code: 'en-IN',
              target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
            })
          )
        );
      } else if (data.options.some(option => ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Neptune', 'Earth'].includes(option))) {
        // For planet names, translate them
        translatedOptions = await Promise.all(
          data.options.map(option => 
            sarvamApi.translate({
              input: option,
              source_language_code: 'en-IN',
              target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
            })
          )
        );
      }
      // For numeric options (like '6', '7', '8', '9'), keep them as is

      // Also translate the correct answer if it's not numeric
      let translatedCorrectAnswer = data.correctAnswer;
      if (isNaN(Number(data.correctAnswer))) {
        translatedCorrectAnswer = await sarvamApi.translate({
          input: data.correctAnswer,
          source_language_code: 'en-IN',
          target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
        });
      }

      questions.push({
        id: `fallback_${index}_${Date.now()}`,
        question,
        options: translatedOptions,
        correctAnswer: translatedCorrectAnswer,
        explanation,
        category: 'apod' as const
      });
    }
    return questions;
  };

  const generateNextQuestion = async () => {
    if (questionIndex >= 5) { // Limit to 5 questions per session
      completeQuiz();
      return;
    }

    setIsLoading(true);
    
    try {
      // Select question from cache with variety control
      const availableQuestions = getAvailableQuestions();
      
      if (availableQuestions.length === 0) {
        // Reload cache if empty
        await preloadQuestions();
        const newAvailableQuestions = getAvailableQuestions();
        
        if (newAvailableQuestions.length === 0) {
          // Use fallback if still no questions
          const fallbackQuestion = await generateSingleFallbackQuestion();
          displayQuestion(fallbackQuestion);
          return;
        }
      }

      // Select random question from available ones
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions[randomIndex];
      
      displayQuestion(selectedQuestion);
      
    } catch (error) {
      console.error('Error generating question:', error);
      const fallbackQuestion = await generateSingleFallbackQuestion();
      displayQuestion(fallbackQuestion);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableQuestions = (): QuizQuestion[] => {
    const allQuestions = [
      ...questionCache.apod,
      ...questionCache.mars_rover,
      ...questionCache.neo,
      ...questionCache.fallback
    ];

    // Filter out already used questions and ensure variety
    const availableQuestions = allQuestions.filter(q => !usedQuestionIds.has(q.id));
    
    // If we've used too many questions, reset the used set but keep variety
    if (availableQuestions.length < 2) {
      setUsedQuestionIds(new Set());
      return allQuestions;
    }
    
    return availableQuestions;
  };

  const displayQuestion = (questionData: QuizQuestion) => {
    console.log('Displaying question:', {
      id: questionData.id,
      category: questionData.category,
      question: questionData.question,
      options: questionData.options,
      currentLanguage
    });
    
    setCurrentQuestion(questionData);
    setQuestionsInSession(prev => [...prev, questionData]);
    setUsedQuestionIds(prev => new Set([...prev, questionData.id]));
    setIsWaitingForAnswer(true);
    
    // Add question message with image if available
    const messageWithImage: ChatMessage = {
      id: questionData.id,
      message: questionData.question,
      isBot: true,
      imageUrl: questionData.imageUrl,
      category: questionData.category,
      mediaType: questionData.metadata?.isVideo ? 'video' : 'image'
    };
    
    setMessages(prev => [...prev, messageWithImage]);
  };

  const generateSingleFallbackQuestion = async (): Promise<QuizQuestion> => {
    const question = await sarvamApi.translate({
      input: 'How many planets are there in our solar system?',
      source_language_code: 'en-IN',
      target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
    });

    const explanation = await sarvamApi.translate({
      input: 'There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.',
      source_language_code: 'en-IN',
      target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
    });

    // For numeric options, keep them as-is since numbers are universal
    const options = ['6', '7', '8', '9'];
    const correctAnswer = '8';

    return {
      id: `emergency_fallback_${Date.now()}`,
      question,
      options,
      correctAnswer,
      explanation,
      category: 'apod' as const
    };
  };

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || !isWaitingForAnswer) return;

    // Add user's answer to chat
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      message: answer,
      isBot: false
    }]);

    setIsWaitingForAnswer(false);
    
    // Check if answer is correct
    const isCorrect = answer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase()) ||
                     currentQuestion.correctAnswer.toLowerCase().includes(answer.toLowerCase());
    
    // Update streak and score
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Update gamification stats asynchronously (don't wait)
    gamificationService.updateStats(
      isCorrect,
      currentQuestion.category,
      isCorrect ? streak + 1 : 0
    ).then(updatedStats => {
      setUserStats(updatedStats);
      
      // Check for new badges asynchronously
      gamificationService.checkForNewBadges(updatedStats).then(earnedBadges => {
        if (earnedBadges.length > 0) {
          setNewBadges(earnedBadges);
        }
      });
    });
    
    // Much faster feedback flow
    setTimeout(() => {
      // Add feedback immediately
      const feedbackMessage = isCorrect ? t('correct') : t('incorrect');
      setMessages(prev => [...prev, {
        id: `feedback-${Date.now()}`,
        message: feedbackMessage,
        isBot: true,
        isCorrect
      }]);

      // Add explanation quickly
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `explanation-${Date.now()}`,
          message: currentQuestion.explanation,
          isBot: true
        }]);

        // Move to next question much faster
        setTimeout(() => {
          const nextIndex = questionIndex + 1;
          setQuestionIndex(nextIndex);
          generateNextQuestion();
        }, 800); // Reduced from 2000ms to 800ms
      }, 400); // Reduced from 1000ms to 400ms
    }, 200); // Reduced from 500ms to 200ms

    setUserInput('');
  };

  const completeQuiz = async () => {
    const accuracy = questionsInSession.length > 0 ? Math.round((score / questionsInSession.length) * 100) : 0;
    
    const completionMessage = await sarvamApi.translate({
      input: `Congratulations! You completed the quiz with ${score}/${questionsInSession.length} correct answers (${accuracy}% accuracy) and a streak of ${streak}! 🎉`,
      source_language_code: 'en-IN',
      target_language_code: sarvamApi.getLanguageCodePublic(currentLanguage)
    });

    setMessages(prev => [...prev, {
      id: `complete-${Date.now()}`,
      message: completionMessage,
      isBot: true
    }]);

    // Show share option after a delay
    setTimeout(() => {
      setShowShareModal(true);
    }, 2000);
  };

  const handleSend = () => {
    if (userInput.trim()) {
      handleAnswer(userInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'apod': return <Image className="w-4 h-4" />;
      case 'mars_rover': return <Camera className="w-4 h-4" />;
      case 'neo': return <Satellite className="w-4 h-4" />;
      default: return <Stars className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'apod': return 'from-blue-500 to-purple-500';
      case 'mars_rover': return 'from-red-500 to-orange-500';
      case 'neo': return 'from-yellow-500 to-green-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-4 shadow-2xl">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Stars className="w-7 h-7 text-amber-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-xl font-bold text-white">{t('appTitle')}</h1>
            </div>
          </div>
          
          {/* Enhanced Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">{score}/{Math.max(questionsInSession.length, 1)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className="text-white text-sm font-medium">{streak}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Award className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-medium">{gamificationService.getEarnedBadges().length}</span>
            </div>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-xl border border-green-300/20 hover:from-green-400 hover:to-emerald-400 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-white text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="relative">
              <ChatMessage
                message={msg.message}
                isBot={msg.isBot}
                isCorrect={msg.isCorrect}
                imageUrl={msg.imageUrl}
                mediaType={msg.mediaType}
              />
              {msg.category && msg.isBot && (
                <div className="flex justify-start mb-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(msg.category)} text-white text-xs font-medium`}>
                    {getCategoryIcon(msg.category)}
                    <span>{msg.category.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
                <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                <span className="text-white text-sm">Generating question...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      {isWaitingForAnswer && currentQuestion && (
        <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 p-6 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            {currentQuestion.options ? (
              // Multiple choice buttons
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="group p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white text-left transition-all duration-300 transform hover:scale-[1.02] border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 bg-gradient-to-r ${getCategoryColor(currentQuestion.category)} rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:scale-110 transition-all duration-300`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Text input
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="flex-1 p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                />
                <button
                  onClick={handleSend}
                  disabled={!userInput.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badge Notifications */}
      {newBadges.map((badge, index) => (
        <BadgeNotification
          key={badge.id}
          badge={badge}
          onClose={() => setNewBadges(prev => prev.filter(b => b.id !== badge.id))}
          delay={index * 1000}
        />
      ))}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          stats={userStats}
          currentLanguage={currentLanguage}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default EnhancedQuizChat; 