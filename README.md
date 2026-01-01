# URL Fetcher

A full-stack application that fetches the content of HTTP URLs and displays the results via a web interface.

## Monorepo Structure

This project is organized as an NX monorepo with the following structure:

- **`apps/server`** - Fastify backend API that handles URL fetching
- **`apps/client`** - React frontend web application
- **`libs/shared`** - Shared TypeScript types used by both client and server

This structure provides:
- **Type safety** - Shared types ensure consistent data structures across the stack
- **Code organization** - Clear separation between frontend, backend, and shared code
- **Development efficiency** - Run both apps simultaneously with a single command

## Features

- Submit one or more URLs to be fetched
- View all submitted URLs with their fetch status (loading, success, failed)
- Real-time updates via Server-Sent Events (SSE)
- Display fetched content with both preview (rendered HTML) and source code views
- Track fetch times and error messages
- URL validation and normalization
- Safe HTML rendering with XSS prevention
- Responsive UI with Mantine components

## Tech Stack

### Backend
- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe development
- **class-validator** - DTO validation
- **EventEmitter** - Real-time updates via SSE

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe development
- **Mantine** - Component library
- **React Router** - Navigation
- **TanStack Query (React Query)** - Data fetching and caching
- **date-fns** - Date formatting
- **DOMPurify** - XSS prevention


## Installation

```bash
npm install
```

## Running the Application

Start both the backend server and frontend client in development mode:

```bash
npm run dev
```

This will start:
- Backend API server at `http://localhost:3333`
- Frontend web application at `http://localhost:4200`

## API Endpoints

### POST /url/fetch
Submit URLs to be fetched.

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"urls": ["http://example.com", "http://google.com"]}' http://localhost:3333/url/fetch
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "http://example.com",
      "status": "loading",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

### GET /url/list
Get all submitted URLs with their fetch status.

**Request:**
```bash
curl http://localhost:3333/url/list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "http://example.com",
      "status": "success",
      "content": "<html>...</html>",
      "createdAt": 1234567890,
      "updatedAt": 1234567891,
      "fetchTime": 342
    }
  ]
}
```

### GET /url/content?url=<url>
Get the fetched content for a specific URL.

**Request:**
```bash
curl http://localhost:3333/url/content?url=http://example.com
```

**Response:**
```json
{
  "success": true,
  "data": "<html>...</html>"
}
```

### GET /url/events
Server-Sent Events endpoint for real-time updates.

## Project Structure

```
url-fetcher/
├── apps/
│   ├── client/          # React frontend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/   # Reusable UI components
│   │   │   │   ├── dal/          # Data access layer (API hooks)
│   │   │   │   ├── hooks/        # Custom React hooks
│   │   │   │   ├── pages/        # Page components
│   │   │   │   └── services/     # API services
│   │   │   └── main.tsx
│   │   └── project.json
│   └── server/          # Fastify backend API
│       ├── src/
│       │   ├── app/
│       │   │   ├── routes/       # API routes and controllers
│       │   │   └── utils/        # Utilities (SSE, DB, helpers)
│       │   └── main.ts
│       └── project.json
└── libs/
    └── shared/          # Shared types between client and server
        └── src/
            └── lib/
                └── shared.ts     # Type definitions

```

## Architecture Highlights

### Type Safety
- Shared TypeScript types between client and server via `@org/shared` package
- Discriminated unions for `UrlRecord` type ensuring type safety based on fetch status
- No `any` types throughout the codebase

### Real-time Updates
- Server-Sent Events (SSE) for pushing updates to the client
- Automatic UI updates when URL fetch status changes
- React Query cache invalidation on SSE events

### Validation
- DTO validation with `class-validator` on the backend
- URL normalization (auto-adds `https://` if missing)
- Input validation at multiple layers

### Security
- DOMPurify for XSS prevention when rendering HTML
- CORS configured for cross-origin requests
- Safe HTML rendering with whitelisted tags and attributes

### Separation of Concerns
- Service layer for business logic
- Controller layer for HTTP handling
- Separate hooks for API calls vs. SSE events
- Component-based UI architecture

## License

MIT
