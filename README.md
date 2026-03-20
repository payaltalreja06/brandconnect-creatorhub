# Brand-Influencer Platform (MERN)

This repository contains a prototype **brand-influencer marketplace** built with a **MERN** stack (MongoDB + Express + React + Node). It is designed as a foundation for building a scalable marketplace where brands can find and collaborate with creators (influencers), manage campaigns, chat, and track payments.

---

## 📌 What’s Included

### ✅ Frontend (React + TypeScript)
- Built with **Vite**
- UI components from **shadcn/ui** (Radix + Tailwind)
- Pages for:
  - Brand dashboard, campaigns, discover, payments, messages
  - Influencer dashboard, campaigns, messages, profile, analytics
  - Public landing and login
- Uses **mock data** in `frontend/src/data/dummy.ts` (placeholder until backend is integrated)

### ✅ Backend (Express + TypeScript)
- Basic project structure in `backend/`
- MongoDB connectivity via **mongoose**
- Models created for:
  - Users (brands + influencers)
  - Campaigns
  - Chat threads + messages
  - Payments
  - Notifications
- JWT-based auth assumed (to be implemented)

### ✅ API Documentation (Ready-to-use)
All endpoint contracts are documented below so frontend and QA teams can integrate and test immediately.

## 🧩 API Endpoint Reference

> All endpoints requiring authentication expect an `Authorization: Bearer <token>` header.

### Auth

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Register a user (brand or influencer) |
| `/api/auth/login` | POST | Login and receive JWT |
| `/api/auth/me` | GET | Get current user profile |


### Users / Search

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/users/me` | GET | Get current user profile |
| `/api/users/me` | PATCH | Update current user profile |
| `/api/users/search` | GET | Search for influencers/brands (filter by role/domain/location/page) |


### Campaigns

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/campaigns` | GET | List campaigns (filter by role/status/brand/influencer) |
| `/api/campaigns` | POST | Create a campaign (brand only) |
| `/api/campaigns/:id` | GET | Get campaign detail |
| `/api/campaigns/:id` | PATCH | Update campaign (status, deliverables, etc.) |
| `/api/campaigns/:id/assign` | POST | Assign influencer to campaign |
| `/api/campaigns/:id/status` | POST | Update campaign status |


### Chat (Threads + Messages)

#### Threads
| Endpoint | Method | Purpose |
|---|---|---|
| `/api/chat/threads` | GET | List current user threads |
| `/api/chat/threads` | POST | Create a new thread |
| `/api/chat/threads/:id` | GET | Get thread details |

#### Messages
| Endpoint | Method | Purpose |
|---|---|---|
| `/api/chat/threads/:id/messages` | GET | List messages in a thread (pagination) |
| `/api/chat/threads/:id/messages` | POST | Send a message |


### Payments

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/payments` | GET | List payments (filter by user, status, campaign) |
| `/api/payments/:id` | GET | Get payment detail |
| `/api/payments/:id/status` | POST | Update payment status |


### Notifications

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/notifications` | GET | List user notifications |
| `/api/notifications/:id/read` | POST | Mark a notification as read |
| `/api/notifications/mark-all-read` | POST | Mark all notifications as read |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (>= 18)
- MongoDB running locally (default: `mongodb://localhost:27017/brand-influencer`)

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run Backend (prototype)
```bash
cd backend
npm install
npm run dev
```

> Note: Backend is scaffolded but may require implementation of auth/routes before it functions fully.

---

## � Google OAuth Setup (Implemented)
1. Create OAuth consent screen in Google Cloud Console:
   - App name, support email, scopes (email, profile)
   - Add `http://localhost:8080` as your test user origin (for local development)
2. Create OAuth 2.0 Client ID (Web application) and add:
   - Authorized JavaScript origins: `http://localhost:8080`
   - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback` (if you use code flow)
3. Set secrets:
   - Backend: `backend/.env`:
     - `GOOGLE_CLIENT_ID=...`
     - `GOOGLE_CLIENT_SECRET=...`
   - Frontend: `frontend/.env`:
     - `VITE_GOOGLE_CLIENT_ID=...`
     - `VITE_API_URL=http://localhost:5000/api/auth`

### Backend route
- POST `/api/auth/google` expects `{ credential, role?, profile?, brand? }` 
- **Multi-layer security**:
  - Verifies Google OAuth token
  - Checks `signupCompleted` flag for existing users
  - Validates profile completeness (social media handles for influencers, website for brands)
  - Only allows login for users who completed full signup process
- **Signup**: Sets `signupCompleted: true` when creating new accounts

### Database Schema
- **User model** includes `signupCompleted: Boolean` flag (default: false)
- Ensures only properly onboarded users can access the platform
- **Migration Required**: Run `node migrate-users.js` to update existing users with complete profiles

### Signup Validation
- **Regular Signup**: Name, email, password, and profile fields required
  - **Influencers**: At least one social media handle (Instagram/TikTok/YouTube) required
  - **Brands**: Website required
- **Google Signup**: Email, name/brand name required; profile fields optional
  - Users can add social media/website after signup
- Form validation prevents submission until required fields are complete

### Frontend
- `src/App.tsx` now uses `GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}`
- `src/pages/LoginPage.tsx` and `SignupPage.tsx` both support Google OAuth
- **Login Flow**: Google OAuth → Multiple security checks → Login only if fully signed up
- **Signup Flow**: Google OAuth pre-fills email/name → Complete profile → Set `signupCompleted: true`
- **Error Handling**: Clear messages for incomplete signup/profile states

---

## �📄 Where to Find the Schema
- **MongoDB schema**: `backend/schema.txt`
- Use this file to understand the database collections and document shapes the frontend expects.

---

## 🛠️ Next Steps (Recommended)
1. Implement backend routes based on the API contract in this README
2. Add authentication (JWT) and route guards for protected endpoints
3. Replace frontend mock data (`dummy.ts`) with REST API calls
4. Add unit/API tests (Postman/Newman) based on the test cases implied by the endpoint contracts

---

If you want, I can also generate a **Postman collection** or an **OpenAPI (Swagger)** spec from the API contract for easier team onboarding.
