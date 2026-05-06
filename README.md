# PMG Agent Orchestration Portal

Authentication system and internal dashboard for Perennial Management Group (PMG) to automate client onboarding via Monday.com integration.

## Tech Stack

- **Frontend:** HTMX + DaisyUI + Tailwind CSS
- **Backend:** Hono (Node.js + TypeScript)
- **Data Layer:** Mock data (clean architecture for easy Monday.com API migration)

## Quick Start

```bash
# Install dependencies
npm install

# Build CSS
npm run build:css

# Start dev server
npm run dev
```

The server will start at `http://localhost:3000`.

## Default Credentials

- **Admin Username:** `admin`
- **Admin Password:** `pmg-admin-2024`

## Environment Variables

Create a `.env` file:

```
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
LINK_TOKEN_SECRET=your-secret-key-for-signing-client-tokens
```

## Architecture

### Routes
- `/admin` — PMG internal dashboard (protected by admin auth)
- `/portal` — Client portal (token-based access)
- `/auth` — Authentication endpoints

### Services
- `MondayService` — Board and task data (mock, replace with Monday.com GraphQL API)
- `OnboardingService` — Onboarding flow and portal link generation

### Auth
- **Admin:** Basic Auth + session cookie
- **Clients:** HMAC-signed tokens with boardId + clientId payload

## File Structure

```
src/
  routes/
    admin.routes.ts
    auth.routes.ts
    portal.routes.ts
  services/
    monday.service.ts
    onboarding.service.ts
  utils/
    token.ts
  middleware/
    adminAuth.ts
  views/
    layout.ts
    admin/
      dashboard.ts
      board-detail.ts
    partials/
      board-row.ts
      task-row.ts
  mock/
    boards.ts
  server.ts
```
