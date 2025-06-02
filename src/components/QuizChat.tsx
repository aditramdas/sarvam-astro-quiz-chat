import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import { Send, ArrowLeft, Stars, Flame, Trophy } from 'lucide-react';

interface QuizChatProps {
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

const QuizChat: React.FC<QuizChatProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [score, setScore] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions: Question[] = [
    {
      id: '1',
      question: 'Which planet is known as the "Red Planet" in astrology?',
      options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
      correctAnswer: 'Mars',
      explanation: 'Mars is called the Red Planet due to its reddish appearance, caused by iron oxide on its surface.'
    },
    {
      id: '2',
      question: 'How many zodiac signs are there in Western astrology?',
      options: ['10', '11', '12', '13'],
      correctAnswer: '12',
      explanation: 'There are 12 zodiac signs in Western astrology: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces.'
    },
    {
      id: '3',
      question: 'What does your zodiac sign represent in astrology?',
      correctAnswer: 'personality',
      explanation: 'Your zodiac sign is believed to influence your personality traits, characteristics, and tendencies according to astrological beliefs.'
    }
  ];

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
    
    // Start first question after a delay
    setTimeout(() => {
      askQuestion(0);
    }, 1000);
  }, [t]);

  const askQuestion = (index: number) => {
    if (index >= questions.length) {
      // Quiz completed
      setMessages(prev => [...prev, {
        id: `complete-${Date.now()}`,
        message: `Congratulations! You completed the quiz with a final score of ${score}/${questions.length} and a best streak of ${bestStreak}! 🎉`,
        isBot: true
      }]);
      return;
    }

    const question = questions[index];
    setCurrentQuestion(question);
    setIsWaitingForAnswer(true);
    
    setMessages(prev => [...prev, {
      id: question.id,
      message: question.question,
      isBot: true
    }]);
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || !isWaitingForAnswer) return;

    // Add user's answer to chat
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      message: answer,
      isBot: false
    }]);

    setIsWaitingForAnswer(false);
    
    // Check if answer is correct
    const isCorrect = answer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase());
    
    // Update streak and score
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      // Add feedback
      const feedbackMessage = isCorrect ? t('correct') : t('incorrect');
      setMessages(prev => [...prev, {
        id: `feedback-${Date.now()}`,
        message: feedbackMessage,
        isBot: true,
        isCorrect
      }]);

      setTimeout(() => {
        // Add explanation
        setMessages(prev => [...prev, {
          id: `explanation-${Date.now()}`,
          message: currentQuestion.explanation,
          isBot: true
        }]);

        setTimeout(() => {
          // Move to next question
          const nextIndex = questionIndex + 1;
          setQuestionIndex(nextIndex);
          askQuestion(nextIndex);
        }, 2000);
      }, 1000);
    }, 500);

    setUserInput('');
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
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">{score}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
              <span className="text-white text-sm font-medium">{streak}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <span className="text-xs text-gray-300">Best:</span>
              <span className="text-white text-sm font-medium">{bestStreak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              isBot={msg.isBot}
              isCorrect={msg.isCorrect}
            />
          ))}
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
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
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
    </div>
  );
};

export default QuizChat;
