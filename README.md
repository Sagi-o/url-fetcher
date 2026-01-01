# URL Fetcher

A full-stack application that fetches the content of HTTP URLs and displays the results via a web interface.

## Installation & Setup

```bash
npm install
npm run dev
```

This will start:
- Backend API server at `http://localhost:3000`
- Frontend web application at `http://localhost:4200`

## Tech Stack

**Backend:** Fastify, TypeScript, class-validator
**Frontend:** React, TypeScript, Mantine, React Router, TanStack Query, date-fns, DOMPurify
**Monorepo:** NX with shared types library

## Features

- Submit multiple URLs to be fetched
- Real-time updates via Server-Sent Events
- Preview (rendered HTML) and source code views
- Fetch time tracking and error messages
- URL validation and normalization
- XSS prevention with DOMPurify

## API Endpoints

### POST /url/fetch
Submit URLs to be fetched.

**Request:**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"urls": ["http://example.com", "http://google.com"]}' http://localhost:3000/url/fetch
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
curl http://localhost:3000/url/list
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
curl http://localhost:3000/url/content?url=http://example.com
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
│   ├── client/          # React frontend
│   └── server/          # Fastify backend
└── libs/
    └── shared/          # Shared TypeScript types
```

## Architecture

- **Type Safety:** Shared types via `@org/shared` package, discriminated unions, no `any` types
- **Real-time Updates:** SSE for live status updates with React Query cache invalidation
- **Validation:** DTO validation with class-validator, URL normalization
- **Security:** DOMPurify for XSS prevention, CORS configured
- **Separation of Concerns:** Service/controller layers, component-based UI
