
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ChatMessage from './ChatMessage';
import { Send, ArrowLeft, Stars } from 'lucide-react';

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
        message: 'Congratulations! You have completed the quiz. Thank you for playing!',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center">
              <Stars className="w-6 h-6 text-purple-300 mr-2" />
              <h1 className="text-xl font-bold text-white">{t('appTitle')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
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
        <div className="bg-white/10 backdrop-blur-lg border-t border-white/20 p-4">
          <div className="max-w-2xl mx-auto">
            {currentQuestion.options ? (
              // Multiple choice buttons
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white text-left transition-all duration-300 transform hover:scale-105 border border-white/30"
                  >
                    <span className="font-semibold mr-2">
                      {index === 0 ? t('questionA') : index === 1 ? t('questionB') : index === 2 ? t('questionC') : t('questionD')}:
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              // Text input
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="flex-1 p-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!userInput.trim()}
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
