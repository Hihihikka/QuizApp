# QuizApp

A full-stack quiz application with a gameplay loop planned as:
**Quiz → Rewards → Poker → Final Ranking**

Currently implemented: quiz CRUD, single-player quiz gameplay with scoring, time bonuses, and loot box rewards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Zustand, React Router 7 |
| Backend | NestJS 11, Prisma 7, PostgreSQL |
| Shared | npm workspaces (`@quizapp/shared`) |
| API types | Auto-generated via `openapi-typescript` |

---

## Project Structure

```
QuizApp/
├── src/                  # Frontend (React + Vite)
│   └── features/
│       ├── auth/         # Auth pages (in progress)
│       ├── gameplay/     # Quiz gameplay (PlayPage, useGameStore)
│       └── quiz/         # Quiz CRUD (create, edit, preview, list)
├── backend/              # NestJS API
│   ├── prisma/           # Schema + migrations
│   └── src/
│       ├── generated/    # Prisma Client (auto-generated, not committed)
│       └── quiz/         # Quiz controller, service, DTO
└── shared/               # Shared constants (@quizapp/shared)
    └── src/
        └── quizLimits.ts # TIME_LIMIT_MIN / TIME_LIMIT_MAX
```

---

## Prerequisites

- Node.js 22+
- PostgreSQL (running locally or via Docker)
- npm 10+ (workspaces support)

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/Hihihikka/QuizApp.git
cd QuizApp
npm install
```

This installs dependencies for all workspaces (frontend, backend, shared) and links `@quizapp/shared` automatically.

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/quizapp"
```

### 3. Generate Prisma Client

```bash
cd backend
npx prisma generate
cd ..
```

This generates the typed database client into `backend/src/generated/prisma/`.  
Run this once after cloning, and again whenever `backend/prisma/schema.prisma` changes.

### 4. Run database migrations

```bash
cd backend
npx prisma migrate deploy
cd ..
```

### 5. Start the backend

```bash
npm run backend:dev
```

API runs at `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api/docs`

### 6. Start the frontend

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## API

The backend exposes a REST API documented via Swagger. Base path: `/api/quizzes`.

| Method | Path | Description |
|---|---|---|
| GET | `/api/quizzes` | List all quizzes (optional `?search=`) |
| GET | `/api/quizzes/:id` | Get quiz by ID |
| POST | `/api/quizzes` | Create quiz |
| PUT | `/api/quizzes/:id` | Update quiz |
| DELETE | `/api/quizzes/:id` | Delete quiz |

Full schema available at `http://localhost:3000/api/docs` when the backend is running.

### API Types Codegen

Frontend types are auto-generated from the OpenAPI spec — never hand-duplicated:

```bash
# backend must be running first
npm run generate:types
```

This writes to `src/features/quiz/api-types.ts`.

---

## Shared Package

`@quizapp/shared` contains constants used by both frontend and backend.  
Currently exports `TIME_LIMIT_MIN` (5) and `TIME_LIMIT_MAX` (120) — the single source of truth for question time limit validation, enforced at three levels:

- Frontend form (`useQuizForm.ts`)
- JSON import parser (`quizParser.ts`)
- Backend DTO (`class-validator` decorators in `quiz.dto.ts`)

If you change the limits, change them only in `shared/src/quizLimits.ts`.  
Then rebuild shared: `npm run shared:build`.

---

## Quiz JSON Import Format

When creating a quiz, questions can be imported via JSON. Supported formats:

```json
[
  {
    "text": "Question text",
    "answers": ["Correct answer", "Wrong A", "Wrong B", "Wrong C"],
    "timeLimit": 20
  }
]
```

Or wrapped in an object:
```json
{ "questions": [ ... ] }
```

Rules:
- `answers`: 2–6 items, first item is always the **correct answer**
- `timeLimit`: optional per-question override (5–120 sec); falls back to the quiz's `defaultTimeLimit` if omitted
- `text`: required, non-empty string

---

## Gameplay

- **Scoring**: correct answer = 500 pts base + time bonus (up to +30 pts for answering in the first third of the time limit)
- **Loot boxes**: earned every 1000 pts (bronze → silver → gold, up to 3 per session)
- **Timer**: counts down per question; timeout counts as a wrong answer

---

## Roadmap

- [ ] Authentication (files scaffolded, logic pending)
- [ ] Quiz attempt persistence (`QuizAttempt` model + endpoint)
- [ ] Multiplayer mode
- [ ] Poker phase
- [ ] Final ranking

---

## Development Notes

- `backend/src/generated/` — gitignored, must be regenerated after `npm install` (handled automatically via `postinstall` script in `backend/package.json`)
- `*.tsbuildinfo` — gitignored, TS incremental build cache
- Frontend API types (`src/features/quiz/api-types.ts`) — gitignored if you prefer, since they're generated; currently committed as convenience
