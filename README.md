# Collabrix (Brand-Influencer Platform)

Collabrix is a full-stack **MERN** (MongoDB, Express, React, Node.js) platform designed for brand and influencer collaborations. It features real-time communication, automated notifications, campaign management, and detailed analytics.

---

## 🚀 Features

### ✅ Core Functionality
- **Dual Roles**: Separate dashboards and workflows for **Brands** and **Influencers**.
- **Campaign Management**: Brands can create campaigns; influencers can pitch or accept invitations.
- **Real-time Chat**: Fully integrated messaging system powered by **Socket.IO**.
- **Smart Notifications**: Real-time alerts for new requests, messages, and campaign updates.
- **Analytics Dashboard**: Performance tracking for influencers (YT/IG stats) and brands (ROI/Spending).
- **Profile Marketplace**: Discover influencers by domain, location, and engagement.

### ✅ Technical Excellence
- **Tab Isolation**: Independent sessions per browser tab using `sessionStorage`.
- **Protected Routes**: Role-based access control for all internal pages.
- **Responsive UI**: Modern, dark-themed interface built with **Tailwind CSS** and **Framer Motion**.
- **Mock Data & Seeding**: Robust seeding scripts for instant prototype testing.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Axios, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT Authentication, Socket.IO.

---

## ⚙️ Environment Setup

Create `.env` files in both `frontend` and `backend` directories.

### 📂 Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI="mongo_uri"
JWT_SECRET="your_sceret_key"
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:8080
```

### 📂 Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🏃 Quick Start

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```


```

### 3. Run the Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:8080`.

---

## 🔐 Test Credentials

Use these accounts to explore the platform after seeding:

| Role | Email | Password |
|---|---|---|
| **Influencer** | `priya@collabrix.com` | `password123` |
| **Influencer** | `ravi@collabrix.com` | `password123` |
| **Brand** | `glowskin@collabrix.com` | `password123` |
| **Brand** | `technova@collabrix.com` | `password123` |

---

## 📊 Analytics Pipeline (Spark & Airflow)

The platform includes a dedicated Data Engineering layer for processing YouTube analytics using **PySpark** and **Apache Airflow**.



### 🔹 Full Stack (Docker & Airflow)
Automated, production-ready pipeline with scheduling and monitoring.
1.  **Navigate to pipeline**: `cd spark-pipeline`
2.  **Start Services**: `docker compose up --build`
3.  **Access Airflow**: [http://localhost:8181](http://localhost:8181) (User: `admin`, Pass: `admin`)
4.  **Trigger DAG**: Enable and run the `yt_fetcher` DAG.



---

## 📁 Project Structure


```text
brand-influencer/
├── backend/
│   ├── models/       # Mongoose Schemas
│   ├── routes/       # API Endpoints
│   ├── middleware/   # Auth & Role guards
│   ├── server.js     # Entry point & Socket.IO
│   └── seed.js       # Database seeder
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── contexts/    # Auth, Chat, Notifications
│   │   ├── pages/       # Dashboard & Feature pages
│   │   ├── lib/         # API & Socket config
│   │   └── App.tsx      # Routing
├── spark-pipeline/
│   ├── jobs/         # PySpark ETL scripts
│   ├── dags/         # Airflow Pipeline definitions
│   ├── data/         # Raw and Processed JSON/Parquet storage
│   ├── Dockerfile    # PySpark Environment
│   └── orchestrate_etl.ps1 # Lite-mode orchestrator

```

---

*Note: This project is a prototype. Ensure security audits and environment variable rotations before production use.*
