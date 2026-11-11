# Vibe Ops

Платформа для когортного пилотного курса для инженеров: агентность, MCP, guardrails, мультиагентные системы, гибкость мышления.

MVP: весь контент когорты открыт сразу, без оплаты (добавится в v2).

## Стек

- Next.js (App Router) + TypeScript + Tailwind
- Postgres + Prisma
- Auth.js — вход по email magic link (через Resend)
- Cloudflare R2 (S3-совместимое хранилище) — видео-материалы, раздаются через подписанные URL

## Локальный запуск

1. Скопируй `.env.example` в `.env` и заполни значения (локальный Postgres, Resend API key, R2 креды).
2. `npm install`
3. `npx prisma migrate dev` — накатить схему на базу
4. `npm run dev`

## Модель данных

См. `prisma/schema.prisma`. Коротко:

- `Cohort` → `Module` (неделя курса) → `Submission` (сдача задания), `FeedbackForm`/`FeedbackResponse` (отдельные формы для новичков и сильных участников)
- `Enrollment` связывает `User` с `Cohort` и хранит `level` (novice/strong)
- `LiveSession` — живые онлайн-созвоны (kickoff/midpoint/final), без привязки к конкретной неделе

## Admin

`/admin` доступен только пользователям с `role = ADMIN` (выставляется вручную в базе). Там: создание когорт, модулей, вопросов фидбека по уровням, живых созвонов; просмотр сдач и ответов на фидбек.

## Деплой

Railway: подключить Postgres-плагин (даёт `DATABASE_URL` автоматически), прописать остальные переменные из `.env.example` в Variables.
