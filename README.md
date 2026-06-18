# FASHIO

FASHIO is a premium fashion e-commerce application built with a modern MERN-style stack. It combines an editorial storefront, product browsing, cart management, secure authentication, Razorpay checkout, and a profile/order dashboard into one polished full-stack experience.

The project is designed to showcase practical product engineering skills recruiters care about:

- Clean component architecture
- Secure JWT-based auth
- Google sign-in support
- Payment gateway integration
- Admin-protected backend routes
- Persistent order storage
- Inventory updates after successful payment
- Responsive UI with a refined luxury aesthetic

## Live Features

- Responsive landing page with hero carousel
- Product catalog with category browsing
- Search, filter, and price sorting in the shop
- Product detail page with size selection
- Slide-in cart drawer with quantity controls
- Registration and login with JWT authentication
- Google login integration
- Checkout flow powered by Razorpay
- Order creation, payment verification, and stock deduction
- User dashboard with order history and profile editing
- Admin-only product creation API
- Seed script for quickly populating the database

## Why This Project Stands Out

- Secure auth flow with local login and Google OAuth
- Protected backend routes using JWT middleware
- Payment verification on the server, not only on the client
- Inventory is reduced after successful payment
- Orders are stored in MongoDB and tied to the logged-in user
- Redux Toolkit is used for predictable cart and auth state
- The UI is responsive and polished across desktop and mobile
- The catalog includes a fallback dataset for smoother local development

## Tech Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS 4
- Google OAuth

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Token
- bcryptjs
- Google Auth Library
- Razorpay SDK

## Project Structure

```bash
Fashio/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── utils/
│   └── vite.config.js
└── README.md
```

## Core Pages

- `/` - Home page with hero section and featured products
- `/shop` - Full catalog with search, filters, and sorting
- `/men` - Men’s collection
- `/women` - Women’s collection
- `/product/:id` - Product detail page
- `/checkout` - Razorpay checkout and order summary
- `/login` - Login page with email/password and Google sign-in
- `/register` - New user registration
- `/dashboard` - Profile management and order history

## Backend Capabilities

### Authentication

- User registration
- Email/password login
- Google login
- JWT token issuance and verification

### Products

- Fetch all products
- Fetch a single product by ID
- Create products with admin-only protection

### Orders

- Create Razorpay payment orders
- Verify Razorpay payment signatures on the server
- Store paid orders in MongoDB
- Reduce product stock after successful payment
- Fetch current user order history

### User Profile

- Update name
- Update email
- Update phone number
- Update address

## Database Models

- `User`
- `Product`
- `Order`

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Fashio.git
cd Fashio
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Optional frontend environment variable for Razorpay:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Note: the frontend currently points to `http://localhost:5000/api` in `frontend/src/api/axiosConfig.js`, so the backend should run locally on port `5000` during development unless you update that base URL.

## Run the Project

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

## Seed the Database

To populate the product catalog with sample fashion items:

```bash
cd backend
npm run seed
```

## Available Scripts

### Backend

- `npm run dev` - Start the Express server with Nodemon
- `npm start` - Start the Express server
- `npm run seed` - Seed the database with products

### Frontend

- `npm run dev` - Start the Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

### Users

- `PUT /api/user/profile`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` - admin only

### Orders

- `POST /api/orders`
- `POST /api/orders/razorpay`
- `POST /api/orders/verify`
- `GET /api/orders/user`

## Sample Admin Setup

If you want an admin account for testing protected routes, use the helper script in `backend/utils/createAdmin.js`.

Default credentials created by that script:

- Email: `admin@fashio.com`
- Password: `admin1234`

## Notes

- `node_modules` is intentionally not meant to be committed.
- Product images in the seed data use remote image URLs.
- The checkout flow is prepared for Razorpay sandbox or live credentials.

## Future Improvements

- Add an admin dashboard UI for product management
- Add wishlist functionality
- Add product reviews and ratings
- Add pagination and infinite scroll for large catalogs
- Add email notifications for order status updates

## Author

Built by Deekshith.

