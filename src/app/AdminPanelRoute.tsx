import React, { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import { UserContextType } from './Root';
import { AdminPanel } from './components/AdminPanel';
import { api } from '../utils/api';
import { BottomNav } from './components/BottomNav';

export function AdminPanelRoute() {
  const { tgUser, balance, setBalance, userStats, isAdmin, setActiveTab } = useOutletContext<UserContextType>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Handle Telegram Back Button
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const isSupported = tg?.version && parseFloat(tg.version) >= 6.1;

    if (tg?.BackButton && isSupported) {
      const handleBack = () => navigate('/');
      
      try {
        if (tg.BackButton.isVisible === false || tg.BackButton.isVisible === undefined) {
           tg.BackButton.show();
        }
        tg.BackButton.onClick(handleBack);
      } catch (e) {}

      return () => {
         try {
           tg.BackButton.offClick(handleBack);
           tg.BackButton.hide();
         } catch (e) {}
      };
    }
  }, [navigate]);

  if (!isAdmin) return null;

  return (
    <div className="relative flex-1 flex flex-col z-10 w-full max-w-md mx-auto h-full bg-transparent">
      <AdminPanel 
        api={api} 
        adminId={tgUser?.id || 0} 
        currentUser={tgUser} 
        currentBalance={balance} 
        currentStats={userStats} 
        onUpdateBalance={(userId, newBalance) => {
          if (tgUser && userId === tgUser.id) {
            setBalance(newBalance);
          }
        }}
      />
      <BottomNav activeTab="admin" setActiveTab={(tab) => {
        if (tab !== 'admin') {
          setActiveTab(tab as 'crash' | 'profile');
          navigate('/');
        }
      }} isAdmin={isAdmin} />
    </div>
  );
}