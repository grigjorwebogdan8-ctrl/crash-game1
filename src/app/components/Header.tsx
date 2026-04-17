import React from 'react';
import { ChevronDown, Star } from 'lucide-react';

interface HeaderProps {
  balance: number;
  onlineCount: number;
  tgUser?: any;
  onTopUp: () => void;
}

export function Header({ balance, onlineCount, tgUser, onTopUp }: HeaderProps) {
  const isGuest = !tgUser || !tgUser.id;
  const displayName = isGuest ? 'Гость' : (tgUser.username || tgUser.first_name || 'Игрок');

  return (
    <div className="flex items-center justify-between px-4 py-3 z-10 w-full max-w-md mx-auto relative shrink-0">
      <div className="flex items-center gap-3">
        {/* Telegram Profile or Guest */}
        <div className="flex items-center justify-center w-[40px] h-[40px] rounded-[14px] bg-[#1C2030] border border-[#2A3043] overflow-hidden">
          {tgUser?.photo_url ? (
            <img src={tgUser.photo_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-[14px] font-bold">
              {isGuest ? 'GST' : displayName.substring(0,2).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Balance and Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onTopUp}
          className="flex items-center gap-2 bg-[#1C2030] hover:bg-[#2A3043] transition-colors border border-[#2A3043] h-[40px] px-3 rounded-[14px] min-w-[100px] justify-between"
        >
          <div className="flex items-center gap-1.5">
            <Star size={16} fill="#FFD700" className="text-[#FFD700]" />
            <span className="text-white font-bold text-[14px]">{balance.toFixed(0)}</span>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
