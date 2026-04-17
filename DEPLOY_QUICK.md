# ⚡ Быстрый деплой на Vercel

## ✅ Проект готов к деплою!

Все необходимые файлы созданы и проверены:
- ✅ `index.html` создан
- ✅ `src/main.tsx` создан  
- ✅ `vercel.json` настроен
- ✅ `package.json` обновлен
- ✅ `tsconfig.json` создан
- ✅ `.gitignore` создан
- ✅ Билд успешно проходит (`pnpm build`)
- ✅ Supabase бэкенд уже работает

## 🚀 3 шага до деплоя:

### 1️⃣ Инициализируйте Git

```bash
git init
git add .
git commit -m "feat: RocketFry Crash Game ready for deploy"
```

### 2️⃣ Создайте репозиторий на GitHub

```bash
# Перейдите на https://github.com/new
# Создайте репозиторий, затем:

git remote add origin https://github.com/ВАШ-USERNAME/rocketfry.git
git branch -M main
git push -u origin main
```

### 3️⃣ Деплой на Vercel

**Вариант А: Web UI (самый простой)**

1. Откройте https://vercel.com/new
2. Импортируйте ваш GitHub репозиторий
3. Vercel автоматически определит настройки
4. Нажмите **Deploy**
5. Готово! 🎉

**Вариант Б: CLI**

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 🔗 После деплоя

Ваше приложение будет доступно по адресу:
```
https://rocketfry.vercel.app
```

### Настройте Telegram WebApp:

1. Откройте @BotFather
2. `/setmenubutton` → выберите бота
3. Вставьте URL: `https://ваш-домен.vercel.app`

## 📊 Проверка API

Убедитесь что Supabase работает:

```bash
curl https://lwnqqjqaiauiqyxebehd.supabase.co/functions/v1/make-server-0dc2674a/health
```

Ответ: `{"status":"ok"}` ✅

## 💡 Полезные команды

```bash
# Локальная разработка
pnpm dev

# Сборка проекта
pnpm build

# Превью сборки
pnpm preview

# Деплой на Vercel
vercel --prod
```

## 📚 Подробная инструкция

Смотрите файл `VERCEL_DEPLOY.md` для детальных инструкций.

---

**Готово!** Теперь просто следуйте 3 шагам выше и ваше приложение будет онлайн! 🚀
