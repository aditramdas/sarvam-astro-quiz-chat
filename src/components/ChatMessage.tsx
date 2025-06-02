import React, { useState } from 'react';
import { Bot, User, CheckCircle, XCircle, Image as ImageIcon, Video, AlertCircle, ExternalLink } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isCorrect?: boolean;
  imageUrl?: string;
  mediaType?: 'image' | 'video';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBot, 
  isCorrect, 
  imageUrl, 
  mediaType = 'image' 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image state when imageUrl changes
  React.useEffect(() => {
    if (imageUrl) {
      setImageLoading(true);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    setImageLoaded(false);
  };

  const renderMediaContent = () => {
    if (!imageUrl || !isBot) return null;

    // If it's a video or the URL suggests video content
    if (mediaType === 'video' || imageUrl.includes('youtube') || imageUrl.includes('.mp4') || imageUrl.includes('vimeo')) {
      return (
        <div className="mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
          <div className="flex items-center justify-center p-8 text-gray-600">
            <div className="text-center max-w-xs">
              <Video className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-base font-semibold text-gray-800 mb-2">Video Content</p>
              <p className="text-sm text-gray-600 mb-4">Click below to view the video</p>
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                View Video
              </a>
            </div>
          </div>
        </div>
      );
    }

    // Handle image content with proper state management
    return (
      <div className="mb-3 rounded-lg overflow-hidden relative bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
        {/* Hidden image element to test loading */}
        <img 
          src={imageUrl}
          alt="NASA space content"
          className="hidden"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Show actual image if it loaded successfully */}
        {imageLoaded && !imageError && (
          <div className="w-full">
            <img 
              src={imageUrl}
              alt="NASA space content"
              className="w-full max-h-80 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 right-2">
              <a 
                href={imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                <ExternalLink className="w-3 h-3" />
                View Full Size
              </a>
            </div>
          </div>
        )}
        
        {/* Show loading state */}
        {imageLoading && !imageLoaded && !imageError && (
          <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <div className="flex items-center justify-center p-6">
              <div className="text-center max-w-sm">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Loading NASA Image...</p>
                <p className="text-xs text-gray-600">
                  Please wait while we load the space content
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Show fallback content only when image fails to load */}
        {imageError && !imageLoaded && (
          <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
            <div className="flex items-center justify-center p-6">
              <div className="text-center max-w-sm">
                <div className="relative mb-4">
                  <ImageIcon className="w-16 h-16 text-blue-500 mx-auto" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">NASA</span>
                  </div>
                </div>
                <p className="text-base font-semibold text-gray-800 mb-2">Space Image Available</p>
                <p className="text-sm text-gray-600 mb-4">
                  Due to security restrictions, NASA images must be viewed on their servers
                </p>
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  View NASA Image
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
            
            {/* Enhanced media display */}
            {renderMediaContent()}
            
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
