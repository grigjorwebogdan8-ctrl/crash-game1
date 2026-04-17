import React from 'react';
import { X } from 'lucide-react';

export interface HistoryItem {
  type: string;
  game?: string;
  amount: number;
  multiplier?: number;
  winAmount?: number;
  date: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export function HistoryModal({ isOpen, onClose, history }: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={onClose}>
      <div 
        className="bg-[#1C2030] rounded-t-[24px] w-full max-w-md mx-auto p-4 flex flex-col h-[80vh] animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-[20px] font-bold text-white">История ставок</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-all duration-300 bg-[#2A3043] rounded-full hover:scale-105 active:scale-95">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-safe">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">История пуста</div>
          ) : (
            history.map((item, i) => {
              const isWin = item.winAmount && item.winAmount > 0;
              return (
                <div key={i} className="flex items-center justify-between bg-[#0F1423] p-4 rounded-[16px] border border-[#2A3043]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A3043] flex shrink-0 items-center justify-center text-slate-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold text-[16px]">Crash <span className={isWin ? "text-[#1DD662]" : "text-red-500"}>x{item.multiplier ? item.multiplier.toFixed(2) : '0.00'}</span></span>
                      <span className="text-slate-500 text-[12px]">{item.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`font-bold text-[16px] ${isWin ? 'text-[#1DD662]' : 'text-red-500'}`}>
                      {isWin ? `+${item.winAmount?.toFixed(2)}` : `-${item.amount.toFixed(2)}`}
                    </span>
                    <span className="text-slate-500 text-[12px]">Ставка: {item.amount}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
