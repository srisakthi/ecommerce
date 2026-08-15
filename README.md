# NexCart - Enterprise E-Commerce Platform

NexCart is a comprehensive, full-stack enterprise e-commerce platform built on the MERN stack (MongoDB, Express, React, Node.js). It offers a rich shopping experience for customers and a robust dashboard for sellers and administrators to manage their storefronts, products, and inventory.

## Features

- **Multi-Role Authentication**: Secure login and registration for Customers, Sellers, and Admins.
- **Seller Dashboard**: Sellers can exclusively manage their own products and categories.
- **Dynamic Shopping Cart & Checkout**: Integrated checkout flow with a responsive cart system.
- **Verified Reviews**: Customers can only leave reviews on products they have successfully purchased.
- **Real-time Product Filtering**: Advanced search, category filtering, and price sorting capabilities.
- **Image Uploads**: Integrated image handling and serving for product thumbnails and galleries.
- **Dynamic Discounts**: Automatically calculated discount badges on the storefront.
- **Responsive UI**: Fully responsive, modern UI built with Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), React Router, Redux Toolkit, Tailwind CSS, Lucide React (Icons).
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB (Atlas/Local).
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/srisakthi/ecommerce.git
   cd ecommerce
   ```

2. Install Backend Dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install Frontend Dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Environment Variables:
   - Create a `.env` file in the `backend/` directory based on your local configuration (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).
   - Create a `.env` file in the `frontend/` directory (e.g., `VITE_API_URL=http://localhost:5000/api/v1`).

### Running the App Locally

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

## License

&copy; 2026 NexCart. All rights reserved.
