import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { vibrate } from '../utils/vibrate';
import { Star } from 'lucide-react';

interface BetControlsProps {
  balance: number;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  onBet: () => void;
  onCashout: () => void;
  isBetting: boolean;
  gameState: 'idle' | 'countdown' | 'in-progress' | 'crashed';
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
  const [activeTab, setActiveTab] = useState<'total' | 'auto'>('total');
  const [autoCashout, setAutoCashout] = useState(2.0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseFloat(e.target.value);
    if (isNaN(val)) val = 0;
    setBetAmount(val);
  };

  const adjustBet = (amount: number) => {
    vibrate(10);
    setBetAmount(Math.min(Math.max(0, betAmount + amount), balance));
  };

  const handleMin = () => {
    vibrate(10);
    setBetAmount(10);
  };

  const handleMax = () => {
    vibrate(20);
    setBetAmount(balance);
  };

  const handleBlur = () => {
    if (betAmount < 0) setBetAmount(0);
    if (betAmount > balance) setBetAmount(balance);
  };

  const canBet = (gameState === 'idle' || gameState === 'countdown') && !isBetting && balance >= betAmount && betAmount > 0;

  return (
    <div className="bg-[#1C2030] rounded-[24px] p-4 flex flex-col gap-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      
      {/* Tabs */}
      <div className="flex bg-[#0F1423] p-1 rounded-[16px] transition-all duration-300">
        <button 
          className={`flex-1 py-2.5 rounded-[12px] text-[14px] font-semibold transition-all duration-300 ${activeTab === 'total' ? 'bg-[#1C2030] text-white shadow-sm' : 'text-slate-400'}`}
          onClick={() => setActiveTab('total')}
        >
          Сумма ставки
        </button>
        <button 
          className={`flex-1 py-2.5 rounded-[12px] text-[14px] font-semibold transition-all duration-300 ${activeTab === 'auto' ? 'bg-[#1C2030] text-white shadow-sm' : 'text-slate-400'}`}
          onClick={() => setActiveTab('auto')}
        >
          Автовывод
        </button>
      </div>

      {activeTab === 'total' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400">
               <Star size={20} fill="currentColor" />
             </div>
             <Input 
                type="number" 
                value={betAmount.toString()} 
                onChange={handleAmountChange}
                onBlur={handleBlur}
                disabled={isBetting}
                className="w-full h-14 bg-[#0F1423] border-none text-white text-lg font-bold pl-12 rounded-[16px] focus-visible:ring-0 transition-colors duration-300"
              />
          </div>

          <div className="grid grid-cols-6 gap-2">
             <Button variant="ghost" onClick={handleMin} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">Мин</Button>
             <Button variant="ghost" onClick={() => adjustBet(100)} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">+100</Button>
             <Button variant="ghost" onClick={() => adjustBet(500)} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">+500</Button>
             <Button variant="ghost" onClick={() => adjustBet(1000)} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">+1k</Button>
             <Button variant="ghost" onClick={() => adjustBet(5000)} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">+5k</Button>
             <Button variant="ghost" onClick={handleMax} disabled={isBetting} className="h-10 bg-[#262C40] hover:bg-[#2C334A] text-slate-300 rounded-[12px] text-[13px] font-medium p-0 transition-all duration-300 active:scale-95">Макс</Button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <div className="relative">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
               X
             </div>
             <Input 
                type="number" 
                value={autoCashout.toString()} 
                onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 1.01)}
                step="0.1"
                min="1.01"
                disabled={isBetting}
                className="w-full h-14 bg-[#0F1423] border-none text-white text-lg font-bold pl-12 rounded-[16px] focus-visible:ring-0 transition-colors duration-300"
              />
          </div>
        </motion.div>
      )}

      {/* Main Action Button */}
      <div className="mt-1">
        {isBetting && gameState === 'in-progress' && !hasCashedOut ? (
          <Button 
            onClick={onCashout}
            className="w-full h-[60px] rounded-[16px] text-[18px] font-black tracking-wide bg-[#1DD662] hover:bg-[#1BD15F] text-white active:scale-[0.98] transition-all duration-300 shadow-[0_0_15px_rgba(29,214,98,0.3)] hover:shadow-[0_0_20px_rgba(29,214,98,0.5)]"
          >
            Забрать {currentWin.toFixed(2)}
          </Button>
        ) : (
          <Button 
            onClick={onBet}
            disabled={!canBet}
            className={`w-full h-[60px] rounded-[16px] text-[18px] font-black tracking-wide transition-all duration-300 ${
              isBetting 
                ? 'bg-[#262C40] text-slate-400 opacity-80' 
                : 'bg-[#1DD662] hover:bg-[#1BD15F] text-white active:scale-[0.98] shadow-[0_0_15px_rgba(29,214,98,0.2)] hover:shadow-[0_0_20px_rgba(29,214,98,0.4)]'
            } ${!canBet && !isBetting ? 'opacity-50' : ''}`}
          >
            {isBetting ? 'Ожидание раунда' : 'Ставка'}
          </Button>
        )}
      </div>
    </div>
  );
}
