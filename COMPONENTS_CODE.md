# 📦 Полный код всех компонентов Crash Game

Скопируйте каждый файл в соответствующую папку вашего проекта.

---

## 📁 src/app/App.tsx

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StarBackground } from './components/StarBackground';
import { RocketFlight } from './components/RocketFlight';
import { BetControls } from './components/BetControls';
import { BetsList, Bet } from './components/BetsList';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';

const generateFakeUsername = () => {
  const names = ['Alex', 'Mikhail', 'Dmitry', 'Ivan', 'Elena', 'Anna', 'Sergey', 'Oleg', 'Igor', 'Max'];
  const name = names[Math.floor(Math.random() * names.length)];
  return `${name}${Math.floor(Math.random() * 9999)}`;
};

const generateCrashPoint = () => {
  const e = 100 / (100 - Math.random() * 100);
  const result = Math.max(1.00, Math.floor(e * 100) / 100);
  return result > 1000 ? 1000 : result;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('crash');
  
  // Game State
  const [gameState, setGameState] = useState<'countdown' | 'flying' | 'crashed'>('countdown');
  const [countdown, setCountdown] = useState(5.0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(1.0);
  
  // User State
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [isBetting, setIsBetting] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [winAmount, setWinAmount] = useState(0);

  // Bets State
  const [bets, setBets] = useState<Bet[]>([]);
  
  // Refs for requestAnimationFrame
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const lastCheckRef = useRef<number>(0);
  const roundStartTimeRef = useRef<number>(0);

  // Logic to initialize a round
  const initRound = useCallback(() => {
    const newCrashPoint = generateCrashPoint();
    setCrashPoint(newCrashPoint);
    setMultiplier(1.0);
    setGameState('countdown');
    setCountdown(5.0);
    setHasCashedOut(false);
    lastCheckRef.current = 0;
    
    // Generate fake bets
    const fakeBetsCount = Math.floor(Math.random() * 15) + 5;
    const newBets: Bet[] = [];
    for (let i = 0; i < fakeBetsCount; i++) {
      newBets.push({
        id: `fake-${i}-${Date.now()}`,
        username: generateFakeUsername(),
        amount: Math.floor(Math.random() * 1000) + 10,
        status: 'playing',
        targetMultiplier: 1.01 + Math.random() * 5
      });
    }
    setBets(newBets.sort((a, b) => b.amount - a.amount));
    
  }, []);

  // First init
  useEffect(() => {
    initRound();
  }, [initRound]);

  // Main Game Loop
  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const dt = now - lastUpdateRef.current;
      lastUpdateRef.current = now;

      if (gameState === 'countdown') {
        setCountdown((prev) => {
          const next = prev - dt / 1000;
          if (next <= 0) {
            setGameState('flying');
            roundStartTimeRef.current = Date.now();
            return 0;
          }
          return next;
        });
      } else if (gameState === 'flying') {
        const timeMs = now - roundStartTimeRef.current;
        let nextMultiplier = Math.exp(0.00008 * timeMs);
        
        if (nextMultiplier >= crashPoint) {
          nextMultiplier = crashPoint;
          setGameState('crashed');
          setBets(prev => prev.map(bet => 
            bet.status === 'playing' ? { ...bet, status: 'crashed' } : bet
          ));
          if (isBetting && !hasCashedOut) {
            setIsBetting(false); // User lost
          }
          setTimeout(initRound, 3000);
        }

        setMultiplier(nextMultiplier);

        if (timeMs - lastCheckRef.current > 100) {
          lastCheckRef.current = timeMs;
          setBets(prev => {
            let changed = false;
            const newBets = prev.map(bet => {
              if (bet.status === 'playing' && bet.targetMultiplier && nextMultiplier >= bet.targetMultiplier) {
                changed = true;
                return {
                  ...bet,
                  status: 'cashed_out' as const,
                  multiplier: bet.targetMultiplier,
                  winAmount: bet.amount * bet.targetMultiplier
                };
              }
              return bet;
            });
            return changed ? newBets : prev;
          });
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [gameState, crashPoint, isBetting, hasCashedOut, initRound]);

  const handleBet = () => {
    if (gameState === 'countdown' && balance >= betAmount && !isBetting) {
      setBalance(prev => prev - betAmount);
      setIsBetting(true);
      
      const myBet: Bet = {
        id: `my-${Date.now()}`,
        username: 'You',
        amount: betAmount,
        status: 'playing'
      };
      
      setBets(prev => [myBet, ...prev]);
    }
  };

  const handleCashout = () => {
    if (gameState === 'flying' && isBetting && !hasCashedOut) {
      const win = betAmount * multiplier;
      setWinAmount(win);
      setBalance(prev => prev + win);
      setHasCashedOut(true);
      
      setBets(prev => prev.map(bet => 
        bet.id.startsWith('my-') 
          ? { ...bet, status: 'cashed_out', multiplier, winAmount: win }
          : bet
      ));
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#0A0F1D] flex flex-col font-sans overflow-hidden text-slate-100">
      <StarBackground speedMultiplier={gameState === 'flying' ? 3 : 0.5} />

      <div className="relative flex-1 flex flex-col z-10 w-full max-w-md mx-auto h-full shadow-2xl bg-slate-950/40 backdrop-blur-sm border-x border-slate-900/50">
        
        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth flex flex-col">
          <Header balance={balance} />

          {activeTab === 'crash' && (
            <div className="flex flex-col p-4 gap-4 pb-10">
              {/* Rocket Area */}
              <div className="relative w-full rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl overflow-hidden shrink-0 h-72">
                <RocketFlight gameState={gameState} multiplier={multiplier} />
                
                {/* Countdown Overlay */}
                {gameState === 'countdown' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-40">
                    <div className="text-xl font-bold text-slate-300 mb-2">ВЗЛЕТ ЧЕРЕЗ</div>
                    <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                      {countdown.toFixed(1)}s
                    </div>
                  </div>
                )}
                
                {/* Previous Multipliers Bar (Visual Fake Data) */}
                <div className="absolute bottom-3 w-full px-4 z-50 overflow-hidden">
                  <div className="flex gap-2 w-full max-w-full overflow-x-auto no-scrollbar scroll-smooth">
                    {['7.34x', '1.62x', '7.22x', '2.58x', '1.29x', '6.03x', '9.43x'].map((m, i) => {
                      const num = parseFloat(m);
                      return (
                        <span key={i} className={`shrink-0 px-2 py-1 rounded-md text-xs font-bold ${
                          num > 5 ? 'text-yellow-400 bg-yellow-400/10' :
                          num > 2 ? 'text-purple-400 bg-purple-400/10' :
                          'text-blue-400 bg-blue-400/10'
                        }`}>
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bet Controls */}
              <BetControls 
                balance={balance}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                onBet={handleBet}
                onCashout={handleCashout}
                isBetting={isBetting}
                gameState={gameState}
                hasCashedOut={hasCashedOut}
                currentWin={betAmount * multiplier}
              />

              {/* Bets List */}
              <div className="flex flex-col mt-2 gap-2">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest flex justify-between px-1">
                  <span>Всего ставок: {bets.length}</span>
                  <span className="text-yellow-500">
                    ★ {bets.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}
                  </span>
                </div>
                <BetsList bets={bets} currentMultiplier={multiplier} />
              </div>
            </div>
          )}

          {activeTab === 'roulette' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6 text-slate-400 h-full min-h-[500px]">
              <div className="relative w-32 h-32 rounded-full border-8 border-slate-800 border-t-blue-500 animate-[spin_3s_linear_infinite]" />
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Рулетка</h2>
                <p className="text-slate-500">Раздел в разработке...</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex-1 flex flex-col items-center p-8 gap-6 text-slate-400 min-h-[500px]">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-blue-500 flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                ME
              </div>
              <h2 className="text-3xl font-bold text-white">Lionel Messi</h2>
              
              <div className="bg-slate-900/80 w-full p-6 rounded-2xl text-left border border-slate-800 shadow-xl space-y-4">
                <div className="flex justify-between pb-4 border-b border-slate-800/50">
                  <span className="text-slate-500">Баланс</span>
                  <span className="text-yellow-400 font-bold text-xl">{balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-slate-800/50">
                  <span className="text-slate-500">Всего игр</span>
                  <span className="text-white font-bold text-xl">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Статус</span>
                  <span className="text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full">VIP</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
```

---

## 📁 src/app/components/StarBackground.tsx

```tsx
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

export function StarBackground({ speedMultiplier = 1 }: { speedMultiplier?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random(),
          speed: (Math.random() * 0.5 + 0.1),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f172a'; // tailwind slate-900 background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Move star down to create flying effect
        star.y += star.speed * speedMultiplier;
        
        // Twinkle
        star.opacity += (Math.random() - 0.5) * 0.1;
        if (star.opacity < 0.2) star.opacity = 0.2;
        if (star.opacity > 1) star.opacity = 1;

        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    initStars();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMultiplier]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
```

---

## 📁 src/app/components/RocketFlight.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';

interface RocketFlightProps {
  gameState: 'countdown' | 'flying' | 'crashed';
  multiplier: number;
}

export function RocketFlight({ gameState, multiplier }: RocketFlightProps) {
  return (
    <div className="relative w-full h-64 overflow-hidden flex items-center justify-center">
      {/* Curved line background representing flight path */}
      <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <pattern id="stars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="25" r="0.6" fill="white" />
            <circle cx="75" cy="45" r="0.8" fill="white" />
            <circle cx="45" cy="75" r="0.5" fill="white" />
            <circle cx="85" cy="85" r="0.7" fill="white" />
            <circle cx="20" cy="10" r="0.5" fill="white" />
            <circle cx="80" cy="35" r="0.8" fill="white" />
            <circle cx="50" cy="30" r="0.4" fill="white" />
            <circle cx="10" cy="60" r="0.6" fill="white" />
            <circle cx="90" cy="50" r="0.5" fill="white" />
            <circle cx="70" cy="20" r="0.7" fill="white" />
            <circle cx="30" cy="15" r="0.9" fill="white" />
          </pattern>
        </defs>

        {/* Background Parallax Layer */}
        <motion.g 
          animate={{ y: gameState === 'flying' ? (multiplier - 1) * 5 : 0 }}
          transition={{ ease: "linear", duration: 0.1 }}
          opacity="0.5"
        >
          {/* Planets */}
          <circle cx="85" cy="-20" r="6" fill="#4B5563" />
          <ellipse cx="85" cy="-20" rx="10" ry="3" fill="none" stroke="#6B7280" strokeWidth="0.5" transform="rotate(-20 85 -20)" />
          
          <circle cx="20" cy="-120" r="3" fill="#374151" />
          
          <circle cx="75" cy="-250" r="5" fill="#1f2937" />
          <ellipse cx="75" cy="-250" rx="8" ry="2" fill="none" stroke="#374151" strokeWidth="0.5" transform="rotate(15 75 -250)" />
          
          <circle cx="15" cy="-400" r="4" fill="#4B5563" />
          
          {/* Infinite Stars Rectangle */}
          <rect x="0" y="-1000" width="100" height="1100" fill="url(#stars)" />
        </motion.g>

        {/* Second Static Star Layer for depth */}
        <rect x="0" y="0" width="100" height="100" fill="url(#stars)" opacity="0.3" />

        {gameState !== 'countdown' && (
          <motion.path
            d={`M 0,100 Q ${50 - Math.min(1, (multiplier - 1) / 5) * 25},${90 - Math.min(1, (multiplier - 1) / 5) * 40} ${90 - Math.min(1, (multiplier - 1) / 5) * 40},${20 - Math.min(1, (multiplier - 1) / 5) * 20}`}
            fill="transparent"
            stroke="#eab308"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              gameState === 'flying' 
                ? { pathLength: 1, opacity: 1 } 
                : { opacity: 0 }
            }
            transition={{ duration: 5, ease: "linear" }}
          />
        )}
      </svg>

      {/* The Rocket */}
      <AnimatePresence>
        {gameState !== 'crashed' && (
          <motion.div
            className="absolute z-10"
            initial={false}
            animate={
              gameState === 'countdown'
                ? { x: '-30vw', y: '10vh', rotate: 45 }
                : { 
                    x: ['-30vw', '10vw'], 
                    y: ['10vh', '-10vh'], 
                    rotate: [45, 45 + (Math.random() * 5 - 2.5)],
                  }
            }
            transition={
              gameState === 'countdown'
                ? { duration: 0.5, ease: 'easeOut' }
                : { duration: 5, ease: 'easeOut', yoyo: Infinity }
            }
          >
            <motion.div
              animate={
                gameState === 'flying'
                  ? { y: [0, -5, 0, 5, 0], x: [0, 2, 0, -2, 0] }
                  : { y: [0, -2, 0], x: 0 }
              }
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="relative"
            >
              <Rocket size={64} className="text-yellow-400 fill-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
              {/* Exhaust flame */}
              {gameState === 'flying' && (
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-8 h-8 bg-orange-500 rounded-full blur-md opacity-80"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion on Crash */}
      <AnimatePresence>
        {gameState === 'crashed' && (
          <motion.div
            className="absolute z-20 text-red-500 font-bold text-4xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-red-600 rounded-full blur-xl absolute -inset-4" />
            💥 CRASHED
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multiplier Display */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 pointer-events-none">
        <motion.div 
          className={`text-5xl font-black ${gameState === 'crashed' ? 'text-red-500' : 'text-white'}`}
          animate={gameState === 'crashed' ? { scale: [1, 1.2, 1], x: [-5, 5, -5, 5, 0] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {multiplier.toFixed(2)}x
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 📁 src/app/components/BetControls.tsx

```tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Minus, Plus } from 'lucide-react';

interface BetControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onBet: () => void;
  onCashout: () => void;
  isBetting: boolean;
  gameState: 'countdown' | 'flying' | 'crashed';
  hasCashedOut: boolean;
  currentWin: number;
}

export function BetControls({
  balance,
  betAmount,
  setBetAmount,
  onBet,
  onCashout,
  isBetting,
  gameState,
  hasCashedOut,
  currentWin
}: BetControlsProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    setBetAmount(val);
  };

  const adjustBet = (amount: number) => {
    setBetAmount(Math.min(Math.max(1, betAmount + amount), balance));
  };

  const handleBlur = () => {
    if (betAmount < 1) setBetAmount(1);
    if (betAmount > balance) setBetAmount(balance);
  };

  const canBet = gameState === 'countdown' && !isBetting && balance >= betAmount;

  return (
    <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 flex flex-col gap-4">
      {/* Bet Amount Input */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Input 
            type="number" 
            value={betAmount.toString()} 
            onChange={handleAmountChange}
            onBlur={handleBlur}
            disabled={isBetting}
            className="bg-slate-800 border-slate-700 text-white text-lg font-bold text-center h-12"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => adjustBet(1)}
          disabled={isBetting}
          className="h-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          +1
        </Button>
        <Button 
          variant="outline" 
          onClick={() => adjustBet(5)}
          disabled={isBetting}
          className="h-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          +5
        </Button>
        <Button 
          variant="outline" 
          onClick={() => adjustBet(10)}
          disabled={isBetting}
          className="h-12 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
        >
          +10
        </Button>
      </div>

      {/* Main Action Button */}
      {isBetting && gameState === 'flying' && !hasCashedOut ? (
        <Button 
          onClick={onCashout}
          className="w-full h-14 text-xl font-bold bg-green-500 hover:bg-green-600 text-white animate-pulse"
        >
          ЗАБРАТЬ {currentWin.toFixed(2)}
        </Button>
      ) : (
        <Button 
          onClick={onBet}
          disabled={!canBet}
          className={`w-full h-14 text-xl font-bold ${
            isBetting 
              ? 'bg-slate-700 text-slate-400' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isBetting ? 'СТАВКА ПРИНЯТА' : 'СДЕЛАТЬ СТАВКУ'}
        </Button>
      )}
    </div>
  );
}
```

---

## 📁 src/app/components/BetsList.tsx

```tsx
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface Bet {
  id: string;
  username: string;
  amount: number;
  multiplier?: number;
  winAmount?: number;
  status: 'playing' | 'cashed_out' | 'crashed';
  targetMultiplier?: number;
}

interface BetsListProps {
  bets: Bet[];
  currentMultiplier: number;
}

export function BetsList({ bets, currentMultiplier }: BetsListProps) {
  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col overflow-hidden pb-4">
      <div className="p-3 text-xs font-semibold text-slate-400 flex justify-between uppercase tracking-wider bg-slate-900/80 sticky top-0 z-10 border-b border-slate-800">
        <span>Пользователь</span>
        <span>Ставка / Выигрыш</span>
      </div>
      
      <div className="px-2 pt-2 flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {bets.map((bet) => {
            const currentWin = bet.status === 'playing' ? bet.amount * currentMultiplier : bet.winAmount;
            
            return (
              <motion.div
                key={bet.id}
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                  bet.status === 'cashed_out' 
                    ? 'bg-green-900/30 border border-green-500/30 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' 
                    : bet.status === 'crashed'
                    ? 'bg-red-900/30 border border-red-500/30 opacity-75'
                    : 'bg-slate-800/80 border border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold shadow-inner">
                    {bet.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-200">{bet.username}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-slate-300 font-bold">
                    {bet.amount.toFixed(2)}
                  </span>
                  {bet.status === 'cashed_out' && (
                    <span className="text-green-400 text-sm font-bold">
                      {bet.multiplier?.toFixed(2)}x / {bet.winAmount?.toFixed(2)}
                    </span>
                  )}
                  {bet.status === 'playing' && currentMultiplier > 1 && (
                    <span className="text-yellow-400 text-sm font-bold">
                      ~{currentWin?.toFixed(2)}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

## 📁 src/app/components/Header.tsx

```tsx
import React, { useEffect, useState } from 'react';
import { Users, Coins, Gift } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  balance: number;
}

export function Header({ balance }: HeaderProps) {
  const [onlineCount, setOnlineCount] = useState(150);

  useEffect(() => {
    // Update online count every 3-5 seconds
    const updateOnline = () => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        let next = prev + change;
        if (next < 50) next = 50;
        if (next > 250) next = 250;
        return next;
      });
      setTimeout(updateOnline, 3000 + Math.random() * 2000);
    };
    
    const timeoutId = setTimeout(updateOnline, 3000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex items-center justify-between p-4 z-10 w-full max-w-md mx-auto">
      {/* Online Badge */}
      <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-white font-bold text-sm">{onlineCount}</span>
        <Users size={14} className="text-slate-400" />
      </div>

      {/* Balance and Bonus */}
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" className="rounded-full bg-slate-800/80 border-slate-700 text-yellow-500 hover:text-yellow-400">
          <Gift size={18} />
        </Button>
        <div className="bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
          <Coins size={16} className="text-yellow-500" />
          <span className="text-white font-bold text-sm">{balance.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
```

---

## 📁 src/app/components/BottomNav.tsx

```tsx
import React from 'react';
import { Rocket, Disc, User } from 'lucide-react';

export type TabType = 'crash' | 'roulette' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="bg-slate-900 border-t border-slate-800 h-16 flex items-center justify-around px-2 z-50">
      <button 
        onClick={() => setActiveTab('crash')}
        className={`flex flex-col items-center justify-center w-20 gap-1 transition-colors ${activeTab === 'crash' ? 'text-blue-500' : 'text-slate-500'}`}
      >
        <Rocket size={20} className={activeTab === 'crash' ? 'fill-blue-500/20' : ''} />
        <span className="text-[10px] font-semibold">Краш</span>
      </button>

      <button 
        onClick={() => setActiveTab('roulette')}
        className={`flex flex-col items-center justify-center w-20 gap-1 transition-colors ${activeTab === 'roulette' ? 'text-blue-500' : 'text-slate-500'}`}
      >
        <Disc size={20} />
        <span className="text-[10px] font-semibold">Рулетка</span>
      </button>

      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center w-20 gap-1 transition-colors ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-500'}`}
      >
        <User size={20} />
        <span className="text-[10px] font-semibold">Профиль</span>
      </button>
    </div>
  );
}
```

---

## 📁 src/app/lib/utils.ts

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 🎨 CSS Файлы

### src/styles/index.css

```css
@import "./fonts.css";
@import "tailwindcss";
@import "./theme.css";
```

### src/styles/fonts.css

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### src/styles/tailwind.css

```css
@import "tailwindcss";
```

### src/styles/theme.css

**⚠️ Скопируйте полное содержимое из `/workspaces/default/code/src/styles/theme.css`**

---

## ✅ Готово!

После создания всех файлов запустите:

```bash
npm install
npm run dev
```

Ваш проект будет доступен по адресу `http://localhost:3000` 🚀
