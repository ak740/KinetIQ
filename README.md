# KinetIQ
KinetIQ: AI Study Tutor Buddy

# KinetIQ — AI study buddy for high-school Math & Science

React (Vite) frontend · Node.js/Express API · MySQL 8 in Docker.

## Run it

```bash
docker compose up --build
```

- App: http://localhost:3000
- API: http://localhost:4000/api/health
- MySQL: localhost:3307 (user `kinetiq` / `kinetiq_pass`, db `kinetiq`)

Weekly tests unlock 7 days after the last test. To try them immediately:
`WEEKLY_COOLDOWN_DAYS=0 docker compose up --build` (or copy `.env.example` to `.env`).

Local dev without Docker for the app: start only the DB (`docker compose up db`), then
`cd backend && npm i && DB_HOST=localhost DB_PORT=3307 npm run dev` and `cd frontend && npm i && npm run dev` (http://localhost:5173, proxies `/api`).

## The student journey

1. Sign up, pick a **grade (9–12)** and **subjects** (Math / Science).
2. Take the **diagnostic** per subject (3 questions per grade-eligible topic, mixed difficulty).
3. Get an initial **KinetIQ score** (0–100) and a **SWOT**: Strengths, Weaknesses, Areas of improvement, Training areas.
4. Follow the **personalised plan**: lessons and topic quizzes for the weakest topics first.
5. Take **weekly improvement tests**, weighted towards weak topics and unseen questions, and watch the score history grow.
6. Earn **XP, levels, streaks and badges** along the way.

## How scoring works

- Each topic has a **mastery** (0–100). Diagnostic sets it; later results blend in (weekly 50%, quiz 30%), weighted by question difficulty.
- Subject **score** = average mastery of assessed topics for the student's grade. Every test appends to `score_history`, which drives the progress chart and "points gained".
- SWOT thresholds (`config.js` → `learning`): ≥75 strength · <50 weakness · between = improvement area (also anything that dropped ≥10 points).

## Architecture

```
backend/src
  config.js            tunables: thresholds, test sizes, XP, cooldown
  db/                  schema.sql (idempotent migrations), seed.js, pool
  data/                content as data: catalog, math.js, science.js, lessons.js, badges.js
  services/            mastery · swot · testEngine · gamification (domain logic)
  routes/              auth · catalog · tests · learning · progress (thin HTTP layer)
frontend/src           pages/, components/, api.js, auth.jsx
```

## Extending

| To add… | Do this |
|---|---|
| A **subject** (English, History…) | Add it and its topics to `data/catalog.js`, add questions/lessons referencing the topic slugs, restart. Seeding is idempotent; the UI picks it up automatically. |
| **Questions / lessons** | Append to `data/*.js` (keyed by `code`) and restart. |
| A **badge** | Add a row to `data/badges.js`. `rule` is any stat from `collectStats()` in `services/gamification.js`; add a stat there for new kinds of achievements. |
| A **test type** (e.g. monthly mock) | Add the enum value in `schema.sql`, a picker in `services/testEngine.js`, an XP entry in `config.js`. |
| **API features** | New router in `routes/`, register it in `app.js`. |
| **Teacher/parent roles, AI-generated questions, adaptive difficulty** | Natural next steps: questions are already tagged with topic/difficulty/grade, and `testEngine` pickers are isolated functions you can swap for an LLM- or IRT-driven selector. |

Schema changes: `schema.sql` is `CREATE TABLE IF NOT EXISTS`; for column changes on an existing DB, introduce a numbered migrations folder (e.g. with `umzug` or `knex`) when you need it.

## Notes

- Set a strong `JWT_SECRET` outside local development.
- Passwords are hashed with bcrypt; tokens expire after 7 days.
