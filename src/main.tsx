import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

// === Telegram WebApp user registration ===
const tg = (window as any).Telegram?.WebApp;
const user = tg?.initDataUnsafe?.user;

if (user) {
  fetch("/api/user/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: user.id,
      username: user.username
    })
  });
}

// === WebSocket подключение к Railway ===
const ws = new WebSocket("wss://courageous-flow.up.railway.app");

ws.onopen = () => {
  console.log("WS connected");
};

ws.onmessage = (event) => {
  console.log("WS message:", event.data);
  // тут ты будешь обновлять состояние игры, список игроков и т.д.
};

// === React рендер ===
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App ws={ws} /> 
  </React.StrictMode>
);
