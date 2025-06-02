export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredLanguage: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CloudUserStats {
  userId: string;
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
  consecutiveDays: number;
  lastStreakDate: string;
  weeklyStats: {
    [weekKey: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      daysPlayed: number;
    };
  };
  monthlyStats: {
    [monthKey: string]: {
      questionsAnswered: number;
      correctAnswers: number;
      daysPlayed: number;
      badgesEarned: number;
    };
  };
  allTimeBest: {
    longestStreak: number;
    bestWeeklyScore: number;
    bestMonthlyScore: number;
    perfectQuizzes: number;
  };
  updatedAt: Date;
}

class AuthService {
  private user: User | null = null;
  private listeners: Set<(authState: AuthState) => void> = new Set();

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Check for existing session
    const savedUser = localStorage.getItem('quiz_user');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        this.notifyListeners();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('quiz_user');
      }
    }
  }

  // Email/Password Authentication
  async signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    try {
      // Simulate API call - replace with actual Firebase/Supabase call
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        displayName,
        preferredLanguage: 'english',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      this.user = mockUser;
      localStorage.setItem('quiz_user', JSON.stringify(mockUser));
      
      // Migrate local data to cloud
      await this.migrateLocalDataToCloud();
      
      this.notifyListeners();
      return mockUser;
    } catch (error) {
      throw new Error('Sign up failed: ' + (error as Error).message);
    }
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      // Simulate API call
      const mockUser: User = {
        id: `user_${email.replace('@', '_').replace('.', '_')}`,
        email,
        displayName: email.split('@')[0],
        preferredLanguage: 'english',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        lastLoginAt: new Date()
      };

      this.user = mockUser;
      localStorage.setItem('quiz_user', JSON.stringify(mockUser));
      
      // Sync cloud data to local
      await this.syncCloudDataToLocal();
      
      this.notifyListeners();
      return mockUser;
    } catch (error) {
      throw new Error('Sign in failed: ' + (error as Error).message);
    }
  }

  // Google OAuth
  async signInWithGoogle(): Promise<User> {
    try {
      // Different profile photo options for testing
      const photoOptions = [
        'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=40&h=40&fit=crop&crop=face', // Working astronaut photo
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', // Working person photo
        'https://broken-url-for-testing.com/photo.jpg', // Broken URL to test fallback
        undefined // No photo to test default avatar
      ];
      
      // Randomly select a photo option (or use first one for consistent testing)
      const selectedPhoto = photoOptions[0]; // Change index to test different scenarios
      
      // Simulate Google OAuth
      const mockUser: User = {
        id: `google_${Date.now()}`,
        email: 'user@gmail.com',
        displayName: 'Space Explorer',
        photoURL: selectedPhoto,
        preferredLanguage: 'english',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      this.user = mockUser;
      localStorage.setItem('quiz_user', JSON.stringify(mockUser));
      
      await this.migrateLocalDataToCloud();
      this.notifyListeners();
      return mockUser;
    } catch (error) {
      throw new Error('Google sign in failed: ' + (error as Error).message);
    }
  }

  // Guest Mode with optional upgrade
  async continueAsGuest(): Promise<User> {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      email: '',
      displayName: 'Guest Explorer',
      preferredLanguage: 'english',
      createdAt: new Date(),
      lastLoginAt: new Date()
    };

    // Don't save guest users to localStorage
    this.user = guestUser;
    this.notifyListeners();
    return guestUser;
  }

  async upgradeGuestAccount(email: string, password: string, displayName: string): Promise<User> {
    if (!this.user || !this.user.id.startsWith('guest_')) {
      throw new Error('No guest account to upgrade');
    }

    // Convert guest to full account
    const upgradedUser: User = {
      ...this.user,
      id: `user_${Date.now()}`,
      email,
      displayName,
      createdAt: new Date()
    };

    this.user = upgradedUser;
    localStorage.setItem('quiz_user', JSON.stringify(upgradedUser));
    
    await this.migrateLocalDataToCloud();
    this.notifyListeners();
    return upgradedUser;
  }

  async signOut(): Promise<void> {
    this.user = null;
    localStorage.removeItem('quiz_user');
    this.notifyListeners();
  }

  // Cloud Data Sync
  private async migrateLocalDataToCloud(): Promise<void> {
    if (!this.user) return;

    try {
      // Get local stats
      const localStats = localStorage.getItem('astro_quiz_stats');
      const localBadges = localStorage.getItem('astro_quiz_badges');

      if (localStats) {
        const stats = JSON.parse(localStats);
        await this.saveUserStatsToCloud(stats);
      }

      if (localBadges) {
        const badges = JSON.parse(localBadges);
        await this.saveBadgesToCloud(badges);
      }

      console.log('Local data migrated to cloud successfully');
    } catch (error) {
      console.error('Failed to migrate local data:', error);
    }
  }

  private async syncCloudDataToLocal(): Promise<void> {
    if (!this.user) return;

    try {
      const cloudStats = await this.getUserStatsFromCloud();
      const cloudBadges = await this.getBadgesFromCloud();

      if (cloudStats) {
        localStorage.setItem('astro_quiz_stats', JSON.stringify(cloudStats));
      }

      if (cloudBadges) {
        localStorage.setItem('astro_quiz_badges', JSON.stringify(cloudBadges));
      }

      console.log('Cloud data synced to local successfully');
    } catch (error) {
      console.error('Failed to sync cloud data:', error);
    }
  }

  async saveUserStatsToCloud(stats: any): Promise<void> {
    if (!this.user) return;

    try {
      // Simulate cloud save - replace with actual API call
      const cloudStats: CloudUserStats = {
        userId: this.user.id,
        ...stats,
        consecutiveDays: this.calculateConsecutiveDays(stats),
        lastStreakDate: new Date().toISOString(),
        weeklyStats: this.calculateWeeklyStats(stats),
        monthlyStats: this.calculateMonthlyStats(stats),
        allTimeBest: this.calculateAllTimeBest(stats),
        updatedAt: new Date()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Stats saved to cloud:', cloudStats);
    } catch (error) {
      console.error('Failed to save stats to cloud:', error);
    }
  }

  async getUserStatsFromCloud(): Promise<CloudUserStats | null> {
    if (!this.user) return null;

    try {
      // Simulate cloud fetch
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock data for demo
      return null;
    } catch (error) {
      console.error('Failed to fetch stats from cloud:', error);
      return null;
    }
  }

  async saveBadgesToCloud(badges: any[]): Promise<void> {
    if (!this.user) return;

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log('Badges saved to cloud:', badges);
    } catch (error) {
      console.error('Failed to save badges to cloud:', error);
    }
  }

  async getBadgesFromCloud(): Promise<any[] | null> {
    if (!this.user) return null;

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return null;
    } catch (error) {
      console.error('Failed to fetch badges from cloud:', error);
      return null;
    }
  }

  // Analytics helpers
  private calculateConsecutiveDays(stats: any): number {
    const today = new Date().toISOString().split('T')[0];
    const lastPlay = stats.lastPlayDate;
    
    if (!lastPlay) return 0;
    
    const daysDiff = Math.floor(
      (new Date(today).getTime() - new Date(lastPlay).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysDiff <= 1 ? stats.totalDaysPlayed : 1;
  }

  private calculateWeeklyStats(stats: any): { [weekKey: string]: any } {
    // Implementation for weekly aggregation
    return {};
  }

  private calculateMonthlyStats(stats: any): { [monthKey: string]: any } {
    // Implementation for monthly aggregation
    return {};
  }

  private calculateAllTimeBest(stats: any): any {
    return {
      longestStreak: stats.bestStreak || 0,
      bestWeeklyScore: 0,
      bestMonthlyScore: 0,
      perfectQuizzes: 0
    };
  }

  // Listeners for state changes
  subscribe(listener: (authState: AuthState) => void): () => void {
    this.listeners.add(listener);
    
    // Send current state immediately
    listener(this.getAuthState());
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const authState = this.getAuthState();
    this.listeners.forEach(listener => listener(authState));
  }

  getAuthState(): AuthState {
    return {
      user: this.user,
      isLoading: false,
      isAuthenticated: this.user !== null && !this.user.id.startsWith('guest_')
    };
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  isGuest(): boolean {
    return this.user?.id.startsWith('guest_') || false;
  }

  async deleteAccount(): Promise<void> {
    if (!this.user) return;

    try {
      // Delete cloud data
      await this.deleteUserDataFromCloud();
      
      // Clear local data
      localStorage.removeItem('quiz_user');
      localStorage.removeItem('astro_quiz_stats');
      localStorage.removeItem('astro_quiz_badges');
      
      this.user = null;
      this.notifyListeners();
    } catch (error) {
      throw new Error('Failed to delete account: ' + (error as Error).message);
    }
  }

  private async deleteUserDataFromCloud(): Promise<void> {
    // Simulate cloud deletion
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('User data deleted from cloud');
  }
}

export const authService = new AuthService(); 