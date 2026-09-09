# Fluxboard

Collaborative real-time workflow builder — multiple users edit the same node/edge canvas and see
each other's changes live over WebSockets, with optimistic UI and a Postgres backend.

**Status:** work in progress.

## Monorepo layout

- `apps/web` — React + TypeScript frontend (Vite, React Flow, Zustand, React Query)
- `apps/server` — Express + TypeScript backend (REST API + WebSocket sync, Drizzle ORM, Postgres)
- `packages/shared` — TypeScript types shared between frontend and backend
