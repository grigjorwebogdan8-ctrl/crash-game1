# 🚀 ЗАПУСК ПРОЕКТА - Полная инструкция

## 📊 Текущее состояние

✅ **Код готов** - весь фронтенд и бэкенд реализованы
✅ **Структура настроена** - все файлы на своих местах
✅ **Билд работает** - `pnpm build` проходит успешно
⚠️ **Нужны актуальные ключи Supabase** - старые устарели

---

## 🎯 Что нужно сделать (3 простых шага)

### Шаг 1: Получите ключи Supabase (5 минут)

1. Откройте https://supabase.com/dashboard
2. Войдите в аккаунт (или создайте новый через GitHub)
3. Найдите проект `lwnqqjqaiauiqyxebehd` ИЛИ создайте новый
4. Перейдите в **Settings** → **API**
5. Скопируйте:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public**: `eyJhbG...`

**Подробная инструкция:** Смотрите файл `GET_SUPABASE_KEYS.md`

---

### Шаг 2: Дайте мне ваши ключи

Просто ответьте в формате:

```
Project URL: https://xxx.supabase.co
Anon Key: eyJhbG...
```

Я автоматически:
- Обновлю все файлы с ключами
- Проверю подключение
- Подготовлю финальный деплой

**ИЛИ** сделайте вручную (смотрите `GET_SUPABASE_KEYS.md` → Шаг 4)

---

### Шаг 3: Деплой на Vercel (2 минуты)

После того как ключи обновлены:

#### Способ A: Через CLI (быстрее)

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите
vercel login

# Деплой
vercel --prod
```

#### Способ B: Через GitHub (рекомендуется для будущих обновлений)

```bash
# 1. Создайте репозиторий
git init
git add .
git commit -m "feat: RocketFry ready for production"

# 2. Загрузите на GitHub
git remote add origin https://github.com/ВАШ-USERNAME/rocketfry.git
git push -u origin main

# 3. Откройте https://vercel.com/new
# 4. Импортируйте репозиторий
# 5. Нажмите Deploy
```

**Подробная инструкция:** Смотрите файл `SETUP_COMPLETE.md`

---

## 🔄 Порядок действий (копируйте и выполняйте)

### 1️⃣ Получение ключей Supabase

```
□ Открыть https://supabase.com/dashboard
□ Войти в аккаунт
□ Создать проект (если нет) или найти существующий
□ Settings → API
□ Скопировать Project URL
□ Скопировать anon public key
□ Дать мне ключи для обновления
```

### 2️⃣ Настройка Supabase Functions

```bash
# Установить Supabase CLI
npm install -g supabase

# Войти
supabase login

# Связать проект
supabase link --project-ref ВАШ-PROJECT-ID

# Развернуть функции
supabase functions deploy make-server-0dc2674a
```

### 3️⃣ Проверка подключения

```bash
# После обновления ключей
node scripts/test-connection.mjs
```

Должно быть:
```
✅ Health Check: { status: 'ok' }
✅ Баланс тестового пользователя: { balance: 0 }
✅ Баланс создан: { success: true }
✅ Баланс прочитан: { balance: 1000 }
```

### 4️⃣ Деплой на Vercel

```bash
# Вход
vercel login

# Production деплой
vercel --prod
```

### 5️⃣ Настройка Telegram бота

```
1. Открыть @BotFather
2. /newbot → создать бота
3. /newapp → настроить Web App
4. Указать URL: https://ваш-проект.vercel.app
5. /setmenubutton → добавить кнопку "Играть"
```

---

## 📁 Важные файлы

| Файл | Назначение |
|------|-----------|
| `GET_SUPABASE_KEYS.md` | Как получить ключи Supabase |
| `SETUP_COMPLETE.md` | Полная инструкция по настройке |
| `DEBUG_SUPABASE.md` | Отладка проблем с базой данных |
| `UPDATE_DEPLOY.md` | Как обновлять деплой |
| `DEPLOY_QUICK.md` | Быстрая инструкция по деплою |

---

## ⚡ Быстрый старт для опытных

```bash
# 1. Получите ключи из Supabase Dashboard
# 2. Обновите src/utils/supabase/info.ts
# 3. Установите и настройте CLI
npm install -g supabase vercel
supabase login
supabase link --project-ref YOUR_ID
supabase functions deploy make-server-0dc2674a

# 4. Деплой
vercel login
vercel --prod

# 5. Готово!
```

---

## 🆘 Помощь

### Я могу сделать за вас:

✅ **Обновить все ключи** - просто дайте мне Project URL и Anon Key
✅ **Создать конфигурацию** - подготовлю все файлы
✅ **Проверить настройки** - найду ошибки в коде
✅ **Исправить проблемы** - если что-то не работает

### Вы должны сделать сами:

🔐 **Войти в Supabase** - я не имею доступа к вашему аккаунту
🔐 **Войти в Vercel** - требуется ваша авторизация
🔐 **Создать Telegram бота** - через @BotFather
🚀 **Выполнить команды деплоя** - в вашем терминале

---

## 📞 Следующий шаг

**Сейчас сделайте это:**

1. Откройте https://supabase.com/dashboard
2. Скопируйте ваши ключи
3. Дайте мне их в формате:
   ```
   Project URL: https://xxx.supabase.co
   Anon Key: eyJhbG...
   ```

Я моментально обновлю все файлы и мы продолжим! 🚀

---

## 🎉 Что получится в итоге

После завершения всех шагов у вас будет:

✅ Полностью рабочее приложение на Vercel
✅ База данных на Supabase с сохранением всех данных
✅ Telegram бот с Web App
✅ Автоматический деплой при обновлениях
✅ Админ панель для управления пользователями
✅ Логи и мониторинг

**Готовы начать? Получите ключи Supabase! 🔑**
