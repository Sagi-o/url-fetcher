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

**Backend:** Fastify, TypeScript, class-validator, lodash
**Frontend:** React, TypeScript, Mantine, React Router, TanStack Query, nuqs, date-fns, DOMPurify
**Monorepo:** NX with shared types library

## Features

- Submit multiple URLs to be fetched
- Real-time updates via Server-Sent Events
- Preview (rendered HTML) and source code views
- Fetch time tracking and error messages
- URL validation and normalization
- XSS prevention with DOMPurify
- Pagination (5 items per page)
- Sorting by creation/update date (ascending/descending)
- URL state management with query parameters (deep linking support)

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
Get all submitted URLs with their fetch status. Supports pagination and sorting.

**Query Parameters:**
- `page` (optional): Page number, defaults to 1
- `limit` (optional): Items per page, defaults to 5
- `sortBy` (optional): Sort field (`createdAt` or `updatedAt`), defaults to `updatedAt`
- `order` (optional): Sort order (`asc` or `desc`), defaults to `desc`

**Request:**
```bash
curl http://localhost:3000/url/list?page=1&limit=5&sortBy=updatedAt&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "url": "http://example.com",
        "status": "success",
        "content": "<html>...</html>",
        "createdAt": 1234567890,
        "updatedAt": 1234567891,
        "fetchTime": 342
      }
    ],
    "meta": {
      "page": 1,
      "limit": 5,
      "total": 10,
      "totalPages": 2
    }
  }
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
Server-Sent Events endpoint for real-time updates. The client establishes a persistent connection, and the server pushes `UrlRecord` data whenever a URL's status changes (from loading → success/failed). This enables live UI updates without polling. Each event contains the complete updated URL record with the latest status, content (if successful), or error message (if failed).

## Project Structure

```
url-fetcher/
├── apps/
│   ├── client/          # React frontend
│   └── server/          # Fastify backend
└── libs/
    └── shared/          # Shared TypeScript types
```

## Testing

Run all tests:
```bash
npm test
```

Run specific test suites:
```bash
npm run test:server  # Backend tests only
npm run test:client  # Frontend tests only
```

Run E2E tests with Cypress:
```bash
# Start the server manually first
npm run dev:server

# Then run E2E tests in another terminal
npm run test:e2e
```

**Test Coverage:**
- **Backend:** 9 tests covering URL service, pagination, sorting, fetch operations, events, and error handling
- **Frontend:** 3 tests covering component rendering, status display, and interactions
- **E2E:** 11 Cypress tests using Page Object pattern covering complete user flows (URL submission, navigation, content viewing, pagination)

**Test Architecture:**
- All UI components use `data-testid` attributes for reliable element selection
- Cypress tests follow the Page Object pattern for maintainability
- Page objects located in `apps/client-e2e/src/support/page-objects/`

## Architecture

- **Type Safety:** Shared types via `@org/shared` package, discriminated unions, no `any` types
- **Real-time Updates:** SSE for live status updates with React Query cache invalidation
- **URL State Management:** Query parameters synced with nuqs for deep linking and shareable URLs
- **Pagination:** Server-side pagination with reusable utilities and metadata
- **Validation:** DTO validation with class-validator, URL normalization
- **Security:** DOMPurify for XSS prevention, CORS configured
- **Separation of Concerns:** Service/controller layers, component-based UI
- **Testing:** Page Object pattern for E2E tests, all interactions use `data-testid` attributes
