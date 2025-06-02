
import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isCorrect?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, isCorrect }) => {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      <div className={`flex items-start max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isBot 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}>
            {isBot ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
          </div>
        </div>
        
        <div className={`px-4 py-3 rounded-2xl shadow-lg ${
          isBot 
            ? 'bg-white/90 text-gray-800 border border-purple-200' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
        } ${
          isCorrect === true ? 'border-green-400 bg-green-50' : 
          isCorrect === false ? 'border-red-400 bg-red-50' : ''
        }`}>
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
