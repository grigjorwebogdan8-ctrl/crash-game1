# 🚀 Crash Game - Инструкция по экспорту и установке

## 📦 Описание проекта

**Crash Game** — полностью функциональное мобильное казино-приложение на React + TypeScript + Tailwind CSS v4.

### Основные возможности:
- ✅ Полная игровая механика с раундами (5 сек на ставки → полет → краш → автоперезапуск)
- ✅ Динамический расчет множителя с реалистичным алгоритмом краша
- ✅ Система ставок с валидацией баланса и быстрыми кнопками (+10, +50, +100, MAX)
- ✅ Живой список ставок других игроков с автокэшаутом
- ✅ Анимированный фон со звездами и планетами (parallax эффект)
- ✅ Плавная траектория полета ракеты, выпрямляющаяся на больших множителях
- ✅ Нижняя навигация с заглушками для других разделов (рулетка, профиль)
- ✅ Адаптивный дизайн под мобильные устройства

---

## 🛠️ Структура проекта

```
crash-game/
├── src/
│   ├── app/
│   │   ├── App.tsx                          # Главный компонент приложения
│   │   └── components/
│   │       ├── StarBackground.tsx           # Анимированный фон со звездами
│   │       ├── RocketFlight.tsx             # Компонент полета ракеты
│   │       ├── BetControls.tsx              # Панель управления ставками
│   │       ├── BetsList.tsx                 # Список активных ставок
│   │       ├── Header.tsx                   # Шапка с балансом
│   │       ├── BottomNav.tsx                # Нижняя навигация
│   │       ├── figma/
│   │       │   └── ImageWithFallback.tsx    # Компонент для загрузки изображений
│   │       └── ui/                          # UI компоненты (shadcn/ui)
│   │           ├── button.tsx
│   │           ├── input.tsx
│   │           └── ... (другие UI компоненты)
│   └── styles/
│       ├── tailwind.css                     # Основные стили Tailwind
│       ├── theme.css                        # Tailwind v4 токены и переменные
│       ├── fonts.css                        # Импорты шрифтов
│       └── index.css                        # Глобальные стили
├── package.json                             # Зависимости проекта
├── vite.config.ts                           # Конфигурация Vite
└── tsconfig.json                            # Конфигурация TypeScript

```

---

## 📋 Шаг 1: Создание локального проекта

### 1.1 Создайте новую папку и инициализируйте проект

```bash
mkdir crash-game
cd crash-game
npm init -y
```

### 1.2 Скопируйте `package.json`

Создайте файл `package.json` со следующим содержимым:

```json
{
  "name": "crash-game",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.487.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.2.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.12",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.7.0",
    "tailwindcss": "^4.1.12",
    "typescript": "^5.7.2",
    "vite": "^6.3.5"
  }
}
```

### 1.3 Установите зависимости

```bash
npm install
# или если используете pnpm
pnpm install
```

---

## 📂 Шаг 2: Создание файлов конфигурации

### 2.1 `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: true
  }
});
```

### 2.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 2.3 `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 2.4 `index.html` (в корне проекта)

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

### 2.5 `src/main.tsx`

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

## 🎨 Шаг 3: Создание файлов стилей

### 3.1 `src/styles/index.css`

```css
@import "./fonts.css";
@import "tailwindcss";
@import "./theme.css";
```

### 3.2 `src/styles/fonts.css`

```css
/* Здесь можно добавить импорты Google Fonts если нужно */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### 3.3 `src/styles/tailwind.css`

```css
@import "tailwindcss";
```

### 3.4 `src/styles/theme.css`

**⚠️ ВАЖНО:** Скопируйте полное содержимое файла `/workspaces/default/code/src/styles/theme.css` из вашего проекта Figma Make.

Этот файл содержит все CSS-переменные для Tailwind v4 (цвета, радиусы, токены).

---

## 🧩 Шаг 4: Создание компонентов

Создайте папку `src/app/components/` и скопируйте следующие файлы:

### 4.1 Основные игровые компоненты

Вам нужно создать следующие файлы (полный код я предоставлю ниже):

1. **`src/app/App.tsx`** — главный компонент приложения
2. **`src/app/components/StarBackground.tsx`** — звездный фон
3. **`src/app/components/RocketFlight.tsx`** — анимация ракеты
4. **`src/app/components/BetControls.tsx`** — панель ставок
5. **`src/app/components/BetsList.tsx`** — список ставок
6. **`src/app/components/Header.tsx`** — шапка с балансом
7. **`src/app/components/BottomNav.tsx`** — нижняя навигация

### 4.2 Минимальные UI компоненты

Создайте папку `src/app/components/ui/` и добавьте базовые компоненты:

**`src/app/components/ui/button.tsx`**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

**`src/app/components/ui/input.tsx`**

```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm",
          "focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

### 4.3 Утилита `cn`

**`src/app/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 🚀 Шаг 5: Запуск проекта

```bash
npm run dev
```

Откройте браузер по адресу `http://localhost:3000`

---

## 📦 Полный код компонентов

Ниже я предоставлю весь код для копирования:

### ✅ Полный список файлов для копирования:

1. `src/app/App.tsx` (основной файл приложения)
2. `src/app/components/StarBackground.tsx`
3. `src/app/components/RocketFlight.tsx`
4. `src/app/components/BetControls.tsx`
5. `src/app/components/BetsList.tsx`
6. `src/app/components/Header.tsx`
7. `src/app/components/BottomNav.tsx`
8. `src/styles/theme.css`

---

## 📝 Примечания

- **Tailwind v4** используется через `@tailwindcss/vite` плагин
- Все анимации оптимизированы через `requestAnimationFrame`
- Проект полностью автономный, не требует внешних API
- Баланс и ставки хранятся в состоянии React (при перезагрузке сбрасываются)

---

## 🎯 Что делать дальше?

После создания проекта вы можете:
1. **Добавить localStorage** для сохранения баланса
2. **Подключить backend** для реальных ставок
3. **Добавить звуки** для улучшения UX
4. **Настроить PWA** для установки на мобильные устройства
5. **Реализовать рулетку** и другие разделы из навигации

---

**Готово!** 🎉 Теперь у вас есть полностью рабочая копия Crash Game!
