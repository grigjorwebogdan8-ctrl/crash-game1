import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0dc2674a`;

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Init user
  userInit: async (userData: any): Promise<{ ok: boolean }> => {
    return apiCall(`/user-init`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get user balance
  getBalance: async (userId: string | number): Promise<{ balance: number }> => {
    return apiCall(`/user/${userId}/balance`);
  },

  // Update user balance
  updateBalance: async (userId: string | number, balance: number): Promise<{ success: boolean }> => {
    return apiCall(`/user/${userId}/balance`, {
      method: 'POST',
      body: JSON.stringify({ balance }),
    });
  },

  // Get user stats
  getStats: async (userId: string | number): Promise<{ games: number; wins: number; maxMultiplier: number; totalBet: number }> => {
    return apiCall(`/user/${userId}/stats`);
  },

  // Update user stats
  updateStats: async (userId: string | number, stats: any): Promise<{ success: boolean }> => {
    return apiCall(`/user/${userId}/stats`, {
      method: 'POST',
      body: JSON.stringify(stats),
    });
  },

  // Get user history
  getHistory: async (userId: string | number): Promise<any[]> => {
    return apiCall(`/user/${userId}/history`);
  },

  // Add to user history
  addHistory: async (userId: string | number, item: any): Promise<{ success: boolean }> => {
    return apiCall(`/user/${userId}/history`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  // Place bet
  placeBet: async (userId: string | number, amount: number, game: string, data?: any): Promise<{ success: boolean; betId: string }> => {
    return apiCall(`/bet/place`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount, game, data }),
    });
  },

  // Cashout
  cashout: async (userId: string | number, betId: string, winAmount: number): Promise<{ success: boolean; win: number }> => {
    return apiCall(`/bet/cashout`, {
      method: 'POST',
      body: JSON.stringify({ userId, betId, winAmount }),
    });
  },

  // Top up with Stars
  topUpStars: async (userId: string | number, amount: number): Promise<{ success: boolean }> => {
    return apiCall(`/topup/stars`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  },

  // Top up with TON
  topUpTon: async (userId: string | number, amount: number): Promise<{ success: boolean }> => {
    return apiCall(`/topup/ton`, {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  },

  // Get all users (admin)
  getUsers: async (): Promise<any[]> => {
    return apiCall(`/admin/users`);
  },

  // Get all history (admin)
  getAdminHistory: async (): Promise<any[]> => {
    return apiCall(`/admin/history`);
  },

  // Withdraw (stub for future)
  withdraw: async (userId: string | number, amount: number, address: string): Promise<{ success: boolean }> => {
    // This is a stub - withdraw functionality is not implemented as per requirements
    return { success: false };
  },

  // Set next crash point (admin)
  setNextCrash: async (multiplier: number): Promise<{ success: boolean }> => {
    return apiCall(`/admin/next-crash`, {
      method: 'POST',
      body: JSON.stringify({ multiplier }),
    });
  },

  // Get current game crash point
  getCrashPoint: async (): Promise<{ crashPoint: number, forced: boolean }> => {
    return apiCall(`/game/crash-point`);
  },
};
