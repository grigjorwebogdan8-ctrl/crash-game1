import React from 'react';
import { Rocket, User, Shield } from 'lucide-react';

export type TabType = 'crash' | 'profile' | 'admin';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
}

export function BottomNav({ activeTab, setActiveTab, isAdmin }: BottomNavProps) {
  return (
    <div className="bg-[#1C2030] border-t border-[#2A3043] h-[72px] flex items-center justify-around px-2 z-50 shrink-0 pb-safe transition-all duration-300">
      <button 
        onClick={() => setActiveTab('crash')}
        className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-all duration-300 ${activeTab === 'crash' ? 'text-white scale-105' : 'text-[#64748B]'}`}
      >
        <Rocket size={24} className={activeTab === 'crash' ? 'text-blue-500 fill-blue-500' : ''} />
        <span className="text-[12px] font-semibold">Играть</span>
      </button>

      <button 
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-all duration-300 ${activeTab === 'profile' ? 'text-white scale-105' : 'text-[#64748B]'}`}
      >
        <User size={24} className={activeTab === 'profile' ? 'text-blue-400 fill-blue-400' : ''} />
        <span className="text-[12px] font-semibold">Профиль</span>
      </button>

      {isAdmin && (
        <button 
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center justify-center w-20 gap-1.5 transition-all duration-300 ${activeTab === 'admin' ? 'text-yellow-500 scale-105' : 'text-slate-500'}`}
        >
          <Shield size={24} className={activeTab === 'admin' ? 'fill-yellow-500/20' : ''} />
          <span className="text-[12px] font-semibold">Админ</span>
        </button>
      )}
    </div>
  );
}
