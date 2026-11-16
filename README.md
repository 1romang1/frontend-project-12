# Hexlet Chat

Учебный Slack-подобный чат (React, Vite, Mantine, Zustand и TanStack Query).

## Запуск

Требуется Node.js 22.12+ и npm.

```bash
npm install
make build
make start
```

После сборки сервер доступен на `http://localhost:5001`.
Для разработки в двух терминалах выполните `make start-backend` и `make start-frontend`. Vite: `http://localhost:5002`.

Тестирование: `npm test`; линтер: `make lint`.

## Возможности

- `/login`, `/signup`, защищённая `/` и страница 404.
- Токен JWT сохраняется в Zustand с `persist`.
- Каналы и сообщения кешируются TanStack Query, выбор канала и модалка — Zustand.
- Сообщения отправляются по REST API, события Socket.IO обновляют кеш без дублирования.
- Входные точки `src/index.jsx` и `src/init.jsx` соответствуют контракту Hexlet.

## Деплой

Ранее указанный адрес на Render: https://frontend-project-12-0m0o.onrender.com

После перехода на корневую структуру в Render настройте Build Command: `npm install && npm run build`, Start Command: `npm run start`. Убедитесь, что окружение использует Node.js 22.12+.
