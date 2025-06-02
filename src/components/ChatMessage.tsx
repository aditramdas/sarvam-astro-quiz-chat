
import React from 'react';
import { Bot, User, CheckCircle, XCircle } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isCorrect?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, isCorrect }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-6 animate-fade-in`}>
      <div className={`flex items-end max-w-sm lg:max-w-lg ${isBot ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
            isBot 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-purple-300/30' 
              : 'bg-gradient-to-br from-emerald-500 to-cyan-600 ring-2 ring-cyan-300/30'
          }`}>
            {isBot ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
          </div>
        </div>
        
        <div className="relative">
          <div className={`px-5 py-4 rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 ${
            isBot 
              ? 'bg-white/95 text-gray-800 border-white/20' 
              : 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white border-emerald-300/30'
          } ${
            isCorrect === true ? 'ring-2 ring-green-400 bg-green-50/95' : 
            isCorrect === false ? 'ring-2 ring-red-400 bg-red-50/95' : ''
          }`}>
            
            {/* Feedback icon */}
            {isCorrect !== undefined && (
              <div className="absolute -top-2 -right-2">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
                )}
              </div>
            )}
            
            <p className="text-sm leading-relaxed font-medium">{message}</p>
            
            {/* Message tail */}
            <div className={`absolute bottom-3 ${isBot ? '-left-1' : '-right-1'} w-3 h-3 transform rotate-45 ${
              isBot 
                ? 'bg-white/95' 
                : 'bg-gradient-to-br from-emerald-500 to-cyan-600'
            } ${
              isCorrect === true ? 'bg-green-50/95' : 
              isCorrect === false ? 'bg-red-50/95' : ''
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
