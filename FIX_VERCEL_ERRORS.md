# 🔧 Исправление ошибок деплоя на Vercel

## ❌ Проблема: ERR_INVALID_THIS при установке пакетов

Ошибка возникает из-за конфликта между pnpm и npm на Vercel.

---

## ✅ Решение применено автоматически

Я обновил следующие файлы:

### 1. `vercel.json` - изменен на npm

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### 2. `.npmrc` - добавлены настройки

```
shamefully-hoist=true
legacy-peer-deps=true
strict-peer-dependencies=false
auto-install-peers=true
```

### 3. `.vercelignore` - создан

Исключает ненужные файлы из деплоя.

### 4. `package.json` - добавлены engines

Указывает минимальные версии Node.js и npm.

---

## 🚀 Теперь деплойте заново

### Вариант 1: Через Vercel CLI

```bash
# Удалите старый деплой (если был)
vercel remove rocketfry-game --yes

# Новый деплой
vercel --prod
```

### Вариант 2: Через GitHub

```bash
# Добавьте изменения
git add .
git commit -m "fix: настройки для Vercel деплоя"
git push origin main
```

Vercel автоматически пересоберет проект с новыми настройками.

### Вариант 3: Через Vercel Dashboard (если уже создан проект)

1. Откройте https://vercel.com/dashboard
2. Выберите ваш проект
3. **Settings** → **General**
4. Найдите **Build & Development Settings**
5. Убедитесь что:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `dist`
6. Сохраните и сделайте **Redeploy**

---

## 🔍 Альтернативные решения (если ошибка повторится)

### Решение A: Использовать npm вместо pnpm локально

```bash
# Удалите pnpm зависимости
rm -rf node_modules pnpm-lock.yaml

# Установите через npm
npm install --legacy-peer-deps

# Проверьте что билд работает
npm run build

# Закоммитьте package-lock.json
git add package-lock.json
git commit -m "chore: switch to npm"
git push
```

### Решение B: Указать версию Node.js в Vercel

В Vercel Dashboard:
1. **Settings** → **Environment Variables**
2. Добавьте переменную:
   - **Name**: `NODE_VERSION`
   - **Value**: `18`
3. Сохраните и сделайте Redeploy

### Решение C: Очистить кэш Vercel

```bash
# Через CLI
vercel --prod --force

# Или в Dashboard
# Deployments → последний деплой → три точки → Redeploy → Clear cache
```

---

## 📊 Проверка что ошибка исправлена

После деплоя в логах Vercel должно быть:

✅ **Правильный вывод:**
```
Installing dependencies...
npm install --legacy-peer-deps
added 2010 packages in 45s

Building...
> build
> vite build

vite v6.3.5 building for production...
✓ 2010 modules transformed.
✓ built in 3.81s

Build Completed
```

❌ **НЕ должно быть:**
```
ERR_INVALID_THIS
WARN GET https://registry.npmjs.org/...
```

---

## 🐛 Другие частые ошибки Vercel

### "Build exceeded maximum duration"

**Решение:** Используйте `--force` для пересборки:
```bash
vercel --prod --force
```

### "Failed to compile"

**Решение:** Проверьте что локально билд работает:
```bash
npm run build
# или
pnpm build
```

### "Module not found"

**Решение:** Убедитесь что все зависимости в `package.json`:
```bash
npm install --save недостающий-пакет
```

---

## 📞 Если ничего не помогает

### 1. Проверьте логи Vercel

```bash
vercel logs --prod
```

### 2. Попробуйте другой регион

В `vercel.json` добавьте:
```json
{
  "regions": ["iad1"]
}
```

### 3. Используйте Vercel Support

Если проблема сохраняется:
1. Откройте https://vercel.com/support
2. Опишите проблему
3. Приложите логи деплоя

---

## ✅ Готово!

Теперь просто:

```bash
git add .
git commit -m "fix: Vercel deploy settings"
git push origin main
```

Или:

```bash
vercel --prod
```

Деплой должен пройти успешно! 🚀

---

## 📝 Что было исправлено (summary)

| Файл | Изменение | Зачем |
|------|-----------|-------|
| `vercel.json` | `pnpm` → `npm` | Vercel лучше работает с npm |
| `.npmrc` | Добавлены флаги | Решение peer dependencies конфликтов |
| `.vercelignore` | Создан | Ускорение деплоя, меньше файлов |
| `package.json` | Добавлены engines | Фиксация версий Node/npm |

**Готово к деплою! 🎉**
