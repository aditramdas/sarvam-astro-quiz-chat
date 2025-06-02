export interface SarvamTranslateRequest {
  input: string;
  source_language_code: string;
  target_language_code: string;
  speaker_gender?: 'Male' | 'Female';
  mode?: 'formal' | 'informal';
  model?: 'mayura:v1';
  enable_preprocessing?: boolean;
}

export interface SarvamTranslateResponse {
  translated_text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl?: string;
  category: 'apod' | 'mars_rover' | 'neo';
  metadata?: any;
}

class SarvamApiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SARVAM_API_KEY || '';
    this.baseUrl = 'https://api.sarvam.ai';
  }

  async translate(request: SarvamTranslateRequest): Promise<string> {
    if (!this.apiKey) {
      console.warn('Sarvam API key not provided, using fallback translation');
      return this.fallbackTranslation(request.input, request.target_language_code);
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Subscription-Key': this.apiKey,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Sarvam API error: ${response.statusText}`);
      }

      const data: SarvamTranslateResponse = await response.json();
      return data.translated_text;
    } catch (error) {
      console.error('Translation error:', error);
      return this.fallbackTranslation(request.input, request.target_language_code);
    }
  }

  private fallbackTranslation(text: string, targetLang: string): string {
    // Fallback translations for common phrases
    const translations: Record<string, Record<string, string>> = {
      hindi: {
        'What is shown in this image?': 'इस तस्वीर में क्या दिख रहा है?',
        'Which rover took this photo?': 'यह फोटो किस रोवर ने ली थी?',
        'Which asteroids pass near Earth this week?': 'इस सप्ताह कौन-से पिंड पृथ्वी के पास से गुज़र रहे हैं?',
        'Correct! Well done!': 'सही! बहुत अच्छा!',
        'Incorrect. Let me explain...': 'गलत। मैं समझाता हूँ...',
        'Daily space quiz with live NASA data': 'नासा के लाइव डेटा के साथ दैनिक अंतरिक्ष प्रश्नोत्तरी',
        'How many planets are there in our solar system?': 'हमारे सौर मंडल में कितने ग्रह हैं?',
        'Which planet is known as the Red Planet?': 'कौन सा ग्रह लाल ग्रह के नाम से जाना जाता है?',
        'What is the largest planet in our solar system?': 'हमारे सौर मंडल का सबसे बड़ा ग्रह कौन सा है?',
        'How long does it take for light from the Sun to reach Earth?': 'सूर्य से प्रकाश को पृथ्वी तक पहुंचने में कितना समय लगता है?',
        // Space objects and phenomena
        'A supernova explosion': 'एक सुपरनोवा विस्फोट',
        'The Andromeda Galaxy': 'एंड्रोमेडा आकाशगंगा',
        'A black hole visualization': 'एक ब्लैक होल का चित्रण',
        // Planet names
        'Mars': 'मंगल',
        'Venus': 'शुक्र',
        'Jupiter': 'बृहस्पति',
        'Saturn': 'शनि',
        'Earth': 'पृथ्वी',
        'Neptune': 'नेप्च्यून',
        'Mercury': 'बुध',
        'Uranus': 'यूरेनस',
        // Time units
        '8 minutes': '8 मिनट',
        '8 seconds': '8 सेकंड',
        '8 hours': '8 घंटे',
        '8 days': '8 दिन'
      },
      tamil: {
        'What is shown in this image?': 'இந்த படத்தில் என்ன காட்டப்பட்டுள்ளது?',
        'Which rover took this photo?': 'இந்த புகைப்படத்தை எந்த ரோவர் எடுத்தது?',
        'Which asteroids pass near Earth this week?': 'இந்த வாரம் எந்த சிறுகோள்கள் பூமிக்கு அருகே செல்கின்றன?',
        'Correct! Well done!': 'சரி! நன்றாக செய்தீர்கள்!',
        'Incorrect. Let me explain...': 'தவறு. நான் விளக்குகிறேன்...',
        'Daily space quiz with live NASA data': 'நாசாவின் நேரடி தரவுகளுடன் தினசரி விண்வெளி வினாடி வினா',
        'How many planets are there in our solar system?': 'நமது சூரிய குடும்பத்தில் எத்தனை கோள்கள் உள்ளன?',
        'Which planet is known as the Red Planet?': 'எந்த கோள் சிவப்பு கோள் என்று அழைக்கப்படுகிறது?',
        'What is the largest planet in our solar system?': 'நமது சூரிய குடும்பத்தில் மிகப்பெரிய கோள் எது?',
        'How long does it take for light from the Sun to reach Earth?': 'சூரியனில் இருந்து ஒளி பூமியை அடைய எவ்வளவு நேரம் ஆகும்?',
        // Space objects and phenomena
        'A supernova explosion': 'ஒரு சுப்பர்நோவா வெடிப்பு',
        'The Andromeda Galaxy': 'ஆண்ட்ரோமெடா விண்மீன் மண்டலம்',
        'A black hole visualization': 'ஒரு கருந்துளையின் காட்சிப்படுத்தல்',
        // Planet names
        'Mars': 'செவ்வாய்',
        'Venus': 'வெள்ளி',
        'Jupiter': 'வியாழன்',
        'Saturn': 'ஶநி',
        'Earth': 'பூமி',
        'Neptune': 'நெப்டியூன்',
        'Mercury': 'புதன்',
        'Uranus': 'யூரேனஸ்',
        // Time units
        '8 minutes': '8 நிமிடங்கள்',
        '8 seconds': '8 விநாடிகள்',
        '8 hours': '8 மணி நேரம்',
        '8 days': '8 நாட்கள்'
      },
      bengali: {
        'What is shown in this image?': 'এই ছবিতে কী দেখানো হয়েছে?',
        'Which rover took this photo?': 'কোন রোভার এই ছবি তুলেছিল?',
        'Which asteroids pass near Earth this week?': 'এই সপ্তাহে কোন গ্রহাণুগুলি পৃথিবীর কাছ দিয়ে যাচ্ছে?',
        'Correct! Well done!': 'সঠিক! খুব ভালো!',
        'Incorrect. Let me explain...': 'ভুল। আমি ব্যাখ্যা করি...',
        'Daily space quiz with live NASA data': 'নাসার লাইভ ডেটা সহ দৈনিক স্থান কুইজ',
        'How many planets are there in our solar system?': 'আমাদের সৌরজগতে কয়টি গ্রহ আছে?',
        'Which planet is known as the Red Planet?': 'কোন গ্রহটি লাল গ্রহ নামে পরিচিত?',
        'What is the largest planet in our solar system?': 'আমাদের সৌরজগতের বৃহত্তম গ্রহ কোনটি?',
        'How long does it take for light from the Sun to reach Earth?': 'সূর্য থেকে আলো পৃথিবীতে পৌঁছতে কত সময় লাগে?',
        // Space objects and phenomena
        'A supernova explosion': 'একটি সুপারনোভা বিস্ফোরণ',
        'The Andromeda Galaxy': 'অ্যান্ড্রোমিডা গ্যালাক্সি',
        'A black hole visualization': 'একটি ব্ল্যাক হোলের দৃশ্যায়ন',
        // Planet names
        'Mars': 'মঙ্গল',
        'Venus': 'শুক্র',
        'Jupiter': 'বৃহস্পতি',
        'Saturn': 'শনি',
        'Earth': 'পৃথিবী',
        'Neptune': 'নেপচুন',
        'Mercury': 'বুধ',
        'Uranus': 'ইউরেনাস',
        // Time units
        '8 minutes': '৮ মিনিট',
        '8 seconds': '৮ সেকেন্ড',
        '8 hours': '৮ ঘন্টা',
        '8 days': '৮ দিন'
      },
      marathi: {
        'What is shown in this image?': 'या चित्रात काय दाखवले आहे?',
        'Which rover took this photo?': 'हा फोटो कोणत्या रोव्हरने काढला?',
        'Which asteroids pass near Earth this week?': 'या आठवड्यात कोणते लघुग्रह पृथ्वीजवळून जात आहेत?',
        'Correct! Well done!': 'बरोबर! छान!',
        'Incorrect. Let me explain...': 'चुकीचे. मी समजावून सांगतो...',
        'Daily space quiz with live NASA data': 'नासाच्या थेट डेटासह दैनिक अवकाश क्विझ',
        'How many planets are there in our solar system?': 'आपल्या सौरमालेत किती ग्रह आहेत?',
        'Which planet is known as the Red Planet?': 'कोणता ग्रह लाल ग्रह म्हणून ओळखला जातो?',
        'What is the largest planet in our solar system?': 'आपल्या सौरमालेतील सर्वात मोठा ग्रह कोणता आहे?',
        'How long does it take for light from the Sun to reach Earth?': 'सूर्यापासून प्रकाश पृथ्वीवर पोहोचण्यासाठी किती वेळ लागतो?',
        // Space objects and phenomena
        'A supernova explosion': 'एक सुपरनोव्हा स्फोट',
        'The Andromeda Galaxy': 'अँड्रोमेडा आकाशगंगा',
        'A black hole visualization': 'एक कृष्ण विवराचे चित्रण',
        // Planet names
        'Mars': 'मंगळ',
        'Venus': 'शुक्र',
        'Jupiter': 'गुरू',
        'Saturn': 'शनि',
        'Earth': 'पृथ्वी',
        'Neptune': 'नेपच्यून',
        'Mercury': 'बुध',
        'Uranus': 'युरेनस',
        // Time units
        '8 minutes': '८ मिनिटे',
        '8 seconds': '८ सेकंद',
        '8 hours': '८ तास',
        '8 days': '८ दिवस'
      },
      malayalam: {
        'What is shown in this image?': 'ഈ ചിത്രത്തിൽ എന്താണ് കാണിച്ചിരിക്കുന്നത്?',
        'Which rover took this photo?': 'ഏത് റോവറാണ് ഈ ഫോട്ടോ എടുത്തത്?',
        'Which asteroids pass near Earth this week?': 'ഈ ആഴ്ച ഏതെല്ലാം ഛിന്നഗ്രഹങ്ങളാണ് ഭൂമിക്ക് സമീപത്തുകൂടെ കടന്നുപോകുന്നത്?',
        'Correct! Well done!': 'ശരി! വളരെ നന്നായി!',
        'Incorrect. Let me explain...': 'തെറ്റ്. ഞാൻ വിശദീകരിക്കാം...',
        'Daily space quiz with live NASA data': 'നാസയുടെ തത്സമയ ഡാറ്റയോടെ ദൈനിക ബഹിരാകാശ ക്വിസ്',
        'How many planets are there in our solar system?': 'നമ്മുടെ സൗരയൂഥത്തിൽ എത്ര ഗ്രഹങ്ങളുണ്ട്?',
        'Which planet is known as the Red Planet?': 'ഏത് ഗ്രഹത്തെയാണ് ചുവപ്പ് ഗ്രഹം എന്ന് വിളിക്കുന്നത്?',
        'What is the largest planet in our solar system?': 'നമ്മുടെ സൗരയൂഥത്തിലെ ഏറ്റവും വലിയ ഗ്രഹം ഏതാണ്?',
        'How long does it take for light from the Sun to reach Earth?': 'സൂര്യനിൽ നിന്നുള്ള പ്രകാശം ഭൂമിയിലെത്താൻ എത്ര സമയമെടുക്കും?',
        // Space objects and phenomena
        'A supernova explosion': 'ഒരു സൂപ്പർനോവ സ്ഫോടനം',
        'The Andromeda Galaxy': 'ആൻഡ്രോമിഡ ഗാലക്സി',
        'A black hole visualization': 'ഒരു കറുത്ത ദ്വാരത്തിന്റെ ദൃശ്യവൽക്കരണം',
        // Planet names
        'Mars': 'ചൊവ്വ',
        'Venus': 'ശുക്രൻ',
        'Jupiter': 'വ്യാഴം',
        'Saturn': 'ശനി',
        'Earth': 'ഭൂമി',
        'Neptune': 'നെപ്റ്റ്യൂൺ',
        'Mercury': 'ബുധൻ',
        'Uranus': 'യുറാനസ്',
        // Time units
        '8 minutes': '8 മിനിറ്റ്',
        '8 seconds': '8 സെക്കൻഡ്',
        '8 hours': '8 മണിക്കൂർ',
        '8 days': '8 ദിവസം'
      }
    };

    return translations[targetLang]?.[text] || text;
  }

  async generateQuizQuestion(
    category: 'apod' | 'mars_rover' | 'neo',
    data: any,
    targetLanguage: string
  ): Promise<QuizQuestion> {
    const questionId = `${category}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    switch (category) {
      case 'apod':
        return this.generateAPODQuestion(questionId, data, targetLanguage);
      case 'mars_rover':
        return this.generateMarsRoverQuestion(questionId, data, targetLanguage);
      case 'neo':
        return this.generateNeoQuestion(questionId, data, targetLanguage);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  private async generateAPODQuestion(id: string, apodData: any, targetLanguage: string): Promise<QuizQuestion> {
    const baseQuestion = 'What astronomical object or phenomenon is featured in today\'s NASA image?';
    const question = await this.translate({
      input: baseQuestion,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    // Generate options based on APOD title and common space objects
    const correctAnswer = apodData.title;
    const englishOptions = [
      'A supernova explosion',
      'The Andromeda Galaxy',
      'A black hole visualization'
    ];

    // Translate the incorrect options
    const translatedIncorrectOptions = await Promise.all(
      englishOptions.map(option => 
        this.translate({
          input: option,
          source_language_code: 'en-IN',
          target_language_code: this.getLanguageCode(targetLanguage),
        })
      )
    );

    const options = [
      correctAnswer,
      ...translatedIncorrectOptions
    ].sort(() => Math.random() - 0.5);

    const baseExplanation = `${apodData.explanation.substring(0, 200)}... Click the link above to view the full NASA image and description.`;
    const explanation = await this.translate({
      input: baseExplanation,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    // Determine media type and URL
    const isVideo = apodData.media_type === 'video';
    let mediaUrl = apodData.url;
    
    // For images, prefer HD URL if available
    if (!isVideo && apodData.hdurl) {
      mediaUrl = apodData.hdurl;
    }

    // Handle different video platforms
    if (isVideo) {
      // YouTube videos need special handling
      if (mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')) {
        // Keep the original YouTube URL
        mediaUrl = apodData.url;
      }
    }

    return {
      id,
      question: isVideo ? 
        await this.translate({
          input: 'What does today\'s NASA video show?',
          source_language_code: 'en-IN',
          target_language_code: this.getLanguageCode(targetLanguage),
        }) : question,
      options,
      correctAnswer,
      explanation,
      imageUrl: mediaUrl,
      category: 'apod',
      metadata: { 
        date: apodData.date, 
        title: apodData.title,
        mediaType: apodData.media_type,
        isVideo: isVideo
      }
    };
  }

  private async generateMarsRoverQuestion(id: string, photoData: any, targetLanguage: string): Promise<QuizQuestion> {
    console.log('Generating Mars rover question for language:', targetLanguage);
    
    const baseQuestion = 'Which NASA rover captured this Martian landscape photo?';
    const question = await this.translate({
      input: baseQuestion,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    console.log('Translated question:', question);

    const correctAnswer = photoData.rover.name;
    
    // Keep rover names as they are (proper names) but ensure variety
    const allRoverNames = ['Perseverance', 'Ingenuity', 'Sojourner', 'Spirit', 'Opportunity', 'Curiosity'];
    const incorrectOptions = allRoverNames
      .filter(name => name !== correctAnswer)
      .slice(0, 3); // Take first 3 different rover names

    const options = [
      correctAnswer,
      ...incorrectOptions
    ].filter((option, index, arr) => arr.indexOf(option) === index)
      .sort(() => Math.random() - 0.5);

    console.log('Final options for Mars rover question:', options);

    const baseExplanation = `This photo was taken by the ${photoData.rover.name} rover using the ${photoData.camera.full_name} on Sol ${photoData.sol} (${photoData.earth_date}). Click the link above to view the full resolution image on NASA's servers.`;
    const explanation = await this.translate({
      input: baseExplanation,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    return {
      id,
      question,
      options,
      correctAnswer,
      explanation,
      imageUrl: photoData.img_src,
      category: 'mars_rover',
      metadata: {
        rover: photoData.rover.name,
        camera: photoData.camera.name,
        sol: photoData.sol,
        earthDate: photoData.earth_date
      }
    };
  }

  private async generateNeoQuestion(id: string, neoData: any[], targetLanguage: string): Promise<QuizQuestion> {
    if (!neoData.length) {
      throw new Error('No NEO data available');
    }

    const selectedNeo = neoData[Math.floor(Math.random() * neoData.length)];
    const baseQuestion = `Which asteroid is passing near Earth this week with a diameter of approximately ${Math.round(selectedNeo.estimated_diameter.kilometers.estimated_diameter_max)} km?`;
    
    const question = await this.translate({
      input: baseQuestion,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    const correctAnswer = selectedNeo.name;
    const otherNeos = neoData.filter(neo => neo.id !== selectedNeo.id).slice(0, 2);
    
    // Keep asteroid names as they are (scientific designations/proper names)
    const options = [
      correctAnswer,
      ...otherNeos.map(neo => neo.name),
      'Apophis' // Famous asteroid name
    ].slice(0, 4).sort(() => Math.random() - 0.5);

    const explanation = await this.translate({
      input: `${selectedNeo.name} is passing near Earth with a closest approach distance of ${Math.round(parseFloat(selectedNeo.close_approach_data[0].miss_distance.kilometers))} kilometers.`,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });

    return {
      id,
      question,
      options,
      correctAnswer,
      explanation,
      category: 'neo',
      metadata: {
        name: selectedNeo.name,
        diameter: selectedNeo.estimated_diameter.kilometers.estimated_diameter_max,
        isHazardous: selectedNeo.is_potentially_hazardous_asteroid,
        approachDate: selectedNeo.close_approach_data[0].close_approach_date
      }
    };
  }

  private getLanguageCode(language: string): string {
    const languageCodes: Record<string, string> = {
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      bengali: 'bn-IN',
      marathi: 'mr-IN',
      malayalam: 'ml-IN',
      english: 'en-IN'
    };
    return languageCodes[language] || 'en-IN';
  }

  // Public method to get language code (for use in other components)
  public getLanguageCodePublic(language: string): string {
    return this.getLanguageCode(language);
  }

  async generateShareableMessage(score: number, total: number, streak: number, targetLanguage: string): Promise<string> {
    const baseMessage = `I scored ${score}/${total} in today's space quiz with a streak of ${streak}! Can you beat me? 🚀`;
    
    return await this.translate({
      input: baseMessage,
      source_language_code: 'en-IN',
      target_language_code: this.getLanguageCode(targetLanguage),
    });
  }
}

export const sarvamApi = new SarvamApiService(); 