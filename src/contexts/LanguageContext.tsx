import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hindi' | 'tamil' | 'bengali' | 'marathi' | 'malayalam' | 'english';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  english: {
    appTitle: 'Sarvam AstroQuiz',
    selectLanguage: 'Select Your Language',
    startQuiz: 'Start Quiz',
    hindi: 'Hindi',
    tamil: 'Tamil',
    bengali: 'Bengali',
    marathi: 'Marathi',
    malayalam: 'Malayalam',
    english: 'English',
    correct: 'Correct! Well done!',
    incorrect: 'Incorrect. Let me explain...',
    send: 'Send',
    loading: 'Loading...',
    welcome: 'Welcome to Sarvam AstroQuiz! I will ask you questions about astrology. Are you ready?',
    questionA: 'A',
    questionB: 'B',
    questionC: 'C',
    questionD: 'D',
  },
  hindi: {
    appTitle: 'सर्वम एस्ट्रोक्विज़',
    selectLanguage: 'अपनी भाषा चुनें',
    startQuiz: 'क्विज़ शुरू करें',
    hindi: 'हिंदी',
    tamil: 'तमिल',
    bengali: 'बंगाली',
    marathi: 'मराठी',
    malayalam: 'मलयालम',
    english: 'अंग्रेजी',
    correct: 'सही! बहुत अच्छा!',
    incorrect: 'गलत। मैं समझाता हूँ...',
    send: 'भेजें',
    loading: 'लोड हो रहा है...',
    welcome: 'सर्वम एस्ट्रोक्विज़ में आपका स्वागत है! मैं आपसे ज्योतिष के बारे में सवाल पूछूंगा। क्या आप तैयार हैं?',
    questionA: 'अ',
    questionB: 'आ',
    questionC: 'इ',
    questionD: 'ई',
  },
  tamil: {
    appTitle: 'சர்வம் ஆஸ்ட்ரோகுவிஸ்',
    selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    startQuiz: 'வினாடி வினா தொடங்கு',
    hindi: 'இந்தி',
    tamil: 'தமிழ்',
    bengali: 'வங்காளி',
    marathi: 'மராத்தி',
    malayalam: 'மலையாளம்',
    english: 'ஆங்கிலம்',
    correct: 'சரி! நன்றாக செய்தீர்கள்!',
    incorrect: 'தவறு. நான் விளக்குகிறேன்...',
    send: 'அனுப்பு',
    loading: 'ஏற்றுகிறது...',
    welcome: 'சர்வம் ஆஸ்ட்ரோகுவிஸ்-க்கு வரவேற்கிறோம்! நான் உங்களிடம் ஜோதிடம் பற்றி கேள்விகள் கேட்பேன். நீங்கள் தயாரா?',
    questionA: 'அ',
    questionB: 'ஆ',
    questionC: 'இ',
    questionD: 'ஈ',
  },
  bengali: {
    appTitle: 'সর্বম অ্যাস্ট্রোকুইজ',
    selectLanguage: 'আপনার ভাষা নির্বাচন করুন',
    startQuiz: 'কুইজ শুরু করুন',
    hindi: 'হিন্দি',
    tamil: 'তামিল',
    bengali: 'বাংলা',
    marathi: 'মারাঠি',
    malayalam: 'মালয়ালাম',
    english: 'ইংরেজি',
    correct: 'সঠিক! খুব ভালো!',
    incorrect: 'ভুল। আমি ব্যাখ্যা করি...',
    send: 'পাঠান',
    loading: 'লোড হচ্ছে...',
    welcome: 'সর্বম অ্যাস্ট্রোকুইজে স্বাগতম! আমি আপনাকে জ্যোতিষশাস্ত্র সম্পর্কে প্রশ্ন করব। আপনি কি প্রস্তুত?',
    questionA: 'ক',
    questionB: 'খ',
    questionC: 'গ',
    questionD: 'ঘ',
  },
  marathi: {
    appTitle: 'सर्वम अॅस्ट्रोक्विझ',
    selectLanguage: 'तुमची भाषा निवडा',
    startQuiz: 'क्विझ सुरू करा',
    hindi: 'हिंदी',
    tamil: 'तमिळ',
    bengali: 'बंगाली',
    marathi: 'मराठी',
    malayalam: 'मल्याळम',
    english: 'इंग्रजी',
    correct: 'बरोबर! छान!',
    incorrect: 'चुकीचे. मी समजावून सांगतो...',
    send: 'पाठवा',
    loading: 'लोड होत आहे...',
    welcome: 'सर्वम अॅस्ट्रोक्विझमध्ये आपले स्वागत आहे! मी तुम्हाला ज्योतिषशास्त्राबद्दल प्रश्न विचारणार आहे. तुम्ही तयार आहात का?',
    questionA: 'अ',
    questionB: 'आ',
    questionC: 'इ',
    questionD: 'ई',
  },
  malayalam: {
    appTitle: 'സര്‍വം ആസ്ട്രോക്വിസ്',
    selectLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
    startQuiz: 'ക്വിസ് ആരംഭിക്കുക',
    hindi: 'ഹിന്ദി',
    tamil: 'തമിഴ്',
    bengali: 'ബംഗാളി',
    marathi: 'മറാത്തി',
    malayalam: 'മലയാളം',
    english: 'ഇംഗ്ലീഷ്',
    correct: 'ശരി! വളരെ നന്നായി!',
    incorrect: 'തെറ്റ്. ഞാൻ വിശദീകരിക്കാം...',
    send: 'അയയ്ക്കുക',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    welcome: 'സര്‍വം ആസ്ട്രോക്വിസിലേക്ക് സ്വാഗതം! ജ്യോതിഷത്തെക്കുറിച്ച് ഞാൻ നിങ്ങളോട് ചോദ്യങ്ങൾ ചോദിക്കും. നിങ്ങൾ തയ്യാറാണോ?',
    questionA: 'അ',
    questionB: 'ആ',
    questionC: 'ഇ',
    questionD: 'ഈ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
