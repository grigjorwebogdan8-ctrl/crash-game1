import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { StarBackground } from './components/StarBackground';
import { RocketFlight } from './components/RocketFlight';
import { BetControls } from './components/BetControls';
import { BetsList, Bet } from './components/BetsList';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { WalletModal } from './components/WalletModal';
import { HistoryModal, HistoryItem } from './components/HistoryModal';
import { vibrate } from './utils/vibrate';
import { api } from '../utils/api';
import { UserContextType } from './Root';

export function MainApp() {
  const { tgUser, balance, setBalance, userStats, setUserStats, userHistory, setUserHistory, isAdmin, activeTab, setActiveTab } = useOutletContext<UserContextType>();
  const navigate = useNavigate();

  
  // Game State - Crash
  const [crashGameState, setCrashGameState] = useState<'idle' | 'countdown' | 'in-progress' | 'crashed'>('idle');
  const [countdown, setCountdown] = useState(5.0);
  const [multiplier, setMultiplier] = useState(1.0);
  
  // App State
  const [onlineCount, setOnlineCount] = useState(0);

  // User State
  const [betAmount, setBetAmount] = useState(10);
  const [isBetting, setIsBetting] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Bets State
  const [bets, setBets] = useState<Bet[]>([]);
  const [myBetId, setMyBetId] = useState<string | null>(null);

  // Back Button Logic
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const isSupported = tg?.version && parseFloat(tg.version) >= 6.1;

    if (tg?.BackButton && isSupported) {
      const handleBack = () => setActiveTab('crash');
      
      const updateBackButton = () => {
         try {
           if (activeTab !== 'crash') {
              if (tg.BackButton.isVisible === false || tg.BackButton.isVisible === undefined) {
                 tg.BackButton.show();
              }
              tg.BackButton.onClick(handleBack);
           } else {
              if (tg.BackButton.isVisible) {
                 tg.BackButton.hide();
              }
              tg.BackButton.offClick(handleBack);
           }
         } catch (e) {}
      };
      
      updateBackButton();

      return () => {
         try {
           tg.BackButton.offClick(handleBack);
         } catch (e) {}
      };
    }
  }, [activeTab]);

  // Game Loop Simulation
  const isRunningRef = useRef(false);
  const betsRef = useRef(bets);
  betsRef.current = bets;

  useEffect(() => {
    const onlineInterval = setInterval(() => {
      setOnlineCount(Math.floor(100 + Math.random() * 50));
    }, 5000);
    return () => clearInterval(onlineInterval);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let isSubscribed = true;

    const pollInterval = setInterval(() => {
      if (isRunningRef.current) return;
      if (betsRef.current.length > 0) {
        isRunningRef.current = true;
        runGameCycle();
      }
    }, 500);

    const runGameCycle = () => {
      if (!isSubscribed) return;
      setCrashGameState('countdown');
      setMultiplier(1.0);
      
      let cd = 5.0;
      intervalId = setInterval(() => {
        cd -= 0.1;
        if (cd <= 0) {
          clearInterval(intervalId);
          startFlying();
        } else {
          setCountdown(cd);
        }
      }, 100);
    };

    const startFlying = () => {
      if (!isSubscribed) return;
      setCrashGameState('in-progress');
      let currentMult = 1.00;
      const crashPoint = 1.0 + Math.random() * 4.0; 

      intervalId = setInterval(() => {
        currentMult += 0.01 + (currentMult * 0.005);
        if (currentMult >= crashPoint) {
          clearInterval(intervalId);
          crash(currentMult);
        } else {
          setMultiplier(currentMult);
        }
      }, 50);
    };

    const crash = (finalMult: number) => {
      if (!isSubscribed) return;
      setCrashGameState('crashed');
      setMultiplier(finalMult);
      vibrate([200, 100, 200]);

      timeoutId = setTimeout(() => {
        if (!isSubscribed) return;
        setCrashGameState('idle');
        setMultiplier(1.0);
        setCountdown(5.0);
        setIsBetting(false);
        setHasCashedOut(false);
        setBets([]); 
        
        setTimeout(() => {
          isRunningRef.current = false;
        }, 100);
      }, 3000);
    };

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      isRunningRef.current = false;
    };
  }, []);

  // Record bet loss
  useEffect(() => {
    const recordLoss = async () => {
      if (crashGameState === 'crashed' && isBetting && !hasCashedOut && tgUser) {
        const userId = tgUser.id;
        const newStats = { ...userStats, games: userStats.games + 1, totalBet: userStats.totalBet + betAmount };
        setUserStats(newStats);
        await api.updateStats(userId, newStats);

        const historyItem = {
           type: 'bet', game: 'Crash', amount: betAmount, multiplier: 0, winAmount: 0,
           date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };
        setUserHistory(prev => [historyItem, ...prev]);
        await api.addHistory(userId, historyItem);
        setIsBetting(false);
      }
    };
    recordLoss();
  }, [crashGameState, isBetting, hasCashedOut, betAmount, tgUser]);

  const handlePlaceCrashBet = async () => {
    const userId = tgUser ? tgUser.id : 12345;
    const username = tgUser ? (tgUser.username || tgUser.first_name) : 'Гость';

    if ((crashGameState === 'idle' || crashGameState === 'countdown') && balance >= betAmount && !isBetting) {
      const res = await api.placeBet(userId, betAmount, 'crash');
      if (res.success) {
         vibrate([30, 30]);
         setBalance(prev => prev - betAmount);
         setIsBetting(true);
         setHasCashedOut(false);
         setMyBetId(res.betId);
         setBets(prev => [{ id: res.betId, username, amount: betAmount, status: 'playing' }, ...prev]);
      }
    }
  };

  const handleCashout = async () => {
    const userId = tgUser ? tgUser.id : 12345;
    if (crashGameState === 'in-progress' && isBetting && !hasCashedOut && myBetId) {
      const win = betAmount * multiplier;
      const res = await api.cashout(userId, myBetId, win);
      if (res.success) {
         vibrate([50, 100, 50, 100]);
         setWinAmount(win);
         setBalance(prev => prev + win);
         setHasCashedOut(true);
         setBets(prev => prev.map(bet => bet.id === myBetId ? { ...bet, status: 'cashed_out', multiplier, winAmount: win } : bet));

         const newStats = { ...userStats, wins: userStats.wins + 1, games: userStats.games + 1, totalBet: userStats.totalBet + betAmount, maxMultiplier: Math.max(userStats.maxMultiplier, multiplier) };
         setUserStats(newStats);
         await api.updateStats(userId, newStats);

         const historyItem = { type: 'bet', game: 'Crash', amount: betAmount, multiplier, winAmount: win, date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) };
         setUserHistory(prev => [historyItem, ...prev]);
         await api.addHistory(userId, historyItem);
      }
    }
  };

  const handleTopUpStars = async (amount: number) => {
     const userId = tgUser ? tgUser.id : 12345;
     const res = await api.topUpStars(userId, amount);
     if (res.success) {
        const { balance: newBalance } = await api.getBalance(userId);
        setBalance(newBalance);
     }
  };

  const handleTopUpTon = async (amount: number) => {
     const userId = tgUser ? tgUser.id : 12345;
     const res = await api.topUpTon(userId, amount);
     if (res.success) {}
  };

  const displayName = tgUser ? (tgUser.username || tgUser.first_name) : 'Гость';

  // Override set tab to handle routing to admin
  const onTabChange = (tab: TabType) => {
    if (tab === 'admin') {
      navigate('/admin');
    } else {
      setActiveTab(tab as 'crash' | 'profile');
    }
  };

  return (
    <>
      <StarBackground speedMultiplier={crashGameState === 'in-progress' ? 3 : 0.5} />
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} balance={balance} onTopUpStars={handleTopUpStars} onTopUpTon={handleTopUpTon} />
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={userHistory} />

      <div className="relative flex-1 flex flex-col z-10 w-full max-w-md mx-auto h-full bg-transparent">
        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col pb-6 no-scrollbar">
          {activeTab !== 'profile' && (
            <Header balance={balance} onlineCount={onlineCount} tgUser={tgUser} onTopUp={() => setIsWalletOpen(true)} />
          )}

          {activeTab === 'crash' && (
            <div className="flex flex-col p-4 gap-4 pb-10 fade-in-up">
              <div className="relative w-full rounded-2xl bg-slate-900/70 border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 h-72 group">
                <div className="absolute inset-0 rounded-2xl border border-blue-500/10 pointer-events-none group-hover:border-blue-500/30 transition-colors z-50" />
                <RocketFlight gameState={crashGameState} multiplier={multiplier} countdown={countdown} />
              </div>
              <BetControls balance={balance} betAmount={betAmount} setBetAmount={setBetAmount} onBet={handlePlaceCrashBet} onCashout={handleCashout} isBetting={isBetting} gameState={crashGameState} hasCashedOut={hasCashedOut} currentWin={betAmount * multiplier} />
              <div className="flex flex-col mt-2 gap-2">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest flex justify-between px-1">
                  <span>Ставки раунда</span>
                  <span className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">★ {bets.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}</span>
                </div>
                <BetsList bets={bets} currentMultiplier={multiplier} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex-1 flex flex-col p-4 animate-in fade-in duration-300">
              <h2 className="text-[20px] font-bold text-white text-center mb-6 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">Профиль</h2>
              <div className="flex flex-col items-center mb-8">
                <div className="w-[88px] h-[88px] rounded-[32px] bg-[#1C2030] overflow-hidden mb-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#2A3043] transition-transform duration-300 hover:scale-105">
                   {tgUser?.photo_url ? (
                      <img src={tgUser.photo_url} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">{displayName.substring(0, 2).toUpperCase()}</div>
                   )}
                </div>
                <h3 className="text-[24px] font-bold text-white mb-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">{displayName}</h3>
                <div className="bg-[#0F1423] px-4 py-1.5 rounded-full border border-[#2A3043] flex items-center gap-2 mb-2 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                   <span className="text-slate-500 text-[12px] uppercase font-bold tracking-wider">ID</span>
                   <span className="text-slate-300 text-[14px] font-mono">{tgUser?.id || 'Гость'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setIsWalletOpen(true)} className="flex items-center justify-between p-4 bg-[#1C2030] rounded-[16px] hover:bg-[#2A3043] transition-all duration-300 active:scale-[0.98] shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg></div>
                    <span className="text-white font-bold text-[16px]">Кошелек</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <button onClick={() => setIsHistoryOpen(true)} className="flex items-center justify-between p-4 bg-[#1C2030] rounded-[16px] hover:bg-[#2A3043] transition-all duration-300 active:scale-[0.98] shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                    <span className="text-white font-bold text-[16px]">История ставок</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <button className="flex items-center justify-between p-4 bg-[#1C2030] rounded-[16px] hover:bg-[#2A3043] transition-all duration-300 active:scale-[0.98] shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                    <span className="text-white font-bold text-[16px]">Язык</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[14px] font-medium">Русский</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </button>
                <button 
                  onClick={() => {
                     const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
                     if (tg && tg.openTelegramLink) {
                        tg.openTelegramLink('https://t.me/arina_neytor');
                     } else {
                        window.open('https://t.me/arina_neytor', '_blank');
                     }
                  }}
                  className="flex items-center justify-between p-4 bg-[#1C2030] rounded-[16px] hover:bg-[#2A3043] transition-all duration-300 active:scale-[0.98] mt-2 shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center text-blue-500 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                    </div>
                    <span className="text-white font-bold text-[16px]">Поддержка</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={onTabChange} isAdmin={isAdmin} />
      </div>
    </>
  );
}