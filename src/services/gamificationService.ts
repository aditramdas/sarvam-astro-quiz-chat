import { authService } from './authService';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  earned?: Date;
}

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  dailyQuizzes: number;
  categoriesCompleted: {
    apod: number;
    mars_rover: number;
    neo: number;
  };
  lastPlayDate: string;
  totalDaysPlayed: number;
}

export interface Achievement {
  id: string;
  type: 'streak' | 'score' | 'category' | 'daily';
  value: number;
  timestamp: Date;
}

class GamificationService {
  private readonly storageKey = 'astro_quiz_stats';
  private readonly badgesKey = 'astro_quiz_badges';
  private readonly achievementsKey = 'astro_quiz_achievements';

  private defaultStats: UserStats = {
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    dailyQuizzes: 0,
    categoriesCompleted: {
      apod: 0,
      mars_rover: 0,
      neo: 0
    },
    lastPlayDate: '',
    totalDaysPlayed: 0
  };

  private badges: Badge[] = [
    {
      id: 'first_steps',
      name: 'पहला कदम',
      description: 'Complete your first quiz',
      icon: '🚀',
      condition: (stats) => stats.totalQuestions >= 1
    },
    {
      id: 'mars_master',
      name: 'मंगलयान मास्टर',
      description: 'Get 5 Mars Rover questions correct',
      icon: '🔴',
      condition: (stats) => stats.categoriesCompleted.mars_rover >= 5
    },
    {
      id: 'space_photographer',
      name: 'अंतरिक्ष फोटोग्राफर',
      description: 'Get 5 APOD questions correct',
      icon: '📸',
      condition: (stats) => stats.categoriesCompleted.apod >= 5
    },
    {
      id: 'asteroid_hunter',
      name: 'क्षुद्रग्रह शिकारी',
      description: 'Get 5 Near-Earth Object questions correct',
      icon: '☄️',
      condition: (stats) => stats.categoriesCompleted.neo >= 5
    },
    {
      id: 'streak_master',
      name: 'धारावाहिक मास्टर',
      description: 'Achieve a streak of 10',
      icon: '🔥',
      condition: (stats) => stats.bestStreak >= 10
    },
    {
      id: 'perfect_score',
      name: 'परफेक्ट स्कोर',
      description: 'Get 100% accuracy in a quiz session',
      icon: '⭐',
      condition: (stats) => stats.totalQuestions >= 5 && stats.correctAnswers / stats.totalQuestions === 1
    },
    {
      id: 'daily_explorer',
      name: 'दैनिक खोजकर्ता',
      description: 'Play for 7 consecutive days',
      icon: '🌟',
      condition: (stats) => stats.totalDaysPlayed >= 7
    },
    {
      id: 'space_expert',
      name: 'अंतरिक्ष विशेषज्ञ',
      description: 'Answer 100 questions correctly',
      icon: '🎓',
      condition: (stats) => stats.correctAnswers >= 100
    }
  ];

  getUserStats(): UserStats {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return { ...this.defaultStats };
    }
    return { ...this.defaultStats, ...JSON.parse(stored) };
  }

  async updateStats(
    isCorrect: boolean, 
    category: 'apod' | 'mars_rover' | 'neo',
    currentStreak: number
  ): Promise<UserStats> {
    const stats = this.getUserStats();
    const today = new Date().toISOString().split('T')[0];
    
    // Check for streak continuation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Reset streak if more than 1 day gap
    if (stats.lastPlayDate && stats.lastPlayDate !== today && stats.lastPlayDate !== yesterdayStr) {
      stats.currentStreak = 0;
    }
    
    // Update basic stats
    stats.totalQuestions += 1;
    if (isCorrect) {
      stats.correctAnswers += 1;
      stats.categoriesCompleted[category] += 1;
    }

    // Update streak
    stats.currentStreak = currentStreak;
    stats.bestStreak = Math.max(stats.bestStreak, currentStreak);

    // Update daily stats
    if (stats.lastPlayDate !== today) {
      stats.dailyQuizzes += 1;
      stats.totalDaysPlayed += 1;
      stats.lastPlayDate = today;
    }

    // Save locally
    this.saveStats(stats);
    
    // Sync to cloud if authenticated
    const user = authService.getCurrentUser();
    if (user && !user.id.startsWith('guest_')) {
      try {
        await authService.saveUserStatsToCloud(stats);
      } catch (error) {
        console.warn('Failed to sync stats to cloud:', error);
      }
    }
    
    // Check for new badges
    this.checkForNewBadges(stats);
    return stats;
  }

  private saveStats(stats: UserStats): void {
    localStorage.setItem(this.storageKey, JSON.stringify(stats));
  }

  getEarnedBadges(): Badge[] {
    const stored = localStorage.getItem(this.badgesKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveBadges(badges: Badge[]): void {
    localStorage.setItem(this.badgesKey, JSON.stringify(badges));
  }

  async checkForNewBadges(stats: UserStats): Promise<Badge[]> {
    const earnedBadges = this.getEarnedBadges();
    const earnedIds = earnedBadges.map(b => b.id);
    const newBadges: Badge[] = [];

    for (const badge of this.badges) {
      if (!earnedIds.includes(badge.id) && badge.condition(stats)) {
        const earnedBadge = { ...badge, earned: new Date() };
        earnedBadges.push(earnedBadge);
        newBadges.push(earnedBadge);
      }
    }

    if (newBadges.length > 0) {
      this.saveBadges(earnedBadges);
      
      // Sync badges to cloud if authenticated
      const user = authService.getCurrentUser();
      if (user && !user.id.startsWith('guest_')) {
        try {
          await authService.saveBadgesToCloud(earnedBadges);
        } catch (error) {
          console.warn('Failed to sync badges to cloud:', error);
        }
      }
    }

    return newBadges;
  }

  getAllBadges(): Badge[] {
    return this.badges;
  }

  getProgressToNextBadge(stats: UserStats): { badge: Badge; progress: number; total: number } | null {
    const earnedIds = this.getEarnedBadges().map(b => b.id);
    
    for (const badge of this.badges) {
      if (earnedIds.includes(badge.id)) continue;

      // Calculate progress for different badge types
      let progress = 0;
      let total = 1;

      if (badge.id === 'mars_master') {
        progress = stats.categoriesCompleted.mars_rover;
        total = 5;
      } else if (badge.id === 'space_photographer') {
        progress = stats.categoriesCompleted.apod;
        total = 5;
      } else if (badge.id === 'asteroid_hunter') {
        progress = stats.categoriesCompleted.neo;
        total = 5;
      } else if (badge.id === 'streak_master') {
        progress = stats.bestStreak;
        total = 10;
      } else if (badge.id === 'space_expert') {
        progress = stats.correctAnswers;
        total = 100;
      } else if (badge.id === 'daily_explorer') {
        progress = stats.totalDaysPlayed;
        total = 7;
      }

      if (progress < total) {
        return { badge, progress, total };
      }
    }

    return null;
  }

  generateShareMessage(stats: UserStats, language: string): string {
    const accuracy = stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
    
    const messages = {
      hindi: `मैंने आज ${accuracy}% सटीकता के साथ अंतरिक्ष क्विज़ खेला! मेरा बेस्ट स्ट्रीक ${stats.bestStreak} है। क्या तुम इसे हरा सकते हो? 🚀`,
      tamil: `இன்று நான் ${accuracy}% துல்லியத்துடன் விண்வெளி வினாடி வினா விளையாடினேன்! என் சிறந்த தொடர் ${stats.bestStreak}. நீங்கள் என்னை வெல்ல முடியுமா? 🚀`,
      bengali: `আজ আমি ${accuracy}% নির্ভুলতার সাথে স্পেস কুইজ খেলেছি! আমার সেরা স্ট্রিক ${stats.bestStreak}। তুমি কি আমাকে হারাতে পারবে? 🚀`,
      marathi: `आज मी ${accuracy}% अचूकतेसह स्पेस क्विझ खेळला! माझा बेस्ट स्ट्रीक ${stats.bestStreak} आहे. तुम्ही मला हरवू शकता का? 🚀`,
      malayalam: `ഇന്ന് ഞാൻ ${accuracy}% കൃത്യതയോടെ സ്പേസ് ക്വിസ് കളിച്ചു! എന്റെ ബെസ്റ്റ് സ്ട്രീക്ക് ${stats.bestStreak} ആണ്. നിങ്ങൾക്ക് എന്നെ തോൽപ്പിക്കാൻ കഴിയുമോ? 🚀`,
      english: `I played the space quiz today with ${accuracy}% accuracy! My best streak is ${stats.bestStreak}. Can you beat me? 🚀`
    };

    return messages[language as keyof typeof messages] || messages.english;
  }

  // Enhanced cloud sync methods
  async syncFromCloud(): Promise<void> {
    const user = authService.getCurrentUser();
    if (!user || user.id.startsWith('guest_')) return;

    try {
      const cloudStats = await authService.getUserStatsFromCloud();
      const cloudBadges = await authService.getBadgesFromCloud();

      if (cloudStats) {
        // Merge cloud stats with local stats (take the higher values)
        const localStats = this.getUserStats();
        const mergedStats = this.mergeStats(localStats, cloudStats);
        this.saveStats(mergedStats);
      }

      if (cloudBadges) {
        // Merge badges
        const localBadges = this.getEarnedBadges();
        const mergedBadges = this.mergeBadges(localBadges, cloudBadges);
        this.saveBadges(mergedBadges);
      }
    } catch (error) {
      console.error('Failed to sync from cloud:', error);
    }
  }

  private mergeStats(local: UserStats, cloud: any): UserStats {
    return {
      totalQuestions: Math.max(local.totalQuestions, cloud.totalQuestions || 0),
      correctAnswers: Math.max(local.correctAnswers, cloud.correctAnswers || 0),
      currentStreak: Math.max(local.currentStreak, cloud.currentStreak || 0),
      bestStreak: Math.max(local.bestStreak, cloud.bestStreak || 0),
      dailyQuizzes: Math.max(local.dailyQuizzes, cloud.dailyQuizzes || 0),
      categoriesCompleted: {
        apod: Math.max(local.categoriesCompleted.apod, cloud.categoriesCompleted?.apod || 0),
        mars_rover: Math.max(local.categoriesCompleted.mars_rover, cloud.categoriesCompleted?.mars_rover || 0),
        neo: Math.max(local.categoriesCompleted.neo, cloud.categoriesCompleted?.neo || 0)
      },
      lastPlayDate: local.lastPlayDate > cloud.lastPlayDate ? local.lastPlayDate : cloud.lastPlayDate || '',
      totalDaysPlayed: Math.max(local.totalDaysPlayed, cloud.totalDaysPlayed || 0)
    };
  }

  private mergeBadges(local: Badge[], cloud: Badge[]): Badge[] {
    const merged = [...local];
    
    for (const cloudBadge of cloud) {
      const exists = merged.find(b => b.id === cloudBadge.id);
      if (!exists) {
        merged.push(cloudBadge);
      }
    }
    
    return merged;
  }

  resetStats(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.badgesKey);
    localStorage.removeItem(this.achievementsKey);
  }

  exportStats(): string {
    const stats = this.getUserStats();
    const badges = this.getEarnedBadges();
    return JSON.stringify({ stats, badges }, null, 2);
  }

  // Streak validation methods
  validateStreak(stats: UserStats): number {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If last play was today, maintain current streak
    if (stats.lastPlayDate === today) {
      return stats.currentStreak;
    }
    
    // If last play was yesterday, can continue streak
    if (stats.lastPlayDate === yesterdayStr) {
      return stats.currentStreak;
    }
    
    // Otherwise, streak is broken
    return 0;
  }

  getStreakStatus(stats: UserStats): {
    isActive: boolean;
    daysRemaining: number;
    message: string;
  } {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPlayDate === today) {
      return {
        isActive: true,
        daysRemaining: 0,
        message: "Streak active! Come back tomorrow to continue."
      };
    }

    if (stats.lastPlayDate === yesterdayStr) {
      return {
        isActive: true,
        daysRemaining: 1,
        message: "Last chance! Play today to maintain your streak."
      };
    }

    return {
      isActive: false,
      daysRemaining: 0,
      message: "Streak broken. Start a new one today!"
    };
  }
}

export const gamificationService = new GamificationService(); 