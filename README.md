# IQT Smart Task Manager

## Project Purpose

IQT Smart Task Manager is a full-stack MERN application that provides the
foundation for managing tasks. This repository currently contains the initial
project scaffold — the frontend, the backend, and the tooling needed to run
them together. Task management features, authentication, and AI integrations
will be added in later iterations.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- Tailwind CSS
- Axios

**Backend**
- Node.js
- Express.js
- JavaScript
- MongoDB
- Mongoose

**Tooling**
- concurrently (run client and server together)

## Project Structure

```
iqt-smart-task-manager/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
├── README.md
├── .gitignore
└── package.json     # Root scripts to run the full stack
```

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs the root, client, and server dependencies.

### 2. Configure environment variables

Copy the example env file in the server and adjust values as needed:

```bash
cp server/.env.example server/.env
```

### 3. Run the app (frontend + backend together)

From the project root:

```bash
npm run dev
```

- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:5000

### Run individually

```bash
npm run client   # frontend only
npm run server   # backend only
```
