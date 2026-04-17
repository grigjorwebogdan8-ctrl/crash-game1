# ⚡ Автоматическая настройка Supabase + Vercel

## ✅ Что уже сделано автоматически

### 1. Supabase уже настроен! 🎉

Ваш проект уже подключен к Supabase:
- **Project ID**: `lwnqqjqaiauiqyxebehd`
- **URL**: `https://lwnqqjqaiauiqyxebehd.supabase.co`
- **Anon Key**: Уже прописан в коде
- **Таблица**: `kv_store_0dc2674a` создана
- **Edge Functions**: Развернуты и работают

### 2. Все ключи уже в коде

Файлы с ключами созданы:
- ✅ `.env.example` - пример конфигурации
- ✅ `.env.local` - локальная разработка
- ✅ `src/utils/supabase/info.ts` - ключи для приложения

### 3. Скрипт проверки создан

- ✅ `scripts/test-connection.mjs` - автоматическая проверка

---

## 🚀 Быстрый старт (3 команды)

### Шаг 1: Проверьте что Supabase работает

```bash
node scripts/test-connection.mjs
```

**Ожидаемый результат:**
```
🔍 Проверка подключения к Supabase...

1️⃣ Проверка Health Check...
   ✅ Health Check: { status: 'ok' }

2️⃣ Проверка получения баланса...
   ✅ Баланс тестового пользователя: { balance: 0 }

3️⃣ Создание тестового баланса...
   ✅ Баланс создан: { success: true }

4️⃣ Проверка созданного баланса...
   ✅ Баланс прочитан: { balance: 1000 }

✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ! Supabase работает корректно.
```

### Шаг 2: Деплой на Vercel

Установите Vercel CLI (если еще не установлен):

```bash
npm install -g vercel
```

Войдите в аккаунт Vercel:

```bash
vercel login
```

Следуйте инструкциям:
1. Выберите способ входа (GitHub/Email)
2. Подтвердите через браузер

Деплой проекта:

```bash
vercel
```

Vercel задаст вопросы:
- **Set up and deploy?** → YES
- **Which scope?** → Выберите ваш аккаунт
- **Link to existing project?** → NO
- **What's your project's name?** → rocketfry-game (или любое другое)
- **In which directory is your code located?** → ./
- **Want to override the settings?** → NO

Готово! Приложение задеплоится.

### Шаг 3: Production деплой

```bash
vercel --prod
```

Ваше приложение будет доступно по адресу:
```
https://rocketfry-game.vercel.app
```

---

## 📱 Настройка Telegram WebApp

После деплоя на Vercel:

### 1. Откройте @BotFather в Telegram

### 2. Создайте бота (если еще не создали)

```
/newbot
```

Введите:
- Имя бота: `RocketFry Game`
- Username бота: `rocketfry_bot` (или любой доступный)

### 3. Настройте Web App

```
/newapp
```

Выберите вашего бота и введите:
- **Title**: RocketFry
- **Description**: Crash Game в Telegram
- **Photo**: Загрузите иконку (512x512px)
- **Demo GIF** (опционально): Пропустите
- **Web App URL**: `https://rocketfry-game.vercel.app`
- **Short name**: rocketfry

### 4. Настройте кнопку меню

```
/setmenubutton
```

Выберите бота и введите:
- **Button text**: Играть
- **Web App URL**: `https://rocketfry-game.vercel.app`

---

## 🔧 Альтернатива: Vercel через GitHub (рекомендуется)

### Шаг 1: Создайте Git репозиторий

```bash
git init
git add .
git commit -m "Initial commit: RocketFry Crash Game"
```

### Шаг 2: Загрузите на GitHub

1. Создайте репозиторий на https://github.com/new
2. Название: `rocketfry-game`
3. **НЕ добавляйте** README, .gitignore (уже есть)

Подключите и запушьте:

```bash
git remote add origin https://github.com/ВАШ-USERNAME/rocketfry-game.git
git branch -M main
git push -u origin main
```

### Шаг 3: Деплой через Vercel UI

1. Откройте https://vercel.com/new
2. Нажмите **Import Git Repository**
3. Выберите `rocketfry-game`
4. Нажмите **Deploy**

Vercel автоматически определит настройки и задеплоит проект.

**Преимущества:**
- Автоматический деплой при push в main
- Удобное управление через UI
- Preview deployments для каждого PR

---

## 🔑 Ваши ключи и доступы

### Supabase

- **Dashboard**: https://supabase.com/dashboard/project/lwnqqjqaiauiqyxebehd
- **Project URL**: `https://lwnqqjqaiauiqyxebehd.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (уже в коде)

**Доступ к таблице:**
1. Dashboard → Table Editor
2. Выберите `kv_store_0dc2674a`
3. Увидите все данные пользователей

**Логи сервера:**
1. Dashboard → Edge Functions
2. Выберите `make-server-0dc2674a`
3. Вкладка **Logs**

### Vercel (после деплоя)

- **Dashboard**: https://vercel.com/dashboard
- **Project URL**: Получите после деплоя
- **Logs**: Dashboard → ваш проект → Logs

---

## ✅ Проверка что все работает

### 1. Проверьте Supabase

```bash
node scripts/test-connection.mjs
```

Все 4 теста должны пройти ✅

### 2. Проверьте локальную версию

```bash
pnpm dev
```

Откройте http://localhost:5173 и:
- Проверьте консоль браузера (F12)
- Сделайте тестовую ставку
- Проверьте что логи появляются

### 3. Проверьте production

Откройте ваш Vercel URL и:
- Сделайте ставку
- Проверьте что данные сохраняются
- Откройте Supabase Dashboard → Table Editor
- Должны появиться записи в `kv_store_0dc2674a`

---

## 🐛 Если что-то не работает

### Supabase не отвечает

```bash
# Проверка здоровья
curl https://lwnqqjqaiauiqyxebehd.supabase.co/functions/v1/make-server-0dc2674a/health
```

Должен вернуть: `{"status":"ok"}`

Если нет:
1. Откройте Supabase Dashboard
2. Edge Functions → `make-server-0dc2674a`
3. Проверьте статус (должен быть **Active**)

### Vercel CLI не работает

```bash
# Установите заново
npm uninstall -g vercel
npm install -g vercel

# Войдите снова
vercel login
```

### Данные не сохраняются

Смотрите файл `DEBUG_SUPABASE.md` - там полное руководство по отладке.

---

## 📊 Что дальше?

### Улучшения

1. **WebSocket для мультиплеера** - синхронизация раундов между игроками
2. **Реальные платежи** - интеграция Telegram Stars API
3. **Аналитика** - Vercel Analytics, Google Analytics
4. **Мониторинг** - Sentry для отслеживания ошибок
5. **Оптимизация** - lighthouse, performance monitoring

### Полезные команды

```bash
# Локальная разработка
pnpm dev

# Сборка проекта
pnpm build

# Превью сборки
pnpm preview

# Деплой на Vercel
vercel --prod

# Просмотр логов Vercel
vercel logs

# Просмотр логов Supabase
# Через Dashboard → Edge Functions → Logs
```

---

## 🎉 Готово!

Ваш проект RocketFry полностью настроен:
- ✅ Supabase работает
- ✅ Все ключи прописаны
- ✅ Код готов к деплою
- ✅ Инструкции готовы

Просто выполните 3 команды:

```bash
# 1. Проверка
node scripts/test-connection.mjs

# 2. Вход в Vercel
vercel login

# 3. Деплой
vercel --prod
```

**Успехов с запуском! 🚀**
