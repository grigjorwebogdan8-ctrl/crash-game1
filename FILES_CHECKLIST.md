# ✅ Чек-лист файлов Crash Game

Полный список всех файлов, которые нужно создать для запуска проекта.

---

## 📋 Корневые файлы (в корне проекта)

- [ ] `package.json` — зависимости проекта
- [ ] `vite.config.ts` — конфигурация Vite
- [ ] `tsconfig.json` — конфигурация TypeScript
- [ ] `tsconfig.node.json` — конфигурация TS для Node.js
- [ ] `index.html` — точка входа HTML

---

## 📁 Папка `src/`

### Главный файл
- [ ] `src/main.tsx` — точка входа React

---

## 📁 Папка `src/app/`

### Основной компонент
- [ ] `src/app/App.tsx` — главный компонент приложения

---

## 📁 Папка `src/app/lib/`

### Утилиты
- [ ] `src/app/lib/utils.ts` — функция `cn()` для объединения классов

---

## 📁 Папка `src/app/components/`

### Игровые компоненты
- [ ] `src/app/components/StarBackground.tsx` — звездный фон
- [ ] `src/app/components/RocketFlight.tsx` — анимация ракеты
- [ ] `src/app/components/BetControls.tsx` — панель ставок
- [ ] `src/app/components/BetsList.tsx` — список ставок
- [ ] `src/app/components/Header.tsx` — шапка с балансом
- [ ] `src/app/components/BottomNav.tsx` — нижняя навигация

---

## 📁 Папка `src/app/components/ui/`

### UI компоненты
- [ ] `src/app/components/ui/button.tsx` — компонент Button
- [ ] `src/app/components/ui/input.tsx` — компонент Input

---

## 📁 Папка `src/styles/`

### CSS файлы
- [ ] `src/styles/index.css` — главный CSS (импорты)
- [ ] `src/styles/fonts.css` — импорт шрифтов
- [ ] `src/styles/tailwind.css` — импорт Tailwind
- [ ] `src/styles/theme.css` — Tailwind v4 токены и переменные

---

## 📊 Итоговая статистика

| Категория | Количество файлов |
|-----------|-------------------|
| Корневые файлы | 5 |
| Основные файлы | 1 |
| Утилиты | 1 |
| Игровые компоненты | 6 |
| UI компоненты | 2 |
| CSS файлы | 4 |
| **ВСЕГО** | **19 файлов** |

---

## 🗂️ Визуальная структура

```
crash-game/
│
├── 📄 index.html
├── 📄 package.json
├── 📄 vite.config.ts
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
│
└── 📁 src/
    ├── 📄 main.tsx
    │
    ├── 📁 app/
    │   ├── 📄 App.tsx ⭐ (главный файл)
    │   │
    │   ├── 📁 lib/
    │   │   └── 📄 utils.ts
    │   │
    │   └── 📁 components/
    │       ├── 📄 StarBackground.tsx
    │       ├── 📄 RocketFlight.tsx
    │       ├── 📄 BetControls.tsx
    │       ├── 📄 BetsList.tsx
    │       ├── 📄 Header.tsx
    │       ├── 📄 BottomNav.tsx
    │       │
    │       └── 📁 ui/
    │           ├── 📄 button.tsx
    │           └── 📄 input.tsx
    │
    └── 📁 styles/
        ├── 📄 index.css
        ├── 📄 fonts.css
        ├── 📄 tailwind.css
        └── 📄 theme.css ⚠️ (важный файл с токенами)
```

---

## ⚠️ Критически важные файлы

Эти файлы **обязательны** для работы проекта:

1. **`src/styles/theme.css`** — без него Tailwind не будет работать
2. **`src/app/App.tsx`** — главный компонент приложения
3. **`src/app/lib/utils.ts`** — функция `cn()` используется во всех компонентах
4. **`package.json`** — без зависимостей проект не соберется

---

## 📝 Порядок создания файлов

Рекомендуемая последовательность:

1. **Корневые конфиги** (package.json, vite.config.ts, tsconfig.json, index.html)
2. **Установка зависимостей** (`npm install`)
3. **Стили** (src/styles/*)
4. **Утилиты** (src/app/lib/utils.ts)
5. **UI компоненты** (src/app/components/ui/*)
6. **Игровые компоненты** (src/app/components/*)
7. **Главный App** (src/app/App.tsx)
8. **Точка входа** (src/main.tsx)

---

## 🔍 Проверка после создания

После создания всех файлов выполните:

```bash
# Проверка структуры
ls -R src/

# Установка зависимостей
npm install

# Проверка синтаксиса TypeScript
npx tsc --noEmit

# Запуск проекта
npm run dev
```

---

## 🎉 Готово!

Если вы создали все 19 файлов из этого списка — проект готов к запуску! 🚀
