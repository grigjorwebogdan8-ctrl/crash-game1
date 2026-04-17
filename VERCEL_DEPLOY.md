# 🚀 Деплой RocketFry на Vercel

## Подготовка проекта

Проект уже настроен для деплоя на Vercel! Все необходимые файлы созданы:

- ✅ `index.html` - HTML entry point
- ✅ `src/main.tsx` - React entry point
- ✅ `vercel.json` - конфигурация Vercel
- ✅ `.gitignore` - исключения для Git
- ✅ Supabase бэкенд уже развернут и работает

## Шаг 1: Инициализация Git репозитория

```bash
git init
git add .
git commit -m "Initial commit: RocketFry Crash Game"
```

## Шаг 2: Создание репозитория на GitHub

1. Перейдите на https://github.com/new
2. Создайте новый репозиторий (например, `rocketfry-game`)
3. **НЕ ДОБАВЛЯЙТЕ** README, .gitignore или LICENSE (они уже есть)
4. Скопируйте команды для подключения существующего репозитория:

```bash
git remote add origin https://github.com/ВАШ-USERNAME/rocketfry-game.git
git branch -M main
git push -u origin main
```

## Шаг 3: Деплой на Vercel

### Вариант A: Через Web UI (Рекомендуется)

1. Перейдите на https://vercel.com/new
2. Войдите через GitHub
3. Выберите свой репозиторий `rocketfry-game`
4. Vercel автоматически определит настройки:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
5. Нажмите **Deploy**
6. Готово! Ваше приложение будет доступно по URL типа `https://rocketfry-game.vercel.app`

### Вариант B: Через Vercel CLI

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Деплой проекта
vercel

# Деплой в production
vercel --prod
```

## Шаг 4: Настройка Telegram WebApp

После деплоя вам нужно настроить Telegram бота:

1. Откройте @BotFather в Telegram
2. Отправьте команду `/newapp` или `/editapp` (если бот уже создан)
3. Выберите вашего бота
4. Установите Web App URL: `https://ваш-домен.vercel.app`

## Важные замечания

### Supabase уже работает ✅

Бэкенд на Supabase Edge Functions уже развернут и доступен по адресу:
```
https://lwnqqjqaiauiqyxebehd.supabase.co/functions/v1/make-server-0dc2674a
```

Все API endpoints работают:
- `/user/:userId/balance` - баланс пользователя
- `/user/:userId/stats` - статистика
- `/user/:userId/history` - история ставок
- `/bet/place` - сделать ставку
- `/bet/cashout` - забрать выигрыш
- `/topup/stars` - пополнение через Stars
- `/admin/users` - список всех пользователей

### Переменные окружения

Если нужны дополнительные переменные окружения, добавьте их в Vercel:

1. Перейдите в настройки проекта на Vercel
2. **Settings** → **Environment Variables**
3. Добавьте переменные (если потребуется)

### Автоматические деплои

После настройки, каждый push в `main` ветку будет автоматически деплоить новую версию на Vercel.

## Проверка работоспособности

После деплоя откройте ваше приложение:

1. Главная страница должна загрузиться
2. Проверьте консоль браузера на ошибки
3. Попробуйте сделать ставку
4. Проверьте работу баланса и статистики

## Кастомный домен (опционально)

Если хотите использовать свой домен:

1. **Vercel Dashboard** → Ваш проект → **Settings** → **Domains**
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel

## Troubleshooting

### Ошибка при билде

Если возникла ошибка при сборке:
```bash
# Проверьте локально
pnpm build
```

### Проблемы с путями

Убедитесь что `vercel.json` правильно настроен для SPA:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### API не работает

Проверьте что Supabase Functions активны:
```bash
curl https://lwnqqjqaiauiqyxebehd.supabase.co/functions/v1/make-server-0dc2674a/health
```

Должен вернуть: `{"status":"ok"}`

## Следующие шаги

1. ✅ Настройте WebSocket для мультиплеера (если нужно)
2. ✅ Добавьте аналитику (Google Analytics, Vercel Analytics)
3. ✅ Настройте мониторинг ошибок (Sentry)
4. ✅ Оптимизируйте производительность
5. ✅ Добавьте E2E тесты

---

**Готово!** 🎉 Ваше приложение RocketFry теперь доступно в интернете!
