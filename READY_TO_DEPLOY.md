# 🎉 ВСЕ ГОТОВО К ДЕПЛОЮ!

## ✅ Что выполнено:

1. **Ключи Supabase обновлены** ✅
   - Project URL: `https://lwnqqjqaiauiqyxebehd.supabase.co`
   - Anon Key: обновлен и работает корректно
   - Все файлы обновлены

2. **Подключение проверено** ✅
   ```
   ✅ Health Check: { status: 'ok' }
   ✅ Баланс тестового пользователя: { balance: 0 }
   ✅ Баланс создан: { success: true }
   ✅ Баланс прочитан: { balance: 1000 }
   ```

3. **Проект собран** ✅
   - Build успешен
   - Все файлы готовы к деплою

---

## 🚀 ДЕПЛОЙ НА VERCEL (3 команды)

### Вариант A: Через Vercel CLI (Быстрее)

```bash
# 1. Установите Vercel CLI (если еще не установлен)
npm install -g vercel

# 2. Войдите в аккаунт
vercel login

# 3. Деплой на production
vercel --prod
```

После деплоя вы получите URL типа:
```
https://rocketfry-game.vercel.app
```

---

### Вариант B: Через GitHub + Vercel UI (Рекомендуется)

#### Шаг 1: Создайте Git репозиторий

```bash
git init
git add .
git commit -m "feat: RocketFry Crash Game production ready"
```

#### Шаг 2: Загрузите на GitHub

1. Создайте репозиторий: https://github.com/new
   - Name: `rocketfry-game`
   - **НЕ добавляйте** README, .gitignore (уже есть)

2. Подключите и запушьте:

```bash
git remote add origin https://github.com/ВАШ-USERNAME/rocketfry-game.git
git branch -M main
git push -u origin main
```

#### Шаг 3: Деплой через Vercel

1. Откройте: https://vercel.com/new
2. Войдите через GitHub
3. Нажмите **Import Git Repository**
4. Выберите `rocketfry-game`
5. Настройки определятся автоматически:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
6. Нажмите **Deploy**

**Готово!** Vercel задеплоит проект и даст вам URL.

**Преимущества этого способа:**
- ✅ Автоматический деплой при каждом `git push`
- ✅ Preview deployments для Pull Requests
- ✅ Легкое откатывание к предыдущим версиям
- ✅ Удобное управление через UI

---

## 📱 НАСТРОЙКА TELEGRAM WEBAPP

После деплоя на Vercel настройте Telegram бота:

### 1. Создайте бота (если еще нет)

Откройте @BotFather в Telegram:

```
/newbot
```

Введите:
- **Bot name**: RocketFry Game
- **Username**: `rocketfry_bot` (или любой свободный)

Сохраните токен бота!

### 2. Создайте Web App

```
/newapp
```

Выберите вашего бота и введите:
- **Title**: RocketFry
- **Description**: Крутая Crash Game с реальными ставками
- **Photo**: Загрузите иконку 512x512px
- **Demo GIF**: Пропустите (или загрузите)
- **Web App URL**: `https://ваш-проект.vercel.app` ⬅️ URL из Vercel
- **Short name**: rocketfry

### 3. Настройте кнопку меню

```
/setmenubutton
```

Выберите бота:
- **Button text**: 🎮 Играть
- **Web App URL**: `https://ваш-проект.vercel.app`

### 4. Готово! Тестируйте

Откройте бота в Telegram и нажмите **Играть** - откроется ваше приложение!

---

## 🔍 ПРОВЕРКА РАБОТЫ

### 1. Откройте приложение в браузере

URL из Vercel → откройте в браузере

### 2. Откройте консоль (F12)

Должны появиться логи:
```
Loaded balance: 0
Loaded stats: {games: 0, wins: 0, ...}
Loaded history: 0 items
```

### 3. Сделайте тестовую ставку

После ставки в консоли:
```
Bet placed: {userId: 12345, betAmount: 10, newBalance: -10}
Stats updated after loss: {...}
History updated after loss: {...}
```

### 4. Проверьте Supabase Dashboard

1. Откройте: https://supabase.com/dashboard/project/lwnqqjqaiauiqyxebehd
2. **Table Editor** → `kv_store_0dc2674a`
3. Должны появиться записи:
   - `user:12345:balance`
   - `user:12345:stats`
   - `user:12345:history`

---

## 📊 МОНИТОРИНГ И ЛОГИ

### Vercel Logs

```bash
# Просмотр логов в реальном времени
vercel logs --follow

# Логи production деплоя
vercel logs --prod
```

### Supabase Logs

1. Dashboard → **Edge Functions**
2. Выберите `make-server-0dc2674a`
3. Вкладка **Logs**

Должны быть записи:
```
Stats updated for user 12345: {...}
History updated for user 12345, total items: 1
Balance updated for user 12345: -10
```

---

## 🎯 ЧЕКЛИСТ ЗАПУСКА

```
✅ Ключи Supabase обновлены
✅ Подключение к Supabase работает
✅ Проект собран (pnpm build)
✅ Git репозиторий создан
□ Загружено на GitHub
□ Задеплоено на Vercel
□ Telegram бот создан
□ Web App настроен
□ Кнопка меню добавлена
□ Протестировано в Telegram
□ Проверены логи Supabase
□ Проверена таблица kv_store
```

---

## 🚨 ЧАСТЫЕ ПРОБЛЕМЫ

### Vercel: "Build failed"

```bash
# Проверьте локально
pnpm build

# Если работает - проблема в настройках Vercel
# Убедитесь что:
# - Build Command: pnpm build
# - Output Directory: dist
# - Install Command: pnpm install
```

### Telegram: "Failed to load"

- Проверьте что URL в @BotFather правильный
- URL должен начинаться с `https://`
- Проверьте что приложение доступно по этому URL

### Данные не сохраняются

```bash
# Проверьте подключение
node scripts/test-connection.mjs

# Проверьте логи Supabase
# Dashboard → Edge Functions → Logs
```

---

## 📞 ПОДДЕРЖКА

Если что-то не работает:

1. Проверьте консоль браузера (F12)
2. Проверьте логи Vercel: `vercel logs`
3. Проверьте логи Supabase в Dashboard
4. Смотрите файл `DEBUG_SUPABASE.md`

---

## 🎉 ГОТОВО!

**Ваш проект RocketFry полностью готов к запуску!**

Выполните команды деплоя выше и через 5 минут у вас будет работающее приложение в Telegram! 🚀

---

## 📈 ДАЛЬНЕЙШИЕ УЛУЧШЕНИЯ

После запуска можно добавить:

1. **WebSocket мультиплеер** - синхронизация раундов
2. **Telegram Stars платежи** - реальные пополнения
3. **Реферальная система** - привлечение игроков
4. **Аналитика** - Vercel Analytics, Mixpanel
5. **Push уведомления** - через Telegram Bot API
6. **Лидерборды** - топ игроков
7. **Бонусы и промокоды**

**Успехов с запуском! 🎮**
