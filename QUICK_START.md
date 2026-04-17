# ⚡ Быстрый старт Crash Game

Краткая инструкция для запуска проекта за 5 минут.

---

## 📦 Шаг 1: Создание проекта

```bash
mkdir crash-game && cd crash-game
npm init -y
```

---

## 📥 Шаг 2: Установка зависимостей

**Скопируйте `package.json` из `EXPORT_GUIDE.md`**, затем:

```bash
npm install
```

Или установите зависимости вручную:

```bash
npm install react react-dom
npm install motion lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom
```

---

## ⚙️ Шаг 3: Файлы конфигурации

Создайте в корне проекта:

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000, open: true }
});
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

### `index.html` (в корне)
```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crash Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### `src/main.tsx`
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🎨 Шаг 4: Стили

Создайте папку `src/styles/`:

### `src/styles/index.css`
```css
@import "./fonts.css";
@import "tailwindcss";
@import "./theme.css";
```

### `src/styles/fonts.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### `src/styles/theme.css`
⚠️ **Скопируйте полностью из файла `/workspaces/default/code/src/styles/theme.css`**

---

## 🧩 Шаг 5: Компоненты

Скопируйте все файлы из `COMPONENTS_CODE.md`:

```
src/
├── app/
│   ├── App.tsx
│   ├── lib/
│   │   └── utils.ts
│   └── components/
│       ├── StarBackground.tsx
│       ├── RocketFlight.tsx
│       ├── BetControls.tsx
│       ├── BetsList.tsx
│       ├── Header.tsx
│       ├── BottomNav.tsx
│       └── ui/
│           ├── button.tsx
│           └── input.tsx
└── styles/
    ├── index.css
    ├── fonts.css
    └── theme.css
```

---

## 🚀 Шаг 6: Запуск

```bash
npm run dev
```

Откройте браузер: **http://localhost:3000**

---

## 📂 Финальная структура проекта

```
crash-game/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── lib/
    │   │   └── utils.ts
    │   └── components/
    │       ├── StarBackground.tsx
    │       ├── RocketFlight.tsx
    │       ├── BetControls.tsx
    │       ├── BetsList.tsx
    │       ├── Header.tsx
    │       ├── BottomNav.tsx
    │       └── ui/
    │           ├── button.tsx
    │           └── input.tsx
    └── styles/
        ├── index.css
        ├── fonts.css
        └── theme.css
```

---

## 🔧 Команды проекта

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Просмотр production-сборки |

---

## 🎯 Что дальше?

- **localStorage** — сохранение баланса между сеансами
- **Backend API** — реальные ставки и авторизация
- **PWA** — установка на мобильные устройства
- **Звуки** — добавление звуковых эффектов
- **Рулетка** — реализация других игр

---

**Готово!** 🎉 Теперь у вас есть полностью рабочая версия Crash Game!
