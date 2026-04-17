import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Users, Ban, DollarSign, Activity, History, Gamepad2, Settings } from 'lucide-react';

interface AdminPanelProps {
  api: any;
  adminId: number;
  currentUser?: any;
  currentBalance?: number;
  currentStats?: any;
  onUpdateBalance?: (userId: number, newBalance: number) => void;
}

type AdminTab = 'users' | 'history' | 'rounds' | 'stats';

export function AdminPanel({ api, adminId, currentUser, currentBalance, currentStats, onUpdateBalance }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  
  const [users, setUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const apiUsers = await api.getUsers();

      const formattedUsers = apiUsers.map((u: any) => ({
        id: parseInt(u.userId),
        username: u.userId, 
        balance: u.balance || 0,
        games: u.stats?.games || 0,
        totalBet: u.stats?.totalBet || 0,
        wins: u.stats?.wins || 0,
        blocked: false 
      }));

      if (currentUser && currentUser.id) {
        const isAlreadyIn = formattedUsers.find((u: any) => u.id === currentUser.id);
        if (!isAlreadyIn) {
          formattedUsers.unshift({
            id: currentUser.id,
            username: currentUser.username || currentUser.first_name || 'Игрок',
            balance: currentBalance || 0,
            games: currentStats?.games || 0,
            totalBet: currentStats?.totalBet || 0,
            wins: currentStats?.wins || 0,
            blocked: false
          });
        }
      }

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'stats') {
      loadUsers();
    } else if (activeTab === 'history') {
      loadHistory();
    }
  }, [api, currentUser, currentBalance, currentStats, activeTab]);

  const filteredUsers = users.filter(u => {
    if (amountFilter && u.balance < Number(amountFilter)) return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      if (!u.username.toString().toLowerCase().includes(search) && !u.id.toString().includes(search)) {
        return false;
      }
    }
    return true;
  });

  // Calculate global stats
  const totalBalance = users.reduce((acc, u) => acc + u.balance, 0);
  const totalGames = users.reduce((acc, u) => acc + u.games, 0);
  const totalBets = users.reduce((acc, u) => acc + u.totalBet, 0);

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto pb-20 w-full fade-in-up">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Settings size={24} className="text-yellow-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-wide">Админ Панель</h2>
          <span className="text-xs font-mono text-slate-500">ID: {adminId}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/50">
        <button 
          onClick={() => setActiveTab('users')} 
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1 ${activeTab === 'users' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Users size={16} /> Пользователи
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1 ${activeTab === 'history' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <History size={16} /> История
        </button>
        <button 
          onClick={() => setActiveTab('rounds')} 
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1 ${activeTab === 'rounds' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Gamepad2 size={16} /> Раунды
        </button>
        <button 
          onClick={() => setActiveTab('stats')} 
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Activity size={16} /> Стата
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Поиск</h3>
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="ID пользователя..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm w-full text-white focus:outline-none focus:border-blue-500 transition-colors" 
              />
              <input 
                type="number" 
                placeholder="Минимальный баланс" 
                value={amountFilter} 
                onChange={e => setAmountFilter(e.target.value)} 
                className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm w-full text-white focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider mt-2">Список ({filteredUsers.length})</h3>

            {loading && <div className="text-center py-8 text-slate-500">Загрузка...</div>}

            {!loading && filteredUsers.map(u => (
              <div key={u.id} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col gap-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-lg flex items-center gap-2">
                      {u.username}
                      {u.blocked && <span className="px-2 py-0.5 rounded text-[10px] bg-red-900/50 text-red-500 uppercase">Заблокирован</span>}
                    </span>
                    <span className="text-xs font-mono text-slate-500 mt-1">ID: {u.id}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-slate-500 uppercase font-bold">Баланс</span>
                    <span className="text-yellow-400 font-bold text-xl drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">{u.balance.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 border-t border-slate-800/50 pt-4 mt-1">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const newBalance = window.prompt(`Введите новый баланс для ${u.username}:`, u.balance.toString());
                      if (newBalance !== null && !isNaN(Number(newBalance))) {
                        const parsedBalance = Number(newBalance);
                        try {
                          await api.updateBalance(u.id, parsedBalance);
                          setUsers(prev => prev.map(user => user.id === u.id ? { ...user, balance: parsedBalance } : user));
                          if (onUpdateBalance) onUpdateBalance(u.id, parsedBalance);
                        } catch (error) {
                          alert('Ошибка при обновлении баланса');
                        }
                      }
                    }}
                    className="flex-1 border-blue-500/30 text-blue-400 bg-blue-900/10 hover:bg-blue-900/30 hover:border-blue-500 transition-colors h-10 text-xs font-bold"
                  >
                    <DollarSign size={14} className="mr-1" /> Баланс
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setUsers(prev => prev.map(user => user.id === u.id ? { ...user, blocked: !user.blocked } : user));
                    }}
                    className={`flex-1 transition-colors h-10 text-xs font-bold ${
                      u.blocked 
                        ? "border-green-500/30 text-green-400 bg-green-900/10 hover:bg-green-900/30 hover:border-green-500" 
                        : "border-red-500/30 text-red-400 bg-red-900/10 hover:bg-red-900/30 hover:border-red-500"
                    }`}
                  >
                    <Ban size={14} className="mr-1" /> {u.blocked ? 'Разблок' : 'Блок'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col gap-3">
            <h3 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Все ставки</h3>
            {loading ? <div className="text-slate-500">Загрузка...</div> : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {history.length === 0 ? (
                  <div className="text-slate-500 text-sm text-center py-4">История пуста</div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="flex flex-col p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 font-mono text-xs">ID: {h.userId}</span>
                        <span className="text-slate-500 text-xs">{h.date}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Ставка: <span className="text-yellow-400">{h.amount} ★</span></span>
                        {h.multiplier > 0 ? (
                          <span className="text-green-400 font-bold">Вывод x{h.multiplier.toFixed(2)}</span>
                        ) : (
                          <span className="text-red-400 font-bold">Проигрыш</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rounds Tab (Mock) */}
      {activeTab === 'rounds' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col gap-3 items-center justify-center py-10">
            <Gamepad2 size={48} className="text-slate-600 mb-2" />
            <h3 className="text-slate-400 font-bold">Управление раундами</h3>
            <p className="text-sm text-slate-500 text-center">Эта функция будет доступна после настройки WebSocket для синхронизации мультиплеера.</p>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="flex flex-col gap-4 fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">Всего юзеров</span>
              <span className="text-2xl font-black text-white">{users.length}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">Общий баланс</span>
              <span className="text-2xl font-black text-yellow-400">{totalBalance.toFixed(0)} ★</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">Игр сыграно</span>
              <span className="text-2xl font-black text-blue-400">{totalGames}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1">Объем ставок</span>
              <span className="text-2xl font-black text-purple-400">{totalBets.toFixed(0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}