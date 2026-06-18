# FASHIO

FASHIO is a high-performance full-stack e-commerce application built with a modern MERN architecture. It features an interactive luxury storefront, smooth state-driven cart management, secure hybrid authentication, and a server-verified payment pipeline.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://fashio-ecommerce-ejd3.vercel.app)

---

## Core Features

- **Route Guarding:** Directs unauthenticated guest traffic straight to the secure onboarding login screens first.
- **State-Driven Cart:** Slide-in shopping drawer managed cleanly via Redux Toolkit with responsive quantity enforcement.
- **Hybrid Authentication:** Secure local login workflows built on JSON Web Tokens (JWT) integrated alongside Google OAuth.
- **Server-Verified Checkout:** Transaction pipeline powered by the Razorpay SDK that verifies signatures securely on the server before modifying stock or logging orders.
- **Consumer Dashboard:** Isolated user space tracking personal profile updates and persistent historical order logs.

---

## Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19 • Vite • Redux Toolkit • React Router DOM • Axios • Tailwind CSS 4 |
| **Backend** | Node.js • Express • JSON Web Token (JWT) • bcryptjs • Google Auth Library |
| **Database** | MongoDB • Mongoose ODM |
| **Payments** | Razorpay SDK |

---

## Project Structure

```bash
Fashio/
├── backend/            # Express API server, routes, and DB models
│   ├── controllers/    # Request handlers & business logic
│   ├── middleware/     # JWT authentication & route guards
│   ├── models/         # MongoDB schemas (User, Product, Order)
│   ├── routes/         # REST API endpoints
│   └── seed.js         # Database hydration script
└── frontend/           # React client application
    ├── src/
    │   ├── api/        # Axios configurations & API layer
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # View layouts (Shop, Checkout, Dashboard)
    │   └── store/      # Redux Toolkit global state architecture
```

## API Architecture

🔑 Authentication

POST /api/auth/register -> User sign-up with bcrypt password hashing

POST /api/auth/login -> Local credential validation & JWT generation

POST /api/auth/google -> Token exchange validation for Google Sign-In

🛍️ Products

GET /api/products -> Retrieves complete matching inventory

GET /api/products/:id -> Fetches isolated individual item properties

💳 Orders & Checkout

POST /api/orders/razorpay -> Registers secure payment intent via Razorpay

POST /api/orders/verify -> Strict server-side verification of payment signatures

GET /api/orders/user -> Returns profile-isolated purchase history

## Quick Start (Local Setup)

1. Clone & Install

```bash
git clone https://github.com/Deekshith-80/Fashio-Ecommerce.git
cd Fashio-Ecommerce

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

2. Environment Setup (backend/.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
RAZORPAY_KEY_ID=your_razorpay_public_key
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

3. Run Commands

Start Backend Server: `npm start` (inside `/backend`)

Seed Catalog Data: `npm run seed` (inside `/backend` to instantly populate products)

Start Frontend App: `npm run dev` (inside `/frontend`)

## Author

Built with clean product engineering practices by Deekshith.
