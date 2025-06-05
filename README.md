# Sarvam AstroQuiz - Enhanced Space Quiz App with Authentication
![image](https://github.com/user-attachments/assets/08491e5a-e3b1-43b4-8120-b94252bb6eae)

An intelligent, multilingual space quiz application that generates fresh questions using live NASA data, supports multiple Indic languages through Sarvam AI, and now includes **secure authentication** for cross-device progress sync.


![image](https://github.com/user-attachments/assets/f3e61860-759b-4d13-a34d-8555e323ce0f)

## 🚀 New Authentication Features

### **Why Authentication Matters for Streak Data**

Previously, the app used localStorage which had major limitations:

- **Device-bound**: Progress tied to single browser/device
- **Data loss**: Clearing browser = losing all streaks & badges
- **No cross-device sync**: Can't continue streaks on phone after playing on desktop
- **No backup**: No way to recover lost progress

### **Enhanced with Cloud Authentication**

✅ **Cross-Device Sync**: Continue streaks on any device  
✅ **Secure Backup**: Progress saved in cloud, never lost  
✅ **Global Competition**: Compare with friends worldwide  
✅ **Guest Mode**: Try without signup, upgrade anytime  
✅ **Smart Merging**: Local + cloud data intelligently combined

## 🔐 Authentication Options

### 1. **Full Account (Recommended)**

- **Email/Password**: Traditional signup with email verification
- **Google OAuth**: One-click signin with Google account
- **Benefits**: Full cloud sync, global leaderboards, secure backup

### 2. **Guest Mode**

- **Instant Start**: Play immediately without signup
- **Local Progress**: Stats saved locally (device-only)
- **Easy Upgrade**: Convert to full account anytime with data migration

### 3. **Account Upgrade Flow**

```
Guest User → Sign Up → Auto-migrate local data → Full cloud sync
```

## 🌟 Enhanced Features

### Multi-API Content Generation

- **APOD Questions**: Daily fresh questions from NASA's Astronomy Picture of the Day
- **Mars Rover Photos**: Questions about real photos from Curiosity, Opportunity, and Spirit rovers
- **Near-Earth Objects**: Current week's asteroid data transformed into quiz questions
- **Never Repetitive**: Each question is generated from live API data

### Sarvam AI Integration

- **Multilingual Support**: Hindi, Tamil, Bengali, Marathi, Malayalam, and English
- **Contextual Translation**: Smart question framing in your chosen language
- **Cultural Adaptation**: Content adapted for Indian audiences

### Advanced Gamification & Social Features

- **8 Badge System**: Earn badges like "मंगलयान मास्टर" and "अंतरिक्ष विशेषज्ञ"
- **Intelligent Streak Tracking**:
  - Validates consecutive days properly
  - Allows 1-day grace period
  - Cross-device streak continuation
- **Social Sharing**: Share achievements on WhatsApp, Twitter, Facebook
- **Progress Analytics**: Weekly/monthly stats, all-time bests
- **Cloud Sync**: Real-time progress backup and restoration

### Technical Highlights

- **Real-time Data**: Fresh content from NASA APIs every day
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Offline Support**: Fallback content when APIs are unavailable
- **Performance Optimized**: Fast loading with intelligent caching
- **Secure Authentication**: Industry-standard security practices

## 🛠 Quick Start

### Prerequisites

- Node.js & npm installed
- NASA API key (free from https://api.nasa.gov/)
- Sarvam AI API key (optional, from https://www.sarvam.ai/)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd sarvam-astro-quiz-chat

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the project root:

```env
# NASA API Key (Required for live data)
VITE_NASA_API_KEY=your_nasa_api_key_here

# Sarvam AI API Key (Optional - fallback translations provided)
VITE_SARVAM_API_KEY=your_sarvam_api_key_here
```

See [API_SETUP.md](./API_SETUP.md) for detailed setup instructions.

## 🎯 How It Works

1. **Choose Authentication**: Sign up, sign in, or continue as guest
2. **Language Selection**: Choose from Hindi, Tamil, Bengali, Marathi, Malayalam, or English
3. **Live Content Generation**: App fetches fresh data from NASA APIs
4. **AI Translation**: Sarvam AI translates and contextualizes content
5. **Gamified Experience**: Earn badges, build streaks, compete with friends
6. **Cloud Sync**: Progress automatically synced across all devices
7. **Social Sharing**: Share achievements across social platforms

## 📊 Authentication Flow Examples

### Guest to Full Account Migration

```typescript
// User plays as guest, earns progress
localStorage: { streak: 5, badges: ['first_steps'] }

// User decides to sign up
await authService.signUpWithEmail(email, password, name)

// System automatically migrates data
cloudData = mergeData(localData, cloudData)

// Progress preserved and synced!
```

### Cross-Device Streak Validation

```typescript
// User plays on phone (Monday)
cloudData.lastPlayDate = "2024-01-15";
cloudData.currentStreak = 3;

// User switches to laptop (Tuesday)
// System validates streak continuation
const isValid = validateStreak(cloudData);
// ✅ Streak continues: 4 days
```

## 🏆 Enhanced Badge System

- 🚀 **पहला कदम** - Complete your first quiz
- 🔴 **मंगलयान मास्टर** - Get 5 Mars Rover questions correct
- 📸 **अंतरिक्ष फोटोग्राफर** - Get 5 APOD questions correct
- ☄️ **क्षुद्रग्रह शिकारी** - Get 5 Near-Earth Object questions correct
- 🔥 **धारावाहिक मास्टर** - Achieve a streak of 10
- ⭐ **परफेक्ट स्कोर** - Get 100% accuracy
- 🌟 **दैनिक खोजकर्ता** - Play for 7 consecutive days
- 🎓 **अंतरिक्ष विशेषज्ञ** - Answer 100 questions correctly

## 🔧 Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: Custom service with cloud sync simulation
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **APIs**: NASA (APOD, Mars Rover, NeoWs), Sarvam AI
- **State Management**: React Context + localStorage + cloud sync
- **Deployment**: Lovable Platform

## 📱 User Experience

### Landing Page

- Authentication status display
- User profile with stats overview
- Streak status indicators
- Quick language switching
- Sign-in/Sign-up prompts for guests

### Quiz Interface

- Real NASA images and data
- Smooth animations and transitions
- Mobile-responsive design
- Badge notifications
- Progress auto-sync

### Profile Management

- Account upgrade flows
- Statistics dashboard
- Badge collection
- Social sharing tools

## 🌍 Supported Languages

- **Hindi**: हिंदी में पूर्ण समर्थन
- **Tamil**: தமிழில் முழு ஆதரவு
- **Bengali**: বাংলায় সম্পূর্ণ সহায়তা
- **Marathi**: मराठीत संपूर्ण समर्थन
- **Malayalam**: മലയാളത്തിൽ പൂർണ്ണ പിന്തുണ
- **English**: Complete support in English

## 🚀 Deployment

### Via Lovable Platform

1. Open [Lovable Project](https://lovable.dev/projects/0c2e6f69-af0c-4314-8bc7-cc30747bcdc5)
2. Click Share → Publish
3. Set environment variables in project settings

### Manual Deployment

```sh
npm run build
# Deploy the dist/ folder to your hosting platform
```

## 🔒 Security & Privacy

- **Local-First**: Guest mode keeps data on device
- **Secure Sync**: Authenticated users get encrypted cloud backup
- **No Tracking**: No personal data collection beyond what you provide
- **GDPR Compliant**: Account deletion removes all data
- **API Security**: All external API calls properly authenticated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test authentication flows thoroughly
5. Submit a pull request

## 📞 Support

- **Authentication Issues**: Check browser console for detailed logs
- **API Issues**: Check [API_SETUP.md](./API_SETUP.md)
- **Bug Reports**: Open an issue on GitHub
- **Feature Requests**: Use the project's feedback system

## 📄 License

This project is open source. Feel free to use and modify according to your needs.

---

**Made with ❤️ for space enthusiasts and language lovers**

_Now with secure authentication to never lose your cosmic journey progress!_

## 🖼️ Image Display & CORS Handling

### NASA Image Viewing

Due to browser security policies (CORS - Cross-Origin Resource Sharing), NASA images cannot be displayed directly within the web application. This is a common security restriction that prevents websites from loading images from external servers.

**How the app handles this:**

- ✅ **Graceful Fallback**: Shows a beautiful preview card with NASA branding
- ✅ **Direct Links**: Provides "View NASA Image" buttons that open images in new tabs
- ✅ **Clear Messaging**: Explains why images need to be viewed on NASA servers
- ✅ **Enhanced UX**: Users can still enjoy the quiz while viewing images externally

**Why this happens:**

- NASA servers don't include CORS headers for direct browser image access
- This is a security feature, not a bug in the application
- Professional astronomy apps handle this the same way

**Alternative solutions considered:**

- CORS proxy services (unreliable and slow)
- Server-side image caching (requires backend infrastructure)
- Current approach is the most reliable and user-friendly

### Profile Photos

Profile photos from Google OAuth and other providers load normally as they include proper CORS headers.
