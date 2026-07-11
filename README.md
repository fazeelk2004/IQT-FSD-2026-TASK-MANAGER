# IQT Smart Task Manager

A full-stack **MERN** task manager with an AI-assisted description feature. Users
can create, edit, prioritise, complete, filter, and delete tasks, and optionally
ask an AI assistant (via OpenAI, called **only** from the backend) to rewrite a
task description into a concise, professional version.

---

## Assessment Context

This project was built as a technical assessment. It demonstrates:

- A clean MERN architecture (MongoDB, Express, React, Node.js).
- A well-structured REST API with validation, rate limiting, and centralized
  error handling.
- A secure third-party (OpenAI) integration where the API key never leaves the
  server.
- A responsive, accessible React interface.

Authentication and multi-user ownership are intentionally **out of scope**.

---

## Main Features

- **Task CRUD** — create, read, update, and delete tasks.
- **Priorities** — `low` / `medium` / `high`, changeable inline on each card.
- **Completion toggle** — mark tasks complete/active via a checkbox.
- **Filters** — All / Active / Completed.
- **Task summary** — compact Total / Active / Completed counts.
- **Accessible edit modal** — focus trap, Escape to close, keyboard friendly.
- **AI "Improve with AI"** — rewrites the description using OpenAI (backend only).
- **UX states** — loading spinner, readable error messages, and a professional
  empty state.
- **Responsive & accessible** — mobile/tablet/desktop layouts, labelled inputs,
  visible focus rings, ARIA attributes.
- **Backend hardening** — Helmet headers, CORS restriction, request rate
  limiting (with a stricter limit on the AI endpoint), body-size limits, input
  validation, and production-safe error responses.

---

## Technology Stack

**Frontend**
- React 18
- Vite 6
- JavaScript
- Tailwind CSS 3
- Axios

**Backend**
- Node.js + Express 4
- MongoDB + Mongoose 8
- OpenAI Node SDK (Responses API)
- helmet, cors, express-rate-limit, dotenv

**Tooling**
- concurrently (run client + server together)
- nodemon (backend dev reload)

---

## Project Architecture

```
┌──────────────┐        HTTP/JSON        ┌──────────────────┐        HTTPS        ┌────────────┐
│   React SPA  │  ───────────────────▶   │   Express API    │  ───────────────▶   │   OpenAI   │
│  (Vite)      │   /api/tasks, /api/ai   │  (Node.js)       │   Responses API     │            │
│              │  ◀───────────────────   │                  │  ◀───────────────   │            │
└──────────────┘                         └───────┬──────────┘                     └────────────┘
                                                 │ Mongoose
                                                 ▼
                                          ┌──────────────┐
                                          │   MongoDB    │
                                          └──────────────┘
```

- The React app talks **only** to the Express API (`VITE_API_URL`).
- The Express API owns all persistence (MongoDB) and all OpenAI calls.
- The **OpenAI API key lives only on the server** — the browser never sees it.

Backend layering: `routes → middleware (validation, rate limit) → controllers →
services (OpenAI) / models (Mongoose)`, with a centralized error handler.

---

## Folder Structure

```
IQTAssessmentTaskManager/
├── package.json                 # root scripts (run client + server together)
├── README.md
├── client/                      # React + Vite frontend
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── services/
│       │   └── taskApi.js        # Axios calls to the backend
│       └── components/
│           ├── Header.jsx
│           ├── TaskForm.jsx
│           ├── TaskList.jsx
│           ├── TaskItem.jsx
│           ├── TaskFilters.jsx
│           ├── TaskSummary.jsx
│           ├── EditTaskModal.jsx
│           ├── LoadingSpinner.jsx
│           └── ErrorMessage.jsx
└── server/                      # Node.js + Express backend
    ├── .env.example
    ├── POSTMAN_TESTS.md
    └── src/
        ├── server.js             # entry point
        ├── app.js                # Express app + middleware
        ├── config/
        │   └── db.js             # Mongoose connection
        ├── models/
        │   └── Task.js
        ├── controllers/
        │   ├── task.controller.js
        │   ├── ai.controller.js
        │   └── health.controller.js
        ├── services/
        │   └── openaiService.js  # OpenAI Responses API call
        ├── middleware/
        │   ├── validateTask.js   # input + ObjectId validation
        │   ├── rateLimiter.js    # global + AI limiters
        │   ├── notFound.js
        │   └── errorHandler.js
        └── routes/
            ├── index.js
            ├── task.routes.js
            ├── ai.routes.js
            └── health.routes.js
```

---

## Database Schema

**Collection:** `tasks` (Mongoose model `Task`)

| Field         | Type     | Rules / Default                                             |
|---------------|----------|------------------------------------------------------------|
| `_id`         | ObjectId | Auto-generated by MongoDB                                  |
| `title`       | String   | **Required**, trimmed, 2–150 characters                    |
| `description` | String   | Optional, trimmed, max 1000 characters, default `""`       |
| `completed`   | Boolean  | Default `false`                                            |
| `priority`    | String   | Enum: `low` \| `medium` \| `high`, default `medium`        |
| `createdAt`   | Date     | Auto-set by Mongoose timestamps                            |
| `updatedAt`   | Date     | Auto-updated by Mongoose timestamps                        |

Indexes: `completed`, `priority`, and `createdAt` (descending) for common
filtering and newest-first listing.

Example document:

```json
{
  "_id": "6a5220912f1fe0b1f0d0e61c",
  "title": "Prepare sprint demo",
  "description": "Walk through the task manager MVP for the review meeting.",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-07-11T10:53:05.406Z",
  "updatedAt": "2026-07-11T10:53:05.406Z"
}
```

---

## REST API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint            | Description                         | Body fields                                   |
|--------|---------------------|-------------------------------------|-----------------------------------------------|
| GET    | `/health`           | Health check                        | —                                             |
| GET    | `/tasks`            | List all tasks (newest first)       | —                                             |
| GET    | `/tasks/:id`        | Get one task                        | —                                             |
| POST   | `/tasks`            | Create a task                       | `title` (req), `description?`, `priority?`    |
| PATCH  | `/tasks/:id`        | Update a task (partial)             | any of `title`, `description`, `completed`, `priority` |
| DELETE | `/tasks/:id`        | Delete a task                       | —                                             |
| POST   | `/ai/improve-task`  | AI-improve a task description       | `title` (req), `description?`                 |

**Response envelope**

```json
// success
{ "success": true, "data": { /* task or array */ } }

// error
{ "success": false, "message": "Readable error message" }
```

Status codes: `200` OK, `201` Created, `400` validation/bad ObjectId,
`404` not found, `429` rate limited, `5xx` upstream/server errors.

### curl — Task API

```bash
# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Build login page","description":"Create login","priority":"high"}'

# List all tasks
curl http://localhost:5000/api/tasks

# Get one task (replace <id>)
curl http://localhost:5000/api/tasks/<id>

# Update a task (mark completed + change priority)
curl -X PATCH http://localhost:5000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true,"priority":"low"}'

# Delete a task
curl -X DELETE http://localhost:5000/api/tasks/<id>
```

### curl — OpenAI endpoint

```bash
curl -X POST http://localhost:5000/api/ai/improve-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Build login page","description":"Create login"}'
```

Successful response:

```json
{ "success": true, "data": { "improvedDescription": "..." } }
```

---

## OpenAI API Integration

The AI feature rewrites a task description into one concise, professional
paragraph (roughly 30–80 words, no headings, no bullet points, no invented
details).

**Flow:** React `TaskForm` → `taskApi.improveTask()` → `POST /api/ai/improve-task`
→ `ai.controller.js` (validates input) → `openaiService.js` → OpenAI Responses
API → improved text returned to the client, which places it in the description
field for review. **Nothing is auto-saved** — the user reviews and submits.

> **Security note — OpenAI is called only through the backend.**
> The `OPENAI_API_KEY` is read from server-side environment variables only. It is
> never exposed to React, never placed in a `VITE_`-prefixed variable, never
> logged, and raw OpenAI errors are never returned to the client. The browser
> only ever calls the Express endpoint, so the key cannot leak to the frontend.

The request uses a timeout, and the AI endpoint has a stricter rate limit than
the rest of the API. If `OPENAI_API_KEY` is not set, the endpoint responds with a
handled configuration error (it does not crash the server).

---

## Environment Variables

Copy each `.env.example` to `.env` and fill in your own values.
**Never commit real secrets** — `.env` files are gitignored.

**Backend** (`server/.env`)

| Variable         | Required | Example                                  | Notes                                        |
|------------------|----------|------------------------------------------|----------------------------------------------|
| `NODE_ENV`       | No       | `development`                            | `production` hides internal 5xx messages      |
| `PORT`           | No       | `5000`                                   | Defaults to `5000`                            |
| `MONGODB_URI`    | Yes*     | `mongodb://127.0.0.1:27017/iqt_tasks`    | *Task endpoints need a database               |
| `CLIENT_URL`     | No       | `http://localhost:5173`                  | Allowed CORS origin                           |
| `OPENAI_API_KEY` | No**     | `sk-...` (never commit)                  | **Required only for the AI endpoint           |
| `OPENAI_MODEL`   | No       | `gpt-4o-mini`                            | Optional model override                       |

**Frontend** (`client/.env`)

| Variable        | Required | Example                       | Notes                              |
|-----------------|----------|-------------------------------|------------------------------------|
| `VITE_API_URL`  | No       | `http://localhost:5000/api`   | Falls back to the local API URL    |

---

## Local Installation

**Prerequisites:** Node.js 18+, npm, and a MongoDB database (local or MongoDB
Atlas).

```bash
# 1. Install all dependencies (root + client + server)
npm run install:all

# 2. Create env files from the examples
cp server/.env.example server/.env
cp client/.env.example client/.env
# then edit server/.env (MONGODB_URI, OPENAI_API_KEY, ...)

# 3. Run frontend + backend together
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000  (health: http://localhost:5000/api/health)

### Backend setup (only)

```bash
cd server
npm install
npm run dev      # nodemon (auto-reload)   — or: npm start
```

### Frontend setup (only)

```bash
cd client
npm install
npm run dev      # Vite dev server
```

Run individually from the root instead: `npm run server` / `npm run client`.

---

## Testing

> There is **no automated test suite yet** (see Future Improvements). Testing is
> currently manual, via curl or Postman.

- **curl:** use the Task API and OpenAI examples above.
- **Postman / manual cases:** see [`server/POSTMAN_TESTS.md`](server/POSTMAN_TESTS.md)
  for step-by-step cases (health, list, create, empty-title rejection, get one,
  update, complete, invalid ObjectId, delete, 404).
- **Frontend build check:** `npm run build` (from `client/`) verifies the app
  compiles.

---

## Deployment

Frontend and backend deploy as two pieces.

**Backend (Node host — Render, Railway, Fly.io, a VM, etc.)**
1. Set env vars: `NODE_ENV=production`, `MONGODB_URI`, `CLIENT_URL`
   (your deployed frontend URL), `OPENAI_API_KEY`.
2. Start with `npm start` (runs `node src/server.js`).

**Frontend (static host — Vercel, Netlify, Cloudflare Pages, etc.)**
1. Set `VITE_API_URL` to your deployed backend URL (e.g. `https://api.example.com/api`).
2. Build: `npm run build` (output in `client/dist/`).
3. Serve the `dist/` folder as a static site.

Ensure `CLIENT_URL` on the backend matches the deployed frontend origin so CORS
allows it.

---

## Security Considerations

Implemented in this project:

- **Helmet** secure HTTP headers.
- **CORS** restricted to `CLIENT_URL` (falls back to `http://localhost:5173` in
  development).
- **Rate limiting** — a global limiter on `/api`, plus a **stricter limiter on the
  AI endpoint**.
- **Body-size limits** — JSON/urlencoded capped at `10kb`.
- **Input validation** — request-level checks plus Mongoose schema validation
  (title length, description length, priority enum).
- **MongoDB ObjectId validation** before any lookup by id.
- **Mass-assignment prevention** — only whitelisted fields are accepted on
  create/update.
- **Production-safe errors** — centralized error handler; when
  `NODE_ENV=production`, internal 5xx messages are replaced with a generic
  message and stack traces are never returned.
- **API-key protection** — `OPENAI_API_KEY` is backend-only, never exposed to the
  frontend, never logged; raw OpenAI errors are never returned to clients.

Not implemented (by design): authentication, per-user authorization, CSRF tokens.

---

## Future Improvements

- Automated tests (Jest/Vitest + Supertest for the API, React Testing Library
  for components).
- Authentication and per-user task ownership.
- Startup environment-variable validation and a stricter production CORS
  allowlist.
- Pagination and search/sort for large task lists.
- Optimistic UI updates and toast notifications.
- CI/CD pipeline and containerization (Docker).
- Persisted, shared rate-limit store for multi-instance deployments.
```
