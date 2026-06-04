# UA → IE Car Scout — Deploy Guide

## Архитектура

```
┌─────────────────────────┐     HTTPS      ┌─────────────────────────┐
│   Frontend (Static)     │ ────────────►  │   Backend (Node/Express) │
│   Vite + React          │               │   DoneDeal scraper       │
│   Render Static Site    │ ◄──────────── │   Render Web Service     │
└─────────────────────────┘   JSON API    └─────────────────────────┘
          │                                          │
          │ VITE_AUTORIA_API_KEY (direct)            │
          ▼                                          ▼
   AUTO.RIA API                               DoneDeal.ie
   (Ukrainian cars)                           (Irish prices)
```

## Предварительные требования

- Аккаунт на [render.com](https://render.com) (free tier достаточно)
- GitHub репозиторий с кодом проекта
- AUTO.RIA API ключ → [developers.auto.ria.com](https://developers.auto.ria.com)

---

## Шаг 1 — Пуш кода на GitHub

```bash
cd ua-ie-car-scout
git init
git add .
git commit -m "feat: initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/ua-ie-car-scout.git
git push -u origin main
```

> ⚠️ Убедись что `.env` в `.gitignore` и не попадает в репозиторий.

---

## Шаг 2 — Деплой Backend (API сервер)

1. Войди на [dashboard.render.com](https://dashboard.render.com)
2. **New → Web Service**
3. Подключи GitHub репозиторий
4. Настройки:

| Поле | Значение |
|------|----------|
| Name | `ua-ie-car-scout-api` |
| Region | `Frankfurt (EU Central)` |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `node server/index.js` |
| Plan | `Free` |

5. **Environment Variables** (вкладка Environment):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `VITE_AUTORIA_API_KEY` | `0GFUwvt6X0aN5uZtUDmppruNsDnNX0gnRAMg7818` |

6. Нажми **Create Web Service**
7. Дождись деплоя (~2 мин). Проверь: `https://ua-ie-car-scout-api.onrender.com/api/health`

Ожидаемый ответ:
```json
{"status":"ok","ts":"2025-01-15T10:00:00.000Z","cacheSize":0}
```

---

## Шаг 3 — Деплой Frontend (статический сайт)

1. **New → Static Site**
2. Тот же репозиторий
3. Настройки:

| Поле | Значение |
|------|----------|
| Name | `ua-ie-car-scout-web` |
| Region | `Frankfurt (EU Central)` |
| Branch | `main` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

4. **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://ua-ie-car-scout-api.onrender.com` |
| `VITE_AUTORIA_API_KEY` | `0GFUwvt6X0aN5uZtUDmppruNsDnNX0gnRAMg7818` |

5. **Redirects/Rewrites** → добавь правило:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
   *(Нужно для React Router — без этого F5 на `/calc` даст 404)*

6. Нажми **Create Static Site**
7. Сайт будет доступен по адресу `https://ua-ie-car-scout-web.onrender.com`

---

## Шаг 4 — Smoke test после деплоя

```bash
# Health check
curl https://ua-ie-car-scout-api.onrender.com/api/health

# DoneDeal scraper (ирландские цены)
curl "https://ua-ie-car-scout-api.onrender.com/api/irish-prices?model=Toyota+AE86"

# Фронтенд — открыть в браузере
open https://ua-ie-car-scout-web.onrender.com
```

---

## Альтернативы Render

### Railway (проще, быстрее холодный старт)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Vercel (только фронтенд; бэкенд нужен отдельно)
```bash
npm install -g vercel
vercel --prod
```

### Самостоятельный сервер (VPS)
```bash
# Установка на Ubuntu
npm ci --omit=dev
npm run build
# Запуск через PM2
npm install -g pm2
pm2 start server/index.js --name api
pm2 serve dist 8080 --spa --name web
pm2 save && pm2 startup
```

---

## Известные ограничения Free Tier (Render)

| Проблема | Причина | Решение |
|---------|---------|---------|
| Первый запрос медленный (~30 сек) | Render усыпляет сервис при неактивности | Upgrade до Starter ($7/мес) или UptimeRobot ping каждые 14 мин |
| DoneDeal может заблокировать IP | Render использует общие IP | Добавь задержки в scraper или используй proxy |
| AUTO.RIA: 10 000 запросов/сутки | Лимит бесплатного ключа | Rate limiting уже есть в сервисе; кэш на 10 мин |

---

## Обновление после изменений

```bash
git add .
git commit -m "fix: ..."
git push
# Render автоматически задеплоит при push в main
```

---

## Структура env переменных

```
.env (local)                    Render Dashboard (production)
─────────────────────────────   ──────────────────────────────────
VITE_AUTORIA_API_KEY=xxx        VITE_AUTORIA_API_KEY=xxx  (API service)
PORT=3001                       (PORT задаётся Render автоматически)
VITE_API_BASE=http://localhost  VITE_API_BASE=https://...api.onrender.com
                                                           (Static site)
```

---

*Built for Eddie's Toyota hunt ☘️*
