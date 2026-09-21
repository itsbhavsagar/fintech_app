# BrickShare — Fractional Real Estate Investment App

> Own a piece of commercial India from just ₹10,000

BrickShare is a full-stack mobile fintech application that lets retail investors buy fractional shares in Grade A commercial real estate across India — offices, retail malls, warehouses, and coworking spaces. Users can browse properties, invest from a low minimum ticket size, track portfolio performance, and get AI-powered guidance on properties and diversification.

The app is built as a production-style demo: a React Native client talks to an Express + Prisma + PostgreSQL backend, with Groq-powered AI features proxied through the server so API keys never ship in the mobile bundle.

---

## Screenshots

<div align="center">
  <img src="./assets/screenshots/home.jpeg" width="19%" alt="Home dashboard" />
  <img src="./assets/screenshots/explore.jpeg" width="19%" alt="Explore properties" />
  <img src="./assets/screenshots/portfolio.jpeg" width="19%" alt="Portfolio" />
  <img src="./assets/screenshots/ai_insights.jpeg" width="19%" alt="AI portfolio insights" />
  <img src="./assets/screenshots/property-ai.jpeg" width="19%" alt="Property AI summary" />
  <img src="./assets/screenshots/chat.jpeg" width="19%" alt="AI chat" />
</div>

---

## What Is This App?

BrickShare is a **fractional real estate investment platform** aimed at Indian retail investors who want access to institutional-grade commercial assets without buying an entire property.

### The problem it solves

Commercial real estate in India has historically required crores of capital and deep market knowledge. BrickShare lowers the barrier by:

- Splitting properties into affordable units (minimum ₹10,000)
- Surfacing key metrics — occupancy, expected returns, tenant mix, funding progress
- Giving users a single place to discover, invest, and monitor holdings
- Using AI to explain properties and suggest portfolio moves in plain language

### Who it is for

| Audience | How they use it |
| -------- | --------------- |
| Retail investors | Browse Grade A assets, invest fractionally, track returns |
| First-time real estate investors | Learn via AI summaries and property Q&A before committing |
| Product / engineering demos | End-to-end fintech + mobile + AI stack you can run locally |

### What you can do in the app

**Investing & portfolio**

- Browse 7 seeded commercial properties across Delhi, Noida, Gurgaon, and Bangalore
- Filter by property type, city, and minimum expected return
- Invest in units with live return calculation, platform fee review, and confirmation
- View portfolio value, invested amount, returns, and a 6-month performance chart
- Save properties to a watchlist and review full transaction history
- Complete a 3-step KYC flow (personal details, bank, documents)

**AI assistance**

- **Property Q&A** — ask questions about a specific listing; answers are grounded in that property's data
- **AI property summary** — streaming overview of returns, risk, tenants, and location
- **Investment Assistant** — recommends properties based on your budget and current portfolio
- **Portfolio Insights** — AI analysis of holdings with diversification suggestions
- **Voice search** — speak a query; Groq Whisper transcribes it and applies search filters on Explore

---

## Tech Stack

### Mobile app (frontend)

| Technology | Version | Role |
| ---------- | ------- | ---- |
| [Expo](https://expo.dev) | 55.x | Cross-platform mobile framework |
| [React Native](https://reactnative.dev) | 0.83 | Native UI layer (iOS, Android, web) |
| [Expo Router](https://docs.expo.dev/router/introduction/) | 55.x | File-based navigation and deep linking |
| [React](https://react.dev) | 19.x | Component model |
| [TypeScript](https://www.typescriptlang.org) | 5.9 | Static typing |
| [NativeWind](https://www.nativewind.dev) | 4.x | Tailwind CSS utility classes in RN |
| [TanStack Query](https://tanstack.com/query) | 5.x | Server state, caching, and mutations |
| [Reanimated](https://docs.swmansion.com/react-native-reanimated/) | 4.x | Animations (e.g. investment success) |
| [FlashList](https://shopify.github.io/flash-list/) | 2.x | High-performance property lists |
| [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) | 55.x | Microphone recording for voice search |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | 55.x | Tactile feedback on key actions |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | 2.x | JWT and user session persistence |
| [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | — | Gradient headers and cards |
| [react-native-markdown-display](https://github.com/iamacup/react-native-markdown-display) | — | Rendered AI/markdown content |

### Backend (API)

| Technology | Version | Role |
| ---------- | ------- | ---- |
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | 4.x | REST API server |
| [TypeScript](https://www.typescriptlang.org) | 5.5 | Type-safe server code |
| [Prisma](https://www.prisma.io) | 5.x | ORM and migrations |
| [PostgreSQL](https://www.postgresql.org) | 17+ | Primary database (Neon, Supabase, or local) |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.x | JWT authentication (30-day expiry) |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.x | Password hashing |

### AI / ML

| Service | Model | Role |
| ------- | ----- | ---- |
| [Groq](https://groq.com) | `openai/gpt-oss-20b` | Property Q&A, summaries, assistant, portfolio insights |
| [Groq Whisper](https://groq.com) | `whisper-large-v3-turbo` | Voice search transcription |

All Groq calls are made **server-side** via `POST /api/chat` and `POST /api/chat/transcribe`. The mobile app never holds a Groq API key.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native + Expo                       │
│  Expo Router screens · TanStack Query · NativeWind UI        │
│  AI hooks → streamChat() / transcribeAudio() → backend API   │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTPS / JSON  (JWT in header)
┌──────────────────────────▼──────────────────────────────────┐
│                   Express REST API                           │
│  Auth · Properties · Investments · Portfolio · Chat proxy    │
│  Demo fallback when DB or Groq unavailable (dev-friendly)      │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
     ┌─────────────────┐       ┌─────────────────┐
     │   PostgreSQL    │       │    Groq API     │
     │  Prisma ORM     │       │  Chat + Whisper │
     └─────────────────┘       └─────────────────┘
```

### Demo / offline-friendly mode

Set `DEMO_FALLBACK=true` in `backend/.env` (the default) to run without a live database or Groq key:

- Auth routes return a demo JWT when Postgres is unreachable
- Property and portfolio routes serve in-memory sample data
- AI routes return canned responses when `GROQ_API_KEY` is missing
- Voice transcription returns a placeholder query in demo mode

Set `DEMO_FALLBACK=false` in production so missing DB or invalid tokens fail loudly.

---

## Features

### Authentication

- Email + password registration and login
- JWT sessions with 30-day expiry, stored in AsyncStorage
- Protected tab navigator — unauthenticated users are redirected to login
- Shared auth UI primitives (`AuthPrimitives`) for consistent login/sign-up screens
- KYC onboarding flow with status tracking on the user record

### Property discovery

- 7 commercial listings (seeded) across 4 cities
- Filters: type (Office, Retail, Warehouse, Coworking), city, minimum return band
- Text search across title, location, type, and city
- Voice search on Explore — record → transcribe → apply as search query
- One-tap watchlist bookmarking

### Property detail

- Image carousel with pagination
- Occupancy bar (colour-coded green / yellow / red)
- Funding progress and available units
- Tenant list with icons
- Streaming AI summary (simulated word-by-word on device)
- Dedicated property Q&A chat screen

### Investment flow

Three-step flow under `app/investment/[id]/`:

1. **Select units** — adjust quantity, see live amount and projected return
2. **Review** — platform fee (2%), total payable
3. **Confirm** — success animation, investment persisted via API

### Portfolio & activity

- Live portfolio totals from backend
- Per-investment cards with current value and return %
- 6-month performance chart
- Streaming AI portfolio insights
- Transaction history and in-app notifications

### AI chat surfaces

| Screen | Purpose |
| ------ | ------- |
| `app/property/[id]/qa.tsx` | Property-specific Q&A |
| `app/assistant.tsx` | Investment assistant with full catalog + portfolio context |
| Portfolio tab | AI insights panel |

Responses are constrained by system prompts to BrickShare / property context. The client simulates streaming by chunking the full server response into 3-word groups at 30 ms intervals (React Native `fetch` does not expose true SSE on mobile).

---

## Project Structure

```
fintech_app/
├── app/                              # Expo Router screens
│   ├── index.tsx                     # Auth gate → home or onboarding
│   ├── onboarding.tsx                # 3-slide first-run intro
│   ├── assistant.tsx                 # Investment AI assistant
│   ├── transactions.tsx              # Transaction history
│   ├── watchlist.tsx                 # Saved properties
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── sign-up.tsx
│   │   └── kyc.tsx
│   ├── (app)/                        # Protected bottom-tab screens
│   │   ├── _layout.tsx               # Tab nav + auth guard
│   │   ├── home.tsx                  # Dashboard
│   │   ├── explore.tsx               # Browse + filters + voice
│   │   ├── portfolio.tsx             # Holdings + AI insights
│   │   ├── profile.tsx
│   │   └── notifications.tsx
│   ├── property/
│   │   ├── [id].tsx                  # Property detail
│   │   └── [id]/qa.tsx               # Property AI chat
│   └── investment/
│       ├── [id].tsx                  # Unit selection
│       └── [id]/
│           ├── review.tsx            # Fee review
│           └── confirm.tsx           # Confirmation
│
├── src/
│   ├── components/
│   │   ├── auth/AuthPrimitives.tsx   # Shared auth layout + inputs
│   │   ├── ui/                       # Button, Input, ChatBubble, etc.
│   │   ├── property/                 # PropertyCard, OccupancyBar, …
│   │   ├── portfolio/                # InvestmentCard, PortfolioChart
│   │   └── layout/                   # ScreenWrapper, TabBar, Header
│   ├── hooks/
│   │   ├── useAssistant.ts
│   │   ├── usePropertyQA.ts
│   │   ├── usePropertySummary.ts
│   │   ├── usePortfolioInsights.ts
│   │   ├── useVoiceSearch.ts         # expo-audio + Whisper proxy
│   │   └── useBackend.ts             # TanStack Query API hooks
│   ├── lib/
│   │   ├── api.ts                    # REST client with JWT injection
│   │   ├── auth.ts                   # Token + user persistence
│   │   ├── env.ts                    # API URL resolution (incl. Android)
│   │   ├── groq.ts                   # Backend chat proxy + simulated stream
│   │   ├── whisper.ts                # Backend transcription proxy
│   │   └── queryClient.ts
│   └── types/api.ts
│
└── backend/
    ├── src/
    │   ├── app.ts                    # Express app + route mounting
    │   ├── index.ts                  # Server entry
    │   ├── demo.ts                   # Demo fallback data + helpers
    │   ├── routes/
    │   │   ├── auth.ts
    │   │   ├── properties.ts
    │   │   ├── investments.ts
    │   │   ├── portfolio.ts
    │   │   ├── watchlist.ts
    │   │   ├── transactions.ts
    │   │   ├── notifications.ts
    │   │   ├── chat.ts               # Groq chat + Whisper proxy
    │   │   └── messages.ts
    │   └── middleware/
    │       ├── auth.ts               # JWT verification (+ demo bypass)
    │       └── errorHandler.ts
    └── prisma/
        ├── schema.prisma
        └── seed.ts                   # 7 properties + sample data
```

---

## Database Schema

| Model | Key fields |
| ----- | ---------- |
| `User` | email, phone, name, hashed password, `kycStatus` |
| `Property` | title, slug, city, type, `expectedReturn`, occupancy, images, tenants, funding fields |
| `Investment` | userId, propertyId, units, amount, `currentValue`, `returnPercent` |
| `Watchlist` | userId + propertyId (unique pair) |
| `Transaction` | userId, propertyId, type, amount |
| `Session` | userId, optional propertyId, type (`property-qa` / `portfolio-chat`) |
| `Message` | sessionId, role, content |
| `Chunk` | propertyId, text, `embedding Float[]` (schema ready for future RAG) |

---

## API Reference

### Health

```
GET    /api/health                  Service status
```

### Auth

```
POST   /api/auth/register           Create account → JWT
POST   /api/auth/login              Login → JWT
```

### Properties & investments

```
GET    /api/properties              List all properties (public)
GET    /api/properties/:id          Single property (auth)
POST   /api/investments             Create investment
GET    /api/investments             List user investments
GET    /api/portfolio               Portfolio summary + totals
```

### User data

```
GET    /api/watchlist               Saved properties
POST   /api/watchlist/:id           Add to watchlist
DELETE /api/watchlist/:id           Remove from watchlist
GET    /api/transactions            Transaction history
GET    /api/notifications           User alerts
```

### AI (auth required)

```
POST   /api/chat                    Groq chat completion proxy
POST   /api/chat/transcribe         Whisper audio transcription
GET    /api/messages/:sessionId     Chat message history
```

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **npm** (or yarn/pnpm)
- **PostgreSQL** — optional for first run if `DEMO_FALLBACK=true`
- **Groq API key** — optional for first run; required for real AI responses
- **Expo Go** on a physical device, or iOS Simulator / Android Emulator

### 1. Clone the repository

```bash
git clone https://github.com/itsbhavsagar/fintech_app.git
cd fintech_app
```

### 2. Frontend setup

```bash
npm install
cp .env.example .env
```

Root `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

On a physical device, replace `localhost` with your machine's LAN IP so the phone can reach the backend.

Start the Expo dev server:

```bash
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go.

### 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=4000
DEMO_FALLBACK=true
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=replace-with-a-long-random-secret
GROQ_API_KEY=your_groq_key
```

With `DEMO_FALLBACK=true`, you can start the API immediately and explore the app using sample data. When you are ready for persistent data:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the API:

```bash
npm run dev
```

The API listens on `http://localhost:4000` by default.

### Quick smoke test

```bash
curl http://localhost:4000/api/health
# → {"ok":true,"service":"brickshare-backend"}
```

---

## Environment Variables

| Variable | Where | Required | Description |
| -------- | ----- | -------- | ----------- |
| `EXPO_PUBLIC_API_URL` | Root `.env` | Yes | Backend base URL for the mobile app |
| `PORT` | `backend/.env` | No | API port (default `4000`) |
| `DATABASE_URL` | `backend/.env` | For production | Postgres connection string |
| `JWT_SECRET` | `backend/.env` | Yes | Secret for signing JWTs |
| `GROQ_API_KEY` | `backend/.env` | For AI | Groq key for chat + Whisper |
| `DEMO_FALLBACK` | `backend/.env` | No | `true` = graceful demo mode when DB/AI unavailable |

Never commit `.env` files. Use the provided `.env.example` templates.

---

## Roadmap

- [ ] Server-side streaming (SSE) for AI responses instead of client-side simulation
- [ ] pgvector RAG — populate `Chunk` embeddings and retrieve by cosine similarity
- [ ] Redis-backed rate limiting on AI endpoints
- [ ] Razorpay integration for real payments
- [ ] Push notifications for investment and return events
- [ ] Admin panel for property CRUD

---

## Built By

**Bhavsagar** — Frontend / Product Engineer

React · React Native · Next.js · TypeScript · Node.js · AI/LLM Integration

[GitHub](https://github.com/itsbhavsagar) · [LinkedIn](https://linkedin.com/in/bhavsagar92) · [Portfolio](https://bhavsagar.com)

> Also see [AI LMS Tutor](https://ai-lms-tutor-sigma.vercel.app) — a full-stack AI learning platform with RAG, Groq streaming, and Whisper voice input.
