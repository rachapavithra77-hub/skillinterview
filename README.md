# AI Interview Agent

An AI-powered interview agent that conducts a real, curriculum-driven mock interview: it asks at
least 8 questions across 4 curriculum days, generates context-aware follow-up questions from the
candidate's previous answers, maintains full conversation context, and produces structured,
scored feedback at the end.

## Architecture

This project is a single **TanStack Start (React 19 + Vite)** full-stack application. The frontend
and the backend live in one deployable app, but they are cleanly separated:

```
src/
├── routes/                     # BACKEND (HTTP API) + FRONTEND (pages)
│   ├── health.ts               # GET /health           -> { "status": "active" }
│   ├── api/health.ts           # GET /api/health
│   ├── api/agent/init.ts       # POST|GET /api/agent/init
│   ├── api/agent/feed.ts       # GET  /api/agent/feed
│   ├── api/interview/start.ts          # POST /api/interview/start
│   ├── api/interview/message.ts        # POST /api/interview/message
│   ├── api/interview/end.ts            # POST /api/interview/end
│   ├── api/interview/feedback/$sessionId.ts  # GET /api/interview/feedback/:sessionId
│   ├── api/interview/session/$sessionId.ts   # GET /api/interview/session/:sessionId
│   ├── index.tsx               # /            landing page
│   ├── setup.tsx               # /setup       interview setup
│   ├── interview.tsx           # /interview   interview room
│   ├── complete.tsx            # /complete    completion screen
│   ├── results/$sessionId.tsx  # /results/:id detailed report
│   └── dashboard.tsx           # /dashboard   stats + agent feed
├── lib/
│   ├── curriculum.ts                 # synthetic curriculum: 4 days, 12 questions
│   ├── ai.server.ts                  # AI provider client (server only)
│   ├── interview.service.server.ts   # question/follow-up/scoring/feedback generation
│   ├── session-store.server.ts       # session + agent state
│   └── http.server.ts                # JSON/CORS helpers
├── services/api.ts             # frontend API service (all fetch calls centralised)
├── context/InterviewContext.tsx# frontend interview state
├── components/                 # UI components
└── utils/format.ts
```

Server-only modules (`*.server.ts`) are never bundled into the browser, so the AI API key is never
exposed to the frontend.

> Note on structure: the brief described a separate `frontend/` + Express `server/` monorepo. This
> workspace runs a single TanStack Start app, so the backend is implemented with TanStack **server
> routes** (real HTTP endpoints with request validation, CORS and error handling) instead of a
> separate Express process. All required endpoints, paths, request bodies and response shapes are
> implemented exactly as specified.

## Features

- 8-question curriculum plan covering all 4 curriculum days (2 questions per day)
- Context-aware follow-up questions that explicitly reference the candidate's previous answer
- Per-answer scoring and analysis
- Structured final feedback: overall/technical/communication/problem-solving/confidence scores,
  strengths, areas to improve, summary, next steps and per-question feedback
- Autonomous agent: `POST /api/agent/init` initialises the agent and generates an insight feed with
  no further prompting; `GET /api/agent/feed` returns those posts
- "AI Interview Control Room" UI: deep navy, glass panels, animated aurora background, live
  progress indicator, timer, split-screen interview room
- Full loading and error states, responsive on desktop/tablet/mobile
- No authentication, no voice, session state is in-memory

## Curriculum

| Day | Focus |
| --- | --- |
| 1 | Introduction, Background, Fundamentals |
| 2 | Technical concepts, Problem solving, Data structures |
| 3 | Projects, Debugging, System thinking |
| 4 | Behavioral, Teamwork, Leadership |

## Environment variables

Backend (server-side only):

```
LOVABLE_API_KEY=      # AI gateway key (auto-provisioned in Lovable Cloud)
OPENAI_API_KEY=       # optional fallback if you supply your own key
```

Frontend (optional):

```
VITE_API_URL=/api     # defaults to /api (same origin)
```

If no AI key is configured, the API returns a clear JSON configuration error (HTTP 500) instead of
crashing, and the UI shows a friendly error with Retry / Check Server actions.

## Running locally

```bash
bun install
bun run dev      # app + API on http://localhost:8080
bun run build    # production build
```

Health check: `curl http://localhost:8080/health` -> `{"status":"active"}`

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | `{ "status": "active" }` |
| POST | `/api/agent/init` | Initialise the autonomous agent (also accepts GET) |
| GET | `/api/agent/feed` | Agent-generated interview insight posts |
| POST | `/api/interview/start` | `{ userId, day, interviewType?, difficulty? }` -> `{ sessionId, question }` |
| POST | `/api/interview/message` | `{ sessionId, content }` -> `{ message, progress, completed }` |
| GET | `/api/interview/session/:sessionId` | Full session state |
| GET | `/api/interview/feedback/:sessionId` | Structured feedback |
| POST | `/api/interview/end` | End the session and generate feedback |

Example:

```bash
curl -X POST localhost:8080/api/interview/start \
  -H 'content-type: application/json' \
  -d '{"userId":"user-1","day":1}'
```

## AI usage

All AI calls happen server-side in `src/lib/interview.service.server.ts` via
`src/lib/ai.server.ts`. A single professional-interviewer system prompt enforces: one question at a
time, no repetition, explicit use of previous answers for follow-ups, curriculum coverage, and
completion after 8 questions. Answer scoring and final feedback are derived from the real
conversation transcript.

## Deployment

The app is deployment-ready as a single service (Lovable hosting / any Node or edge host that runs
a Vite SSR build). Set `LOVABLE_API_KEY` (or `OPENAI_API_KEY`) as an environment variable on the
host. No secrets are hardcoded and none reach the browser. CORS headers are set on every API
response, including error and preflight responses.
