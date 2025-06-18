# MERN E-commerce Project

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features
- User authentication (signup, login, password reset)
- Product listing and details
- Cart and wishlist functionality
- Order placement and order history
- Admin panel for product and order management
- Responsive design

## Installation Process

### Prerequisites
- Node.js (v14 or above)
- MongoDB (local or cloud)

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mern-ecommerce-p.git
   cd mern-ecommerce-p
   ```
2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the `backend` folder with your MongoDB URI and JWT secret.
   - Example:
     ```env
     MONGODB_URI=mongodb://localhost:27017/ecommerce
     JWT_SECRET=your_jwt_secret
     ```
5. **Start the backend server:**
   ```bash
   cd backend
   npm start
   # or for development with nodemon
   npm run dev
   ```
6. **Start the frontend server:**
   ```bash
   cd ../frontend
   npm start
   ```
7. **Open the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

## Sample User Login

You can use the following credentials to log in as a demo user (if seeded):

```
Email: demo@gmail.com
Password: helloWorld@123
```

> **Note:** If you have a different seeded user, update the credentials here accordingly.

## Folder Structure
```
mern-ecommerce-p/
  backend/
  frontend/
  static/
```

## License
MIT License



