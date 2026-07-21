# E-Commerce RBAC

An E-Commerce web application featuring Role-Based Access Control (RBAC) with Express.js (Neon Postgres), Next.js (App Router), Cloudinary, and Razorpay integrations.

## Roles
- **Admin**: Full access to dashboard, products, orders, and user management.
- **Sales**: Access to product management and sales dashboard.
- **User**: Standard customer shopping, cart, wishlist, and checkout.

## Setup Instructions
1. Setup Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update database & credential details in .env
   npm start
   ```

2. Setup Frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update API URLs in .env
   npm run dev
   ```
