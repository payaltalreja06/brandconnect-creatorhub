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
See: `backend/schema-api-doc.txt`
- Full schema documentation for every collection
- REST API contract for all endpoints required by UI
- Test case recommendations for QA

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

## 📄 Where to Find the Schema & API Contract
- **Schema + API docs**: `backend/schema-api-doc.txt`
- Use this file to bootstrap backend endpoints and to align frontend integration expectations.

---

## 🛠️ Next Steps (Recommended)
1. Implement backend routes based on the API contract in `schema-api-doc.txt`
2. Add authentication (JWT) and route guards for protected endpoints
3. Replace frontend mock data (`dummy.ts`) with REST API calls
4. Add unit/API tests (Postman/Newman) based on the test cases in the doc

---

If you want, I can also generate a **Postman collection** or an **OpenAPI (Swagger)** spec from the API contract for easier team onboarding.
