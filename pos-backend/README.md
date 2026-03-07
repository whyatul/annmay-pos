# Restaurant POS System - Backend

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Running locally or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` file with your configuration:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/restaurant-pos
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

4. Seed the database with initial data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:8000`

## 📝 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data
- `npm run clear` - Clear all data from database

## 🔐 Default User Credentials

After running the seed script, you can login with these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@restaurant.com | admin123 |
| Manager | manager@restaurant.com | manager123 |
| Waiter | waiter@restaurant.com | waiter123 |
| Chef | chef@restaurant.com | chef123 |
| Cashier | cashier@restaurant.com | cashier123 |

## 📚 API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/me` - Get logged in user data
- `POST /api/user/logout` - Logout user

### Orders
- `GET /api/order` - Get all orders
- `POST /api/order` - Create new order
- `GET /api/order/:id` - Get order by ID
- `PUT /api/order/:id` - Update order
- `DELETE /api/order/:id` - Delete order

### Tables
- `GET /api/table` - Get all tables
- `POST /api/table` - Create new table
- `GET /api/table/:id` - Get table by ID
- `PUT /api/table/:id` - Update table
- `DELETE /api/table/:id` - Delete table

### Payments
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment` - Get all payments

## 🗄️ Database Models

### User Model
- name, email, phone, password, role, timestamps

### Order Model
- customer details, items, table, status, total amount, timestamps

### Table Model
- tableNumber, seats, status, currentOrder, timestamps

### Payment Model
- order, amount, paymentId, status, timestamps

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Razorpay** - Payment gateway

## 📄 License

MIT
