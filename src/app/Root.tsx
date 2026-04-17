import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { api } from '../utils/api';
import { vibrate } from './utils/vibrate';

export type UserContextType = {
  tgUser: any;
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  userStats: any;
  setUserStats: React.Dispatch<React.SetStateAction<any>>;
  userHistory: any[];
  setUserHistory: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  activeTab: 'crash' | 'profile';
  setActiveTab: React.Dispatch<React.SetStateAction<'crash' | 'profile'>>;
};

const ADMIN_ID = 8266216701; // Replace with your real Admin TG ID

export function Root() {
  const [tgUser, setTgUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [userStats, setUserStats] = useState<any>({ games: 0, wins: 0, maxMultiplier: 0, totalBet: 0 });
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'crash' | 'profile'>('crash');

  useEffect(() => {
    const initApp = () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        
        const user = tg.initDataUnsafe?.user;
        if (user) {
           setTgUser(user);
           api.userInit(user).catch(console.error);
           
           // Fetch real data on start
           api.getBalance(user.id).then(res => setBalance(res.balance));
           api.getStats(user.id).then(res => setUserStats(res));
           api.getHistory(user.id).then(res => setUserHistory(res));
        }
      }
    };

    if (typeof window !== 'undefined' && !window.Telegram) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.async = true;
      script.onload = initApp;
      document.head.appendChild(script);
    } else {
      initApp();
    }
  }, []);

  const isAdmin = tgUser?.id === ADMIN_ID;

  return (
    <div className="w-full h-[100dvh] bg-gradient-to-b from-[#0B0F19] via-[#111827] to-[#0A0F1D] flex flex-col font-sans overflow-hidden text-slate-100">
      <Outlet context={{
        tgUser,
        balance,
        setBalance,
        userStats,
        setUserStats,
        userHistory,
        setUserHistory,
        isAdmin,
        activeTab,
        setActiveTab
      } satisfies UserContextType} />
    </div>
  );
}