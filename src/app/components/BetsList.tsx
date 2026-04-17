import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'lucide-react';

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
                    ? 'bg-green-900/40 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                    : bet.status === 'crashed'
                    ? 'bg-red-900/30 border border-red-500/30 opacity-75'
                    : 'bg-[#161C2D] border border-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700/80 flex flex-shrink-0 items-center justify-center shadow-inner border border-slate-600/50">
                    <User size={18} className="text-slate-400" />
                  </div>
                  <span className="font-bold text-slate-200">{bet.username}</span>
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
