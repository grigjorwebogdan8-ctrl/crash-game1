# 🔑 Получение актуальных ключей Supabase

## ⚠️ Обнаружена проблема

JWT токен в проекте устарел или неправильный. Нужно получить актуальные ключи из вашего Supabase проекта.

---

## 📋 Пошаговая инструкция

### Шаг 1: Откройте Supabase Dashboard

Перейдите по ссылке:
```
https://supabase.com/dashboard
```

Войдите в аккаунт (если еще не вошли).

---

### Шаг 2: Найдите или создайте проект

#### Если проект уже существует:

1. В списке проектов найдите: `lwnqqjqaiauiqyxebehd`
2. Кликните на него

#### Если проекта нет (создайте новый):

1. Нажмите **New Project**
2. Выберите организацию (или создайте новую)
3. Введите:
   - **Name**: `rocketfry-game`
   - **Database Password**: Придумайте надежный пароль (сохраните его!)
   - **Region**: Выберите ближайший (Europe West или US East)
4. Нажмите **Create new project**
5. Подождите 1-2 минуты пока проект создается

---

### Шаг 3: Получите API ключи

1. В левом меню нажмите **⚙️ Settings**
2. Выберите **API**
3. Скопируйте два значения:

#### Project URL
```
https://ВАШ-PROJECT-ID.supabase.co
```

#### anon public (API Key)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...
```

**⚠️ НЕ КОПИРУЙТЕ service_role ключ!** Он секретный и используется только на сервере.

---

### Шаг 4: Обновите ключи в коде

#### Вариант A: Я сделаю это за вас

Просто скажите мне:
```
Мои ключи:
Project URL: https://xxx.supabase.co
Anon Key: eyJhbG...
```

И я автоматически обновлю все файлы.

#### Вариант B: Вручную

Откройте файл `/workspaces/default/code/src/utils/supabase/info.ts` и замените:

```typescript
export const projectId = 'ВАШ-PROJECT-ID'; // из URL
export const publicAnonKey = 'ВАШ-ANON-KEY';
```

Обновите `.env.local`:

```bash
VITE_SUPABASE_URL=https://ВАШ-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=ВАШ-ANON-KEY
```

Обновите `scripts/test-connection.mjs`:

```javascript
const SUPABASE_URL = 'https://ВАШ-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'ВАШ-ANON-KEY';
```

---

### Шаг 5: Настройте Edge Functions (ВАЖНО!)

#### 5.1 Установите Supabase CLI

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Или через npm:**
```bash
npm install -g supabase
```

#### 5.2 Войдите в Supabase

```bash
supabase login
```

Следуйте инструкциям в браузере.

#### 5.3 Свяжите проект

```bash
cd /workspaces/default/code
supabase link --project-ref ВАШ-PROJECT-ID
```

Введите Database Password (который создавали в Шаге 2).

#### 5.4 Разверните Edge Functions

```bash
supabase functions deploy make-server-0dc2674a
```

Подождите пока функция развернется.

---

### Шаг 6: Проверьте что все работает

```bash
node scripts/test-connection.mjs
```

Теперь все 4 теста должны пройти успешно:

```
✅ Health Check: { status: 'ok' }
✅ Баланс тестового пользователя: { balance: 0 }
✅ Баланс создан: { success: true }
✅ Баланс прочитан: { balance: 1000 }

✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!
```

---

## 🔒 Безопасность

### Что можно публиковать:
- ✅ Project URL
- ✅ Anon/Public Key

### Что НЕЛЬЗЯ публиковать:
- ❌ service_role ключ
- ❌ Database Password
- ❌ JWT Secret

Anon Key безопасен для использования на фронтенде, он имеет ограниченные права.

---

## 🆘 Часто задаваемые вопросы

### Q: У меня нет аккаунта Supabase

**A:** Создайте бесплатный аккаунт:
1. Перейдите на https://supabase.com
2. Нажмите **Start your project**
3. Войдите через GitHub (рекомендуется) или Email
4. Следуйте инструкциям выше

### Q: Где найти Project ID?

**A:** Project ID это часть URL вашего проекта:
```
https://[PROJECT-ID].supabase.co
           ↑↑↑↑↑↑
        Это и есть ID
```

### Q: Мой Edge Function не деплоится

**A:** Проверьте:
1. Установлен ли Supabase CLI: `supabase --version`
2. Вы залогинены: `supabase login`
3. Проект связан: `supabase link --project-ref ВАШ-ID`
4. Попробуйте снова: `supabase functions deploy make-server-0dc2674a`

### Q: Можно ли использовать существующий проект?

**A:** Да! Если у вас уже есть Supabase проект, просто:
1. Получите ключи из Settings → API
2. Разверните функции через Supabase CLI
3. Обновите ключи в коде

---

## 📞 Нужна помощь?

### Вариант 1: Автоматическое обновление

Просто дайте мне ваши ключи в формате:

```
Project URL: https://xxx.supabase.co
Anon Key: eyJhbG...
```

И я мгновенно обновлю все файлы.

### Вариант 2: Документация Supabase

- Edge Functions: https://supabase.com/docs/guides/functions
- API Settings: https://supabase.com/docs/guides/api
- CLI: https://supabase.com/docs/guides/cli

---

**Готово!** После получения ключей все заработает 🚀
