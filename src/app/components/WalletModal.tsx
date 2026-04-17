import React, { useState, useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { Button } from './ui/button';
import { vibrate } from '../utils/vibrate';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onTopUpStars: (amount: number) => void;
  onTopUpTon: (amount: number) => void;
  onWithdraw?: (amount: number, address: string) => void;
  history?: any[];
}

type ViewState = 'selector' | 'deposit_amount';
type Currency = 'stars' | 'ton';

export function WalletModal({ isOpen, onClose, balance, onTopUpStars, onTopUpTon }: WalletModalProps) {
  const [view, setView] = useState<ViewState>('selector');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('stars');
  
  // Deposit Amount State
  const [depositAmount, setDepositAmount] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setView('selector');
      setDepositAmount('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDepositSubmit = () => {
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;
    
    if (selectedCurrency === 'stars') {
      const tg = typeof window !== 'undefined' ? (window as any).Telegram?.WebApp : null;
      if (tg && tg.openInvoice) {
         // Placeholder for real openInvoice logic
         vibrate(20);
         onTopUpStars(amt);
         setView('selector');
         setDepositAmount('');
         onClose();
      } else {
         vibrate(20);
         onTopUpStars(amt);
         setView('selector');
         setDepositAmount('');
         onClose();
      }
    } else {
      vibrate(20);
      onTopUpTon(amt);
      setView('selector');
      setDepositAmount('');
      onClose();
    }
  };

  const renderSelector = () => (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300" onClick={onClose}>
      <div 
        className="bg-[#1C2030] rounded-t-[24px] w-full max-w-md mx-auto p-4 animate-in slide-in-from-bottom-full duration-300 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-bold text-white">Кошелек</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-all duration-300 bg-[#2A3043] rounded-full hover:scale-105 active:scale-95">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <button 
            onClick={() => { setSelectedCurrency('stars'); setView('deposit_amount'); }}
            className="flex items-center justify-between p-4 bg-[#0F1423] rounded-[16px] hover:bg-[#161C2E] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1C2030] flex items-center justify-center">
                <span className="text-xl drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">⭐</span>
              </div>
              <span className="text-white font-bold text-[16px]">Telegram Stars</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-[16px]">{(balance > 0 ? balance : 0).toFixed(0)}</span>
              <ChevronLeft className="rotate-180 text-slate-500" size={20} />
            </div>
          </button>
          
          <button 
             onClick={() => { setSelectedCurrency('ton'); setView('deposit_amount'); }}
             className="flex items-center justify-between p-4 bg-[#0F1423] rounded-[16px] hover:bg-[#161C2E] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1C2030] flex items-center justify-center text-blue-500 font-bold drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                T
              </div>
              <span className="text-white font-bold text-[16px]">TON</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-[16px]">0</span>
              <ChevronLeft className="rotate-180 text-slate-500" size={20} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderDepositAmount = () => (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F1423] text-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center p-4 pt-6 border-b border-[#1C2030]">
        <button onClick={() => setView('selector')} className="p-2 text-white hover:text-slate-300 transition-colors mr-2 active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[18px] font-bold flex-1 text-center pr-10">Пополнение</h2>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
        <div className="bg-[#1C2030] p-4 rounded-[16px] flex items-center gap-3 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
          {selectedCurrency === 'stars' ? (
             <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center">
               <span className="text-xl drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">⭐</span>
             </div>
          ) : (
             <div className="w-10 h-10 rounded-full bg-[#0F1423] flex items-center justify-center text-blue-500 font-bold drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
               T
             </div>
          )}
          <div className="flex flex-col">
            <span className="text-white font-bold text-[16px]">
               {selectedCurrency === 'stars' ? 'Telegram Stars' : 'TON'}
            </span>
            <span className="text-slate-400 text-[12px]">Баланс: {selectedCurrency === 'stars' ? balance.toFixed(0) : '0'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[10, 50, 100, 500, 1000].map(amt => (
            <button 
              key={amt}
              onClick={() => { vibrate(10); setDepositAmount(amt.toString()); }}
              className="flex-1 min-w-[60px] py-3 rounded-[12px] bg-[#1C2030] hover:bg-[#2A3043] text-white font-medium transition-all duration-300 active:scale-95"
            >
              {amt}
            </button>
          ))}
        </div>

        <div className="bg-[#1C2030] p-4 rounded-[16px] flex flex-col gap-2 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
           <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[13px]">Сумма</span>
           </div>
           <input 
             type="number"
             placeholder="0.00"
             className="bg-transparent border-none text-white text-[32px] font-bold focus:outline-none placeholder:text-slate-600 w-full transition-all duration-300"
             value={depositAmount}
             onChange={e => setDepositAmount(e.target.value)}
           />
        </div>
      </div>
      
      <div className="mt-auto p-6 pb-10 bg-gradient-to-t from-[#0F1423] via-[#0F1423] to-transparent">
         <Button 
            onClick={handleDepositSubmit}
            disabled={!depositAmount || Number(depositAmount) <= 0}
            className="w-full bg-[#1DD662] hover:bg-[#1BD15F] disabled:bg-[#1C2030] disabled:text-slate-500 text-white rounded-[16px] h-[60px] text-[18px] font-bold transition-all duration-300 active:scale-[0.98] shadow-[0_0_15px_rgba(29,214,98,0.2)]"
         >
            Оплатить
         </Button>
      </div>
    </div>
  );

  return (
    <>
      {view === 'selector' && renderSelector()}
      {view === 'deposit_amount' && renderDepositAmount()}
    </>
  );
}
