# 📝 Crash Game — Шпаргалка

> **Быстрый справочник по командам и ключевым моментам**

---

## ⚡ Быстрые команды

### Создание проекта
```bash
mkdir crash-game && cd crash-game
npm init -y
```

### Установка зависимостей
```bash
npm install react react-dom motion lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite typescript @types/react @types/react-dom
```

### Запуск
```bash
npm run dev          # Запуск dev-сервера
npm run build        # Сборка для продакшена
npm run preview      # Просмотр production-сборки
```

---

## 📁 Минимальный набор файлов

**Корень проекта**:
```
index.html
package.json
vite.config.ts
tsconfig.json
```

**Обязательные компоненты**:
```
src/main.tsx
src/app/App.tsx
src/app/lib/utils.ts
src/app/components/ui/button.tsx
src/app/components/ui/input.tsx
```

**Критически важные стили**:
```
src/styles/index.css
src/styles/theme.css  ⚠️ (токены Tailwind v4)
```

---

## 🔧 Конфиг Vite (минимальный)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000, open: true }
});
```

---

## 🎨 Структура стилей

```css
/* src/styles/index.css */
@import "./fonts.css";
@import "tailwindcss";
@import "./theme.css";
```

---

## 🧩 Утилита `cn()` (обязательна!)

```typescript
// src/app/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 📦 package.json (зависимости)

**Production**:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "motion": "^12.23.24",
  "lucide-react": "^0.487.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.2.0",
  "class-variance-authority": "^0.7.1",
  "@radix-ui/react-slot": "^1.1.2"
}
```

**DevDependencies**:
```json
{
  "vite": "^6.3.5",
  "@vitejs/plugin-react": "^4.7.0",
  "tailwindcss": "^4.1.12",
  "@tailwindcss/vite": "^4.1.12",
  "typescript": "^5.7.2"
}
```

---

## 🐛 Частые проблемы

### Стили не применяются
**Решение**: проверьте, что скопирован `src/styles/theme.css` полностью

### Ошибка импорта компонентов
**Решение**: проверьте, что создан `src/app/lib/utils.ts`

### TypeScript ошибки
**Решение**: установите `@types/react` и `@types/react-dom`

### Vite не запускается
**Решение**: проверьте, что установлен `@tailwindcss/vite`

---

## 🔍 Проверка после установки

```bash
# Проверка структуры файлов
ls -R src/

# Проверка зависимостей
npm list react react-dom motion

# Проверка TypeScript
npx tsc --noEmit

# Запуск проекта
npm run dev
```

---

## 📂 19 обязательных файлов

1. `index.html`
2. `package.json`
3. `vite.config.ts`
4. `tsconfig.json`
5. `tsconfig.node.json`
6. `src/main.tsx`
7. `src/app/App.tsx`
8. `src/app/lib/utils.ts`
9. `src/app/components/StarBackground.tsx`
10. `src/app/components/RocketFlight.tsx`
11. `src/app/components/BetControls.tsx`
12. `src/app/components/BetsList.tsx`
13. `src/app/components/Header.tsx`
14. `src/app/components/BottomNav.tsx`
15. `src/app/components/ui/button.tsx`
16. `src/app/components/ui/input.tsx`
17. `src/styles/index.css`
18. `src/styles/fonts.css`
19. `src/styles/theme.css`

---

## 🎯 Быстрый старт (3 шага)

### 1️⃣ Создание
```bash
mkdir crash-game && cd crash-game
```

### 2️⃣ Установка
```bash
npm init -y
# Скопируйте package.json из EXPORT_GUIDE.md
npm install
```

### 3️⃣ Запуск
```bash
# Скопируйте все файлы из COMPONENTS_CODE.md
npm run dev
```

---

## 📞 Куда идти дальше?

| Вопрос | Файл |
|--------|------|
| Как быстро запустить? | `QUICK_START.md` |
| Нужен полный код | `COMPONENTS_CODE.md` |
| Проверить структуру | `FILES_CHECKLIST.md` |
| Понять архитектуру | `README.md` |

---

## 🎉 Готово!

После выполнения всех шагов у вас будет **полностью рабочая копия Crash Game**! 🚀
