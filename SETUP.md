# 🚀 Complete Setup Guide - Restaurant POS System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Running the Application](#running-the-application)
8. [Testing the System](#testing-the-system)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v14.0.0 or higher)
  ```bash
  node --version
  ```
- **npm** (v6.0.0 or higher) or **yarn**
  ```bash
  npm --version
  ```
- **MongoDB** (v4.4 or higher)
  ```bash
  mongod --version
  ```
- **Git**
  ```bash
  git --version
  ```

### Optional
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (API testing)
- **VS Code** (Recommended IDE)

---

## Project Structure

```
Restaurant_POS_System-master/
├── pos-backend/              # Backend Node.js/Express server
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Custom middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── scripts/              # Database scripts
│   ├── .env                  # Environment variables
│   ├── .env.example          # Environment template
│   ├── app.js                # Main application file
│   └── package.json          # Dependencies
│
├── pos-frontend/             # Frontend React application
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── assets/           # Images, fonts
│   │   ├── components/       # React components
│   │   ├── constants/        # Menu and static data
│   │   ├── hooks/            # Custom hooks
│   │   ├── https/            # API calls
│   │   ├── pages/            # Page components
│   │   ├── redux/            # State management
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Root component
│   │   └── main.jsx          # Entry point
│   ├── .env                  # Environment variables
│   ├── .env.example          # Environment template
│   └── package.json          # Dependencies
│
├── loginsetup.md             # Login credentials guide
├── MENU.md                   # Complete menu documentation
├── SETUP.md                  # This file
└── README.md                 # Project overview
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd pos-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- cookie-parser
- dotenv
- razorpay
- http-errors
- nodemon (dev dependency)

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/restaurant-pos
JWT_SECRET=your_strong_secret_key_here_change_in_production
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
NODE_ENV=development
```

**Important:** 
- Generate a strong JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Get Razorpay keys from [Razorpay Dashboard](https://dashboard.razorpay.com/)

### Step 4: Verify Backend Structure
Ensure these files exist:
- ✅ app.js
- ✅ config/config.js
- ✅ config/database.js
- ✅ All model files
- ✅ All controller files
- ✅ All route files

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd ../pos-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- @reduxjs/toolkit
- react-redux
- axios
- tailwindcss
- framer-motion
- vite

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file:
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Note:** Frontend environment variables in Vite must be prefixed with `VITE_`

### Step 4: Verify Frontend Structure
Ensure these directories exist:
- ✅ src/components
- ✅ src/pages
- ✅ src/redux
- ✅ src/constants
- ✅ src/assets

---

## Database Setup

### Option 1: Local MongoDB

#### Start MongoDB Service

**Windows:**
```bash
net start MongoDB
```

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB is Running
```bash
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restaurant-pos?retryWrites=true&w=majority
   ```
5. Whitelist your IP address in Atlas

### Seed the Database

Populate database with initial data:
```bash
cd pos-backend
npm run seed
```

This creates:
- 5 default users (admin, manager, waiter, chef, cashier)
- 20 tables
- Initial system configuration

**Output should show:**
```
🌱 Starting database seeding...
✅ Connected to MongoDB
✅ Users seeded successfully!
✅ Tables seeded successfully!
🎉 Database seeding completed successfully!
```

---

## Environment Configuration

### Backend Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 8000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/restaurant-pos |
| JWT_SECRET | Secret for JWT signing | random_64_char_string |
| RAZORPAY_KEY_ID | Razorpay API key | rzp_test_... |
| RAZORPAY_KEY_SECRET | Razorpay secret | secret_key... |
| RAZORPAY_WEBHOOK_SECRET | Webhook secret | webhook_secret... |
| NODE_ENV | Environment mode | development |

### Frontend Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_BACKEND_URL | Backend API URL | http://localhost:8000 |
| VITE_RAZORPAY_KEY_ID | Razorpay public key | rzp_test_... |

---

## Running the Application

### Method 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd pos-backend
npm run dev
```

Expected output:
```
☑️  POS Server is listening on port 8000
✅ MongoDB Connected: localhost
```

**Terminal 2 - Frontend:**
```bash
cd pos-frontend
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Method 2: Using PM2 (Production)

Install PM2:
```bash
npm install -g pm2
```

Start both services:
```bash
# Backend
cd pos-backend
pm2 start app.js --name "pos-backend"

# Frontend (build first)
cd pos-frontend
npm run build
pm2 start ecosystem.config.js
```

### Method 3: Docker (Advanced)

Create `docker-compose.yml` in root:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  backend:
    build: ./pos-backend
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/restaurant-pos

  frontend:
    build: ./pos-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run:
```bash
docker-compose up
```

---

## Testing the System

### 1. Access the Application
Open browser and navigate to:
```
http://localhost:5173
```

### 2. Login with Default Credentials

Try logging in with any of these accounts:

**Admin:**
- Email: `admin@restaurant.com`
- Password: `admin123`

**Manager:**
- Email: `manager@restaurant.com`
- Password: `manager123`

**Waiter:**
- Email: `waiter@restaurant.com`
- Password: `waiter123`

**Chef:**
- Email: `chef@restaurant.com`
- Password: `chef123`

**Cashier:**
- Email: `cashier@restaurant.com`
- Password: `cashier123`

### 3. Test Features

#### As Admin:
- [ ] View dashboard with metrics
- [ ] Browse menu items
- [ ] View all tables
- [ ] Check orders
- [ ] View analytics

#### As Waiter:
- [ ] Browse menu
- [ ] Create new order
- [ ] Assign table to order
- [ ] Add items to cart
- [ ] Generate bill

#### As Chef:
- [ ] View incoming orders
- [ ] Update order status
- [ ] Mark orders as "Ready"

#### As Cashier:
- [ ] Process payments
- [ ] Generate invoices
- [ ] View payment history

### 4. API Testing with Postman

Import these endpoints:

**Authentication:**
```http
POST http://localhost:8000/api/user/register
POST http://localhost:8000/api/user/login
GET http://localhost:8000/api/user/me
POST http://localhost:8000/api/user/logout
```

**Orders:**
```http
GET http://localhost:8000/api/order
POST http://localhost:8000/api/order
GET http://localhost:8000/api/order/:id
PUT http://localhost:8000/api/order/:id
DELETE http://localhost:8000/api/order/:id
```

**Tables:**
```http
GET http://localhost:8000/api/table
POST http://localhost:8000/api/table
GET http://localhost:8000/api/table/:id
PUT http://localhost:8000/api/table/:id
DELETE http://localhost:8000/api/table/:id
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

#### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "CORS Error"
**Solution:**
Check backend `app.js`:
```javascript
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173'] // Add your frontend URL
}))
```

#### Issue: "JWT Token Expired"
**Solution:**
- Logout and login again
- Check if JWT_SECRET is set in .env
- Verify token expiration time in userController.js

#### Issue: "Database not seeded"
**Solution:**
```bash
cd pos-backend
npm run clear  # Clear existing data
npm run seed   # Reseed database
```

#### Issue: "Frontend shows blank page"
**Solution:**
```bash
# Check console for errors
# Rebuild the project
cd pos-frontend
npm run build
npm run dev
```

---

## Deployment

### Backend Deployment (Heroku)

1. **Create Heroku App:**
   ```bash
   heroku create restaurant-pos-backend
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI=<your_mongodb_atlas_uri>
   heroku config:set JWT_SECRET=<your_jwt_secret>
   heroku config:set RAZORPAY_KEY_ID=<your_key>
   heroku config:set RAZORPAY_KEY_SECRET=<your_secret>
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build Project:**
   ```bash
   cd pos-frontend
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Configure Environment:**
   Add environment variables in Vercel dashboard

### Frontend Deployment (Netlify)

1. **Build Project:**
   ```bash
   cd pos-frontend
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB Atlas
- [ ] Configure Razorpay for production
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backup strategy
- [ ] Set up error logging
- [ ] Enable compression
- [ ] Configure CDN for frontend

---

## Additional Resources

### Documentation
- [Backend README](pos-backend/README.md)
- [Frontend README](pos-frontend/README.md)
- [Login Setup Guide](loginsetup.md)
- [Menu Documentation](MENU.md)

### Helpful Commands

**Backend:**
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Seed database
npm run clear    # Clear database
```

**Frontend:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Database Management

**Backup Database:**
```bash
mongodump --db restaurant-pos --out ./backup
```

**Restore Database:**
```bash
mongorestore --db restaurant-pos ./backup/restaurant-pos
```

**View Collections:**
```bash
mongosh
use restaurant-pos
show collections
db.users.find().pretty()
```

---

## Support

For issues and questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs
3. Check GitHub issues
4. Contact project maintainer

---

## License

MIT License - See LICENSE file for details

---

**Last Updated:** February 18, 2026

**Setup Version:** 1.0.0

---

**Happy Coding! 🚀**
